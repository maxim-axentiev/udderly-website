import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/fetch', () => ({
  fetchExperienceSitemapSlugs: vi.fn(),
  fetchUrbortSitemapSlugs: vi.fn(),
}))

import { fetchExperienceSitemapSlugs, fetchUrbortSitemapSlugs } from '@/lib/sanity/fetch'
import { getSitemapEntries, getStaticSitemapEntries } from './sitemap'

describe('sitemap CMS outage handling', () => {
  beforeEach(() => {
    vi.mocked(fetchExperienceSitemapSlugs).mockReset()
    vi.mocked(fetchUrbortSitemapSlugs).mockReset()
  })

  it('preserves published blog paths when the experience-slug query fails', async () => {
    vi.mocked(fetchExperienceSitemapSlugs).mockRejectedValue(new Error('Sanity unavailable'))
    vi.mocked(fetchUrbortSitemapSlugs).mockResolvedValue(['farm-update'])
    const paths = (await getSitemapEntries()).map((entry) => entry.path)
    expect(paths).toContain('/urbort-blog/farm-update')
    expect(paths).toContain('/experiences')
    expect(paths).not.toContain('/farm-update')
  })

  it('preserves experience paths when the blog query fails', async () => {
    vi.mocked(fetchExperienceSitemapSlugs).mockResolvedValue(['goat-cuddles'])
    vi.mocked(fetchUrbortSitemapSlugs).mockRejectedValue(new Error('Sanity unavailable'))
    const paths = (await getSitemapEntries()).map((entry) => entry.path)
    expect(paths).toContain('/goat-cuddles')
    expect(paths).toContain('/experiences')
  })

  it('returns only static paths when both published-content queries fail', async () => {
    vi.mocked(fetchExperienceSitemapSlugs).mockRejectedValue(new Error('Sanity unavailable'))
    vi.mocked(fetchUrbortSitemapSlugs).mockRejectedValue(new Error('Sanity unavailable'))
    await expect(getSitemapEntries()).resolves.toEqual(getStaticSitemapEntries())
  })
})
