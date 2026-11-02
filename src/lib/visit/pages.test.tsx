import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    to: string
    children: ReactNode
    className?: string
    'aria-label'?: string
  }) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  ButtonLink: ({
    href,
    children,
    className,
  }: {
    href: string
    children: ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { FarmMarketPage } from '@/components/visit/farm-market-page'
import { GiftCardPage } from '@/components/visit/gift-card-page'
import { GlampingPage } from '@/components/visit/glamping-page'
import { IceCreamPage } from '@/components/visit/ice-cream-page'
import { siteChromeFallback } from '@/lib/site-chrome'
import { getStaticSitemapEntries } from '@/lib/seo/sitemap'
import { createPageHead } from '@/lib/seo/page-head'
import {
  farmGlampingPageQuery,
  farmMarketPageQuery,
  giftCardPageQuery,
  iceCreamPageQuery,
} from '@/lib/sanity/queries'
import { routableExperienceSlug } from '@/lib/routes/paths'

import {
  FARM_GLAMPING_ALIAS,
  FARM_GLAMPING_PATH,
  GIFT_CARD_UNAVAILABLE,
  GLAMPING_UNAVAILABLE,
  glampingAliasRedirect,
} from './model'
import { resolveFarmMarket, resolveGiftCard, resolveGlamping, resolveIceCream } from './resolve'

const image = {
  alt: 'A published farm photo',
  asset: { _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' },
}

describe('visit pages', () => {
  it('renders the store, ice cream, gift card, and glamping layouts from design fallbacks', () => {
    const store = renderToStaticMarkup(<FarmMarketPage page={null} />)
    const ice = renderToStaticMarkup(<IceCreamPage page={null} />)
    const gift = renderToStaticMarkup(<GiftCardPage page={null} />)
    const stay = renderToStaticMarkup(<GlampingPage page={null} />)

    expect(store).toContain('Farm Market')
    expect(store).toContain('award-winning goat milk ice cream')
    expect(store).toContain('Looking through the doorway into the Farm Market Store')
    expect(store).toContain('href="/ice-cream"')
    expect(store).toContain('href="/experiences"')
    expect(store).not.toMatch(/140\+|over 100|urbort|Guests at the farm after visiting the store/i)
    expect(ice).toContain('award-winning goat milk ice cream')
    expect(ice).not.toContain('Lemon Cream')
    expect(ice).not.toContain('118')
    expect(ice).not.toContain('65%')
    expect(ice).not.toMatch(/lactose friendly|A2 casein|twenty minutes|World Vision/i)
    expect(ice).not.toContain('A news clip will appear here once a video is added.')
    expect(ice).not.toContain('youtube.com')
    expect(gift).toContain('Gift card purchase is not available yet.')
    expect(gift).toContain('disabled')
    expect(gift).toContain('Rainbow Registered')
    expect(gift).toContain('https://www.rainbowregistered.com/')
    expect(gift).toContain('https://feaston.com/')
    expect(gift).toContain('FeastON Certified Local logo')
    expect(gift).not.toMatch(/\b140\b|local producers/)
    expect(gift).not.toContain('never expire')
    expect(gift).not.toContain('Guest cuddling a mini goat')
    expect(gift).not.toContain('Placeholder description')
    expect(stay).toContain('Farm')
    expect(stay).toContain('Glamping')
    expect(stay).toContain('Sleep over on our Ontario family farm, with very curious neighbours with hooves.')
    expect(stay).toContain('Farm glamping booking is not available yet.')
    expect(stay).toContain('disabled')
    expect(stay).toContain('https://oxfordcountycheesetrail.ca/')
    expect(stay).not.toContain('Cancellation policy')
    expect(stay).not.toContain('CA$10.60')
    expect(stay).not.toContain('10%')
    expect(stay).not.toContain('king bed')
    expect(stay).not.toContain('May to October')
    expect(stay).not.toContain('Up to 4')
    expect(stay).not.toContain('No pets')
    expect(stay).not.toContain('Goats grazing near the glamping site')
    expect(stay).not.toContain('Luxury RV')
    expect(stay).not.toContain('Marissa')
    expect(stay).not.toContain('Dev P.')
  })

  it('lets published copy replace a section and hides a section when it is turned off', () => {
    const store = renderToStaticMarkup(
      <FarmMarketPage
        page={{
          heroLead: 'Market',
          statValue: '200+',
          showIceCream: false,
          gallery: [image],
        }}
      />,
    )
    expect(store).toContain('Market')
    expect(store).toContain('200+')
    expect(store).not.toContain('href="/ice-cream"')
    expect(store).toContain('A published farm photo')

    const hidden = renderToStaticMarkup(<FarmMarketPage page={{ showStat: false, showGallery: false }} />)
    expect(hidden).not.toContain('200+')
    expect(hidden).not.toContain('Photos from the Farm Market Store')

    const placeholderStat = renderToStaticMarkup(
      <FarmMarketPage page={{ statValue: 'Placeholder count', statLabel: 'Local producers supported', intro: 'Placeholder store story' }} />,
    )
    expect(placeholderStat).not.toContain('Placeholder')
    expect(placeholderStat).toContain('ridiculously picky')
    expect(resolveFarmMarket(null).showStat).toBe(false)
    expect(resolveFarmMarket(null).seo.description).not.toMatch(/140|100/)
  })

  it('keeps gift purchase and glamping booking unavailable, and ignores an unsafe video URL', () => {
    const gift = resolveGiftCard({
      amounts: [{ name: 'CA$50', description: 'Editor label only' }],
    })
    expect(gift.amounts).toEqual([{ name: 'CA$50', description: 'Editor label only' }])
    const giftHtml = renderToStaticMarkup(<GiftCardPage page={{ amounts: gift.amounts }} />)
    expect(giftHtml).toContain('CA$50')
    expect(giftHtml).toContain(GIFT_CARD_UNAVAILABLE)
    expect(giftHtml).toContain('disabled')
    expect(giftHtml).not.toContain('href="#buy"')

    const stay = renderToStaticMarkup(<GlampingPage page={{ showCancellation: false, showCheese: false }} />)
    expect(stay).toContain(GLAMPING_UNAVAILABLE)
    expect(stay).not.toContain('Cancellation policy')
    expect(stay).not.toContain('oxfordcountycheesetrail.ca')

    expect(resolveIceCream({ videoUrl: 'javascript:alert(1)' }).videoUrl).toBeUndefined()
    expect(resolveIceCream({ videoUrl: 'http://example.com/clip' }).videoUrl).toBeUndefined()
    expect(resolveIceCream({ videoUrl: 'https://example.com/clip' }).videoUrl).toBe('https://example.com/clip')
    expect(resolveIceCream(null).flavours).toBeUndefined()
    expect(resolveIceCream(null).showGift).toBe(false)
    expect(resolveIceCream(null).why).toEqual([])
    expect(resolveGiftCard(null).amounts).toEqual([])
    expect(resolveGiftCard(null).showRainbow).toBe(true)
    expect(resolveGiftCard(null).showFeast).toBe(true)
    expect(resolveGiftCard(null).feastCopy).not.toMatch(/\b140\b|local producers/)
    expect(resolveGiftCard({ showRainbow: false, showFeast: false }).showRainbow).toBe(false)
    expect(resolveGiftCard({ showRainbow: false, showFeast: false }).showFeast).toBe(false)
    expect(resolveGiftCard(null).things).toEqual([])

    const publishedIce = renderToStaticMarkup(
      <IceCreamPage
        page={{
          flavours: [
            { name: 'Placeholder Scoop', story: 'Should stay hidden.', ingredients: 'Sugar' },
            { name: 'Published Scoop', story: 'A published flavour story.', ingredients: 'Fresh Ontario goat milk.' },
          ],
          videoUrl: 'https://example.com/clip',
        }}
      />,
    )
    expect(publishedIce).toContain('Published Scoop')
    expect(publishedIce).toContain('A published flavour story.')
    expect(publishedIce).toContain('Fresh Ontario goat milk.')
    expect(publishedIce).toContain('https://example.com/clip')
    expect(publishedIce).not.toContain('Placeholder Scoop')
    expect(publishedIce).not.toContain('World Vision')

    const publishedGift = renderToStaticMarkup(
      <GiftCardPage
        page={{
          things: ['Placeholder rule', 'A published redemption note.'],
          gallery: [image],
          showRainbow: true,
          showFeast: true,
        }}
      />,
    )
    expect(publishedGift).toContain('A published redemption note.')
    expect(publishedGift).toContain('A published farm photo')
    expect(publishedGift).not.toContain('Placeholder rule')
    expect(publishedGift).toContain('Rainbow Registered')
    expect(publishedGift).toContain('feaston.com')
    expect(publishedGift).not.toMatch(/\b140\b|local producers/)
    expect(publishedGift).toContain(GIFT_CARD_UNAVAILABLE)
    expect(publishedGift).toContain('disabled')

    const hiddenCertifications = renderToStaticMarkup(
      <GiftCardPage page={{ showRainbow: false, showFeast: false }} />,
    )
    expect(hiddenCertifications).not.toContain('Rainbow Registered')
    expect(hiddenCertifications).not.toContain('feaston.com')

    const designStay = resolveGlamping(null)
    expect(designStay.addOns).toEqual([])
    expect(designStay.cancellation).toEqual([])
    expect(designStay.amenities).toEqual([])
    expect(designStay.info).toEqual([])
    expect(designStay.details).toEqual([])
    expect(designStay.intro).not.toMatch(/king bed|kitchen|luxury RV/i)
    const partialStay = resolveGlamping({
      addOns: [{ name: 'Campfire Kit', price: 'Ask the farm', items: ['Bag of Firewood & Firestarter'] }],
      cancellationTiers: [],
      cheeseHref: 'javascript:alert(1)',
    })
    expect(partialStay.addOns.map((addOn) => addOn.name)).toEqual(['Campfire Kit'])
    expect(partialStay.addOns.find((addOn) => addOn.name === 'Campfire Kit')?.price).toBe('Ask the farm')
    expect(partialStay.cancellation).toEqual([])
    expect(partialStay.cheeseHref).toBe('https://oxfordcountycheesetrail.ca/')
    const published = resolveGlamping({
      intro: 'A published stay introduction.',
      heroImage: image,
      gallery: [image],
      amenities: ['Confirmed amenity'],
      addOnsHeading: 'Optional extras',
      addOnsNote: 'Ask when you book.',
      addOns: [{ name: 'Firewood', price: 'CA$12', items: ['One bag'] }],
      info: ['No pets on this stay.'],
      cancellationNote: 'Published stay terms.',
      cancellationTiers: [{ when: '5+ days', text: 'A published refund rule.' }],
    })
    expect(published.intro).toBe('A published stay introduction.')
    expect(published.heroImage?.alt).toBe('A published farm photo')
    expect(published.gallery).toHaveLength(1)
    expect(published.showAmenities).toBe(true)
    expect(published.showAddOns).toBe(true)
    expect(published.showCancellation).toBe(true)
    const publishedHtml = renderToStaticMarkup(
      <GlampingPage
        page={{
          intro: 'A published stay introduction.',
          heroImage: image,
          gallery: [image],
          amenities: ['Confirmed amenity'],
          addOns: [{ name: 'Firewood', price: 'CA$12', items: ['One bag'] }],
          info: ['No pets on this stay.'],
          cancellationTiers: [{ when: '5+ days', text: 'A published refund rule.' }],
        }}
      />,
    )
    expect(publishedHtml).toContain('A published stay introduction.')
    expect(publishedHtml).toContain('A published farm photo')
    expect(publishedHtml).toContain('Confirmed amenity')
    expect(publishedHtml).toContain('CA$12')
    expect(publishedHtml).toContain('No pets on this stay.')
    expect(publishedHtml).toContain('5+ days')
    expect(publishedHtml).toContain('A published refund rule.')
    expect(publishedHtml).not.toContain('CA$42.40')
    expect(publishedHtml).not.toContain('7+ days')
  })

  it('uses the glamping path as canonical and redirects the experiences alias', () => {
    expect(glampingAliasRedirect()).toEqual({ href: FARM_GLAMPING_PATH })
    expect(FARM_GLAMPING_ALIAS).toBe('/experiences/farm-glamping')
    expect(routableExperienceSlug('farm-glamping')).toBeUndefined()
    const paths = getStaticSitemapEntries().map((entry) => entry.path)
    expect(paths).toContain('/farm-glamping')
    expect(paths).toContain('/farm-market-store')
    expect(paths).toContain('/ice-cream')
    expect(paths).toContain('/gift-card')
    expect(paths).toContain('/tower-of-goats-discovery-trail')
    expect(paths).not.toContain('/tower-of-goats')
    expect(paths).not.toContain('/experiences/farm-glamping')
    expect(resolveGlamping(null).seo.path).toBe('/farm-glamping')
    const head = createPageHead({ ...resolveGlamping(null).seo, noindex: true })
    expect(JSON.stringify(head)).toContain('noindex, nofollow, noarchive')
  })

  it('queries the page singletons without draft paths', () => {
    for (const query of [farmMarketPageQuery, iceCreamPageQuery, giftCardPageQuery, farmGlampingPageQuery]) {
      expect(query).toContain('_id ==')
      expect(query).not.toContain('drafts.')
    }
  })
})

describe('approved header and footer', () => {
  it('renders the Lovable menus, mobile control, and legal links', () => {
    const header = renderToStaticMarkup(<SiteHeader chrome={siteChromeFallback} />)
    const footer = renderToStaticMarkup(<SiteFooter chrome={siteChromeFallback} />)

    expect(header).toContain('Experiences')
    expect(header).toContain('Gift Cards')
    expect(header).toContain('Explore')
    expect(header).toContain('About')
    expect(header).toContain('href="/farm-market-store"')
    expect(header).toContain('href="/farm-glamping"')
    expect(header).toContain('href="/corporate-training/team-building-experiences"')
    expect(header).toContain('Open navigation')
    expect(header).toContain('aria-expanded')
    expect(header).not.toMatch(/href="\/corporate"/)
    expect(header).not.toContain('Meet the Herd')

    expect(footer).toContain('Come Do Something Udderly Ridiculous')
    expect(footer).toContain('Book an Experience')
    expect(footer).toContain('href="/privacy-policy"')
    expect(footer).toContain('href="/terms-of-service"')
    expect(footer).toContain('href="/cookies-policy"')
    expect(footer).toContain('Cookie preferences')
    expect(footer).toContain('info@udderlyridiculousfarmlife.com')
    expect(footer).not.toMatch(/href="\/privacy"/)
    expect(footer).not.toMatch(/href="\/terms"/)
    expect(footer).not.toContain('#instagram')
  })
})
