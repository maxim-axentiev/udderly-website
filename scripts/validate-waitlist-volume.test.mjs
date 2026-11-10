import assert from 'node:assert/strict'
import test from 'node:test'
import { validateWaitlistVolume } from './validate-waitlist-volume.mjs'

function config(project = 'udderly-website-staging') {
  return {
    services: {
      website: {
        environment: { WAITLIST_DATA_DIR: '/data/waitlist' },
        volumes: [{ type: 'volume', source: 'waitlist-data', target: '/data/waitlist', volume: {} }],
      },
    },
    volumes: { 'waitlist-data': { name: project + '_waitlist-data' } },
  }
}

test('permits the single isolated named volume in each environment', () => {
  for (const project of ['udderly-website-staging', 'udderly-website-production']) {
    assert.equal(validateWaitlistVolume(config(project), project), true)
    const shorthand = config(project)
    shorthand.services.website.volumes = ['waitlist-data:/data/waitlist']
    assert.equal(validateWaitlistVolume(shorthand, project), true)
  }
})

test('allows no volumes only when waitlist is deliberately unavailable', () => {
  assert.equal(validateWaitlistVolume({ services: { website: { volumes: [], environment: {} } } }, 'udderly-website-staging'), true)
  const missing = config()
  missing.services.website.volumes = []
  assert.throws(() => validateWaitlistVolume(missing, 'udderly-website-staging'), /waitlist data volume/i)
})

test('rejects host bind, wrong target, extra mount, and external volumes', () => {
  const changes = [
    (c) => { c.services.website.volumes = ['/var/run/docker.sock:/data/waitlist'] },
    (c) => { c.services.website.volumes[0].type = 'bind' },
    (c) => { c.services.website.volumes[0].source = '/etc' },
    (c) => { c.services.website.volumes[0].target = '/app' },
    (c) => { c.services.website.volumes.push({ type: 'volume', source: 'other', target: '/tmp' }) },
    (c) => { c.volumes['waitlist-data'].external = true },
    (c) => { c.volumes['waitlist-data'].driver = 'nfs' },
    (c) => { c.volumes['waitlist-data'].name = 'another-private-volume' },
    (c) => { c.services.website.environment.WAITLIST_DATA_DIR = '/tmp' },
    (c) => { delete c.volumes['waitlist-data'] },
  ]
  for (const change of changes) {
    const c = config()
    change(c)
    assert.throws(() => validateWaitlistVolume(c, 'udderly-website-staging'), /volume/i)
  }
})
