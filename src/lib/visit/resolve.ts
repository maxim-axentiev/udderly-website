import type { CmsSeo } from '@/lib/about/cms'
import { cmsImageUrl } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'
import type { PageSeoInput } from '@/lib/seo/page-head'

import {
  farmMarketFallback,
  giftCardFallback,
  glampingFallback,
  iceCreamFallback,
  FARM_GLAMPING_PATH,
  FARM_MARKET_PATH,
  GIFT_CARD_PATH,
  ICE_CREAM_PATH,
} from './model'

function clean(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed || undefined
}

function text(value: string | null | undefined, fallback: string) {
  return clean(value) ?? fallback
}

function seoFor(seo: CmsSeo | undefined, fallback: PageSeoInput): PageSeoInput {
  const description = text(seo?.description, fallback.description ?? '')
  return {
    title: text(seo?.title, fallback.title),
    description,
    ogDescription: clean(seo?.description) ? description : fallback.ogDescription,
    path: fallback.path,
    ogType: 'website',
    noindex: seo?.noIndex === true,
  }
}

function list(value: Array<string | null> | null | undefined, fallback: readonly string[]) {
  const next = (value ?? []).flatMap((item) => {
    const line = clean(item)
    return line ? [line] : []
  })
  return next.length ? next : [...fallback]
}

export type VisitImage = { src: string; alt: string }

function photos(images: Array<SanityImage | null> | null | undefined): VisitImage[] | undefined {
  const next = (images ?? []).flatMap((image) => {
    const src = cmsImageUrl(image ?? undefined, 1400)
    const alt = image?.alt?.trim()
    return src && alt ? [{ src, alt }] : []
  })
  return next.length ? next : undefined
}

function photo(image: SanityImage | null | undefined): VisitImage | undefined {
  return photos(image ? [image] : undefined)?.[0]
}

export type IceFlavour = { name: string; story: string; ingredients: string }

function flavours(value: Array<{ name?: string | null; story?: string | null; ingredients?: string | null } | null> | null | undefined): IceFlavour[] | undefined {
  const next = (value ?? []).flatMap((item) => {
    const name = clean(item?.name)
    const story = clean(item?.story)
    if (!name || !story) return []
    return [{ name, story, ingredients: clean(item?.ingredients) ?? '' }]
  })
  return next.length ? next : undefined
}

export type GiftAmount = { name: string; description?: string }

function amounts(value: Array<{ name?: string | null; description?: string | null } | null> | null | undefined): GiftAmount[] {
  return (value ?? []).flatMap((item) => {
    const name = clean(item?.name)
    if (!name) return []
    return [{ name, description: clean(item?.description) }]
  })
}

export function resolveFarmMarket(page: {
  heroLead?: string | null
  heroAccent?: string | null
  introHeading?: string | null
  intro?: string | null
  localHeading?: string | null
  localParagraphs?: Array<string | null> | null
  statValue?: string | null
  statLabel?: string | null
  iceHeading?: string | null
  iceCopy?: string | null
  iceCta?: string | null
  closeHeading?: string | null
  closeCopy?: string | null
  heroImage?: SanityImage
  gallery?: Array<SanityImage | null> | null
  showStat?: boolean | null
  showIceCream?: boolean | null
  showGallery?: boolean | null
  seo?: CmsSeo
} | null) {
  return {
    ...farmMarketFallback,
    localParagraphs: list(page?.localParagraphs, farmMarketFallback.localParagraphs),
    iceCta: text(page?.iceCta, farmMarketFallback.iceCta),
    closeHeading: text(page?.closeHeading, farmMarketFallback.closeHeading),
    closeCopy: text(page?.closeCopy, farmMarketFallback.closeCopy),
    heroImage: photo(page?.heroImage),
    gallery: photos(page?.gallery),
    showGallery: page?.showGallery !== false,
    heroLead: text(page?.heroLead, farmMarketFallback.heroLead),
    heroAccent: text(page?.heroAccent, farmMarketFallback.heroAccent),
    introHeading: text(page?.introHeading, farmMarketFallback.introHeading),
    intro: text(page?.intro, farmMarketFallback.intro),
    localHeading: text(page?.localHeading, farmMarketFallback.localHeading),
    statValue: text(page?.statValue, farmMarketFallback.statValue),
    statLabel: text(page?.statLabel, farmMarketFallback.statLabel),
    iceHeading: text(page?.iceHeading, farmMarketFallback.iceHeading),
    iceCopy: text(page?.iceCopy, farmMarketFallback.iceCopy),
    showStat: page?.showStat !== false,
    showIceCream: page?.showIceCream !== false,
    seo: seoFor(page?.seo, {
      title: farmMarketFallback.seoTitle,
      description: farmMarketFallback.seoDescription,
      path: FARM_MARKET_PATH,
    }),
  }
}

export function resolveIceCream(
  page: {
    heroLead?: string | null
    heroAccent?: string | null
    introHeading?: string | null
    videoUrl?: string | null
    videoHeading?: string | null
    poster?: SanityImage
    flavours?: Array<{ name?: string | null; story?: string | null; ingredients?: string | null } | null> | null
    showVideo?: boolean | null
    showGift?: boolean | null
    showFlavours?: boolean | null
    seo?: CmsSeo
  } | null,
) {
  const videoUrl = clean(page?.videoUrl)
  const safeVideo = videoUrl && /^https:\/\//.test(videoUrl) ? videoUrl : undefined
  return {
    ...iceCreamFallback,
    flavours: flavours(page?.flavours),
    poster: photo(page?.poster),
    showFlavours: page?.showFlavours !== false,
    heroLead: text(page?.heroLead, iceCreamFallback.heroLead),
    heroAccent: text(page?.heroAccent, iceCreamFallback.heroAccent),
    introHeading: text(page?.introHeading, iceCreamFallback.introHeading),
    videoHeading: text(page?.videoHeading, iceCreamFallback.videoHeading),
    videoUrl: safeVideo,
    showVideo: page?.showVideo !== false,
    showGift: page?.showGift !== false,
    seo: seoFor(page?.seo, {
      title: iceCreamFallback.seoTitle,
      description: iceCreamFallback.seoDescription,
      path: ICE_CREAM_PATH,
    }),
  }
}

export function resolveGiftCard(
  page: {
    heroLead?: string | null
    heroAccent?: string | null
    intro?: string | null
    things?: Array<string | null> | null
    amounts?: Array<{ name?: string | null; description?: string | null } | null> | null
    gallery?: Array<SanityImage | null> | null
    showRainbow?: boolean | null
    showFeast?: boolean | null
    showThings?: boolean | null
    showGallery?: boolean | null
    seo?: CmsSeo
  } | null,
) {
  return {
    ...giftCardFallback,
    amounts: amounts(page?.amounts),
    gallery: photos(page?.gallery),
    showThings: page?.showThings !== false,
    showGallery: page?.showGallery !== false,
    heroLead: text(page?.heroLead, giftCardFallback.heroLead),
    heroAccent: text(page?.heroAccent, giftCardFallback.heroAccent),
    intro: text(page?.intro, giftCardFallback.intro),
    things: list(page?.things, giftCardFallback.things),
    showRainbow: page?.showRainbow !== false,
    showFeast: page?.showFeast !== false,
    seo: seoFor(page?.seo, {
      title: giftCardFallback.seoTitle,
      description: giftCardFallback.seoDescription,
      path: GIFT_CARD_PATH,
    }),
  }
}

export function resolveGlamping(
  page: {
    heroLead?: string | null
    heroAccent?: string | null
    intro?: string | null
    amenities?: Array<string | null> | null
    heroImage?: SanityImage
    gallery?: Array<SanityImage | null> | null
    showAddOns?: boolean | null
    showCancellation?: boolean | null
    showCheese?: boolean | null
    addOnsNote?: string | null
    cancellationNote?: string | null
    showAmenities?: boolean | null
    showInfo?: boolean | null
    seo?: CmsSeo
  } | null,
) {
  return {
    ...glampingFallback,
    heroImage: photo(page?.heroImage),
    gallery: photos(page?.gallery),
    addOnsNote: text(page?.addOnsNote, glampingFallback.addOnsNote),
    cancellationNote: text(page?.cancellationNote, glampingFallback.cancellationNote),
    showAmenities: page?.showAmenities !== false,
    showInfo: page?.showInfo !== false,
    heroLead: text(page?.heroLead, glampingFallback.heroLead),
    heroAccent: text(page?.heroAccent, glampingFallback.heroAccent),
    intro: text(page?.intro, glampingFallback.intro),
    amenities: list(page?.amenities, glampingFallback.amenities),
    showAddOns: page?.showAddOns !== false,
    showCancellation: page?.showCancellation !== false,
    showCheese: page?.showCheese !== false,
    seo: seoFor(page?.seo, {
      title: glampingFallback.seoTitle,
      description: glampingFallback.seoDescription,
      path: FARM_GLAMPING_PATH,
    }),
  }
}
