import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { sanityClient } from '@/lib/sanity/client'
import { fetchPublishedHomepage } from '@/lib/sanity/fetch'
import { homepageQuery } from '@/lib/sanity/queries'

describe('fetchPublishedHomepage', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
  })

  it('returns null when Sanity is unavailable', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))
    await expect(fetchPublishedHomepage()).resolves.toBeNull()
  })

  it('requests the published homepage query', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(null as never)
    await fetchPublishedHomepage()
    expect(sanityClient.fetch).toHaveBeenCalledWith(homepageQuery)
    expect(homepageQuery).not.toContain('drafts.')
  })
})
