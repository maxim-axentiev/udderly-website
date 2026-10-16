import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { AdoptPage } from '@/components/adopt/adopt-page'
import { AnimalAdoptionPage } from '@/components/adopt/animal-adoption-page'
import { AnimalsForSalePage } from '@/components/sale/animals-for-sale-page'
import { ADOPTION_ANIMALS } from '@/lib/adopt/content'
import { buildAdoptionCards, resolveAdoptionPageCopy } from '@/lib/adopt/resolve'
import { primaryNav } from '@/lib/navigation'
import { RESERVED_SLUGS, routableExperienceSlug } from '@/lib/routes/paths'
import { redirects } from '@/lib/seo/redirects'
import { FUTURE_INTERNAL_REDIRECTS } from '@/lib/seo/future-redirects'
import { FOR_SALE, SOLD } from '@/lib/sale/content'
import { buildSaleLists, resolveSalePageCopy } from '@/lib/sale/resolve'

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

  it('uses a published introduction without dropping the other names', () => {
    const cards = buildAdoptionCards([
      { slug: 'stanley', introduction: 'Stanley prefers the fancy hay.', speciesTitle: 'Goat' },
    ])
    expect(cards.find((card) => card.slug === 'stanley')?.blurb).toBe('Stanley prefers the fancy hay.')
    expect(cards.find((card) => card.slug === 'stanley')?.source).toBe('sanity')
    expect(cards.map((card) => card.name)).toEqual(ADOPTION_ANIMALS.map((animal) => animal.name))
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
    expect(redirects).toEqual([])
    expect(FUTURE_INTERNAL_REDIRECTS).toEqual([
      expect.objectContaining({ from: '/adopt', to: '/adopt-an-animal' }),
    ])
  })
})
