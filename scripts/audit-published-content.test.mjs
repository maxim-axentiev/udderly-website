import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { auditPublishedContent, fetchPublishedContent, hasUsableLegalContent } from './audit-published-content.mjs'

const substantiveContent = [{ _type: 'block', style: 'normal', children: [
  { _type: 'span', text: 'This policy explains how information is handled, retained, and protected when you use this website.' },
] }]
const policies = [
  { publicSlug: 'privacy-policy', policyType: 'privacy', content: substantiveContent },
  { publicSlug: 'terms-of-service', policyType: 'terms', content: substantiveContent },
  { publicSlug: 'cookies-policy', policyType: 'cookies', content: substantiveContent },
]
const experience = {
  _id: 'goat-yoga', title: 'Goat Yoga', slug: 'goat-yoga',
  bookingVerified: true, bookingProvider: 'fareharbor',
  fareharborItemId: '123456', priceDisplay: '$25',
}

test('production deployment blocks on live published-content failures before touching containers', () => {
  const script = readFileSync(new URL('deploy-production.sh', import.meta.url), 'utf8')
  const audit = script.indexOf('if ! node scripts/audit-published-content.mjs; then')
  const config = script.indexOf('config --format json | node scripts/validate-production-hosts.mjs')
  const container = script.indexOf('docker compose "${COMPOSE_ARGS[@]}" ps -q website')
  const deploy = script.indexOf('up -d --build')
  assert.ok(config >= 0 && audit > config && container > audit && deploy > container)
  assert.match(script, /Production deployment blocked: published content audit failed/)
  const staging = readFileSync(new URL('deploy-staging.sh', import.meta.url), 'utf8')
  assert.ok(!staging.includes('node scripts/audit-published-content.mjs'))
})

test('accepts published policies and verified experience records', () => {
  const result = auditPublishedContent({ policies, experiences: [experience] })
  assert.deepEqual(result.blockers, [])
  assert.deepEqual(result.review, [])
  assert.equal(result.experienceCount, 1)
})

test('rejects empty legal blocks, headings, and placeholder copy', () => {
  for (const content of [
    null, [], [{ _type: 'block', children: [{ _type: 'span', text: '   ' }] }],
    [{ _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Privacy Policy Information and Important Details for Visitors' }] }],
    [{ _type: 'block', children: [{ _type: 'span', text: 'Coming soon. This policy will be provided at a later date.' }] }],
    [{ _type: 'block', children: [{ _type: 'span', text: 'Placeholder text for this website legal policy.' }] }],
  ]) {
    assert.equal(hasUsableLegalContent(content), false)
    const report = auditPublishedContent({ policies: [
      { ...policies[0], content }, policies[1], policies[2],
    ], experiences: [] })
    assert.ok(report.blockers.some((issue) => issue.includes('/privacy-policy')))
  }
  assert.equal(hasUsableLegalContent(substantiveContent), true)
})

test('blocks duplicate published legal slugs even if one record has valid content', () => {
  const report = auditPublishedContent({ policies: [
    ...policies,
    { ...policies[0], _id: 'duplicate-policy', content: [] },
  ], experiences: [] })
  assert.ok(report.blockers.some((issue) => issue.includes('Multiple active published legal policies for /privacy-policy')))
  assert.ok(report.blockers.some((issue) => issue.includes('Legal policy missing published content: /privacy-policy')))
})

test('reports noindex legal policy for review without assuming it is a launch blocker', () => {
  const report = auditPublishedContent({ policies: [
    { ...policies[0], noIndex: true }, policies[1], policies[2],
  ], experiences: [] })
  assert.deepEqual(report.blockers, [])
  assert.ok(report.review.some((issue) => issue.includes('search indexing: /privacy-policy')))
})

test('flags missing legal content, duplicate slugs, and unverified bookings', () => {
  const result = auditPublishedContent({
    policies: [{ publicSlug: 'privacy-policy', policyType: 'terms', content: substantiveContent }],
    experiences: [
      { ...experience, bookingVerified: false, priceDisplay: null },
      { ...experience, _id: 'duplicate', fareharborItemId: 'invalid' },
    ],
  })
  assert.equal(result.blockers.length, 4)
  assert.ok(result.blockers.some((issue) => issue.includes('duplicate slug')))
  assert.ok(result.review.some((issue) => issue.includes('No verified booking destination')))
  assert.ok(result.review.some((issue) => issue.includes('No published price')))
})

test('blocks active experiences that detail routing cannot reliably display', () => {
  const report = auditPublishedContent({ policies, experiences: [
    { ...experience, title: '   ', slug: 'untitled-experience' },
    { ...experience, title: 'Valid title', slug: 'Invalid Slug!' },
  ] })
  assert.ok(report.blockers.some((issue) => issue.includes('missing usable title: untitled-experience')))
  assert.ok(report.blockers.some((issue) => issue.includes('invalid URL slug: Invalid Slug!')))
})

test('blocks active experience slugs that collide with routed or retired URLs', () => {
  const source = readFileSync(new URL('../src/lib/routes/paths.ts', import.meta.url), 'utf8')
  const extract = (name) => {
    const section = source.match(new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`))?.[1]
    assert.ok(section, `Could not read ${name} from routing source`)
    return [...section.matchAll(/'([^']+)'/g)].map((match) => match[1])
  }
  const slugs = [...new Set([...extract('RESERVED_SLUGS'), ...extract('RETIRED_EXPERIENCE_SLUGS')])]
  const aliasSource = readFileSync(new URL('../src/lib/experiences/public-paths.ts', import.meta.url), 'utf8')
  const aliasBlock = aliasSource.match(/const STORED_TO_PUBLIC_SLUG[^=]*=\s*\{([\s\S]*?)\}/)?.[1]
  assert.ok(aliasBlock, 'Could not inspect approved stored experience aliases')
  const aliases = [...aliasBlock.matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)]
  assert.equal(aliases.length, 2)
  const approvedStoredSlugs = new Set(aliases.map((match) => match[1]))
  for (const slug of slugs) {
    const result = auditPublishedContent({ policies, experiences: [{ ...experience, slug }] })
    const collision = result.blockers.some((item) => item.includes('reserved or retired URL slug'))
    assert.equal(collision, !approvedStoredSlugs.has(slug), `Unexpected collision handling: ${slug}`)
  }
  for (const [, stored, publicSlug] of aliases) {
    assert.ok(!slugs.includes(publicSlug), `Public alias is reserved: ${publicSlug}`)
    assert.deepEqual(auditPublishedContent({ policies, experiences: [{ ...experience, slug: stored }] }).blockers, [])
  }
  assert.deepEqual(auditPublishedContent({ policies, experiences: [experience] }).blockers, [])
})

test('allows a private-only verified HTTPS booking destination', () => {
  const result = auditPublishedContent({
    policies,
    experiences: [{
      ...experience, bookingVerified: false, privateBookingVerified: true,
      privateBookingUrl: 'https://fareharbor.com/embeds/book/example/items/123456/',
    }],
  })
  assert.deepEqual(result.review, [])
})

test('rejects credential-bearing HTTPS destinations', () => {
  const result = auditPublishedContent({
    policies,
    experiences: [{
      ...experience, bookingProvider: 'external', bookingUrl: 'https://user:pass@example.com/book',
      privateBookingVerified: false,
    }],
  })
  assert.ok(result.review.some((issue) => issue.includes('No verified booking destination')))
})

test('does not treat placeholder HTTPS URLs as verified booking destinations', () => {
  const urls = [
    'https://localhost/book', 'https://dev.localhost/book',
    'https://preview.example.com/book', 'https://example.org/book',
    'https://example.net/book', 'https://preview.test/book',
    'https://preview.invalid/book',
  ]
  for (const bookingUrl of urls) {
    const report = auditPublishedContent({ policies, experiences: [{
      ...experience, bookingProvider: 'external', bookingUrl, privateBookingVerified: false,
    }] })
    assert.ok(report.review.some((issue) => issue.includes('No verified booking destination')), bookingUrl)
  }
})

test('read-only Sanity query validates the response without credentials', async () => {
  let requested
  const send = async (url, options) => {
    requested = { url, options }
    return { ok: true, json: async () => ({ result: { experiences: [], policies: [] } }) }
  }
  assert.deepEqual(await fetchPublishedContent(send), { experiences: [], policies: [] })
  assert.match(requested.url, /api\.sanity\.io/)
  assert.match(decodeURIComponent(requested.url), /drafts\.\*\*/)
  assert.equal(requested.options.method, undefined)
})
