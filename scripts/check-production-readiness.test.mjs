import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { evaluateProductionReadiness, parseProductionReadinessArgs } from './check-production-readiness.mjs'

const checkoutRoot = fileURLToPath(new URL('../', import.meta.url))
const validContent = {
  policies: ['privacy-policy', 'terms-of-service', 'cookies-policy'].map((slug, i) => ({
    publicSlug: slug, policyType: ['privacy', 'terms', 'cookies'][i],
    content: [{ _type: 'block', children: [{ _type: 'span', text: 'The policy explains how this website processes customer information and protects visitor data.' }] }],
  })),
  experiences: [],
}
function validCompose() {
  const host = 'udderlyridiculousfarmlife.com'
  return { networks: { web: { external: true } }, services: { website: {
    environment: {
      APP_HOST: host, PUBLIC_CANONICAL_ORIGIN: 'https://' + host,
      GOOGLE_PLACES_API_KEY: 'unit-test-places-key', GOOGLE_PLACE_ID: 'unit-test-place',
      RESEND_API_KEY: 'unit-test-mail-key',
    },
    networks: ['web'],
    read_only: true,
    cap_drop: ['ALL'],
    security_opt: ['no-new-privileges:true'],
    labels: {
      'traefik.enable': 'true', 'traefik.docker.network': 'web',
      'traefik.http.routers.udderly-website-production.rule': 'Host(`' + host + '`)',
      'traefik.http.routers.udderly-website-production.entrypoints': 'websecure',
      'traefik.http.routers.udderly-website-production.tls': 'true',
      'traefik.http.routers.udderly-website-production.tls.certresolver': 'letsencrypt',
      'traefik.http.routers.udderly-website-production.service': 'udderly-website-production',
      'traefik.http.routers.udderly-website-production.middlewares': 'udderly-website-production-security',
      'traefik.http.middlewares.udderly-website-production-security.headers.contenttypenosniff': 'true',
      'traefik.http.middlewares.udderly-website-production-security.headers.referrerpolicy': 'strict-origin-when-cross-origin',
      'traefik.http.services.udderly-website-production.loadbalancer.server.port': '3000',
    },
  } } }
}
function ready(overrides = {}) {
  return evaluateProductionReadiness({
    compose: { value: validCompose() }, gitRoot: { value: checkoutRoot },
    gitStatus: { value: '' }, content: { value: validContent }, ...overrides,
  })
}
test('approves only a complete configuration, clean checkout and published content', () => {
  assert.deepEqual(ready(), { blockers: [], review: [
    'Newsletter signup is not integrated; signup forms will remain disabled',
    'Gift card checkout is not integrated; purchase buttons will remain disabled',
  ] })
})
test('reports independent host, checkout, and legal blockers together', () => {
  const config = validCompose()
  config.services.website.environment.APP_HOST = 'placeholder.example.com'
  const result = ready({
    compose: { value: config }, gitRoot: { error: 'not a repository' },
    gitStatus: { value: ' M package.json' }, content: { value: { policies: [], experiences: [] } },
  })
  assert.equal(result.blockers.length, 6)
  assert.ok(result.blockers.some((item) => item.includes('Production configuration invalid')))
  assert.ok(result.blockers.some((item) => item.includes('Git checkout root')))
  assert.ok(result.blockers.some((item) => item.includes('uncommitted changes')))
  assert.equal(result.blockers.filter((item) => item.includes('Legal policy missing')).length, 3)
})
test('fails closed when Compose, Git status or Sanity cannot be verified', () => {
  const result = ready({
    compose: { error: 'Docker unavailable' }, gitStatus: { error: 'Git unavailable' },
    content: { error: 'read failed' },
  })
  assert.equal(result.blockers.length, 3)
  assert.equal(result.review.length, 2)
})
test('rejects a wrong repository root and missing environment file', () => {
  const result = ready({ gitRoot: { value: 'C:/another/project' }, envFileExists: false })
  assert.equal(result.blockers.length, 2)
})
test('retains content review warnings without turning them into launch blockers', () => {
  const result = ready({ content: { value: {
    ...validContent, experiences: [{ slug: 'goat-yoga', title: 'Goat Yoga', bookingVerified: false, priceDisplay: '' }],
  } } })
  assert.deepEqual(result.blockers, [])
  assert.equal(result.review.length, 4)
})
test('warns without blocking when live reviews or contact delivery are not configured', () => {
  const compose = validCompose()
  delete compose.services.website.environment.GOOGLE_PLACES_API_KEY
  delete compose.services.website.environment.GOOGLE_PLACE_ID
  delete compose.services.website.environment.RESEND_API_KEY
  const result = ready({ compose: { value: compose } })
  assert.deepEqual(result.blockers, [])
  assert.equal(result.review.length, 4)
  assert.ok(result.review.some((item) => item.includes('Google Places reviews')))
  assert.ok(result.review.some((item) => item.includes('Contact email delivery')))
})

test('accepts complete SMTP contact delivery and does not leak credential values in warnings', () => {
  const compose = validCompose()
  compose.services.website.environment.GOOGLE_PLACES_API_KEY = '  '
  compose.services.website.environment.RESEND_API_KEY = ''
  Object.assign(compose.services.website.environment, {
    CONTACT_SMTP_HOST: 'mail.example.com', CONTACT_SMTP_PORT: '587',
    CONTACT_SMTP_USER: 'unit-test-user', CONTACT_SMTP_PASSWORD: 'unit-test-private-value',
  })
  const result = ready({ compose: { value: compose } })
  assert.deepEqual(result.blockers, [])
  assert.equal(result.review.length, 3)
  assert.ok(result.review.some((item) => item.includes('Google Places reviews')))
  assert.ok(!JSON.stringify(result).includes('unit-test-private-value'))
})

test('only accepts optional explicit env-file argument', () => {
  assert.deepEqual(parseProductionReadinessArgs([]), { envFile: null })
  assert.deepEqual(parseProductionReadinessArgs(['--env-file', '.env.production']), { envFile: '.env.production' })
  for (const args of [['--deploy'], ['--env-file'], ['--env-file', ''], ['--env-file', 'x', '--deploy']]) {
    assert.throws(() => parseProductionReadinessArgs(args), /Usage:/)
  }
})
