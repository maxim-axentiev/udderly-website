import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AdoptPage } from '@/components/adopt/adopt-page'
import { AnimalAdoptionPage } from '@/components/adopt/animal-adoption-page'
import { AnimalsForSalePage } from '@/components/sale/animals-for-sale-page'
import { ADOPTION_ANIMALS, ADOPT_PAGE } from '@/lib/adopt/content'
import { buildAdoptionCards, checkoutHref, findAdoptionAnimal, resolveAdoptionDetail, resolveAdoptionPageCopy } from '@/lib/adopt/resolve'
import { primaryNav } from '@/lib/navigation'
import { RESERVED_SLUGS, routableExperienceSlug } from '@/lib/routes/paths'
import { redirects } from '@/lib/seo/redirects'
import { FUTURE_INTERNAL_REDIRECTS } from '@/lib/seo/future-redirects'
import { buildSaleLists, findSaleAnimal, resolveSalePageCopy, safeSalePageHref } from '@/lib/sale/resolve'
import { sanityClient } from '@/lib/sanity/client'
import { adoptionOfferingsQuery, animalListingsQuery } from '@/lib/sanity/queries'
import { buildRobotsTxt } from '@/lib/seo/robots'
import { SaleAnimalPage } from '@/components/sale/sale-animal-page'

const images = {
  hero: '/hero.webp',
  sponsor: '/sponsor.jpg',
  support: '/support.jpg',
  awards: [{ year: '2026', src: '/award.png' }],
  cards: {
    'goat-icon-1': '/1.jpg',
    'goat-icon-2': '/2.jpg',
    'goat-icon-3': '/3.jpg',
    'highland-hero': '/cow.jpg',
    'alpaca-walk': '/alpaca.jpg',
    'donkey-picnic': '/donkey.jpg',
    'goat-cuddles': '/chicken.jpg',
  },
} as const

describe('adopt an animal', () => {
  it('renders the hero and an empty list when nothing is published', () => {
    expect(buildAdoptionCards()).toEqual([])
    const html = renderToStaticMarkup(
      <AdoptPage copy={resolveAdoptionPageCopy(null)} cards={buildAdoptionCards()} images={images} />,
    )

    expect(html).toContain('Adopt')
    expect(html).toContain('Meet the adoptables.')
    expect(html).toContain('There are no animals in this list right now.')
    expect(html).not.toContain('sm:grid-cols-2')
    expect(html).not.toContain('Clara')
    expect(html).not.toContain('$35')
    expect(html).not.toContain('$75')
    expect(html).not.toContain('Placeholder description.')
    expect(html).not.toContain('Biscuit')
    expect(html).not.toContain('fareharbor')
  })

  it('uses a published introduction and lists only the published offering', () => {
    const cards = buildAdoptionCards([
      { slug: 'stanley', title: 'Stanley', introduction: 'Stanley prefers the fancy hay.', speciesTitle: 'Goat' },
    ])
    expect(cards).toHaveLength(1)
    expect(cards[0]?.blurb).toBe('Stanley prefers the fancy hay.')
    expect(cards[0]?.source).toBe('sanity')
    expect(cards[0]?.name).toBe('Stanley')
    expect(cards.map((card) => card.slug)).not.toContain('clara')
  })

  it('does not invent a species label for a published offering', () => {
    const clara = buildAdoptionCards([{ slug: 'clara', title: 'Clara', speciesTitle: 'Goat', introduction: 'Hello' }]).find(
      (card) => card.slug === 'clara',
    )
    expect(clara?.alt).toBe('Clara')
    expect(clara?.speciesNote).toBeUndefined()
    expect(clara?.blurb).toBe('Hello')
  })

  it('does not show fallback adoption prices without a checkout URL', () => {
    const chicken = ADOPTION_ANIMALS.find((animal) => animal.slug === 'chicken')!
    const html = renderToStaticMarkup(
      <AnimalAdoptionPage
        animal={chicken}
        copy={resolveAdoptionPageCopy(null)}
        detail={resolveAdoptionDetail(chicken)}
        images={{ hero: '/hero.webp', gallery: ['/a.jpg'], support: '/b.jpg' }}
      />,
    )
    expect(html).toContain('Chicken')
    expect(html).not.toContain('$35')
    expect(html).not.toContain('$75')
    expect(html).not.toContain('Placeholder description.')
    expect(html).not.toContain('href="#')
  })
})

describe('animals for sale', () => {
  it('renders the hero and an empty list when nothing is published', () => {
    const lists = buildSaleLists()
    expect(lists.available).toEqual([])
    expect(lists.sold).toEqual([])

    const html = renderToStaticMarkup(
      <AnimalsForSalePage
        copy={resolveSalePageCopy(null)}
        available={lists.available}
        sold={lists.sold}
        images={{
          hero: '/hero.webp',
          sale: '/sale.webp',
          'highland-hero': '/cow.jpg',
          'highland-cta': '/cow-2.jpg',
          'goat-icon-1': '/1.jpg',
          'goat-icon-2': '/2.jpg',
          'goat-icon-3': '/3.jpg',
          'alpaca-walk': '/alpaca.jpg',
        }}
      />,
    )
    expect(html).toContain('Animals')
    expect(html).toContain('for Sale')
    expect(html).toContain('Available now.')
    expect(html).toContain('There are no animals in this list right now.')
    expect(html).toContain('Happy homes,')
    expect(html).toContain('href="/contact"')
    expect(html).toContain('name="interests"')
    expect(html).toContain('name="consent"')
    expect(html).not.toContain('href="/animals-for-sale/macintosh"')
    expect(html).not.toContain('Macintosh')
    expect(html).not.toContain('$X,XXX')
    expect(html).not.toContain('Placeholder copy.')
    expect(html).toContain('Join the waitlist')
    expect(html).not.toContain('nothing was sent')
    expect(html).not.toContain('fareharbor')
  })

  it('moves a matching published listing only for available or sold', () => {
    const moved = buildSaleLists([{ slug: 'june', status: 'sold', priceDisplay: 'Contact the farm' }])
    expect(moved.available.map((animal) => animal.name)).not.toContain('June')
    expect(moved.sold.find((animal) => animal.slug === 'june')?.priceDisplay).toBe('Contact the farm')

    const held = buildSaleLists([{ slug: 'joe', status: 'reserved' }])
    expect(held.available.map((animal) => animal.name)).not.toContain('Joe')
    expect(held.sold.map((animal) => animal.name)).not.toContain('Joe')
  })

  it('keeps Lovable page copy until the Sanity document is complete', () => {
    expect(resolveSalePageCopy({ intro: 'Only one field' }).source).toBe('fallback')
    expect(resolveAdoptionPageCopy(null).source).toBe('fallback')
  })
})

function completeAdoptionPage(overrides: Record<string, unknown> = {}) {
  return {
    heroLead: ADOPT_PAGE.heroLead,
    heroAccent: ADOPT_PAGE.heroAccent,
    heroIntro: 'Editors can change this introduction.',
    awardsTitle: ADOPT_PAGE.awardsTitle,
    awardsTagline: ADOPT_PAGE.awardsTagline,
    sponsorLead: ADOPT_PAGE.sponsorLead,
    sponsorAccent: ADOPT_PAGE.sponsorAccent,
    sponsorParagraphs: [...ADOPT_PAGE.sponsorParagraphs],
    sponsorNote: ADOPT_PAGE.sponsorNote,
    animalsHeading: 'Meet the herd.',
    animalsIntro: ADOPT_PAGE.animalsIntro,
    learnMoreLabel: 'See more',
    adoptButtonLabel: ADOPT_PAGE.adoptButtonLabel,
    supportLead: ADOPT_PAGE.supportLead,
    supportAccent: ADOPT_PAGE.supportAccent,
    supportParagraphs: [...ADOPT_PAGE.supportParagraphs],
    supportButtonLabel: ADOPT_PAGE.supportButton,
    meetLead: ADOPT_PAGE.meetLead,
    packageLead: ADOPT_PAGE.packageLead,
    packageAccent: ADOPT_PAGE.packageAccent,
    packageIntroGold: ADOPT_PAGE.packageIntroGold,
    packageIntroSingle: ADOPT_PAGE.packageIntroSingle,
    finePrintLead: ADOPT_PAGE.finePrintLead,
    finePrintAccent: ADOPT_PAGE.finePrintAccent,
    detailSupportLead: ADOPT_PAGE.detailSupportLead,
    detailSupportAccent: ADOPT_PAGE.detailSupportAccent,
    seoTitle: 'Adopt an Animal | Udderly Ridiculous Farm Life',
    seoDescription: ADOPT_PAGE.intro,
    ...overrides,
  }
}

describe('sanity editability', () => {
  it('keeps offerings and listings when animal or species references are missing', () => {
    const cards = buildAdoptionCards([{ slug: 'sassafras', introduction: 'Chief of snacks.' }])
    expect(cards).toHaveLength(1)
    expect(cards[0]?.name).toBe('Sassafras')
    expect(cards[0]?.speciesNote).toBeUndefined()
    expect(cards.map((card) => card.slug)).not.toContain('clara')

    const clara = buildAdoptionCards([{ slug: 'clara', speciesTitle: 'Mini Highland Cattle', introduction: 'Hello' }])
    expect(clara.find((card) => card.slug === 'clara')?.speciesNote).toBeUndefined()

    const listing = findSaleAnimal('copperpot-puff-elton-john', [{ slug: 'copperpot-puff-elton-john', status: 'sold', personality: 'One card.' }])
    expect(listing?.name).toBe('Copperpot, Puff & Elton John')
    expect(listing?.species).toBe('alpaca')
    expect(listing?.speciesTitle).toBeUndefined()
    expect(listing?.source).toBe('sanity')
  })

  it('does not publish fallback Tripadvisor claims on the Adopt page', () => {
    const fallback = resolveAdoptionPageCopy(null)
    const missingAwards = resolveAdoptionPageCopy(completeAdoptionPage())
    for (const copy of [fallback, missingAwards]) {
      expect(copy.showAwards).toBe(false)
      const html = renderToStaticMarkup(<AdoptPage copy={copy} cards={[]} images={images} />)
      expect(html).not.toContain('TripAdvisor awards')
      expect(html).not.toContain('Top 10% of attractions worldwide')
    }
    const approved = resolveAdoptionPageCopy(completeAdoptionPage({
      awardImages: [{ alt: 'Published award', asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' } }],
    }))
    expect(approved.showAwards).toBe(true)
    expect(renderToStaticMarkup(<AdoptPage copy={approved} cards={[]} images={images} />)).toContain('TripAdvisor awards')
  })

  it('replaces complete page copy and keeps Lovable copy when the document is incomplete', () => {
    const replaced = resolveAdoptionPageCopy(completeAdoptionPage())
    expect(replaced.source).toBe('sanity')
    expect(replaced.animalsHeading).toBe('Meet the herd.')
    expect(replaced.learnMoreLabel).toBe('See more')
    expect(resolveAdoptionPageCopy({ heroIntro: ADOPT_PAGE.intro }).source).toBe('fallback')
    expect(resolveAdoptionPageCopy({ heroIntro: ADOPT_PAGE.intro }).intro).toBe(ADOPT_PAGE.intro)
  })

  it('keeps the approved introduction when it is stored as the SEO description', () => {
    expect(ADOPT_PAGE.intro.length).toBeGreaterThan(200)
    expect(ADOPT_PAGE.intro.length).toBeLessThanOrEqual(320)
    const copy = resolveAdoptionPageCopy(completeAdoptionPage())
    expect(copy.seoSource).toBe('sanity')
    expect(copy.seoDescription).toBe(ADOPT_PAGE.intro)
    expect(copy.intro).toBe('Editors can change this introduction.')
  })

  it('keeps valid page copy when the SEO description is too long', () => {
    const copy = resolveAdoptionPageCopy(completeAdoptionPage({ seoDescription: 'x'.repeat(321) }))
    expect(copy.source).toBe('sanity')
    expect(copy.intro).toBe('Editors can change this introduction.')
    expect(copy.seoSource).toBe('fallback')
    expect(copy.seoDescription).toBe(ADOPT_PAGE.intro)
  })

  it('rejects credentialed or invalid sale-page links but keeps the waitlist anchor', () => {
    const fallback = '#waitlist'
    expect(safeSalePageHref('#waitlist', fallback)).toBe(fallback)
    expect(safeSalePageHref('/contact', fallback)).toBe('/contact')
    expect(safeSalePageHref('https://example.com/contact', fallback)).toBe('https://example.com/contact')
    for (const unsafe of [
      'https://user:password@example.com/contact',
      'http://user@example.com/contact',
      'javascript:alert(1)',
      'data:text/html,bad',
      '//example.com/contact',
      '#invalid anchor',
      'https://',
    ]) {
      expect(safeSalePageHref(unsafe, fallback)).toBe(fallback)
    }
  })

  it('requires secure, non-credentialed adoption checkout destinations', () => {
    expect(checkoutHref(' https://example.com/adopt-clara ')).toBe('https://example.com/adopt-clara')
    for (const unsafe of [
      'http://example.com/checkout',
      'https://user:password@example.com/checkout',
      'javascript:alert(1)',
      'data:text/html,hello',
      '//example.com/checkout',
      '/checkout',
      'https://',
    ]) {
      expect(checkoutHref(unsafe)).toBeUndefined()
    }
    const clara = findAdoptionAnimal('clara', [{ slug: 'clara', title: 'Clara' }])!
    const hidden = resolveAdoptionDetail(clara, [{ slug: 'clara', packages: [{
      name: 'Silver', priceDisplay: '$35', includes: ['Digital certificate of adoption'],
      checkoutUrl: 'http://example.com/checkout',
    }] }])
    expect(hidden.packages).toEqual([])
  })

  it('shows a published package only when checkout is a real URL', () => {
    const clara = findAdoptionAnimal('clara', [{ slug: 'clara', title: 'Clara' }])!
    const hidden = resolveAdoptionDetail(clara, [{
      slug: 'clara',
      packages: [{
        name: 'Silver',
        kicker: 'Silver Pail',
        priceDisplay: '$35',
        includes: ['Digital certificate of adoption'],
        checkoutUrl: 'pay-later',
      }],
    }])
    expect(hidden.packages).toEqual([])
    const detail = resolveAdoptionDetail(clara, [{
      slug: 'clara',
      tagline: 'The pasture regular.',
      packages: [{
        name: 'Silver',
        kicker: 'Silver Pail',
        priceDisplay: '$35',
        includes: ['Digital certificate of adoption'],
        checkoutUrl: 'https://example.com/adopt-clara',
      }],
    }])
    expect(detail.packages).toHaveLength(1)
    expect(detail.packages[0]?.price).toBe('$35')
    expect(detail.packages[0]?.checkoutUrl).toBe('https://example.com/adopt-clara')
    const html = renderToStaticMarkup(
      <AnimalAdoptionPage
        animal={clara}
        copy={resolveAdoptionPageCopy(null)}
        detail={detail}
        images={{ hero: '/hero.webp', gallery: ['/a.jpg'], support: '/b.jpg' }}
      />,
    )
    expect(html).toContain('$35')
    expect(html).toContain('href="https://example.com/adopt-clara"')
    expect(html).not.toContain('aria-disabled')
    expect(html).not.toContain('pay-later')
    expect(html).not.toContain('$75')
  })

  it('leaves unknown animal facts empty', () => {
    const animal = findSaleAnimal('macintosh', [{ slug: 'macintosh', status: 'available', priceDisplay: '$X,XXX' }])
    expect(animal?.birthDate).toBeUndefined()
    expect(animal?.birthHeight).toBeUndefined()
    expect(animal?.birthWeight).toBeUndefined()
    expect(animal?.sex).toBeUndefined()
    expect(animal?.genetics).toBeUndefined()
    expect(animal?.parentDamName).toBeUndefined()
    expect(animal?.priceDisplay).toBeUndefined()
    expect(animal?.images).toEqual([])
  })

  it('reads published documents only', () => {
    expect(sanityClient.config().perspective).toBe('published')
    expect(adoptionOfferingsQuery).not.toContain('drafts.')
    expect(animalListingsQuery).not.toContain('drafts.')
    expect(adoptionOfferingsQuery).toContain('animal->species->title')
    expect(animalListingsQuery).toContain('species->title')
    expect(adoptionOfferingsQuery).toContain('sortOrder asc')
    expect(animalListingsQuery).toContain('groupDescription')
    expect(buildRobotsTxt()).toBe('User-agent: *\nDisallow: /\n')
  })

  it('does not invent listings when nothing is published', () => {
    expect(buildAdoptionCards()).toEqual([])
    expect(buildSaleLists().available).toEqual([])
    expect(buildSaleLists().sold).toEqual([])
    expect(findAdoptionAnimal('clara')).toBeUndefined()
    expect(findSaleAnimal('pekoe-rooibos-matcha')).toBeUndefined()
    expect(findSaleAnimal('macintosh')).toBeUndefined()
    expect(findSaleAnimal('june')).toBeUndefined()
    expect(findSaleAnimal('joe')).toBeUndefined()
  })

  it('lists a newly published animal and hides one that is not published', () => {
    const cards = buildAdoptionCards([
      { title: 'Biscuit', slug: 'biscuit', introduction: 'A new friend.', sortOrder: 2 },
      { title: 'Stanley', slug: 'stanley', sortOrder: 0 },
      { title: 'Stanley', slug: 'stanley', introduction: 'Duplicate.', sortOrder: 1 },
      { title: 'Hidden', slug: 'Not A Slug' },
      { title: 'Paused', slug: 'paused', active: false },
    ])
    expect(cards.map((card) => card.slug)).toEqual(['stanley', 'biscuit'])
    expect(cards[0]?.href).toBe('/adopt-an-animal/stanley')
    expect(cards[1]?.href).toBe('/adopt-an-animal/biscuit')
    expect(cards[1]?.imageKey).toBeUndefined()
    expect(findAdoptionAnimal('biscuit', [
      { title: 'Biscuit', slug: 'biscuit', introduction: 'A new friend.' },
    ])?.name).toBe('Biscuit')
    expect(findAdoptionAnimal('clara', [
      { title: 'Biscuit', slug: 'biscuit' },
    ])).toBeUndefined()
  })

  it('leaves the collection empty after the editor takes it over and unpublishes every animal', () => {
    expect(buildAdoptionCards([], { manageCollection: true })).toEqual([])
    expect(buildAdoptionCards([{ title: 'Clara', slug: 'clara', availability: 'unavailable' }])).toEqual([])
    expect(buildAdoptionCards([{ title: 'Clara', slug: 'clara', active: false }])).toEqual([])
    expect(buildSaleLists([{ title: 'June', slug: 'june', active: false, status: 'available' }]).available).toEqual([])
    expect(findAdoptionAnimal('clara', [], true)).toBeUndefined()
    const lists = buildSaleLists([], { manageCollection: true })
    expect(lists.available).toEqual([])
    expect(lists.sold).toEqual([])
    expect(findSaleAnimal('macintosh', [], true)).toBeUndefined()
    const html = renderToStaticMarkup(
      <AdoptPage copy={resolveAdoptionPageCopy(null)} cards={[]} images={images} />,
    )
    expect(html).toContain('There are no animals in this list right now.')
    expect(html).not.toContain('Clara')
  })

  it('groups published listings by status and keeps cattle layout without a species reference', () => {
    const lists = buildSaleLists([
      { title: 'June', slug: 'june', status: 'sold', priceDisplay: 'Contact the farm', sortOrder: 2 },
      { title: 'Joe', slug: 'joe', status: 'reserved', sortOrder: 1, detailsProfile: 'cattle' },
      { title: 'Biscuit', slug: 'biscuit', status: 'available', sortOrder: 0 },
      { title: 'Biscuit', slug: 'biscuit', status: 'sold', sortOrder: 3 },
      { slug: 'paused', title: 'Paused', active: false, status: 'available' },
    ])
    expect(lists.available.map((animal) => animal.slug)).toEqual(['biscuit'])
    expect(lists.sold.map((animal) => animal.slug)).toEqual(['june'])
    expect(lists.available.find((animal) => animal.slug === 'joe')).toBeUndefined()
    expect(lists.available.find((animal) => animal.slug === 'biscuit')?.species).toBe('other')
    expect(lists.available.find((animal) => animal.slug === 'biscuit')?.imageKey).toBeUndefined()
    expect(lists.sold.map((animal) => animal.slug)).not.toContain('pekoe-rooibos-matcha')
    expect(lists.available.map((animal) => animal.slug)).not.toContain('copperpot-puff-elton-john')
  })

  it('renders a new listing without borrowing another photo or a goat policy', () => {
    const animal = findSaleAnimal('biscuit', [{
      title: 'Biscuit',
      slug: 'biscuit',
      status: 'available',
      personality: 'Biscuit likes the sunny pen.',
      seo: { title: 'B'.repeat(72), description: 'A short description.' },
    }])!
    expect(animal.images).toEqual([])
    expect(animal.seoTitle).toHaveLength(72)
    expect(animal.personality).toBe('Biscuit likes the sunny pen.')
    expect(animal.groupDescription).toBeUndefined()
    const html = renderToStaticMarkup(
      <SaleAnimalPage
        animal={animal}
        copy={resolveSalePageCopy(null)}
        images={{ portrait: '', dam: '/dam.jpg', sire: '/sire.jpg', chart: '/chart.webp' }}
      />,
    )
    expect(html).toContain('Biscuit likes the sunny pen.')
    expect(html).toContain('Biscuit')
    expect(html).not.toContain('Write about all of')
    expect(html).not.toContain('Must be adopted in pairs')
    expect(html).not.toContain('/dam.jpg')
    expect(html).not.toContain('src=""')
  })

  it('keeps an overlong listing title from dropping the description', () => {
    const animal = findSaleAnimal('june', [{
      slug: 'june',
      title: 'June',
      status: 'available',
      personality: 'June stays in the story.',
      groupDescription: 'The pair stays together.',
      seo: { title: 'T'.repeat(121), description: 'June is still described.' },
    }])
    expect(animal?.seoTitle).toBeUndefined()
    expect(animal?.seoDescription).toBe('June is still described.')
    expect(animal?.personality).toBe('June stays in the story.')
    expect(animal?.groupDescription).toBe('The pair stays together.')
    const copy = resolveAdoptionPageCopy(completeAdoptionPage({ seoTitle: 'T'.repeat(71) }))
    expect(copy.source).toBe('sanity')
    expect(copy.intro).toBe('Editors can change this introduction.')
    expect(copy.seoSource).toBe('fallback')
  })

  it('uses a published group description and omits the fallback paragraph', () => {
    const edited = findSaleAnimal('pekoe-rooibos-matcha', [{
      slug: 'pekoe-rooibos-matcha',
      title: 'Pekoe, Rooibos & Matcha',
      status: 'sold',
      groupDescription: 'Three goats, one listing.',
    }])
    expect(edited?.species).toBe('goat')
    const html = renderToStaticMarkup(
      <SaleAnimalPage
        animal={edited!}
        copy={resolveSalePageCopy(null)}
        images={{ portrait: '/goat.jpg', dam: '/dam.jpg', sire: '/sire.jpg', chart: '/chart.webp' }}
      />,
    )
    expect(html).toContain('Three goats, one listing.')
    expect(html).toContain('href="/contact"')
    expect(html).not.toContain('Write about all of')
    expect(html).toContain('name="interests"')
    expect(html).toContain('<form')
    expect(html).not.toContain('nothing was sent')
    expect(html).not.toContain('$X,XXX')

    const unpublished = findSaleAnimal('pekoe-rooibos-matcha', [{
      slug: 'pekoe-rooibos-matcha',
      title: 'Pekoe, Rooibos & Matcha',
      status: 'sold',
    }])!
    const emptyHtml = renderToStaticMarkup(
      <SaleAnimalPage
        animal={unpublished}
        copy={resolveSalePageCopy(null)}
        images={{ portrait: '/goat.jpg', dam: '/dam.jpg', sire: '/sire.jpg', chart: '/chart.webp' }}
      />,
    )
    expect(emptyHtml).not.toContain('Write about all of')
    expect(emptyHtml).not.toContain('Must be adopted in pairs')
    expect(emptyHtml).not.toContain('/dam.jpg')
    expect(emptyHtml).not.toContain('Placeholder')
  })
})

describe('routes and navigation', () => {
  it('reserves the new pages and keeps experience URLs at the root', () => {
    expect(RESERVED_SLUGS).toContain('adopt-an-animal')
    expect(RESERVED_SLUGS).toContain('animals-for-sale')
    expect(routableExperienceSlug('adopt-an-animal')).toBeUndefined()
    expect(routableExperienceSlug('goat-cuddles')).toBe('goat-cuddles')
    expect(primaryNav).toEqual(
      expect.arrayContaining([
        { label: 'Adopt an Animal', href: '/adopt-an-animal' },
        { label: 'Animals for Sale', href: '/animals-for-sale' },
      ]),
    )
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: '/private-mini-highland-experience',
          to: '/mini-highland-cow-experience',
          status: 301,
        }),
      ]),
    )
    expect(FUTURE_INTERNAL_REDIRECTS).toEqual([
      expect.objectContaining({ from: '/adopt', to: '/adopt-an-animal' }),
    ])
  })
})
