import { describe, expect, it } from 'vitest'

import {
  buildSitemapXml,
  getStaticSitemapEntries,
  isSitemapPathExcluded,
} from './sitemap'

describe('sitemap foundation', () => {
  it('includes the homepage and excludes the health endpoint', () => {
    const entries = getStaticSitemapEntries()

    expect(entries.map((entry) => entry.path)).toEqual(['/'])
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
