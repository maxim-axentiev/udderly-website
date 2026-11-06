import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}))

import { experiencesHubFallback } from '@/lib/experiences/hub'
import { resolveExperiencesHubPage } from '@/lib/experiences/hub-page'
import { sanityClient } from '@/lib/sanity/client'
import {
  fetchExperienceBySlug,
  fetchExperienceFoundation,
  fetchExperienceHub,
  fetchExperienceSitemapSlugs,
  fetchPublishedExperiencesHub,
  loadExperiencesHubContent,
} from '@/lib/sanity/fetch'
import { experienceBySlugQuery, experienceFoundationQuery, experienceHubQuery, experienceSitemapSlugsQuery, experiencesHubContentQuery } from '@/lib/sanity/queries'

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

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps unpublished experiences absent when their query returns null', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(null as never)
    await expect(fetchExperienceBySlug('goat-cuddles')).resolves.toBeNull()
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceBySlugQuery, {
      slug: 'goat-cuddles', slugs: expect.arrayContaining(['goat-cuddles']),
    })
  })

  it('times out a stalled individual experience query instead of treating it as an unpublished page', async () => {
    vi.useFakeTimers()
    vi.mocked(sanityClient.fetch).mockImplementation(() => new Promise(() => {}))
    const result = fetchExperienceBySlug('goat-cuddles')
    const rejection = expect(result).rejects.toThrow('Sanity request timed out')
    await vi.advanceTimersByTimeAsync(4000)
    await rejection
  })

  it('omits optional experience foundation content when its query stalls', async () => {
    vi.useFakeTimers()
    vi.mocked(sanityClient.fetch).mockImplementation(() => new Promise(() => {}))
    const result = fetchExperienceFoundation()
    await vi.advanceTimersByTimeAsync(4000)
    await expect(result).resolves.toBeNull()
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceFoundationQuery)
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

  it('times out a stalled published experience sitemap request', async () => {
    vi.useFakeTimers()
    vi.mocked(sanityClient.fetch).mockImplementation(() => new Promise(() => {}))
    const result = fetchExperienceSitemapSlugs()
    const rejection = expect(result).rejects.toThrow('Sanity request timed out')
    await vi.advanceTimersByTimeAsync(4000)
    await rejection
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceSitemapSlugsQuery)
  })

  it('filters sitemap URLs after selecting the preferred indexability record', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue([
      { slug: 'private-miniature-donkey-lunch-picnic', noIndex: false },
      { slug: 'miniature-donkey-lunch-picnic', noIndex: true },
      { slug: 'goat-yoga', noIndex: false },
    ] as never)
    await expect(fetchExperienceSitemapSlugs()).resolves.toEqual(['goat-yoga'])
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceSitemapSlugsQuery)
  })

  it('keeps the experiences listing available when the published cards query fails', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('Sanity is unreachable'))
    await expect(fetchExperienceHub()).resolves.toEqual([])
    expect(sanityClient.fetch).toHaveBeenCalledWith(experienceHubQuery)
    const page = resolveExperiencesHubPage(null, await fetchExperienceHub())
    expect(page.cards.length).toBeGreaterThan(0)
    expect(page.cards.every((card) => !card.bookingActions?.length)).toBe(true)
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
