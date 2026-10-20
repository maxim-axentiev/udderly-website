import { describe, expect, it } from 'vitest'

import {
  buildSitemapXml,
  getStaticSitemapEntries,
  isSitemapPathExcluded,
} from './sitemap'

describe('sitemap foundation', () => {
  it('includes the homepage and excludes the health endpoint', () => {
    const entries = getStaticSitemapEntries()

    expect(entries.map((entry) => entry.path)).toEqual([
      '/',
      '/experiences',
      '/tower-of-goats-discovery-trail',
      '/adopt-an-animal',
      '/animals-for-sale',
      '/corporate-training',
      '/corporate-training/team-building-experiences',
      '/corporate-training/experiential-tourism-development',
      '/corporate-training/disc-assessment',
      '/corporate-training/the-power-of-conversation',
      '/corporate-training/alpaca-emotional-intelligence',
      '/corporate-training/beyond-engagement',
      '/corporate-training/innovation-on-the-farm',
    ])
    expect(isSitemapPathExcluded('/health')).toBe(true)
    expect(isSitemapPathExcluded('/')).toBe(false)
  })

  it('builds loc URLs from the canonical origin', () => {
    const xml = buildSitemapXml('https://example.com', [
      ...getStaticSitemapEntries(),
      { path: '/health' },
    ])

    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).not.toContain('/health')
  })
})
