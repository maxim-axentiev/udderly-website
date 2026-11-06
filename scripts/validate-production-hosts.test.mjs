import assert from 'node:assert/strict'
import test from 'node:test'
import { validateProductionHosts } from './validate-production-hosts.mjs'

function config(host = 'udderlyridiculousfarmlife.com', canonical = 'https://udderlyridiculousfarmlife.com') {
  return { networks: { web: { external: true } }, services: { website: {
    environment: { APP_HOST: host, PUBLIC_CANONICAL_ORIGIN: canonical },
    networks: ['web'],
    read_only: true,
    cap_drop: ['ALL'],
    security_opt: ['no-new-privileges:true'],
    labels: {
      'traefik.enable': 'true',
      'traefik.docker.network': 'web',
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

test('accepts the exact HTTPS production hostname and canonical origin', () => {
  assert.equal(validateProductionHosts(config()), true)
  assert.equal(validateProductionHosts(config('www.udderlyridiculousfarmlife.com','https://www.udderlyridiculousfarmlife.com')), true)
})
test('rejects mismatched, placeholder, and insecure host configurations', () => {
  const failures = [
    config('udderlyridiculousfarmlife.com','https://www.udderlyridiculousfarmlife.com'),
    config('udderlyridiculousfarmlife.com','http://udderlyridiculousfarmlife.com'),
    config('udderlyridiculousfarmlife.com','https://udderlyridiculousfarmlife.com/extra'),
    config('udderlyridiculousfarmlife.com','https://udderlyridiculousfarmlife.com/'),
    config('replace-with-production-hostname.example.com','https://replace-with-production-hostname.example.com'),
    config('staging.example.test','https://staging.example.test'),
    config('staging.example.org','https://staging.example.org'),
    config('staging.example.net','https://staging.example.net'),
    config('udderlyridiculousfarmlife.com:3000','https://udderlyridiculousfarmlife.com:3000'),
    config('', ''),
  ]
  for (const value of failures) assert.throws(() => validateProductionHosts(value))
})
test('prevents production from claiming staging or arbitrary unrelated domains', () => {
  for (const host of [
    'staging.udderlyridiculousfarmlife.com',
    'preview.udderlyridiculousfarmlife.com',
    'udderlyridiculousfarmlife.ca',
    'another-real-business.com',
  ]) {
    assert.throws(() => validateProductionHosts(config(host, `https://${host}`)), /approved farm apex or www hostname/)
  }
})

test('rejects production privilege and host-access overrides despite required capability drops', () => {
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
    assert.throws(() => validateProductionHosts(unsafe), /restore capabilities|run as root|host namespaces|host devices/i)
  }
})

test('rejects disabled production runtime hardening', () => {
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
    assert.throws(() => validateProductionHosts(unsafe), /read-only root filesystem/i)
  }
})

test('rejects production container exposure and unsafe network settings', () => {
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
    assert.throws(() => validateProductionHosts(unsafe), /network|ports|volumes|privileges/i)
  }
})

test('rejects production Traefik misrouting or disabled HTTPS', () => {
  const router = 'traefik.http.routers.udderly-website-production'
  const changes = [
    ['traefik.enable', 'false'],
    ['traefik.docker.network', 'default'],
    [`${router}.entrypoints`, 'web'],
    [`${router}.tls`, 'false'],
    [`${router}.tls.certresolver`, 'other'],
    [`${router}.service`, 'other'],
    ['traefik.http.services.udderly-website-production.loadbalancer.server.port', '8000'],
  ]
  for (const [label, value] of changes) {
    const unsafe = config()
    unsafe.services.website.labels[label] = value
    assert.throws(() => validateProductionHosts(unsafe), /Traefik|HTTPS routing/i)
  }
})

test('blocks missing or weakened production security headers', () => {
  const changes = [
    ['traefik.http.routers.udderly-website-production.middlewares', ''],
    ['traefik.http.middlewares.udderly-website-production-security.headers.contenttypenosniff', 'false'],
    ['traefik.http.middlewares.udderly-website-production-security.headers.referrerpolicy', 'unsafe-url'],
  ]
  for (const [label, value] of changes) {
    const broken = config()
    broken.services.website.labels[label] = value
    assert.throws(() => validateProductionHosts(broken), /security headers/i)
  }
})

test('accepts Docker Compose normalized label arrays and network maps', () => {
  const normalized = config()
  normalized.services.website.labels = Object.entries(normalized.services.website.labels).map(([key, value]) => `${key}=${value}`)
  normalized.services.website.networks = { web: null }
  assert.equal(validateProductionHosts(normalized), true)
})

test('rejects mismatched Traefik routing labels', () => {
  const value = config()
  value.services.website.labels['traefik.http.routers.udderly-website-production.rule'] = 'Host(`other.example.org`)'
  assert.throws(() => validateProductionHosts(value), /Traefik/)
})
