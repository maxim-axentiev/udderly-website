import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CorporateLanding } from '@/components/corporate/landing-page'
import { PhotoCarousel } from '@/components/corporate/sections'
import { DiscProgram } from '@/components/corporate/disc-page'
import { SharedCorporateProgram } from '@/components/corporate/shared-program-page'
import { TeamBuildingProgram } from '@/components/corporate/team-building-page'
import { TourismProgram } from '@/components/corporate/tourism-page'
import { primaryNav } from '@/lib/navigation'
import { corporateProgramBySlugQuery, corporateProgramCardsQuery, corporateTrainingPageQuery } from '@/lib/sanity/queries'
import { createPageHead } from '@/lib/seo/page-head'

import type { CorporateImages } from './images'
import { CORPORATE_ENQUIRY_UNAVAILABLE } from './model'
import {
  resolveCorporateLanding,
  resolveDisc,
  resolveSharedProgram,
  resolveTeamBuilding,
  resolveTourism,
} from './resolve'
import { CORPORATE_PROGRAM_SLUGS } from './slugs'

const images: CorporateImages = {
  hero: '/hero.webp',
  training: '/training.webp',
  experiences: '/experiences.webp',
  goatCuddles: '/goats.jpg',
  alpacaWalk: '/alpaca.jpg',
  highlandHero: '/highland.jpg',
  highlandCta: '/sunset.jpg',
  donkeyPicnic: '/donkey.jpg',
  owners: '/owners.webp',
  farmStore: '/store.webp',
  iceCream: '/ice.webp',
  awards: [{ year: '2026', src: '/award.png' }],
}

const publishedImage = {
  alt: 'A published farm photo',
  asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' },
}

const routes = [
  '/corporate-training',
  ...CORPORATE_PROGRAM_SLUGS.map((slug) => `/corporate-training/${slug}`),
]

describe('corporate photo carousel', () => {
  const photos = [
    { src: '/goats.jpg', alt: 'Goats at the farm' },
    { src: '/alpaca.jpg', alt: 'Alpaca at the farm' },
  ]

  it('makes multi-photo galleries keyboard focusable with carousel controls', () => {
    const html = renderToStaticMarkup(<PhotoCarousel images={photos} label="Training photos" />)
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-label="Training photos"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('aria-label="Previous photo"')
    expect(html).toContain('aria-label="Next photo"')
  })

  it('does not add unnecessary keyboard stops to a single photo', () => {
    const html = renderToStaticMarkup(<PhotoCarousel images={photos.slice(0, 1)} label="Training photos" />)
    expect(html).not.toContain('tabindex="0"')
    expect(html).not.toContain('aria-label="Next photo"')
  })
})

describe('corporate training pages', () => {
  it('renders all eight approved routes from Lovable fallbacks', () => {
    const landing = resolveCorporateLanding(null, [], null, images)
    const team = resolveTeamBuilding(null, null, images)
    const tourism = resolveTourism(null, null, images)
    const disc = resolveDisc(null, null, images)
    const shared = CORPORATE_PROGRAM_SLUGS.filter(
      (slug) =>
        slug === 'the-power-of-conversation' ||
        slug === 'alpaca-emotional-intelligence' ||
        slug === 'beyond-engagement' ||
        slug === 'innovation-on-the-farm',
    ).map((slug) => resolveSharedProgram(slug, null, null, images))

    const html = [
      renderToStaticMarkup(<CorporateLanding page={landing} />),
      renderToStaticMarkup(<TeamBuildingProgram page={team} />),
      renderToStaticMarkup(<TourismProgram page={tourism} />),
      renderToStaticMarkup(<DiscProgram page={disc} />),
      ...shared.map((page) => renderToStaticMarkup(<SharedCorporateProgram page={page} />)),
    ].join('\n')

    expect(routes).toHaveLength(8)
    expect(html).toContain('Real Farm')
    expect(html).toContain('Team Building Experiences')
    expect(html).toContain('Experiential Tourism Development')
    expect(html).toContain('Everything DiSC Workplace')
    expect(html).toContain('Everything DiSC Work of Leaders')
    expect(html).toContain('The Power of')
    expect(html).toContain('Alpaca Emotional')
    expect(html).toContain('Beyond')
    expect(html).toContain('Innovation on')
    expect(html).toContain('Pick your')
    expect(html).toContain('Mix &amp; match')
    expect(html).toContain('Two ways to DiSC')
    expect(html).toContain('Everything DiSC Workplace')
    expect(html).toContain('906200 Township Rd 12')
    expect(html).not.toContain('Priya')
    expect(html).not.toContain('Placeholder review')
    expect(html).not.toContain('$125/hour')
    expect(html).not.toContain('Capacity &amp; Setup')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
    expect(html).toContain('href="/contact"')
    expect(html).not.toContain('name="email"')
    expect(html).not.toContain('nothing was sent')
    expect(html).toContain('Corporate team enjoying a farm lunch experience with alpacas')
    expect(html).not.toContain('farm classroom')
    expect(html).not.toContain('training session on the farm')
  })

  it('keeps the four shared programs on one design without placeholder copy', () => {
    const pages = [
      resolveSharedProgram('the-power-of-conversation', null, null, images),
      resolveSharedProgram('alpaca-emotional-intelligence', null, null, images),
      resolveSharedProgram('beyond-engagement', null, null, images),
      resolveSharedProgram('innovation-on-the-farm', null, null, images),
    ]
    for (const page of pages) {
      expect(page.outcomes.items).toEqual([])
      expect(page.introduction.paragraphs).toEqual([])
      expect(page.hero.intro).toBe('')
    }
    expect(pages.map((page) => page.seo.title)).toEqual([
      'The Power of Conversation | Corporate Training | Udderly Ridiculous',
      'Alpaca Emotional Intelligence | Corporate Training | Udderly Ridiculous',
      'Beyond Engagement | Corporate Training | Udderly Ridiculous',
      'Innovation on the Farm | Corporate Training | Udderly Ridiculous',
    ])
  })

  it('lets a published active program replace its own fallback and the landing card', () => {
    const program = {
      title: 'Conversation practice',
      heroLead: 'Conversation',
      titleAccent: 'Practice',
      slug: 'the-power-of-conversation',
      shortDescription: 'A published card description.',
      heroIntro: 'A published hero introduction.',
      learningOutcomes: ['One published outcome.'],
      active: true,
      seo: { title: 'Published conversation title', description: 'Published conversation description' },
    }
    const page = resolveSharedProgram('the-power-of-conversation', program, null, images)
    expect(page.hero.lead).toBe('Conversation')
    expect(page.hero.accent).toBe('Practice')
    expect(page.hero.intro).toBe('A published hero introduction.')
    expect(page.outcomes.items).toEqual(['One published outcome.'])
    expect(page.seo).toMatchObject({
      title: 'Published conversation title',
      description: 'Published conversation description',
      path: '/corporate-training/the-power-of-conversation',
    })

    const landing = resolveCorporateLanding(null, [program], null, images)
    expect(landing.cards.find((card) => card.href.endsWith('the-power-of-conversation'))).toMatchObject({
      title: 'Conversation practice',
      body: 'A published card description.',
    })
  })

  it('ignores inactive programs and keeps placeholder reviews hidden', () => {
    const hidden = resolveSharedProgram(
      'beyond-engagement',
      {
        title: 'Should not appear',
        slug: 'beyond-engagement',
        active: false,
        reviewsApproved: true,
        testimonials: [{ quote: 'A secret quote', guestName: 'Secret Guest' }],
      },
      null,
      images,
    )
    expect(hidden.hero.lead).toBe('Beyond')
    expect(hidden.close.reviews).toBeNull()

    const unapproved = resolveDisc(
      {
        title: 'DiSC',
        slug: 'disc-assessment',
        active: true,
        reviewsApproved: false,
        testimonials: [{ quote: 'Not approved yet', guestName: 'Guest' }],
      },
      null,
      images,
    )
    expect(unapproved.close.reviews).toBeNull()
    const html = renderToStaticMarkup(<DiscProgram page={unapproved} />)
    expect(html).not.toContain('Not approved yet')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
    expect(html).toContain('href="/contact"')
    expect(html).not.toContain('Program Selection')
    expect(html).not.toContain('Phone Number')
  })

  it('shows only approved testimonials and can hide the facilitator', () => {
    const page = resolveTeamBuilding(
      {
        title: 'Team Building',
        slug: 'team-building-experiences',
        active: true,
        reviewsApproved: true,
        reviewsHeading: 'Approved team notes',
        testimonials: [{ quote: 'The session was useful.', guestName: 'Jordan' }],
        facilitator: { enabled: false },
      },
      null,
      images,
    )
    expect(page.close.reviews?.items).toEqual([{ name: 'Jordan', quote: 'The session was useful.' }])
    expect(page.close.facilitator).toBeNull()
    const html = renderToStaticMarkup(<TeamBuildingProgram page={page} />)
    expect(html).toContain('Approved team notes')
    expect(html).toContain('The session was useful.')
    expect(html).not.toContain('Cheryl, in boots')
  })

  it('hides unverified tourism prices and credentials, and restores a published list without the design prices', () => {
    const page = resolveTourism(null, null, images)
    expect(page.enquiry.showPhone).toBe(false)
    expect(page.services).toEqual([])
    expect(page.credentials).toEqual([])
    const html = renderToStaticMarkup(<TourismProgram page={page} />)
    expect(html).toContain('Your business,')
    expect(html).toContain('Who I help')
    expect(html).toContain('Farms')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
    expect(html).toContain('href="/contact"')
    expect(html).not.toContain('Phone Number')
    expect(html).not.toContain('14-time award winning')
    expect(html).not.toContain('$125/hour')
    expect(html).not.toContain('$2500')
    expect(html).not.toContain('$3000')
    expect(html).not.toContain('Placeholder')
    expect(html).not.toContain('Cheryl, experiential tourism coach')
    expect(html).not.toContain('name="email"')

    const replaced = resolveTourism(
      {
        title: 'Experiential Tourism',
        slug: 'experiential-tourism-development',
        active: true,
        introParagraphs: ['Placeholder description. Hidden.', 'A published tourism introduction.'],
        services: [
          {
            name: 'Placeholder package',
            price: '$125/hour',
            items: [{ title: 'Hidden', body: 'Placeholder promise.' }],
          },
          {
            name: 'Coaching',
            price: 'Ask for the current fee',
            featured: true,
            items: [{ title: 'Session', body: 'One working session.' }, { title: 'Placeholder item', body: 'Placeholder detail.' }],
          },
        ],
        credentials: [
          { icon: 'award', label: 'Placeholder recognition' },
          { icon: 'star', label: 'Confirmed recognition' },
        ],
        pathSteps: [{ title: 'From boardroom', body: 'Placeholder copy. Hidden years.' }, { title: 'Now', body: 'A published step.' }],
      },
      null,
      images,
    )
    expect(replaced.introduction.paragraphs).toEqual(['A published tourism introduction.'])
    expect(replaced.services).toEqual([
      {
        name: 'Coaching',
        price: 'Ask for the current fee',
        featured: true,
        items: [{ title: 'Session', body: 'One working session.' }],
      },
    ])
    expect(replaced.credentials.map((item) => item.label)).toEqual(['Confirmed recognition'])
    expect(replaced.path).toEqual([{ title: 'Now', body: 'A published step.' }])
    const publishedHtml = renderToStaticMarkup(<TourismProgram page={replaced} />)
    expect(publishedHtml).toContain('Ask for the current fee')
    expect(publishedHtml).toContain('One working session.')
    expect(publishedHtml).toContain('Confirmed recognition')
    expect(publishedHtml).not.toContain('$125/hour')
    expect(publishedHtml).not.toContain('14-time')
    expect(publishedHtml).not.toContain('Placeholder')
  })

  it('rejects credentialed corporate card links while preserving approved destinations', () => {
    const fallback = resolveCorporateLanding(null, [], null, images).featured?.href
    expect(resolveCorporateLanding({ featuredProgram: { href: 'https://user:secret@example.com/visit' } }, [], null, images).featured?.href).toBe(fallback)
    expect(resolveCorporateLanding({ featuredProgram: { href: 'https://example.com/visit' } }, [], null, images).featured?.href).toBe('https://example.com/visit')
  })

  it('keeps approved sections when a published corporate document is only partial', () => {
    const landing = resolveCorporateLanding(
      {
        heroLead: 'Hello from the farm',
        programCards: [
          {
            title: 'DiSC Assessment',
            body: 'A real card description.',
            href: '/corporate-training/disc-assessment',
            ctaLabel: 'Learn More',
          },
        ],
        reviewsApproved: true,
        testimonials: [{ quote: '', guestName: '' }],
      },
      [],
      null,
      images,
    )
    expect(landing.hero.lead).toBe('Hello from the farm')
    expect(landing.cards.map((card) => card.title)).toEqual(
      expect.arrayContaining(['DiSC Assessment', 'The Power of Conversation', 'Innovation on the Farm']),
    )
    expect(landing.cards.find((card) => card.title === 'DiSC Assessment')?.body).toBe('A real card description.')
    expect(landing.close.reviews).toBeNull()

    const replacedIntro = resolveSharedProgram(
      'the-power-of-conversation',
      {
        title: 'The Power of Conversation',
        slug: 'the-power-of-conversation',
        active: true,
        introParagraphs: ['A real introduction for this program.'],
      },
      null,
      images,
    )
    expect(replacedIntro.introduction.paragraphs).toEqual(['A real introduction for this program.'])

    const shared = resolveSharedProgram(
      'beyond-engagement',
      { title: 'Beyond Engagement', slug: 'beyond-engagement', active: true },
      null,
      images,
    )
    expect(shared.introduction.paragraphs).toEqual([])
    expect(shared.close.reviews).toBeNull()
  })

  it('removes unverified landing and team claims, then restores published content', () => {
    const landing = resolveCorporateLanding(null, [], null, images)
    const team = resolveTeamBuilding(null, null, images)
    expect(landing.awards.show).toBe(false)
    expect(landing.seo.description).not.toMatch(/20\+/)
    const landingHtml = renderToStaticMarkup(<CorporateLanding page={landing} />)
    const teamHtml = renderToStaticMarkup(<TeamBuildingProgram page={team} />)
    for (const html of [landingHtml, teamHtml]) {
      expect(html).not.toContain('Placeholder')
      expect(html).not.toContain('20+ years')
      expect(html).not.toContain('14-time')
      expect(html).not.toContain('Top 10%')
      expect(html).not.toContain('Cheryl, the farm')
      expect(html).not.toContain('Capacity')
      expect(html).not.toContain('name="email"')
      expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
      expect(html).toContain('href="/contact"')
    }
    expect(landingHtml).toContain('Team Building Experiences')
    expect(landingHtml).toContain('href="/corporate-training/team-building-experiences"')
    expect(teamHtml).toContain('Goat Yoga')
    expect(teamHtml).not.toContain('/goats.jpg')
    expect(team.activities.find((activity) => activity.title === 'Goat Yoga')?.image.src).toBe('')

    const published = resolveTeamBuilding(
      {
        title: 'Team Building Experiences',
        slug: 'team-building-experiences',
        active: true,
        activities: [
          { title: 'Goat Yoga', body: 'A published activity description.', image: publishedImage },
          { title: 'Placeholder activity', body: 'Placeholder description. Hidden.' },
        ],
        facility: {
          enabled: true,
          items: [
            { icon: 'capacity', title: 'Capacity & Setup', body: 'Placeholder room for 30.' },
            { icon: 'av', title: 'Meeting room', body: 'A published room description.' },
          ],
        },
        facilitator: {
          enabled: true,
          title: 'Placeholder portrait title',
          body: 'A published facilitator biography.',
          image: publishedImage,
        },
      },
      {
        experienceAwardsEnabled: true,
        experienceAwardsTitle: 'Published recognition',
        experienceAwardsTagline: 'Placeholder claim',
        experienceAwardImages: [publishedImage],
      },
      images,
    )
    expect(published.activities.find((activity) => activity.title === 'Goat Yoga')).toMatchObject({
      body: 'A published activity description.',
      href: '/contact',
    })
    expect(published.activities.find((activity) => activity.title === 'Goat Yoga')?.image.src).not.toBe('')
    expect(published.activities.some((activity) => activity.title === 'Alpaca Walks')).toBe(true)
    expect(published.activities.some((activity) => activity.title === 'Placeholder activity')).toBe(false)
    expect(published.close.facility?.items).toEqual([
      { icon: 'av', title: 'Meeting room', body: 'A published room description.' },
    ])
    expect(published.close.facilitator).toMatchObject({
      body: 'A published facilitator biography.',
      title: '',
    })
    expect(published.close.facilitator?.image.alt).toBe('A published farm photo')
    expect(published.awards.show).toBe(true)
    expect(published.awards.title).toBe('Published recognition')
    expect(published.awards.tagline).toBe('')
    const publishedHtml = renderToStaticMarkup(<TeamBuildingProgram page={published} />)
    expect(publishedHtml).toContain('A published activity description.')
    expect(publishedHtml).toContain('A published room description.')
    expect(publishedHtml).toContain('A published facilitator biography.')
    expect(publishedHtml).toContain('Published recognition')
    expect(publishedHtml).not.toContain('Capacity')
    expect(publishedHtml).not.toContain('Placeholder')
    expect(publishedHtml).not.toContain('TripAdvisor')
  })

  it('removes placeholder copy from the five program pages and restores published content', () => {
    const disc = resolveDisc(null, null, images)
    const sharedSlugs = [
      'the-power-of-conversation',
      'alpaca-emotional-intelligence',
      'beyond-engagement',
      'innovation-on-the-farm',
    ] as const
    const sharedPages = sharedSlugs.map((slug) => resolveSharedProgram(slug, null, null, images))
    const html = [
      renderToStaticMarkup(<DiscProgram page={disc} />),
      ...sharedPages.map((page) => renderToStaticMarkup(<SharedCorporateProgram page={page} />)),
    ].join('\n')

    expect(disc.seo).toMatchObject({
      title: 'DiSC Assessment Training on a Farm | Udderly Ridiculous',
      description: 'Everything DiSC assessments on a working Ontario farm — Workplace and Work of Leaders programs.',
      path: '/corporate-training/disc-assessment',
    })
    expect(disc.seo.description).not.toMatch(/20\+/)
    expect(sharedPages.map((page) => page.seo.path)).toEqual([
      '/corporate-training/the-power-of-conversation',
      '/corporate-training/alpaca-emotional-intelligence',
      '/corporate-training/beyond-engagement',
      '/corporate-training/innovation-on-the-farm',
    ])
    expect(html).toContain('Everything DiSC Workplace')
    expect(html).toContain('Everything DiSC Work of Leaders')
    expect(html).toContain('The Power of')
    expect(html).toContain('Alpaca Emotional')
    expect(html).toContain('Beyond')
    expect(html).toContain('Innovation on')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
    expect(html).toContain('href="/contact"')
    expect(html).not.toContain('Placeholder')
    expect(html).not.toContain('20+ years')
    expect(html).not.toContain('farm classroom')
    expect(html).not.toContain('Myers-Briggs')
    expect(html).not.toContain('Innovation in a Box')
    expect(html).not.toContain('name="email"')
    expect(html).not.toContain('We will get back to you')

    const publishedDisc = resolveDisc(
      {
        title: 'DiSC Assessment',
        slug: 'disc-assessment',
        active: true,
        introParagraphs: ['Placeholder description. Hidden DiSC intro.', 'A published DiSC introduction.'],
        offerings: [
          {
            title: 'Everything DiSC Workplace',
            body: 'A published Workplace description.',
            outcomes: ['Placeholder outcome.', 'One published Workplace outcome.'],
          },
          { title: 'Placeholder offering', body: 'Placeholder description. Hidden offering.' },
        ],
        practicalItems: [
          { icon: 'duration', label: 'Duration', lines: ['Placeholder schedule.', 'A published half day.'] },
          { icon: 'custom', label: 'Placeholder extra', lines: ['Placeholder promise.'] },
        ],
        seo: { description: 'Placeholder description. Hidden SEO.' },
      },
      null,
      images,
    )
    expect(publishedDisc.introduction.paragraphs).toEqual(['A published DiSC introduction.'])
    expect(publishedDisc.offerings.map((offering) => offering.title)).toEqual([
      'Everything DiSC Workplace',
      'Everything DiSC Work of Leaders',
    ])
    expect(publishedDisc.offerings[0]?.body).toBe('A published Workplace description.')
    expect(publishedDisc.offerings[0]?.outcomes).toEqual(['One published Workplace outcome.'])
    expect(publishedDisc.offerings[1]?.body).toContain('Work of Leaders')
    expect(publishedDisc.practical).toEqual([{ icon: 'duration', label: 'Duration', lines: ['A published half day.'] }])
    expect(publishedDisc.seo.description).toBe(disc.seo.description)
    const publishedDiscHtml = renderToStaticMarkup(<DiscProgram page={publishedDisc} />)
    expect(publishedDiscHtml).toContain('A published DiSC introduction.')
    expect(publishedDiscHtml).toContain('A published half day.')
    expect(publishedDiscHtml).not.toContain('Placeholder')
    expect(publishedDiscHtml).not.toContain('20+ years')

    const publishedShared = resolveSharedProgram(
      'innovation-on-the-farm',
      {
        title: 'Innovation on the Farm',
        slug: 'innovation-on-the-farm',
        active: true,
        heroIntro: 'A published innovation introduction.',
        introParagraphs: ['Placeholder description. Hidden.', 'A published program description.'],
        learningOutcomes: ['Placeholder outcome.', 'One published innovation outcome.'],
        durationDetail: 'A published full day.',
        enhancementsNote: 'Placeholder enhancement.',
      },
      null,
      images,
    )
    expect(publishedShared.hero.intro).toBe('A published innovation introduction.')
    expect(publishedShared.introduction.paragraphs).toEqual(['A published program description.'])
    expect(publishedShared.outcomes.items).toEqual(['One published innovation outcome.'])
    expect(publishedShared.outcomes.durationBody).toBe('A published full day.')
    expect(publishedShared.outcomes.enhancementsBody).toBe('')
    const publishedSharedHtml = renderToStaticMarkup(<SharedCorporateProgram page={publishedShared} />)
    expect(publishedSharedHtml).toContain('One published innovation outcome.')
    expect(publishedSharedHtml).toContain('A published full day.')
    expect(publishedSharedHtml).not.toContain('Placeholder')
    expect(publishedSharedHtml).not.toContain('Manage emotions')
  })

  it('builds metadata for every corporate path', () => {
    const landing = createPageHead(resolveCorporateLanding(null, [], null, images).seo, {
      PUBLIC_CANONICAL_ORIGIN: 'https://staging.udderlyridiculousfarmlife.com',
    })
    expect(landing.meta).toContainEqual({
      title: 'Corporate Training & Team Building on a Farm | Udderly Ridiculous',
    })
    expect(landing.links).toContainEqual({
      rel: 'canonical',
      href: 'https://staging.udderlyridiculousfarmlife.com/corporate-training',
    })
    const hidden = createPageHead(resolveCorporateLanding(null, [], null, images).seo, {})
    expect(hidden.meta).toContainEqual({ name: 'robots', content: 'noindex, nofollow, noarchive' })
    expect(resolveDisc(null, null, images).seo.path).toBe('/corporate-training/disc-assessment')
    expect(resolveTeamBuilding(null, null, images).seo.path).toBe('/corporate-training/team-building-experiences')
    expect(resolveTourism(null, null, images).seo.path).toBe(
      '/corporate-training/experiential-tourism-development',
    )
  })

  it('reads published documents only', () => {
    expect(corporateTrainingPageQuery).toContain('_id == "corporateTrainingPage"')
    expect(corporateProgramBySlugQuery).toContain('active != false')
    expect(corporateProgramBySlugQuery).not.toContain('drafts.')
    expect(corporateProgramCardsQuery).toContain('active != false')
    expect(corporateProgramCardsQuery).not.toContain('drafts.')
  })

  it('does not add corporate training to the current header', () => {
    expect(primaryNav.map((item) => item.label)).toEqual([
      'Experiences',
      'Gift Cards',
      'Animals for Sale',
      'Adopt an Animal',
      'Corporate Training',
      'Explore',
      'About',
      'Contact',
    ])
  })
})
