import { describe, expect, it } from 'vitest'

import { documentPath } from '@/lib/routes/paths'
import { createPageHead } from '@/lib/seo/page-head'
import type { ExperienceCardData } from '@/lib/sanity/types'

import {
  experiencesHubFallback,
  experiencesHubOrFallback,
  experiencesHubSeoInput,
  experiencesHubView,
  resolveExperiencesHub,
  type CmsExperiencesHubDocument,
} from './hub'

const publishedHub: CmsExperiencesHubDocument = {
  _id: 'experiencesHub',
  heading: ' Farm experiences ',
  intro: 'Spend time with the animals. Booking opens from each experience.',
  emptyHeading: 'Nothing is on the calendar',
  emptyMessage: 'New visits will show up here after they are published.',
  seoTitle: 'Farm experiences | Udderly Ridiculous',
  seoDescription: 'Published farm experiences at Udderly Ridiculous Farm Life.',
  ogTitle: 'Come meet the animals',
  ogDescription: 'A shared description that is different from the search description.',
}

function card(slug: string): ExperienceCardData {
  return {
    _id: `experience-${slug}`,
    title: 'Goat yoga',
    slug,
    shortDescription: null,
    priceDisplay: null,
    duration: null,
    category: null,
    season: null,
    sessionType: null,
    ageGuidance: null,
    heroImage: null,
    animalSpecies: null,
  }
}

describe('experiences hub content', () => {
  it('uses a complete published hub document', () => {
    expect(resolveExperiencesHub(publishedHub)).toEqual({
      heading: 'Farm experiences',
      intro: 'Spend time with the animals. Booking opens from each experience.',
      emptyHeading: 'Nothing is on the calendar',
      emptyMessage: 'New visits will show up here after they are published.',
      seo: {
        title: 'Farm experiences | Udderly Ridiculous',
        description: 'Published farm experiences at Udderly Ridiculous Farm Life.',
        ogTitle: 'Come meet the animals',
        ogDescription: 'A shared description that is different from the search description.',
      },
    })
  })

  it('returns the complete local fallback when the document is absent', () => {
    expect(experiencesHubOrFallback(null)).toEqual(experiencesHubFallback)
    expect(resolveExperiencesHub(null)).toBeNull()
  })

  it('rejects a partial document instead of mixing it with fallback copy', () => {
    const partial = experiencesHubOrFallback({
      heading: 'Only a heading',
    })

    expect(partial).toEqual(experiencesHubFallback)
    expect(partial.heading).toBe('Experiences')
    expect(partial.intro).toBe(experiencesHubFallback.intro)
    expect(partial.seo).toEqual(experiencesHubFallback.seo)
  })

  it('rejects invalid fields', () => {
    expect(
      resolveExperiencesHub({
        ...publishedHub,
        heading: 'X'.repeat(81),
      }),
    ).toBeNull()
    expect(
      resolveExperiencesHub({
        ...publishedHub,
        intro: '   ',
      }),
    ).toBeNull()
    expect(
      resolveExperiencesHub({
        ...publishedHub,
        emptyHeading: 12 as unknown as string,
      }),
    ).toBeNull()
    expect(
      resolveExperiencesHub({
        ...publishedHub,
        ogDescription: 'Y'.repeat(201),
      }),
    ).toBeNull()
    expect(experiencesHubOrFallback({ heading: '' })).toEqual(experiencesHubFallback)
  })

  it('keeps the current SEO fallback', () => {
    const head = createPageHead(experiencesHubSeoInput(experiencesHubFallback))
    const title = head.meta.find((entry) => 'title' in entry)
    const description = head.meta.find((entry) => entry.name === 'description')
    const ogTitle = head.meta.find((entry) => entry.property === 'og:title')
    const ogDescription = head.meta.find((entry) => entry.property === 'og:description')

    expect(title).toEqual({ title: 'Experiences | Udderly Ridiculous Farm Life' })
    expect(description).toEqual({
      name: 'description',
      content:
        'Farm experiences at Udderly Ridiculous Farm Life — animals, time outdoors, and a little personality.',
    })
    expect(ogTitle).toEqual({
      property: 'og:title',
      content: 'Experiences | Udderly Ridiculous Farm Life',
    })
    expect(ogDescription).toEqual({
      property: 'og:description',
      content:
        'Farm experiences at Udderly Ridiculous Farm Life — animals, time outdoors, and a little personality.',
    })
  })

  it('uses published SEO without falling back field by field', () => {
    const content = experiencesHubOrFallback(publishedHub)
    const head = createPageHead(experiencesHubSeoInput(content))
    const description = head.meta.find((entry) => entry.name === 'description')
    const ogDescription = head.meta.find((entry) => entry.property === 'og:description')

    expect(description?.content).toBe(
      'Published farm experiences at Udderly Ridiculous Farm Life.',
    )
    expect(ogDescription?.content).toBe(
      'A shared description that is different from the search description.',
    )
    expect(description?.content).not.toBe(experiencesHubFallback.seo.description)
  })

  it('shows the empty state and does not invent experience cards', () => {
    const view = experiencesHubView(experiencesHubFallback, [])

    expect(view.cards).toEqual([])
    expect(view.heading).toBe('Experiences')
    expect(view.intro).toBe(experiencesHubFallback.intro)
    expect(view.emptyHeading).toBe('')
    expect(view.emptyMessage).toBe(experiencesHubFallback.emptyMessage)
  })

  it('hides the empty state when published experiences exist', () => {
    const content = experiencesHubOrFallback(publishedHub)
    const view = experiencesHubView(content, [card('goat-yoga')])

    expect(view.cards).toEqual([card('goat-yoga')])
    expect(view.emptyHeading).toBe('')
    expect(view.emptyMessage).toBe('')
    expect(view.heading).toBe('Farm experiences')
  })

  it('drops experience cards that cannot be addressed', () => {
    const view = experiencesHubView(experiencesHubFallback, [card('')])

    expect(view.cards).toEqual([])
    expect(view.emptyMessage).toBe(experiencesHubFallback.emptyMessage)
  })

  it('keeps Phase 8B URL rules independent of hub copy', () => {
    const content = experiencesHubOrFallback(publishedHub)

    expect(content.heading).toBe('Farm experiences')
    expect(documentPath('experience', 'goat-yoga')).toBe('/goat-yoga')
    expect(documentPath('experience', 'experiences')).toBeUndefined()
    expect(documentPath('page', 'our-story')).toBeUndefined()
    expect(documentPath('animal', 'clara')).toBeUndefined()
  })
})
