import { pathToFileURL } from 'node:url'
import { bookingOverlayIssues } from './verify-booking-overlay.mjs'

const pages = [
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
  '/miniature-donkey-visits', '/baby-goat-playtime-and-snuggles',
  '/alpaca-lunch-picnic', '/alpaca-sunset-picnic', '/alpaca-walks',
  '/miniature-donkey-lunch-picnic', '/miniature-donkey-sunset-picnic',
  '/taste-of-farm-life', '/taste-of-farm-life-family-friendly',
]
const retired = ['/mini-cattle-for-sale', '/promotions', '/cow-wedding',
  '/cheryl-haskett', '/escape-to-the-countryside-farm-glamping', '/goatscaping']
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

function elements(html, name) {
  return html.match(new RegExp(String.raw`<${name}\b[^>]*>`, 'gi')) ?? []
}

function attribute(tag, name) {
  return tag.match(new RegExp(String.raw`(?:^|\s)${name}\s*=\s*(["'])(.*?)\1`, 'i'))?.[2]
}

function stagingSeoSafe(html) {
  const robots = elements(html, 'meta').filter((tag) => attribute(tag, 'name')?.toLowerCase() === 'robots')
    .map((tag) => attribute(tag, 'content')?.toLowerCase() ?? '')
  const hasNoindex = robots.some((value) => /(?:^|[\s,])noindex(?:$|[\s,])/.test(value))
  const canonical = elements(html, 'link').some((tag) =>
    attribute(tag, 'rel')?.toLowerCase().split(/\s+/).includes('canonical'))
  return { hasNoindex, canonical }
}

export function stagingOrigin(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw Error('Supply the approved staging HTTPS origin as the first argument')
  }
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      url.pathname !== '/' || url.search || url.hash || value !== url.origin ||
      !url.hostname.endsWith('.udderlyridiculousfarmlife.com') ||
      ['www.udderlyridiculousfarmlife.com', 'udderlyridiculousfarmlife.com'].includes(url.hostname)) {
    throw Error('Target must be a dedicated HTTPS staging hostname under udderlyridiculousfarmlife.com')
  }
  return url.origin
}

export async function smokeStaging(origin, send = fetch) {
  const base = stagingOrigin(origin)
  const failures = []
  const request = async (path) => send(base + path, {
    redirect: 'manual',
    signal: AbortSignal.timeout(12000),
    headers: { Accept: 'text/html, */*' },
  })
  const check = (okay, message) => { if (!okay) failures.push(message) }
  const guarded = async (path, inspect) => {
    try {
      const response = await request(path)
      const robotsHeader = response.headers.get('x-robots-tag')?.toLowerCase() ?? ''
      check(/(?:^|[\s,])noindex(?:$|[\s,])/.test(robotsHeader),
        `${path}: missing X-Robots-Tag noindex`)
      await inspect(response)
    } catch (error) {
      failures.push(`${path}: ${error.message}`)
    }
  }

  await guarded('/health', async (response) => {
    check(response.status === 200, `/health: expected 200, got ${response.status}`)
    await response.body?.cancel()
  })
  for (const path of pages) {
    await guarded(path, async (response) => {
      check(response.status === 200, `${path}: expected 200, got ${response.status}`)
      if (response.status !== 200) {
        await response.body?.cancel()
        return
      }
      const html = await response.text()
      const seo = stagingSeoSafe(html)
      check(seo.hasNoindex, `${path}: missing HTML noindex metadata`)
      check(!seo.canonical, `${path}: unexpected canonical URL`)
      for (const issue of bookingOverlayIssues(html)) failures.push(`${path}: ${issue}`)
    })
  }
  for (const path of retired) {
    await guarded(path, async (response) => {
      check(response.status === 404, `${path}: retired route expected 404, got ${response.status}`)
      await response.body?.cancel()
    })
  }
  for (const [path, expected] of redirects) {
    await guarded(path, async (response) => {
      const destination = response.headers.get('location')
      check(response.status === 301 && destination === expected,
        `${path}: expected 301 to ${expected}, got ${response.status} to ${destination}`)
      await response.body?.cancel()
    })
  }
  await guarded('/robots.txt', async (response) => {
    const body = await response.text()
    check(response.status === 200 && /^Disallow: \/$/m.test(body),
      '/robots.txt: expected 200 and Disallow: /')
  })
  await guarded('/sitemap.xml', async (response) => {
    check(response.status === 404, `/sitemap.xml: expected disabled 404, got ${response.status}`)
    await response.body?.cancel()
  })
  return { failures, pageCount: pages.length, retiredCount: retired.length, redirectCount: redirects.size }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const origin = stagingOrigin(process.argv[2])
    const report = await smokeStaging(origin)
    console.log(`Staging smoke: ${report.pageCount} pages, ${report.retiredCount} retired routes, ${report.redirectCount} redirects, plus health and SEO.`)
    if (report.failures.length) {
      for (const failure of report.failures) console.error('FAIL:', failure)
      process.exitCode = 1
    } else console.log('PASS: staging HTTPS responses, noindex guards, and route checks.')
  } catch (error) {
    console.error('Staging smoke failed:', error.message)
    process.exitCode = 1
  }
}
