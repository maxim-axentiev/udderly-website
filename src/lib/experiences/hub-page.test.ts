import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ExperiencesPresentation } from '@/components/experience/experiences-presentation'
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
        bookingVerified: true,
        bookingUrl: 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/',
      }),
    ])

    expect(page.cards.map((card) => card.title)).toEqual(['First', 'Second', 'Goat Cuddles'])
    expect(page.cards[1]?.description).toBeUndefined()
    expect(page.cards[0]?.href).toBe('/gift-card')
    expect(page.cards[0]?.bookingUrl).toBeUndefined()
    expect(page.cards[2]?.href).toBe('/goat-cuddles')
    expect(page.cards[2]?.description).toBe('A published description.')
    expect(page.cards[2]?.bookingUrl).toContain('https://fareharbor.com/')
    expect(page.cards[2]?.bookingOverlay).toBe(true)
  })

  it('keeps an unverified experience booking link off the hub card', () => {
    const page = resolveExperiencesHubPage({
      experienceCards: [{ title: 'Goat Cuddles', slug: 'goat-cuddles', sortOrder: 1 }],
    }, [
      experience({
        title: 'Goat Cuddles',
        slug: 'goat-cuddles',
        bookingUrl: 'https://fareharbor.com/embeds/book/udderlyridiculousfarmlife/items/336824/',
      }),
    ])

    expect(page.cards[0]?.href).toBe('/goat-cuddles')
    expect(page.cards[0]?.bookingUrl).toBeUndefined()
  })

  it('links a stored private donkey slug to the approved public path', () => {
    const page = resolveExperiencesHubPage({
      experienceCards: [{ title: 'Private Miniature Donkey Lunch Picnic', slug: 'private-miniature-donkey-lunch-picnic', sortOrder: 1 }],
    }, [
      experience({
        title: 'Private Miniature Donkey Lunch Picnic',
        slug: 'private-miniature-donkey-lunch-picnic',
      }),
    ])

    expect(page.cards[0]?.href).toBe('/miniature-donkey-lunch-picnic')
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

  it('renders the existing unpublished draft with Lovable lines, paragraphs, and local images', () => {
    const cards = [
      ['Goat Yoga', 'goat-yoga', 'May to October', '16+'],
      ['Goat Recess', 'goat-recess', 'May to October', 'All ages'],
      ['Goat Cuddles', 'goat-cuddles', 'November to April', 'All ages'],
      ['Baby Goat Playtime & Snuggles', 'baby-goat-playtime-and-snuggles', 'Select dates', 'All ages', 'limited'],
      ['Mini Highland Cow Experience', 'mini-highland-cow-experience', 'Year-round', '12+'],
      ['Mini Highland Calf Meet & Greet', 'mini-highland-calf-meet-and-greet', 'Select dates', 'All ages', 'limited'],
      ['Alpaca Lunch Picnic', 'alpaca-lunch-picnic', 'May to October', '16+'],
      ['Alpaca Sunset Picnic', 'alpaca-sunset-picnic', 'May to October', '16+'],
      ['Alpaca Walks', 'alpaca-walks', 'May to October · November to April by request', '14+'],
      ['Alpaca Experience & Fibre Nesting Ball Workshop', 'alpaca-experience-and-fibre-nesting-ball-workshop', 'Year-round', '10+'],
      ['Miniature Donkey Visits', 'miniature-donkey-visits', 'Year-round', '10+'],
      ['Private Miniature Donkey Lunch Picnic', 'private-miniature-donkey-lunch-picnic', 'May to October', '16+'],
      ['Private Miniature Donkey Sunset Picnic', 'private-miniature-donkey-sunset-picnic', 'May to October', '16+'],
      ['General Admission – Tower of Goats Discovery Trail', '', 'May to October', 'All ages', '', '/tower-of-goats-discovery-trail'],
      ['Taste of Farm Life', 'taste-of-farm-life', 'May to October', '16+', 'signature'],
      ['Taste of Farm Life Family Friendly', 'taste-of-farm-life-family-friendly', 'May to October', 'All ages', 'signature'],
    ].map(([title, slug, season, age, badge, learnMoreHref], index) => ({
      _key: slug || 'tower',
      title,
      slug: slug || undefined,
      season,
      age,
      badge: badge || undefined,
      learnMoreHref,
      sortOrder: index + 1,
    }))
    const draft = {
      ...publishedHub,
      heroLead: 'Udderly Ridiculous',
      heroAccent: 'Farm Experiences',
      heroSupporting: EXPERIENCES_HERO.supporting,
      categories: [
        { _key: 'cat-farm-experiences', title: 'Farm Experiences', note: '16 ways to get licked', href: '#farm-experiences', sortOrder: 1 },
        { _key: 'cat-farm-stays', title: 'Farm Stays & Packages', note: 'Sleep here, obviously', href: '#farm-stays', sortOrder: 2 },
        { _key: 'cat-gifts', title: 'Gifts', note: 'Better than socks', href: '#gifts', sortOrder: 3 },
        { _key: 'cat-businesses', title: 'For Businesses', note: 'Grown-up ridiculous', href: '#for-businesses', sortOrder: 4 },
      ],
      experienceCards: cards,
      stays: [{ _key: 'stay-farm-glamping', title: 'Farm Glamping', season: 'May to October', age: 'All ages', sortOrder: 1 }],
      gifts: [
        { _key: 'gift-card', kicker: 'Gift Card', title: 'A ridiculous day, wrapped', sortOrder: 1 },
        { _key: 'gift-adopt', kicker: 'Adopt an Animal', title: 'Symbolically theirs. Actually ours.', ctaLabel: 'Meet the Adoptable Animals', ctaHref: '/adopt-an-animal', sortOrder: 2 },
      ],
      programs: [
        { _key: 'program-corporate', title: 'Corporate Training & Team-Building', ctaLabel: 'Explore Corporate Programs', sortOrder: 1 },
        { _key: 'program-tourism', title: 'Experiential Tourism Development', ctaLabel: 'Explore Tourism Development', sortOrder: 2 },
      ],
      rainbow: { kicker: 'Proudly Rainbow Registered', heading: 'Everyone is welcome here.', body: 'Udderly Ridiculous Farm Life is a Rainbow Registered business.' },
      feastOn: { kicker: FEAST_ON.kicker, heading: 'We eat and serve local.', body: `${FEAST_ON.paragraphs[0]}\n\n${FEAST_ON.paragraphs[1]}`, href: FEAST_ON.href },
      newsletterTitle: 'The Udderly Update',
      locationHeading: 'Come find us. We\u2019re out here somewhere.',
      locationNote: 'Roughly 30 minutes from Kitchener-Waterloo, past the part where your GPS gets confident.',
    }
    const page = resolveExperiencesHubPage(draft)

    expect(page.cards.map((card) => card.title)).toEqual(cards.map((card) => card.title))
    expect(page.categories).toHaveLength(4)
    expect(page.stays).toHaveLength(1)
    expect(page.gifts).toHaveLength(2)
    expect(page.programs).toHaveLength(2)
    expect(page.rainbow).toMatchObject({ heading: 'Everyone is', headingAccent: 'welcome here.' })
    expect(page.feast).toMatchObject({ heading: 'We eat', headingAccent: 'and serve local.' })
    expect(page.feast.paragraphs).toEqual([...FEAST_ON.paragraphs])
    expect(page.location).toMatchObject({ headingLead: 'Come find us.', headingAccent: 'We\u2019re out here somewhere.' })
    expect(page.cards.find((card) => card.slug === 'goat-yoga')?.imageKey).toBe('goat-cuddles')
    expect(page.cards.find((card) => card.title.startsWith('General Admission'))?.imageKey).toBe('goats')
    expect(page.cards.every((card) => !card.bookingUrl)).toBe(true)
    expect(JSON.stringify(page)).not.toContain('Farm Hopping')
    expect(page.hero.image).toBeUndefined()
    expect(page.rainbow.image).toBeUndefined()
    expect(page.categories[0]?.imageKey).toBe('goats')
    expect(page.stays[0]?.imageKey).toBe('glamping')
    expect(page.feast.imageKey).toBe('feast')

    const html = renderToStaticMarkup(
      createElement(ExperiencesPresentation, {
        page,
        reviewsFeed: { available: false },
        images: {
          hero: '/hero.png',
          feast: '/feast.webp',
          goats: '/goats.webp',
          'goat-cuddles': '/goat-cuddles.jpg',
          glamping: '/glamping.webp',
          'ice-cream': '/ice-cream.webp',
          training: '/training.webp',
          'highland-hero': '/highland.jpg',
        },
      }),
    )
    expect(html).toContain('Everyone is<br/>welcome here.')
    expect(html).toContain('We eat<br/>and serve local.')
    expect(html).toContain(`Come find us.<br/><span class="text-stroke">${page.location.headingAccent}</span>`)
    expect(html).toContain('src="/hero.png"')
    expect(html).toContain('src="/goat-cuddles.jpg"')
    expect(html).toContain('src="/feast.webp"')
    expect(html).toContain('src="/glamping.webp"')
    expect(html).toContain('src="/ice-cream.webp"')
    expect(html).toContain('src="/training.webp"')
    expect(html).toContain('id="rainbow-registered"')
    expect(html).not.toContain('<img src="/rainbow')
    expect(html).toContain('disabled=""')
    expect(html).toContain('Newsletter signup is not available yet.')
    expect(html).not.toContain('fareharbor')
    expect(html).not.toContain('Farm Hopping')
  })

  it('lets an editor replace a designed line break without losing the other sections', () => {
    const page = resolveExperiencesHubPage({
      feastOn: { heading: 'One custom line', body: 'First paragraph.\n\nSecond paragraph.' },
      locationHeading: 'Find the lane\nPast the cedar',
      experienceCards: [{ title: 'Honey Bee Experience', slug: 'honey-bee-experience', image: { alt: 'Missing file' } }],
    })

    expect(page.feast.heading).toBe('One custom line')
    expect(page.feast.headingAccent).toBeUndefined()
    expect(page.feast.paragraphs).toEqual(['First paragraph.', 'Second paragraph.'])
    expect(page.location).toMatchObject({ headingLead: 'Find the lane', headingAccent: 'Past the cedar' })
    expect(page.cards[0]?.image).toBeUndefined()
    expect(page.cards[0]?.imageKey).toBeUndefined()
    expect(page.rainbow.headingAccent).toBe('welcome here.')
  })
})
