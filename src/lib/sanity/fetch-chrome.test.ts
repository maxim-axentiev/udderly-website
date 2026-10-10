import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { sanityClient } from '@/lib/sanity/client'
import { fetchSiteChromeDocuments } from '@/lib/sanity/fetch'

describe('fetchSiteChromeDocuments', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
  })

  it('returns null documents when Sanity is unavailable', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))

    await expect(fetchSiteChromeDocuments()).resolves.toEqual({
      navigation: null,
      siteSettings: null,
    })
  })

  it('returns published navigation and site settings when the query succeeds', async () => {
    vi.mocked(sanityClient.fetch)
      .mockResolvedValueOnce({
        headerItems: [
          {
            link: {
              label: 'Experiences',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'experiences' },
            },
          },
        ],
      } as never)
      .mockResolvedValueOnce({
        siteName: 'Udderly Test Farm',
      } as never)

    await expect(fetchSiteChromeDocuments()).resolves.toEqual({
      navigation: {
        headerItems: [
          {
            link: {
              label: 'Experiences',
              linkType: 'internal',
              internalLink: { _type: 'page', slug: 'experiences' },
            },
          },
        ],
      },
      siteSettings: { siteName: 'Udderly Test Farm' },
    })
  })
})
