import { describe, expect, it } from 'vitest'

import { buildRobotsTxt } from './robots'

describe('buildRobotsTxt', () => {
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
