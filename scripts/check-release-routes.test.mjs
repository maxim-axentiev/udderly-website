import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { verifyReleaseRoutes } from './check-release-routes.mjs'

function mockSend(indexable = false, override = () => null) {
  const html = (path) => `<!doctype html><html lang="en"><head><meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}">${indexable ? `<link rel="canonical" href="https://udderlyridiculousfarmlife.com${path}">` : ''}</head><body>Farm</body></html>`
  return async (url, options) => {
    assert.equal(options.redirect, 'manual')
    assert.equal(new URL(url).host, '127.0.0.1:3000')
    const path = new URL(url).pathname
    const changed = override(path)
    if (changed) return changed
    if (['/mini-cattle-for-sale', '/promotions', '/cow-wedding', '/cheryl-haskett',
      '/escape-to-the-countryside-farm-glamping', '/goatscaping'].includes(path)) {
      return new Response('Not found', { status: 404 })
    }
    const redirects = new Map([
      ['/faqs', '/faq'],
      ['/private-mini-highland-experience', '/mini-highland-cow-experience'],
      ['/private-miniature-donkey-lunch-picnic', '/miniature-donkey-lunch-picnic'],
      ['/private-miniature-donkey-sunset-picnic', '/miniature-donkey-sunset-picnic'],
    ])
    if (redirects.has(path)) return new Response(null, { status: 301, headers: { location: redirects.get(path) } })
    if (path === '/robots.txt') return new Response(indexable
      ? 'User-agent: *\nAllow: /\nSitemap: https://udderlyridiculousfarmlife.com/sitemap.xml'
      : 'User-agent: *\nDisallow: /\n', { status: 200 })
    if (path === '/sitemap.xml') return indexable
      ? new Response('<urlset><url><loc>https://udderlyridiculousfarmlife.com/</loc></url></urlset>', { status: 200 })
      : new Response('', { status: 404 })
    return new Response(path === '/health' ? 'OK' : html(path), { status: 200 })
  }
}

test('passes staging routes with indexing disabled', async () => {
  assert.deepEqual(await verifyReleaseRoutes(mockSend(), { PUBLIC_CANONICAL_ORIGIN: '' }), [])
})

test('passes production routes with indexing and sitemap enabled', async () => {
  assert.deepEqual(await verifyReleaseRoutes(mockSend(true), {
    PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com',
  }), [])
})

test('reports broken homepage, missing pages, and incorrect SEO mode', async () => {
  const errors = await verifyReleaseRoutes(mockSend(false, (path) => {
    if (path === '/') return new Response('Not HTML', { status: 200 })
    if (path === '/experiences') return new Response('Unavailable', { status: 503 })
    return null
  }), { PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com' })
  assert.ok(errors.some((issue) => issue.includes('/: expected HTML document')))
  assert.ok(errors.some((issue) => issue.includes('/experiences: expected 200')))
  assert.ok(errors.some((issue) => issue.includes('/robots.txt: unexpected crawl policy')))
  assert.ok(errors.some((issue) => issue.includes('/sitemap.xml: expected 200')))
})

test('rejects staging pages that accidentally expose canonical metadata', async () => {
  const errors = await verifyReleaseRoutes(mockSend(false, (path) => path === '/contact'
    ? new Response('<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="https://example.com/contact"></head></html>', { status: 200 })
    : null), { PUBLIC_CANONICAL_ORIGIN: '' })
  assert.ok(errors.some((issue) => issue.includes('/contact: expected noindex robots metadata')))
  assert.ok(errors.some((issue) => issue.includes('/contact: unexpected staging canonical URL')))
})

test('rejects production pages missing canonical and indexable metadata', async () => {
  const errors = await verifyReleaseRoutes(mockSend(true, (path) => path === '/experiences'
    ? new Response('<html><head><meta name="robots" content="noindex"></head></html>', { status: 200 })
    : null), { PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com' })
  assert.ok(errors.some((issue) => issue.includes('/experiences: expected indexable robots metadata')))
  assert.ok(errors.some((issue) => issue.includes('/experiences: missing expected canonical URL')))
})

test('rejects production canonical URL appearing only in another element', async () => {
  const errors = await verifyReleaseRoutes(mockSend(true, (path) => path === '/contact'
    ? new Response('<html><head><meta name="robots" content="index, follow"><a href="https://udderlyridiculousfarmlife.com/contact">Contact</a></head></html>', { status: 200 })
    : null), { PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com' })
  assert.ok(errors.some((issue) => issue.includes('/contact: missing expected canonical URL')))
})

test('rejects staging robots rules that disallow only a subpath', async () => {
  const errors = await verifyReleaseRoutes(mockSend(false, (path) => path === '/robots.txt'
    ? new Response('User-agent: *\nDisallow: /private\n', { status: 200 })
    : null), { PUBLIC_CANONICAL_ORIGIN: '' })
  assert.ok(errors.some((issue) => issue.includes('/robots.txt: unexpected crawl policy')))
})

test('rejects misleading production meta robots and duplicate canonical links', async () => {
  const errors = await verifyReleaseRoutes(mockSend(true, (path) => path === '/contact'
    ? new Response('<html><head><meta name="robots" content="noindex, follow"><meta name="robots" content="index, follow"><link rel="canonical" href="https://udderlyridiculousfarmlife.com/contact"><link rel="canonical" href="https://example.com/contact"></head></html>', { status: 200 })
    : null), { PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com' })
  assert.ok(errors.some((issue) => issue.includes('/contact: expected indexable robots metadata')))
  assert.ok(errors.some((issue) => issue.includes('/contact: missing expected canonical URL')))
})

test('rejects retired experience routes that accidentally become active again', async () => {
  const errors = await verifyReleaseRoutes(mockSend(false, (path) => path === '/cow-wedding'
    ? new Response('Legacy page unexpectedly accessible', { status: 200 }) : null),
  { PUBLIC_CANONICAL_ORIGIN: '' })
  assert.ok(errors.some((issue) => issue.includes('Retired /cow-wedding: expected 404, got 200')))
})

test('rejects incorrect migration redirects even when the destination still loads', async () => {
  const errors = await verifyReleaseRoutes(mockSend(true, (path) => path === '/private-mini-highland-experience'
    ? new Response(null, { status: 302, headers: { location: '/mini-highland-cow-experience' } }) : null),
  { PUBLIC_CANONICAL_ORIGIN: 'https://udderlyridiculousfarmlife.com' })
  assert.ok(errors.some((issue) => issue.includes('Redirect /private-mini-highland-experience: expected 301')))
})

test('deployment scripts require a verified clean Git checkout before accessing Docker', () => {
  for (const filename of ['deploy-staging.sh', 'deploy-production.sh']) {
    const script = readFileSync(new URL(filename, import.meta.url), 'utf8')
    const approval = script.indexOf('if [[ "${CONFIRM_')
    const rootCheck = script.indexOf('git rev-parse --show-toplevel')
    const statusCheck = script.indexOf('git status --porcelain --untracked-files=normal')
    const dockerCheck = script.indexOf('docker compose "${COMPOSE_ARGS[@]}" config --format json')
    assert.ok(approval >= 0 && rootCheck > approval && statusCheck > rootCheck && dockerCheck > statusCheck)
    assert.match(script, /release directory must be the Git checkout root/)
    assert.match(script, /Git status could not be verified/)
    assert.ok(!script.includes('if [[ -d .git ]]'))
  }
})

test('deployment scripts call the same route verifier before successful exit', () => {
  for (const filename of ['deploy-staging.sh', 'deploy-production.sh']) {
    const script = readFileSync(new URL(filename, import.meta.url), 'utf8')
    assert.ok(script.includes('RUN_RELEASE_ROUTE_CHECK=1 website'))
    assert.ok(script.includes('cat scripts/check-release-routes.mjs'))
    assert.ok(script.indexOf('cat scripts/check-release-routes.mjs') < script.lastIndexOf('exit 0'))
  }
})
