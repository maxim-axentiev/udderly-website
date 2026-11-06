import { describe, expect, it } from 'vitest'
import type { ExperienceCardData } from '@/lib/sanity/types'
import { filterExperienceCards } from './filters'

function card(slug: string, overrides: Partial<ExperienceCardData> = {}): ExperienceCardData {
  return {
    _id: `experience-${slug}`,
    title: slug,
    slug,
    shortDescription: null,
    priceDisplay: null,
    duration: null,
    category: null,
    season: null,
    sessionType: null,
    ageGuidance: null,
    bookingUrl: null,
    heroImage: null,
    animalSpecies: null,
    ...overrides,
  }
}

describe('public experience cards', () => {
  it('never lists retired, reserved, or invalid experience URLs', () => {
    const slugs = [
      'goat-yoga', 'mini-cattle-for-sale', 'promotions', 'cow-wedding',
      'cheryl-haskett', 'escape-to-the-countryside-farm-glamping',
      'goatscaping', 'contact', 'invalid/path',
    ]
    expect(filterExperienceCards(slugs.map((slug) => card(slug))).map((item) => item.slug)).toEqual(['goat-yoga'])
  })

  it('keeps seasonally closed offerings and respects optional visitor filters', () => {
    const seasonal = card('alpaca-walks', { season: 'summer', bookingUrl: null })
    expect(filterExperienceCards([seasonal])).toEqual([seasonal])
    expect(filterExperienceCards([seasonal], { season: 'winter' })).toEqual([])
    expect(filterExperienceCards([seasonal], { season: 'summer' })).toEqual([seasonal])
  })

  it('removes cards without a usable title or slug', () => {
    expect(filterExperienceCards([card('goat-yoga', { title: '' }), card('')])).toEqual([])
  })
})
