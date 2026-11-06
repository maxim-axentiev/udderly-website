import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

import { bookingOverlayIssues } from './verify-booking-overlay.mjs'

/**
 * Local post-build HTTP smoke test. Never contacts the public website, makes
 * bookings, or uses credentials. Run after npm run build.
 */
const serverEntry = '.output/server/index.mjs'
if (!existsSync(serverEntry)) {
  console.error('Build is missing. Run npm run build before npm run smoke:local.')
  process.exit(1)
}

const host = '127.0.0.1'
const canonicalMode = process.argv.includes('--canonical')
const canonicalOrigin = 'https://udderlyridiculousfarmlife.com'
const port = canonicalMode ? 3198 : 3197
const origin = `http://${host}:${port}`
const sitePages = [
  '/', '/experiences', '/tower-of-goats-discovery-trail', '/adopt-an-animal',
  '/animals-for-sale', '/corporate-training',
  '/corporate-training/team-building-experiences',
  '/corporate-training/experiential-tourism-development',
  '/corporate-training/disc-assessment',
  '/corporate-training/the-power-of-conversation',
  '/corporate-training/alpaca-emotional-intelligence',
  '/corporate-training/beyond-engagement',
  '/corporate-training/innovation-on-the-farm',
  '/our-story', '/vision-values', '/team', '/faq', '/urbort-blog',
  '/contact', '/newsletter', '/farm-market-store', '/ice-cream',
  '/gift-card', '/farm-glamping', '/privacy-policy',
  '/terms-of-service', '/cookies-policy',
  '/goat-yoga', '/goat-recess', '/goat-cuddles',
  '/alpaca-experience-and-fibre-nesting-ball-workshop',
  '/mini-highland-cow-experience', '/mini-highland-calf-meet-and-greet',
  '/miniature-donkey-visits',
  '/baby-goat-playtime-and-snuggles',
  '/alpaca-lunch-picnic', '/alpaca-sunset-picnic', '/alpaca-walks',
  '/miniature-donkey-lunch-picnic', '/miniature-donkey-sunset-picnic',
  '/taste-of-farm-life', '/taste-of-farm-life-family-friendly',
]
const retired = [
  '/mini-cattle-for-sale', '/promotions', '/cow-wedding', '/cheryl-haskett',
  '/escape-to-the-countryside-farm-glamping', '/goatscaping',
]
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
const errors = []
const request = async (path) => fetch(origin + path, {
  redirect: 'manual',
  signal: AbortSignal.timeout(12000),
})
const check = (condition, message) => { if (!condition) errors.push(message) }
const server = spawn(process.execPath, [serverEntry], {
  stdio: 'ignore',
  windowsHide: true,
  env: {
    ...process.env, NODE_ENV: 'production', HOST: host,
    PORT: String(port), PUBLIC_CANONICAL_ORIGIN: canonicalMode ? canonicalOrigin : '',
  },
})
try {
  let ready = false
  for (let attempt = 0; attempt < 45; attempt++) {
    if (server.exitCode !== null) break
    try {
      const response = await request('/health')
      ready = response.status === 200
      await response.body?.cancel()
      if (ready) break
    } catch { /* not listening yet */ }
    await delay(250)
  }
  if (!ready) throw Error('Local production server did not become healthy')

  const htmlPages = new Map()
  for (const path of sitePages) {
    try {
      const response = await request(path)
      check(response.status === 200, `${path}: expected 200, got ${response.status}`)
      if (response.status === 200) {
        const html = await response.text()
        htmlPages.set(path, html)
        for (const issue of bookingOverlayIssues(html)) errors.push(`${path}: ${issue}`)
        if (canonicalMode) {
          if (['/', '/experiences', '/contact'].includes(path)) {
            check(/<meta[^>]+name="robots"[^>]+content="index, follow"/i.test(html),
              `${path}: expected indexable metadata`)
            check(html.includes(`href="${canonicalOrigin}${path}"`),
              `${path}: missing canonical URL`)
            check(html.includes(`content="${canonicalOrigin}${path}"`),
              `${path}: missing Open Graph URL`)
          }
        } else {
          check(/<meta[^>]+name="robots"[^>]+noindex|<meta[^>]+content="[^"]*noindex[^"]*"[^>]+name="robots"/i.test(html),
            `${path}: missing local noindex metadata`)
          check(!/<link[^>]+rel="canonical"/i.test(html), `${path}: unexpected canonical link`)
        }
      } else await response.body?.cancel()
    } catch (error) { errors.push(`${path}: ${error.message}`) }
  }

  const linked = new Set()
  for (const html of htmlPages.values()) {
    for (const match of html.matchAll(/(?:href|src)=(?:"([^"]+)"|'([^']+)')/g)) {
      const raw = (match[1] ?? match[2]).replaceAll('&amp;', '&')
      if (!raw.startsWith('/') || raw.startsWith('//')) continue
      const pathname = new URL(raw, origin).pathname
      linked.add(pathname)
    }
  }
  for (const path of linked) {
    if (htmlPages.has(path)) continue
    try {
      const response = await request(path)
      check(response.status === 200, `Linked ${path}: expected 200, got ${response.status}`)
      await response.body?.cancel()
    } catch (error) { errors.push(`Linked ${path}: ${error.message}`) }
  }

  for (const path of retired) {
    const response = await request(path)
    check(response.status === 404, `Retired ${path}: expected 404, got ${response.status}`)
    await response.body?.cancel()
  }
  for (const [path, destination] of redirects) {
    const response = await request(path)
    check(response.status === 301 && response.headers.get('location') === destination,
      `Redirect ${path}: expected 301 to ${destination}, got ${response.status} to ${response.headers.get('location')}`)
    await response.body?.cancel()
  }
  const robots = await request('/robots.txt')
  const robotsText = await robots.text()
  if (canonicalMode) {
    check(robots.status === 200 && robotsText.includes('Allow: /') &&
      robotsText.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`) && !robotsText.includes('Disallow: /'),
      'Canonical robots.txt must allow crawling and link to the sitemap')
  } else {
    check(robots.status === 200 && robotsText.includes('Disallow: /'),
      'Local robots.txt must disallow indexing')
  }
  const sitemap = await request('/sitemap.xml')
  if (canonicalMode) {
    const xml = await sitemap.text()
    check(sitemap.status === 200 && sitemap.headers.get('content-type')?.includes('application/xml'),
      `Canonical sitemap should return XML, got ${sitemap.status}`)
    for (const path of ['/', '/experiences', '/contact', '/goat-yoga']) {
      check(xml.includes(`<loc>${canonicalOrigin}${path}</loc>`), `Canonical sitemap missing ${path}`)
    }
    for (const path of retired) {
      check(!xml.includes(`<loc>${canonicalOrigin}${path}</loc>`), `Retired ${path} appeared in sitemap`)
    }
  } else {
    check(sitemap.status === 404, `Local sitemap should be disabled, got ${sitemap.status}`)
    await sitemap.body?.cancel()
  }

  console.log(`Local smoke test: ${sitePages.length} pages, ${linked.size} linked paths, ${retired.length} retired URLs, ${redirects.size} redirects.`)
  if (errors.length) {
    for (const error of errors) console.error('FAIL', error)
    process.exitCode = 1
  } else console.log(`PASS: all checked routes, assets and ${canonicalMode ? 'canonical production SEO' : 'non-indexable local SEO'} behaviour.`)
} catch (error) {
  console.error('Smoke test failed:', error)
  process.exitCode = 1
} finally {
  server.kill()
}
