import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AdoptPage } from '@/components/adopt/adopt-page'
import { AnimalAdoptionPage } from '@/components/adopt/animal-adoption-page'
import { AnimalsForSalePage } from '@/components/sale/animals-for-sale-page'
import { ADOPTION_ANIMALS, ADOPT_PAGE } from '@/lib/adopt/content'
import { buildAdoptionCards, findAdoptionAnimal, resolveAdoptionDetail, resolveAdoptionPageCopy } from '@/lib/adopt/resolve'
import { primaryNav } from '@/lib/navigation'
import { RESERVED_SLUGS, routableExperienceSlug } from '@/lib/routes/paths'
import { redirects } from '@/lib/seo/redirects'
import { FUTURE_INTERNAL_REDIRECTS } from '@/lib/seo/future-redirects'
import { FOR_SALE, SOLD } from '@/lib/sale/content'
import { buildSaleLists, findSaleAnimal, resolveSalePageCopy } from '@/lib/sale/resolve'
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
  it('renders the approved names, Clara as a Mini Highland cow, and no checkout link', () => {
    const html = renderToStaticMarkup(
      <AdoptPage copy={resolveAdoptionPageCopy(null)} cards={buildAdoptionCards()} images={images} />,
    )

    for (const animal of ADOPTION_ANIMALS) {
      expect(html).toContain(animal.name)
      expect(html).toContain(`href="/adopt-an-animal/${animal.slug}"`)
    }
    expect(html).toContain('Clara the Mini Highland cow')
    expect(html).not.toContain('Clara the goat')
    expect(html).not.toContain('#adopt')
    expect(html).not.toContain('fareharbor')
    expect(html).toContain('Meet the adoptables.')
    expect(html).toContain('Placeholder description.')
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

  it('keeps Clara labeled as a Mini Highland cow when a published species disagrees', () => {
    const clara = buildAdoptionCards([{ slug: 'clara', speciesTitle: 'Goat', introduction: 'Hello' }]).find(
      (card) => card.slug === 'clara',
    )
    expect(clara?.alt).toContain('Mini Highland cow')
    expect(clara?.speciesNote).toContain('Mini Highland cow')
  })

  it('does not show a Gold package for Chicken', () => {
    const chicken = ADOPTION_ANIMALS.find((animal) => animal.slug === 'chicken')
    const html = renderToStaticMarkup(
      <AnimalAdoptionPage
        animal={chicken!}
        copy={resolveAdoptionPageCopy(null)}
        detail={resolveAdoptionDetail(chicken!)}
        images={{ hero: '/hero.webp', gallery: ['/a.jpg'], support: '/b.jpg' }}
      />,
    )
    expect(html).toContain('$35')
    expect(html).not.toContain('$75')
    expect(html).not.toContain('href="#')
  })
})

describe('animals for sale', () => {
  it('keeps the Lovable available and sold groups', () => {
    const lists = buildSaleLists()
    expect(lists.available.map((animal) => animal.name)).toEqual(FOR_SALE.map((animal) => animal.name))
    expect(lists.sold.map((animal) => animal.name)).toEqual(SOLD.map((animal) => animal.name))
    expect(lists.sold.map((animal) => animal.name)).toContain('Copperpot, Puff & Elton John')

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
    expect(html).toContain('Available now.')
    expect(html).toContain('Happy homes,')
    expect(html).toContain('href="/animals-for-sale/macintosh"')
    expect(html).toContain('href="/animals-for-sale/copperpot-puff-elton-john"')
    expect(html).not.toContain('fareharbor')
    expect(html).toContain('Join Waitlist')
  })

  it('moves a matching published listing only for available or sold', () => {
    const moved = buildSaleLists([{ slug: 'june', status: 'sold', priceDisplay: 'Contact the farm' }])
    expect(moved.available.map((animal) => animal.name)).not.toContain('June')
    expect(moved.sold.find((animal) => animal.slug === 'june')?.priceDisplay).toBe('Contact the farm')

    const held = buildSaleLists([{ slug: 'joe', status: 'reserved' }])
    expect(held.available.map((animal) => animal.name)).toContain('Joe')
    expect(held.available.find((animal) => animal.slug === 'joe')?.groupingNote).toContain('reserved')
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

    const listing = findSaleAnimal('copperpot-puff-elton-john', [{ slug: 'copperpot-puff-elton-john', personality: 'One card.' }])
    expect(listing?.name).toBe('Copperpot, Puff & Elton John')
    expect(listing?.species).toBe('alpaca')
    expect(listing?.speciesTitle).toBeUndefined()
    expect(listing?.source).toBe('sanity')
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

  it('shows package display text without turning on checkout', () => {
    const clara = findAdoptionAnimal('clara')!
    const detail = resolveAdoptionDetail(clara, [{
      slug: 'clara',
      packages: [{
        name: 'Silver',
        kicker: 'Silver Pail',
        priceDisplay: '$35',
        includes: ['Digital certificate of adoption'],
        checkoutUrl: 'pay-later',
      }],
    }])
    expect(detail.packages).toHaveLength(1)
    expect(detail.packages[0]?.price).toBe('$35')
    expect(detail.packages[0]?.checkoutUrl).toBeUndefined()
    const html = renderToStaticMarkup(
      <AnimalAdoptionPage
        animal={clara}
        copy={resolveAdoptionPageCopy(null)}
        detail={detail}
        images={{ hero: '/hero.webp', gallery: ['/a.jpg'], support: '/b.jpg' }}
      />,
    )
    expect(html).toContain('$35')
    expect(html).toContain('aria-disabled="true"')
    expect(html).not.toContain('pay-later')
  })

  it('leaves unknown animal facts empty', () => {
    const animal = findSaleAnimal('macintosh', [{ slug: 'macintosh', priceDisplay: '$X,XXX' }])
    expect(animal?.birthDate).toBeUndefined()
    expect(animal?.birthHeight).toBeUndefined()
    expect(animal?.birthWeight).toBeUndefined()
    expect(animal?.sex).toBeUndefined()
    expect(animal?.genetics).toBeUndefined()
    expect(animal?.parentDamName).toBeUndefined()
    expect(animal?.priceDisplay).toBe('$X,XXX')
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

  it('keeps the Lovable cards only while no published collection exists', () => {
    expect(buildAdoptionCards().map((card) => card.slug)).toEqual(ADOPTION_ANIMALS.map((animal) => animal.slug))
    expect(buildSaleLists().available).toHaveLength(5)
    expect(buildSaleLists().sold).toHaveLength(12)
    expect(findAdoptionAnimal('clara')?.source).toBe('fallback')
    expect(findSaleAnimal('pekoe-rooibos-matcha')?.slug).toBe('pekoe-rooibos-matcha')
    expect(findSaleAnimal('copperpot-puff-elton-john')?.slug).toBe('copperpot-puff-elton-john')
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
    expect(lists.available.map((animal) => animal.slug)).toEqual(['biscuit', 'joe'])
    expect(lists.sold.map((animal) => animal.slug)).toEqual(['june'])
    expect(lists.available.find((animal) => animal.slug === 'joe')?.species).toBe('cow')
    expect(lists.available.find((animal) => animal.slug === 'joe')?.groupingNote).toContain('reserved')
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

  it('uses the editable group description and the Lovable paragraph when that field is empty', () => {
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
    expect(html).not.toContain('Write about all of Pekoe, Rooibos & Matcha')

    const fallback = findSaleAnimal('pekoe-rooibos-matcha')!
    const fallbackHtml = renderToStaticMarkup(
      <SaleAnimalPage
        animal={fallback}
        copy={resolveSalePageCopy(null)}
        images={{ portrait: '/goat.jpg', dam: '/dam.jpg', sire: '/sire.jpg', chart: '/chart.webp' }}
      />,
    )
    expect(fallbackHtml).toContain('Write about all of Pekoe, Rooibos &amp; Matcha')
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
    expect(redirects).toEqual([
      expect.objectContaining({
        from: '/private-mini-highland-experience',
        to: '/mini-highland-cow-experience',
        status: 301,
      }),
    ])
    expect(FUTURE_INTERNAL_REDIRECTS).toEqual([
      expect.objectContaining({ from: '/adopt', to: '/adopt-an-animal' }),
    ])
  })
})
