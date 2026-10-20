import { describe, expect, it } from 'vitest'

import { ADOPTION_ANIMALS } from '@/lib/adopt/content'
import { homepageHero, homepageSeo } from '@/content/homepage'
import { EXPERIENCES_HERO, FEAST_ON } from '@/lib/experiences/approved-listing'
import { resolveExperiencesHubPage } from '@/lib/experiences/hub-page'
import { buildRobotsTxt } from '@/lib/seo/robots'
import { experiencesHubContentQuery } from '@/lib/sanity/queries'
import { ALL_SALE_ANIMALS } from '@/lib/sale/content'
import type { ExperienceCardData } from '@/lib/sanity/types'

const publishedHub = {
  heading: 'Experiences',
  intro: 'Come do something udderly ridiculous.',
  emptyHeading: 'More ridiculousness is on its way.',
  emptyMessage: 'Check back soon.',
  seoTitle: 'Farm Experiences | Udderly Ridiculous Farm Life',
  seoDescription: 'x'.repeat(180),
}

function experience(overrides: Partial<ExperienceCardData> & Pick<ExperienceCardData, 'slug' | 'title'>): ExperienceCardData {
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

describe('experiences hub page resolution', () => {
  it('uses the approved Lovable page when optional Sanity fields are absent', () => {
    const page = resolveExperiencesHubPage(publishedHub)

    expect(page.hero.lead).toBe(EXPERIENCES_HERO.headingLead)
    expect(page.hero.accent).toBe(EXPERIENCES_HERO.headingAccent)
    expect(page.hero.supporting).toBe(EXPERIENCES_HERO.supporting)
    expect(page.hero.lead).not.toBe(publishedHub.heading)
    expect(page.cards.map((card) => card.title)).toContain('Goat Cuddles')
    expect(page.cards.map((card) => card.title)).toContain('Taste of Farm Life')
    expect(page.stays.map((stay) => stay.title)).toEqual(['Farm Glamping'])
    expect(page.feast.kicker).toBe(FEAST_ON.kicker)
    expect(page.feast.paragraphs.join(' ')).toContain('140')
    expect(page.rainbow.paragraphs.join(' ')).toContain('Rainbow Registered')
    expect(page.newsletter.unavailable).toBe('Newsletter signup is not available yet.')
    expect(JSON.stringify(page)).not.toContain('Farm Hopping')
    expect(JSON.stringify(page)).not.toContain('Placeholder')
  })

  it('lets a published value replace one section without dropping the others', () => {
    const page = resolveExperiencesHubPage({
      ...publishedHub,
      heroLead: 'Come visit',
      heroSupporting: 'x'.repeat(301),
      newsletterTitle: 'Farm notes',
      feastOn: { kicker: 'Still Feast On' },
    })

    expect(page.hero.lead).toBe('Come visit')
    expect(page.hero.accent).toBe(EXPERIENCES_HERO.headingAccent)
    expect(page.hero.supporting).toBe(EXPERIENCES_HERO.supporting)
    expect(page.newsletter.title).toBe('Farm notes')
    expect(page.newsletter.copy).toContain('monthly email')
    expect(page.feast.kicker).toBe('Still Feast On')
    expect(page.feast.paragraphs).toEqual([...FEAST_ON.paragraphs])
    expect(page.cards).toHaveLength(16)
    expect(page.categories).toHaveLength(4)
  })

  it('treats an explicit empty collection as intentional', () => {
    const page = resolveExperiencesHubPage({
      ...publishedHub,
      categories: [],
      experienceCards: [],
      stays: [],
      gifts: [],
      programs: [],
    }, [
      experience({ title: 'Honey Bee Experience', slug: 'honey-bee-experience' }),
    ])

    expect(page.categories).toEqual([])
    expect(page.cards).toEqual([])
    expect(page.stays).toEqual([])
    expect(page.gifts).toEqual([])
    expect(page.programs).toEqual([])
    expect(page.emptyHeading).toBe(publishedHub.emptyHeading)
  })

  it('adds, reorders, and filters experience cards from Sanity', () => {
    const page = resolveExperiencesHubPage({
      experienceCards: [
        { title: 'Second', slug: 'second', sortOrder: 2, description: 'Placeholder description. Do not show.' },
        { title: 'The Farm Hopping Experience', slug: 'farm-hopping', sortOrder: 0 },
        { title: 'First', slug: 'first', sortOrder: 1, learnMoreHref: '/gift-card', bookingUrl: '#book' },
        { title: 'First', slug: 'first', sortOrder: 3 },
        { title: 'Published visit', slug: 'goat-cuddles', sortOrder: 4, bookingUrl: 'javascript:alert(1)' },
      ],
    }, [
      experience({
        title: 'Goat Cuddles',
        slug: 'goat-cuddles',
        shortDescription: 'A published description.',
        bookingUrl: 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/',
      }),
    ])

    expect(page.cards.map((card) => card.title)).toEqual(['First', 'Second', 'Goat Cuddles'])
    expect(page.cards[1]?.description).toBeUndefined()
    expect(page.cards[0]?.href).toBeUndefined()
    expect(page.cards[0]?.bookingUrl).toBeUndefined()
    expect(page.cards[2]?.href).toBe('/goat-cuddles')
    expect(page.cards[2]?.description).toBe('A published description.')
    expect(page.cards[2]?.bookingUrl).toContain('https://fareharbor.com/')
  })

  it('keeps a card when its image or link is missing', () => {
    const page = resolveExperiencesHubPage({
      experienceCards: [
        {
          title: 'No picture',
          slug: 'no-picture',
          image: { alt: 'Missing file' },
          learnMoreHref: '/not-a-real-page',
        },
        {
          title: 'With picture',
          slug: 'with-picture',
          image: {
            alt: 'A published farm photo',
            asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' },
          },
        },
      ],
    })

    expect(page.cards[0]?.image).toBeUndefined()
    expect(page.cards[0]?.title).toBe('No picture')
    expect(page.cards[1]?.image?.alt).toBe('A published farm photo')
    expect(page.cards[1]?.image?.src).toContain('Tb9Ew8CXIwaY6R1kjMvI0uRR')
  })

  it('appends a published experience only while the card list is unmanaged', () => {
    const extra = experience({ title: 'Honey Bee Experience', slug: 'honey-bee-experience' })
    expect(resolveExperiencesHubPage(null, [extra]).cards.map((card) => card.title)).toContain('Honey Bee Experience')
    expect(
      resolveExperiencesHubPage({ experienceCards: [{ title: 'Goat Yoga', slug: 'goat-yoga' }] }, [extra]).cards,
    ).toEqual([expect.objectContaining({ title: 'Goat Yoga' })])
  })

  it('reads published content only and leaves the homepage and animal collections alone', () => {
    expect(experiencesHubContentQuery).toContain('*[_id == "experiencesHub"][0]')
    expect(experiencesHubContentQuery).not.toContain('drafts.')
    expect(homepageSeo.title).toBe('Farm Animal Experiences | Udderly Ridiculous')
    expect(homepageHero.headlineBefore).toBe('Come do something')
    expect(homepageHero.cta.href).toBe('/experiences')
    expect(ADOPTION_ANIMALS).toHaveLength(7)
    expect(ALL_SALE_ANIMALS).toHaveLength(17)
    expect(buildRobotsTxt()).toBe('User-agent: *\nDisallow: /\n')
  })
})
