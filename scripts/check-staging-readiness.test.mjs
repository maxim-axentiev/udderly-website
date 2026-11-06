import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { evaluateStagingReadiness, parseReadinessArgs } from './check-staging-readiness.mjs'

const checkoutRoot = fileURLToPath(new URL('../', import.meta.url))
const cleanRoot = { value: checkoutRoot }

function validCompose() {
  const host = 'staging.udderlyridiculousfarmlife.com'
  const middleware = 'udderly-website-staging-noindex'
  return { networks: { web: { external: true } }, services: { website: {
    environment: { APP_HOST: host, PUBLIC_CANONICAL_ORIGIN: '',
      RESEND_API_KEY: '', CONTACT_SMTP_HOST: '', CONTACT_SMTP_PORT: '',
      CONTACT_SMTP_USER: '', CONTACT_SMTP_PASSWORD: '' },
    networks: ['web'],
    read_only: true,
    cap_drop: ['ALL'],
    security_opt: ['no-new-privileges:true'],
    labels: {
      'traefik.enable': 'true',
      'traefik.docker.network': 'web',
      'traefik.http.routers.udderly-website-staging.rule': 'Host(`' + host + '`)',
      'traefik.http.routers.udderly-website-staging.entrypoints': 'websecure',
      'traefik.http.routers.udderly-website-staging.tls': 'true',
      'traefik.http.routers.udderly-website-staging.tls.certresolver': 'letsencrypt',
      'traefik.http.routers.udderly-website-staging.service': 'udderly-website-staging',
      'traefik.http.services.udderly-website-staging.loadbalancer.server.port': '3000',
      'traefik.http.routers.udderly-website-staging.middlewares': middleware,
      ['traefik.http.middlewares.' + middleware + '.headers.customresponseheaders.X-Robots-Tag']: 'noindex, nofollow, noarchive',
      ['traefik.http.middlewares.' + middleware + '.headers.contenttypenosniff']: 'true',
      ['traefik.http.middlewares.' + middleware + '.headers.referrerpolicy']: 'strict-origin-when-cross-origin',
    },
  } } }
}

test('accepts validated staging configuration and clean working tree', () => {
  assert.deepEqual(evaluateStagingReadiness({ compose: { value: validCompose() }, gitRoot: cleanRoot, gitStatus: { value: '' } }), [])
})

test('rejects placeholder hostname, dirty checkout and missing selected env file', () => {
  const compose = validCompose()
  compose.services.website.environment.APP_HOST = 'YOUR-STAGING-HOSTNAME'
  const issues = evaluateStagingReadiness({
    compose: { value: compose }, gitRoot: cleanRoot, gitStatus: { value: ' M package.json\n' }, envFileExists: false,
  })
  assert.equal(issues.length, 3)
  assert.ok(issues.some((issue) => issue.includes('environment file')))
  assert.ok(issues.some((issue) => issue.includes('configuration invalid')))
  assert.ok(issues.some((issue) => issue.includes('uncommitted changes')))
})

test('reports tools unavailable without exposing or inventing a deploy result', () => {
  assert.equal(evaluateStagingReadiness({
    compose: { error: 'Docker unavailable' }, gitRoot: cleanRoot, gitStatus: { error: 'Git unavailable' },
  }).length, 2)
})

test('blocks a missing Git checkout or a different Git root even with a clean status', () => {
  for (const gitRoot of [undefined, { error: 'not a Git repository' }, { value: '' }, { value: 'C:/another/checkout' }]) {
    const issues = evaluateStagingReadiness({
      compose: { value: validCompose() }, gitRoot, gitStatus: { value: '' },
    })
    assert.equal(issues.length, 1)
    assert.match(issues[0], /Git checkout root unavailable|must be the Git checkout root/)
  }
})

test('accepts only an optional explicit environment-file argument', () => {
  assert.deepEqual(parseReadinessArgs([]), { envFile: null })
  assert.deepEqual(parseReadinessArgs(['--env-file', '.env.staging']), { envFile: '.env.staging' })
  for (const args of [['--deploy'], ['--env-file'], ['--env-file', ''], ['--env-file', 'a', 'extra']]) {
    assert.throws(() => parseReadinessArgs(args), /Usage:/)
  }
})
