import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CorporateLanding } from '@/components/corporate/landing-page'
import { DiscProgram } from '@/components/corporate/disc-page'
import { SharedCorporateProgram } from '@/components/corporate/shared-program-page'
import { TeamBuildingProgram } from '@/components/corporate/team-building-page'
import { TourismProgram } from '@/components/corporate/tourism-page'
import { primaryNav } from '@/lib/navigation'
import { corporateProgramBySlugQuery, corporateProgramCardsQuery, corporateTrainingPageQuery } from '@/lib/sanity/queries'
import { createPageHead } from '@/lib/seo/page-head'

import type { CorporateImages } from './images'
import { CORPORATE_ENQUIRY_UNAVAILABLE, SHARED_PROGRAM_OUTCOMES } from './model'
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

const routes = [
  '/corporate-training',
  ...CORPORATE_PROGRAM_SLUGS.map((slug) => `/corporate-training/${slug}`),
]

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
    expect(html).toContain('$125/hour')
    expect(html).toContain('$2500 + HST &amp; travel costs')
    expect(html).toContain('Two ways to DiSC')
    expect(html).toContain('The practical bits')
    expect(html).toContain('Capacity &amp; Setup')
    expect(html).toContain('906200 Township Rd 12')
    expect(html).not.toContain('Priya')
    expect(html).not.toContain('Placeholder review')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)
    expect(html).toContain('disabled=""')
    expect(html).not.toContain('nothing was sent')
  })

  it('keeps the four shared programs on one design without treating the outcomes as unique facts', () => {
    const pages = [
      resolveSharedProgram('the-power-of-conversation', null, null, images),
      resolveSharedProgram('alpaca-emotional-intelligence', null, null, images),
      resolveSharedProgram('beyond-engagement', null, null, images),
      resolveSharedProgram('innovation-on-the-farm', null, null, images),
    ]
    for (const page of pages) {
      expect(page.outcomes.items).toEqual(SHARED_PROGRAM_OUTCOMES)
      expect(page.introduction.paragraphs[0]).toMatch(/^Placeholder description/)
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
    expect(page.outcomes.items).toEqual([...SHARED_PROGRAM_OUTCOMES, 'One published outcome.'])
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
    expect(html).toContain('Program Selection')
    expect(html).toContain('Phone Number')
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

  it('keeps the tourism enquiry free of a phone field and uses design prices until replaced', () => {
    const page = resolveTourism(null, null, images)
    expect(page.enquiry.showPhone).toBe(false)
    const html = renderToStaticMarkup(<TourismProgram page={page} />)
    expect(html).not.toContain('Phone Number')
    expect(html).toContain('14-time award winning')
    expect(html).toContain(CORPORATE_ENQUIRY_UNAVAILABLE)

    const replaced = resolveTourism(
      {
        title: 'Experiential Tourism',
        slug: 'experiential-tourism-development',
        active: true,
        services: [
          {
            name: 'Coaching',
            price: 'Ask for the current fee',
            featured: true,
            items: [{ title: 'Session', body: 'One working session.' }],
          },
        ],
        credentials: [{ icon: 'award', label: 'Confirmed recognition' }],
      },
      null,
      images,
    )
    expect(replaced.services.map((service) => service.price)).toEqual(
      expect.arrayContaining(['$125/hour', '$2500 + HST & travel costs', 'Ask for the current fee']),
    )
    expect(replaced.credentials.map((item) => item.label)).toEqual(
      expect.arrayContaining(['14-time award winning', 'Confirmed recognition']),
    )
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
    expect(shared.introduction.paragraphs[0]).toContain('Placeholder description')
    expect(shared.close.reviews).toBeNull()
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
