import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { experiencesHubFallback } from '@/lib/experiences/hub'
import { sanityClient } from '@/lib/sanity/client'
import {
  fetchExperienceHub,
  fetchPublishedExperiencesHub,
  loadExperiencesHubContent,
} from '@/lib/sanity/fetch'
import { experienceHubQuery, experiencesHubContentQuery } from '@/lib/sanity/queries'

const publishedHub = {
  _id: 'experiencesHub',
  heading: 'Farm experiences',
  intro: 'Spend time with the animals.',
  emptyHeading: 'Nothing is on the calendar',
  emptyMessage: 'New visits will show up here after they are published.',
  seoTitle: 'Farm experiences | Udderly Ridiculous',
  seoDescription: 'Published farm experiences at Udderly Ridiculous Farm Life.',
  ogTitle: 'Come meet the animals',
  ogDescription: 'A shared description for the Experiences page.',
}

describe('experiences hub fetch', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
  })

  it('requests the published experiences hub and not a draft', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(publishedHub as never)
    await expect(fetchPublishedExperiencesHub()).resolves.toEqual(publishedHub)
    expect(sanityClient.fetch).toHaveBeenCalledWith(experiencesHubContentQuery)
    expect(experiencesHubContentQuery).toContain('*[_id == "experiencesHub"][0]')
    expect(experiencesHubContentQuery).not.toContain('drafts.')
    expect(experiencesHubContentQuery).not.toContain('_type == "experience"')
    expect(experiencesHubContentQuery).toContain('experienceCards')
  })

  it('returns null when the hub query fails', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))
    await expect(fetchPublishedExperiencesHub()).resolves.toBeNull()
  })

  it('uses the complete fallback when the query fails', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))
    await expect(loadExperiencesHubContent()).resolves.toEqual(experiencesHubFallback)
  })

  it('uses the complete fallback when the published document is partial', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue({ heading: 'Only a heading' } as never)
    await expect(loadExperiencesHubContent()).resolves.toEqual(experiencesHubFallback)
  })

  it('keeps published experience cards on their own query', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue([
      { _id: 'experience-1', title: 'Goat yoga', slug: 'goat-yoga' },
    ] as never)

    await expect(fetchExperienceHub()).resolves.toEqual([
      { _id: 'experience-1', title: 'Goat yoga', slug: 'goat-yoga' },
    ])
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceHubQuery)
    expect(experienceHubQuery).toContain('_type == "experience"')
    expect(experienceHubQuery).toContain('bookingUrl')
    expect(experienceHubQuery).not.toContain('experiencesHub')
  })
})
