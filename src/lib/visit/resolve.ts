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

function approvedText(value: string | null | undefined) {
  const trimmed = clean(value)
  if (!trimmed || /^placeholder\b/i.test(trimmed)) return undefined
  return trimmed
}

function text(value: string | null | undefined, fallback: string) {
  return approvedText(value) ?? fallback
}

function publishedLines(value: Array<string | null> | null | undefined) {
  return (value ?? []).flatMap((item) => {
    const line = approvedText(item)
    return line ? [line] : []
  })
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

export type VisitImage = { src: string; alt: string }

function photos(images: Array<SanityImage | null> | null | undefined): VisitImage[] | undefined {
  const next = (images ?? []).flatMap((image) => {
    const src = cmsImageUrl(image ?? undefined, 1400)
    const alt = approvedText(image?.alt)
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
    const name = approvedText(item?.name)
    const story = approvedText(item?.story)
    if (!name || !story) return []
    return [{ name, story, ingredients: approvedText(item?.ingredients) ?? '' }]
  })
  return next.length ? next : undefined
}

export type GiftAmount = { name: string; description?: string }

function amounts(value: Array<{ name?: string | null; description?: string | null } | null> | null | undefined): GiftAmount[] {
  return (value ?? []).flatMap((item) => {
    const name = approvedText(item?.name)
    if (!name) return []
    return [{ name, description: approvedText(item?.description) }]
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
  const localParagraphs = publishedLines(page?.localParagraphs)
  const statValue = approvedText(page?.statValue)
  const statLabel = text(page?.statLabel, farmMarketFallback.statLabel)
  return {
    ...farmMarketFallback,
    localParagraphs: localParagraphs.length ? localParagraphs : farmMarketFallback.localParagraphs,
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
    statValue: statValue ?? '',
    statLabel,
    iceHeading: text(page?.iceHeading, farmMarketFallback.iceHeading),
    iceCopy: text(page?.iceCopy, farmMarketFallback.iceCopy),
    showStat: page?.showStat !== false && Boolean(statValue),
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
  const flavourList = flavours(page?.flavours)
  return {
    ...iceCreamFallback,
    flavours: flavourList,
    poster: photo(page?.poster),
    showFlavours: page?.showFlavours !== false && Boolean(flavourList?.length),
    heroLead: text(page?.heroLead, iceCreamFallback.heroLead),
    heroAccent: text(page?.heroAccent, iceCreamFallback.heroAccent),
    introHeading: text(page?.introHeading, iceCreamFallback.introHeading),
    videoHeading: text(page?.videoHeading, iceCreamFallback.videoHeading),
    videoUrl: safeVideo,
    showVideo: page?.showVideo !== false && Boolean(safeVideo),
    showGift: false,
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
  const things = publishedLines(page?.things)
  const gallery = photos(page?.gallery)
  return {
    ...giftCardFallback,
    amounts: amounts(page?.amounts),
    gallery,
    things,
    showThings: page?.showThings !== false && things.length > 0,
    showGallery: page?.showGallery !== false && Boolean(gallery?.length),
    heroLead: text(page?.heroLead, giftCardFallback.heroLead),
    heroAccent: text(page?.heroAccent, giftCardFallback.heroAccent),
    intro: text(page?.intro, giftCardFallback.intro),
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
    addOnsHeading?: string | null
    addOnsNote?: string | null
    addOns?: Array<{
      name?: string | null
      price?: string | null
      note?: string | null
      items?: Array<string | null> | null
    } | null> | null
    cancellationNote?: string | null
    cancellationTiers?: Array<{ when?: string | null; text?: string | null } | null> | null
    infoHeading?: string | null
    info?: Array<string | null> | null
    cheeseHeading?: string | null
    cheeseCopy?: string | null
    cheeseHref?: string | null
    showAmenities?: boolean | null
    showInfo?: boolean | null
    seo?: CmsSeo
  } | null,
) {
  const addOns = (page?.addOns ?? []).flatMap((item) => {
    const name = clean(item?.name)
    const price = clean(item?.price)
    if (!name || !price) return []
    const items = (item?.items ?? []).flatMap((line) => {
      const entry = clean(line)
      return entry ? [entry] : []
    })
    const note = clean(item?.note)
    return [{ name, price, ...(note ? { note } : {}), items }]
  })
  const cancellation = (page?.cancellationTiers ?? []).flatMap((item) => {
    const when = clean(item?.when)
    const tier = clean(item?.text)
    return when && tier ? [{ when, text: tier }] : []
  })
  const amenities = (page?.amenities ?? []).flatMap((item) => {
    const line = clean(item)
    return line ? [line] : []
  })
  const info = (page?.info ?? []).flatMap((item) => {
    const line = clean(item)
    return line ? [line] : []
  })
  const cheeseHref = clean(page?.cheeseHref)
  return {
    ...glampingFallback,
    heroImage: photo(page?.heroImage),
    gallery: photos(page?.gallery) ?? [],
    addOnsHeading: text(page?.addOnsHeading, glampingFallback.addOnsHeading),
    addOnsNote: clean(page?.addOnsNote) ?? '',
    addOns,
    cancellationNote: clean(page?.cancellationNote) ?? '',
    cancellation,
    infoHeading: text(page?.infoHeading, glampingFallback.infoHeading),
    info,
    cheeseHeading: text(page?.cheeseHeading, glampingFallback.cheeseHeading),
    cheeseCopy: text(page?.cheeseCopy, glampingFallback.cheeseCopy),
    cheeseHref: cheeseHref && /^https:\/\//.test(cheeseHref) ? cheeseHref : glampingFallback.cheeseHref,
    showAmenities: page?.showAmenities !== false && amenities.length > 0,
    showInfo: page?.showInfo !== false && info.length > 0,
    heroLead: text(page?.heroLead, glampingFallback.heroLead),
    heroAccent: text(page?.heroAccent, glampingFallback.heroAccent),
    intro: text(page?.intro, glampingFallback.intro),
    amenities,
    showAddOns: page?.showAddOns !== false && addOns.length > 0,
    showCancellation: page?.showCancellation !== false && cancellation.length > 0,
    showCheese: page?.showCheese !== false,
    seo: seoFor(page?.seo, {
      title: glampingFallback.seoTitle,
      description: glampingFallback.seoDescription,
      path: FARM_GLAMPING_PATH,
    }),
  }
}
