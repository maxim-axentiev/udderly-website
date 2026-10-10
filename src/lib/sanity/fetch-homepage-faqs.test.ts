import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { sanityClient } from '@/lib/sanity/client'
import { fetchHomepageFaqDocument } from '@/lib/sanity/fetch'

describe('fetchHomepageFaqDocument', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
  })

  it('returns null when Sanity is unavailable', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))

    await expect(fetchHomepageFaqDocument()).resolves.toBeNull()
  })

  it('returns ordered FAQ slots when the query succeeds', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue({
      homepageFaqs: [
        {
          _key: 'a',
          faq: {
            _id: 'faq-petting',
            question: 'Are you a petting farm?',
            answer: [
              {
                _type: 'block',
                children: [{ _type: 'span', text: 'Nope!' }],
              },
            ],
            active: true,
          },
        },
      ],
    } as never)

    await expect(fetchHomepageFaqDocument()).resolves.toEqual({
      homepageFaqs: [
        {
          _key: 'a',
          faq: {
            _id: 'faq-petting',
            question: 'Are you a petting farm?',
            answer: [
              {
                _type: 'block',
                children: [{ _type: 'span', text: 'Nope!' }],
              },
            ],
            active: true,
          },
        },
      ],
    })
  })
})
