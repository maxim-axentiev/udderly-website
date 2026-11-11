import assert from 'node:assert/strict'
import test from 'node:test'
import { validateStagingHosts } from './validate-staging-hosts.mjs'

function config(host = 'staging.udderlyridiculousfarmlife.com') {
  const middleware = 'udderly-website-staging-noindex'
  return { networks: { web: { external: true } }, services: { website: {
    environment: { APP_HOST: host, PUBLIC_CANONICAL_ORIGIN: '' },
    networks: ['web'],
    read_only: true,
    cap_drop: ['ALL'],
    security_opt: ['no-new-privileges:true'],
    labels: {
      'traefik.enable': 'true',
      'traefik.docker.network': 'web',
      'traefik.http.routers.udderly-website-staging.rule': `Host(\`${host}\`)`,
      'traefik.http.routers.udderly-website-staging.entrypoints': 'websecure',
      'traefik.http.routers.udderly-website-staging.tls': 'true',
      'traefik.http.routers.udderly-website-staging.tls.certresolver': 'letsencrypt',
      'traefik.http.routers.udderly-website-staging.service': 'udderly-website-staging',
      'traefik.http.services.udderly-website-staging.loadbalancer.server.port': '3000',
      'traefik.http.routers.udderly-website-staging.middlewares': middleware,
      [`traefik.http.middlewares.${middleware}.headers.customresponseheaders.X-Robots-Tag`]: 'noindex, nofollow, noarchive',
      [`traefik.http.middlewares.${middleware}.headers.contenttypenosniff`]: 'true',
      [`traefik.http.middlewares.${middleware}.headers.referrerpolicy`]: 'strict-origin-when-cross-origin',
    },
  } } }
}

test('accepts a real staging hostname with the noindex middleware', () => {
  assert.equal(validateStagingHosts(config()), true)
  const asArray = config()
  asArray.services.website.labels = Object.entries(asArray.services.website.labels).map(([key, value]) => `${key}=${value}`)
  assert.equal(validateStagingHosts(asArray), true)
})

test('blocks placeholders and invalid staging hostnames', () => {
  for (const host of ['replace-with-host.example.com', 'staging.example.org', 'staging.example.net', 'staging.example.test', 'localhost', 'staging.udderlyridiculousfarmlife.com:3000', '']) {
    assert.throws(() => validateStagingHosts(config(host)))
  }
})

test('blocks staging from claiming either public production hostname', () => {
  for (const host of ['udderlyridiculousfarmlife.com', 'www.udderlyridiculousfarmlife.com', 'WWW.UDDERLYRIDICULOUSFARMLIFE.COM']) {
    assert.throws(() => validateStagingHosts(config(host)), /production website hostname/i)
  }
})

test('rejects unrelated valid hostnames and lookalike farm domains', () => {
  for (const host of [
    'unrelated-real-business.com',
    'udderlyridiculousfarmlife.ca',
    'staging.udderlyridiculousfarmlife.com.evil.org',
    'staging-udderlyridiculousfarmlife.com',
  ]) {
    assert.throws(() => validateStagingHosts(config(host)), /farm-owned subdomain/i)
  }
  assert.equal(validateStagingHosts(config('preview.udderlyridiculousfarmlife.com')), true)
})

test('blocks staging routes without HTTPS or the correct service port', () => {
  const router = 'traefik.http.routers.udderly-website-staging'
  const changes = [
    [`${router}.entrypoints`, 'web'],
    [`${router}.tls`, 'false'],
    [`${router}.tls.certresolver`, 'other'],
    [`${router}.service`, 'other'],
    ['traefik.http.services.udderly-website-staging.loadbalancer.server.port', '8000'],
  ]
  for (const [key, value] of changes) {
    const broken = config()
    broken.services.website.labels[key] = value
    assert.throws(() => validateStagingHosts(broken), /HTTPS routing/i)
  }
})

test('rejects staging privilege and host-access overrides despite required capability drops', () => {
  const changes = [
    (c) => { c.services.website.cap_add = ['SYS_ADMIN'] },
    (c) => { c.services.website.user = 'root' },
    (c) => { c.services.website.user = '0:0' },
    (c) => { c.services.website.user = '0:node' },
    (c) => { c.services.website.pid = 'host' },
    (c) => { c.services.website.ipc = 'host' },
    (c) => { c.services.website.devices = ['/dev/sda:/dev/sda'] },
  ]
  for (const change of changes) {
    const unsafe = config()
    change(unsafe)
    assert.throws(() => validateStagingHosts(unsafe), /restore capabilities|run as root|host namespaces|host devices/i)
  }
})

test('rejects disabled staging runtime hardening', () => {
  const changes = [
    (c) => { c.services.website.read_only = false },
    (c) => { c.services.website.cap_drop = [] },
    (c) => { c.services.website.cap_drop = ['NET_ADMIN'] },
    (c) => { c.services.website.security_opt = [] },
    (c) => { c.services.website.security_opt = ['no-new-privileges:false'] },
  ]
  for (const change of changes) {
    const unsafe = config()
    change(unsafe)
    assert.throws(() => validateStagingHosts(unsafe), /read-only root filesystem/i)
  }
})

test('rejects unsafe container network exposure and elevated privileges', () => {
  const changes = [
    (c) => { c.services.website.ports = ['3000:3000'] },
    (c) => { c.services.website.networks = ['web', 'default'] },
    (c) => { c.services.website.networks = { default: null } },
    (c) => { c.networks.web.external = false },
    (c) => { c.services.website.volumes = ['/var/run/docker.sock:/var/run/docker.sock'] },
    (c) => { c.services.website.privileged = true },
    (c) => { c.services.website.network_mode = 'host' },
  ]
  for (const modify of changes) {
    const unsafe = config()
    modify(unsafe)
    assert.throws(() => validateStagingHosts(unsafe), /network|ports|volumes?|privileges/i)
  }
})

test('rejects disabled Traefik or an incorrect Docker network label', () => {
  for (const [label, value] of [['traefik.enable', 'false'], ['traefik.docker.network', 'default']]) {
    const unsafe = config()
    unsafe.services.website.labels[label] = value
    assert.throws(() => validateStagingHosts(unsafe), /Traefik only on the external web network/i)
  }
})

test('allows Resend email delivery without weakening noindex protections', () => {
  const enabled = config()
  enabled.services.website.environment.RESEND_API_KEY = 'test-placeholder-never-a-secret'
  assert.equal(validateStagingHosts(enabled), true)
})

test('rejects direct SMTP email delivery credentials in staging', () => {
  for (const name of ['CONTACT_SMTP_HOST', 'CONTACT_SMTP_PORT', 'CONTACT_SMTP_USER', 'CONTACT_SMTP_PASSWORD']) {
    const unsafe = config()
    unsafe.services.website.environment[name] = 'configured'
    assert.throws(() => validateStagingHosts(unsafe), /SMTP email delivery/i)
  }
})

test('blocks missing or weakened staging security headers', () => {
  const middleware = 'traefik.http.middlewares.udderly-website-staging-noindex.headers'
  for (const [label, value] of [
    [middleware + '.contenttypenosniff', 'false'],
    [middleware + '.referrerpolicy', 'unsafe-url'],
  ]) {
    const broken = config()
    broken.services.website.labels[label] = value
    assert.throws(() => validateStagingHosts(broken), /security headers/i)
  }
})

test('blocks staging without noindex or with a canonical origin', () => {
  const canonical = config()
  canonical.services.website.environment.PUBLIC_CANONICAL_ORIGIN = 'https://udderlyridiculousfarmlife.com'
  assert.throws(() => validateStagingHosts(canonical), /canonical/i)
  const wrongHost = config()
  wrongHost.services.website.labels['traefik.http.routers.udderly-website-staging.rule'] = 'Host(`other.udderlyridiculousfarmlife.com`)'
  assert.throws(() => validateStagingHosts(wrongHost), /hostname/i)
  const noMiddleware = config()
  delete noMiddleware.services.website.labels['traefik.http.routers.udderly-website-staging.middlewares']
  assert.throws(() => validateStagingHosts(noMiddleware), /noindex/i)
  const noHeader = config()
  delete noHeader.services.website.labels['traefik.http.middlewares.udderly-website-staging-noindex.headers.customresponseheaders.X-Robots-Tag']
  assert.throws(() => validateStagingHosts(noHeader), /noindex/i)
})
