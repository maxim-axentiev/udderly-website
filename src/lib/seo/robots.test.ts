import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { buildRobotsTxt } from './robots'

describe('buildRobotsTxt', () => {
  it('locks the staging container canonical origin off at deployment configuration level', () => {
    const compose = readFileSync(resolve(process.cwd(), 'docker-compose.staging.yml'), 'utf8')
    expect(compose).toMatch(/^\s+PUBLIC_CANONICAL_ORIGIN: ""\s*$/m)
    expect(compose).toContain('X-Robots-Tag=noindex, nofollow, noarchive')
  })

  it('disallows crawling when no canonical origin is configured', () => {
    expect(buildRobotsTxt()).toBe('User-agent: *\nDisallow: /\n')
    expect(buildRobotsTxt(undefined)).not.toContain('Sitemap:')
  })

  it('allows crawling and references the sitemap in production', () => {
    const robots = buildRobotsTxt('https://example.com')

    expect(robots).toContain('Allow: /')
    expect(robots).toContain('Sitemap: https://example.com/sitemap.xml')
    expect(robots).not.toContain('Disallow: /')
  })
})
