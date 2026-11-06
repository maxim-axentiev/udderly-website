import assert from 'node:assert/strict'
import test from 'node:test'
import { stagingOrigin, smokeStaging } from './smoke-staging.mjs'

const origin = 'https://staging.udderlyridiculousfarmlife.com'
const headers = { 'x-robots-tag': 'noindex, nofollow, noarchive' }
const html = '<html><head><meta name="robots" content="noindex, nofollow"></head></html>'

function mockSend(override = () => null) {
  return async (url, options) => {
    assert.equal(options.redirect, 'manual')
    assert.ok(url.startsWith(origin + '/'))
    const path = new URL(url).pathname
    const modified = override(path)
    if (modified) return modified
    if (path === '/robots.txt') return new Response('User-agent: *\nDisallow: /\n', { status: 200, headers })
    if (path === '/sitemap.xml' || ['/mini-cattle-for-sale', '/promotions',
      '/cow-wedding', '/cheryl-haskett', '/escape-to-the-countryside-farm-glamping', '/goatscaping'].includes(path)) {
      return new Response('', { status: 404, headers })
    }
    const redirects = new Map([
      ['/faqs', '/faq'],
      ['/private-mini-highland-experience', '/mini-highland-cow-experience'],
      ['/private-miniature-donkey-lunch-picnic', '/miniature-donkey-lunch-picnic'],
      ['/private-miniature-donkey-sunset-picnic', '/miniature-donkey-sunset-picnic'],
      ['/team-building-farm-experiences', '/corporate-training/team-building-experiences'],
      ['/gift-certificate', '/gift-card'],
      ['/subscribe-to-newsletter', '/newsletter'],
      ['/our-vision', '/vision-values'],
      ['/privacy-policy-2', '/privacy-policy'],
      ['/experiential-tourism-development', '/corporate-training/experiential-tourism-development'],
    ])
    if (redirects.has(path)) {
      return new Response('', { status: 301, headers: { ...headers, location: redirects.get(path) } })
    }
    return new Response(path === '/health' ? 'OK' : html, { status: 200, headers })
  }
}

test('only accepts dedicated HTTPS staging subdomains', () => {
  assert.equal(stagingOrigin(origin), origin)
  for (const invalid of [
    undefined, 'http://staging.udderlyridiculousfarmlife.com',
    'https://udderlyridiculousfarmlife.com', 'https://www.udderlyridiculousfarmlife.com',
    'https://staging.udderlyridiculousfarmlife.com.evil.com',
    'https://user:secret@staging.udderlyridiculousfarmlife.com',
    'https://staging.udderlyridiculousfarmlife.com:3000',
    'https://staging.udderlyridiculousfarmlife.com/path',
  ]) assert.throws(() => stagingOrigin(invalid))
})

test('passes matching non-indexable staging responses', async () => {
  const report = await smokeStaging(origin, mockSend())
  assert.deepEqual(report.failures, [])
  assert.equal(report.pageCount, 42)
  assert.equal(report.redirectCount, 10)
})

test('reports a broken private donkey picnic redirect', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/private-miniature-donkey-sunset-picnic'
    ? new Response(null, { status: 302, headers: { ...headers, location: '/miniature-donkey-sunset-picnic' } })
    : null))
  assert.ok(report.failures.some((entry) => entry.includes('/private-miniature-donkey-sunset-picnic: expected 301')))
})

test('catches accidental indexing and incorrect retired routes', async () => {
  const report = await smokeStaging(origin, mockSend((path) => {
    if (path === '/') return new Response('<link rel="canonical" href="https://example.com">', {
      status: 200, headers: {},
    })
    if (path === '/promotions') return new Response('active', { status: 200, headers })
    return null
  }))
  assert.ok(report.failures.some((entry) => entry.includes('missing X-Robots-Tag')))
  assert.ok(report.failures.some((entry) => entry.includes('missing HTML noindex')))
  assert.ok(report.failures.some((entry) => entry.includes('unexpected canonical')))
  assert.ok(report.failures.some((entry) => entry.includes('/promotions: retired route expected 404')))
})

test('rejects misleading noindex text in unrelated tags and canonical attributes in any order', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/contact'
    ? new Response('<html><head><meta name="description" content="noindex"><meta name="robots" content="index, follow"><link href="https://example.com/contact" rel="alternate canonical"></head></html>', { status: 200, headers })
    : null))
  assert.ok(report.failures.some((entry) => entry.includes('/contact: missing HTML noindex')))
  assert.ok(report.failures.some((entry) => entry.includes('/contact: unexpected canonical')))
})

test('accepts valid noindex robots metadata with reordered attributes', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/contact'
    ? new Response('<html><head><meta content="nofollow, noindex" name="robots"></head></html>', { status: 200, headers })
    : null))
  assert.deepEqual(report.failures, [])
})

test('rejects misleading X-Robots-Tag values without a noindex directive', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/contact'
    ? new Response(html, { status: 200, headers: { 'x-robots-tag': 'x-noindex, follow' } })
    : null))
  assert.ok(report.failures.some((entry) => entry.includes('/contact: missing X-Robots-Tag noindex')))
})

test('rejects verified FareHarbor links when the overlay loader is absent', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/mini-highland-cow-experience'
    ? new Response(`${html}<a href="https://fareharbor.com/embeds/book/udderlyridiculous/items/123456/">Book</a>`, { status: 200, headers })
    : null))
  assert.ok(report.failures.some((issue) => issue.includes('/mini-highland-cow-experience: Verified FareHarbor booking links')))
})

test('accepts verified FareHarbor links when their overlay loader is present', async () => {
  const report = await smokeStaging(origin, mockSend((path) => path === '/mini-highland-cow-experience'
    ? new Response(`${html}<a href="https://fareharbor.com/embeds/book/udderlyridiculous/items/123456/">Book</a><script src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes"></script>`, { status: 200, headers })
    : null))
  assert.deepEqual(report.failures, [])
})

test('reports network errors instead of aborting remaining checks', async () => {
  const report = await smokeStaging(origin, mockSend((path) => {
    if (path === '/contact') throw Error('connection lost')
    return null
  }))
  assert.ok(report.failures.some((entry) => entry.includes('/contact: connection lost')))
})
