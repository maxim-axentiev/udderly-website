import { pathToFileURL } from 'node:url'

const projectId = 'umbuxpyp'
const dataset = 'production'
const apiVersion = 'v2026-09-08'
// Mirror the catch-all exclusions in src/lib/routes/paths.ts. A published experience
// at one of these URLs cannot render its detail page and must block cutover.
const blockedExperienceSlugs = new Set([
  'experiences', 'tower-of-goats', 'tower-of-goats-discovery-trail',
  'meet-the-herd', 'stay', 'adopt', 'adopt-an-animal', 'corporate',
  'corporate-training', 'faq', 'our-farm', 'our-story', 'team',
  'vision-values', 'animals-for-sale', 'urbort', 'urbort-blog',
  'contact', 'newsletter', 'privacy', 'privacy-policy', 'terms',
  'terms-of-service', 'cookies-policy', 'farm-market-store', 'ice-cream',
  'gift-card', 'farm-glamping', 'private-mini-highland-experience',
  'private-miniature-donkey-lunch-picnic', 'private-miniature-donkey-sunset-picnic',
  'team-building-farm-experiences', 'faqs', 'gift-certificate',
  'subscribe-to-newsletter', 'our-vision', 'privacy-policy-2',
  'experiential-tourism-development',
  'mini-cattle-for-sale', 'promotions', 'cow-wedding', 'cheryl-haskett',
  'escape-to-the-countryside-farm-glamping', 'goatscaping',
  'health', 'studio', 'robots.txt', 'sitemap.xml',
])

// These two stored CMS slugs intentionally map to distinct public URLs in
// src/lib/experiences/public-paths.ts; their legacy URLs remain redirects.
const approvedStoredExperienceAliases = new Set([
  'private-miniature-donkey-lunch-picnic',
  'private-miniature-donkey-sunset-picnic',
])

const legalTypes = {
  'privacy-policy': 'privacy',
  'terms-of-service': 'terms',
  'cookies-policy': 'cookies',
}
const query = `{
  "experiences": *[_type == "experience" && active != false && !(_id in path("drafts.**"))]{
    _id, title, "slug": slug.current, bookingVerified, bookingProvider,
    bookingUrl, fareharborItemId, privateBookingVerified, privateBookingUrl,
    priceDisplay, priceOptions
  },
  "policies": *[_type == "policy" && active != false && !(_id in path("drafts.**"))]{
    _id, publicSlug, policyType, "noIndex": seo.noIndex,
    content[]{ _type, style, children[]{ _type, text } }
  }
}`

/** Legal pages require substantive published copy, not an empty block or placeholder. */
export function hasUsableLegalContent(content) {
  if (!Array.isArray(content)) return false
  const prose = content.flatMap((block) => {
    if (block?._type !== 'block' || !Array.isArray(block.children)) return []
    if (typeof block.style === 'string' && /^h[1-6]$/.test(block.style)) return []
    return block.children.filter((span) => span?._type === 'span' && typeof span.text === 'string')
      .map((span) => span.text.trim()).filter(Boolean)
  }).join(' ').trim()
  return prose.length >= 40 && !/^(?:placeholder|coming soon|tbd|todo|lorem ipsum|test content)\b/i.test(prose)
}

export function auditPublishedContent(data) {
  const blockers = []
  const review = []
  const experiences = Array.isArray(data?.experiences) ? data.experiences : []
  const policies = Array.isArray(data?.policies) ? data.policies : []
  for (const [slug, type] of Object.entries(legalTypes)) {
    const matches = policies.filter((policy) => policy.publicSlug === slug)
    if (matches.length > 1) {
      blockers.push(`Multiple active published legal policies for /${slug}; page selection is ambiguous`)
    }
    if (matches.length !== 1 || matches[0].policyType !== type || !hasUsableLegalContent(matches[0].content)) {
      blockers.push(`Legal policy missing published content: /${slug}`)
    } else if (matches[0].noIndex === true) {
      review.push(`Required legal policy excludes search indexing: /${slug}`)
    }
  }
  const seen = new Set()
  for (const experience of experiences) {
    const label = experience.slug || experience.title || experience._id || 'untitled'
    if (!experience.slug || seen.has(experience.slug)) {
      blockers.push(`Experience has missing or duplicate slug: ${label}`)
    }
    if (experience.slug) seen.add(experience.slug)
    if (typeof experience.title !== 'string' || !experience.title.trim()) {
      blockers.push(`Active experience missing usable title: ${label}`)
    }
    if (typeof experience.slug === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(experience.slug)) {
      blockers.push(`Active experience has invalid URL slug: ${label}`)
    }
    if (blockedExperienceSlugs.has(experience.slug) && !approvedStoredExperienceAliases.has(experience.slug)) {
      blockers.push(`Active experience uses a reserved or retired URL slug: ${label}`)
    }
    const verified = experience.bookingVerified === true &&
      (experience.bookingProvider === 'fareharbor'
        ? /^\d{3,}$/.test(experience.fareharborItemId?.trim() ?? '')
        : safeHttps(experience.bookingUrl))
    const privateVerified = experience.privateBookingVerified === true && safeHttps(experience.privateBookingUrl)
    if (!verified && !privateVerified) review.push(`No verified booking destination: ${label}`)
    const priceOptions = Array.isArray(experience.priceOptions) ? experience.priceOptions : []
    if (!experience.priceDisplay?.trim() && !priceOptions.some((item) => item?.price?.trim())) {
      review.push(`No published price: ${label}`)
    }
  }
  return { blockers, review, experienceCount: experiences.length, policyCount: policies.length }
}

function safeHttps(value) {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value.trim())
    const host = url.hostname.toLowerCase()
    const placeholder = host === 'localhost' || host.endsWith('.localhost') ||
      host.endsWith('.test') || host.endsWith('.invalid') ||
      ['example.com', 'example.org', 'example.net'].some((domain) =>
        host === domain || host.endsWith('.' + domain))
    return url.protocol === 'https:' && !url.username && !url.password && !placeholder
  } catch {
    return false
  }
}

export async function fetchPublishedContent(fetchImpl = fetch) {
  const endpoint = `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const response = await fetchImpl(endpoint, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw Error(`Published Sanity read failed: HTTP ${response.status}`)
  const payload = await response.json()
  if (!payload?.result || !Array.isArray(payload.result.experiences) || !Array.isArray(payload.result.policies)) {
    throw Error('Published Sanity read returned an unexpected response')
  }
  return payload.result
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const report = auditPublishedContent(await fetchPublishedContent())
    console.log(`Published Sanity: ${report.experienceCount} active experiences, ${report.policyCount} active policy records.`)
    for (const warning of report.review) console.log('REVIEW:', warning)
    for (const blocker of report.blockers) console.error('BLOCKER:', blocker)
    console.log(`Content audit: ${report.blockers.length} blocker(s), ${report.review.length} review item(s).`)
    if (report.blockers.length) process.exitCode = 1
  } catch (error) {
    console.error('Content audit failed:', error.message)
    process.exitCode = 1
  }
}
