import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ExperiencesPresentation } from '@/components/experience/experiences-presentation'
import { TowerOfGoatsPage } from '@/components/experience/tower-of-goats-page'
import {
  APPROVED_EXPERIENCES,
  buildApprovedExperienceListing,
  EXPERIENCES_HERO,
  FEAST_ON,
  isFarmHoppingListing,
  publicBookingUrl,
  TOWER_OF_GOATS_FUTURE_REDIRECT,
  TOWER_OF_GOATS_PATH,
} from '@/lib/experiences/approved-listing'
import { towerOfGoatsStories } from '@/lib/experiences/tower-of-goats'
import { documentPath, routableExperienceSlug } from '@/lib/routes/paths'
import { redirects } from '@/lib/seo/redirects'
import type { ExperienceCardData } from '@/lib/sanity/types'

const FAREHARBOR = 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/'

function card(overrides: Partial<ExperienceCardData> & Pick<ExperienceCardData, 'slug' | 'title'>): ExperienceCardData {
  return {
    _id: `experience-${overrides.slug}`,
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

const towerImages = {
  hero: '/hero.png',
  gallery: {
    'goat-cuddles': '/goat-cuddles.jpg',
    'homepage-experiences': '/experiences.png',
    'goat-icon-1': '/goat-1.jpg',
    'goat-icon-3': '/goat-3.jpg',
  },
  awards: [{ year: '2026', src: '/award-2026.png' }],
} as const

describe('approved experiences listing', () => {
  it('renders the Lovable hero, experience names, and Feast On section', () => {
    const html = renderToStaticMarkup(
      <ExperiencesPresentation
        heroSrc="/hero.png"
        feastSrc="/feast.webp"
        cards={buildApprovedExperienceListing([])}
      />,
    )

    expect(html).toContain(EXPERIENCES_HERO.headingLead)
    expect(html).toContain(EXPERIENCES_HERO.headingAccent)
    expect(html).toContain(EXPERIENCES_HERO.supporting)
    expect(html).toContain('alt="A guest holding a fluffy Highland calf')
    expect(html).toContain(FEAST_ON.kicker)
    expect(html).toContain('https://feaston.com/')
    expect(html).not.toContain('Placeholder')
    expect(html).not.toContain('Farm Hopping')
    expect(html).not.toContain('#book')
    expect(html).not.toContain('#farm-experiences')
  })

  it('lists the approved names and leaves unpublished experiences without a booking action', () => {
    const cards = buildApprovedExperienceListing([])
    const html = renderToStaticMarkup(
      <ExperiencesPresentation heroSrc="/hero.png" feastSrc="/feast.webp" cards={cards} />,
    ).replaceAll('&amp;', '&')

    for (const entry of APPROVED_EXPERIENCES) {
      expect(html).toContain(entry.name)
    }
    expect(html).toContain(`href="${TOWER_OF_GOATS_PATH}"`)
    expect(html).not.toContain('href="/goat-cuddles"')
    expect(html).not.toContain('>Book<')
  })

  it('removes Farm Hopping from published records and keeps other Sanity cards', () => {
    expect(isFarmHoppingListing({ title: 'The Farm Hopping Experience', slug: 'farm-hopping' })).toBe(
      true,
    )

    const cards = buildApprovedExperienceListing([
      card({
        title: 'The Farm Hopping Experience',
        slug: 'farm-hopping',
        bookingUrl: FAREHARBOR,
      }),
      card({
        title: 'Goat Cuddles',
        slug: 'goat-cuddles',
        shortDescription: 'Snuggle with playful baby goats in a cozy barn.',
        priceDisplay: '$18 for ages 2-5. $29.50 for ages 6+',
        bookingUrl: FAREHARBOR,
      }),
      card({
        title: 'Honey Bee Experience',
        slug: 'honey-bee-experience',
        shortDescription: 'Meet the hives.',
      }),
    ])

    const html = renderToStaticMarkup(
      <ExperiencesPresentation heroSrc="/hero.png" feastSrc="/feast.webp" cards={cards} />,
    )

    expect(html).not.toContain('Farm Hopping')
    expect(html).toContain('Snuggle with playful baby goats in a cozy barn.')
    expect(html).toContain('href="/goat-cuddles"')
    expect(html).toContain(`href="${FAREHARBOR}"`)
    expect(html).toContain('Honey Bee Experience')
    expect(html).not.toContain('href="/experiences/goat-cuddles"')
  })

  it('rejects placeholder and hash booking destinations', () => {
    expect(publicBookingUrl(FAREHARBOR)).toBe(FAREHARBOR)
    expect(publicBookingUrl('#book')).toBeUndefined()
    expect(publicBookingUrl('#farm-experiences')).toBeUndefined()
    expect(publicBookingUrl('/experiences')).toBeUndefined()
    expect(publicBookingUrl('javascript:alert(1)')).toBeUndefined()

    const cards = buildApprovedExperienceListing([
      card({ title: 'Goat Yoga', slug: 'goat-yoga', bookingUrl: '#book' }),
    ])
    const yoga = cards.find((entry) => entry.name === 'Goat Yoga')

    expect(yoga?.href).toBe('/goat-yoga')
    expect(yoga?.bookingUrl).toBeUndefined()
    expect(documentPath('experience', 'goat-yoga')).toBe('/goat-yoga')
  })

  it('reserves the Tower of Goats path and does not activate the shorter redirect', () => {
    expect(documentPath('experience', 'tower-of-goats-discovery-trail')).toBeUndefined()
    expect(routableExperienceSlug('tower-of-goats-discovery-trail')).toBeUndefined()
    expect(redirects).toEqual([])
    expect(TOWER_OF_GOATS_FUTURE_REDIRECT).toEqual({
      from: '/tower-of-goats',
      to: '/tower-of-goats-discovery-trail',
    })
  })
})

describe('Tower of Goats page', () => {
  it('renders the approved sections and omits placeholder booking actions', () => {
    const html = renderToStaticMarkup(<TowerOfGoatsPage images={towerImages} />)

    expect(html).toContain('General')
    expect(html).toContain('Tower of Goats Discovery Trail')
    expect(html).toContain('The whole farm, at goat pace.')
    expect(html).toContain('One tower.')
    expect(html).toContain('Canada’s only Goat Tower')
    expect(html).toContain('Sacha Taylor')
    expect(html).toContain('Three Sisters Garden')
    expect(html).toContain('Alvin, Marg and their dog Peanut')
    expect(html).toContain('Hidden throughout the artwork are 20 bees')
    expect(html).toContain('906200 Township Rd 12')
    expect(html).not.toContain('Placeholder')
    expect(html).not.toContain('#book')
    expect(html).not.toContain('Farm Hopping')
    expect(html).not.toContain('Book General Admission')
    expect(towerOfGoatsStories).toHaveLength(5)
  })
})
