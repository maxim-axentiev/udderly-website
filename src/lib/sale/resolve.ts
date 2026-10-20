import { cmsImageUrl } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

import {
  ALL_SALE_ANIMALS,
  FOR_SALE,
  SALE_PAGE,
  SALE_PREP,
  SOLD,
  salePath,
  type SaleAnimal,
  type SaleSpecies,
} from './content'

export type PresentationImage = { src: string; alt: string }

function presentationImage(image: SanityImage | null | undefined, width: number): PresentationImage | undefined {
  if (!image) return undefined
  const src = cmsImageUrl(image, width)
  const alt = image.alt?.trim() ?? ''
  if (!src || !alt) return undefined
  return { src, alt }
}

export type PublishedListing = {
  title?: string | null
  slug?: string | null
  status?: string | null
  sortOrder?: number | null
  active?: boolean | null
  detailsProfile?: string | null
  priceDisplay?: string | null
  personality?: string | null
  groupDescription?: string | null
  speciesTitle?: string | null
  birthHeight?: string | null
  birthWeight?: string | null
  birthDate?: string | null
  sex?: string | null
  genetics?: string | null
  placementIntro?: string | null
  placementItems?: string[] | null
  parentDamName?: string | null
  parentDamHeight?: string | null
  parentSireName?: string | null
  parentSireHeight?: string | null
  images?: SanityImage[] | null
  sizeChart?: SanityImage
  seo?: { title?: string | null; description?: string | null } | null
}

export type SaleCard = Omit<SaleAnimal, 'imageKey' | 'species'> & {
  species: SaleSpecies | 'other'
  imageKey?: SaleAnimal['imageKey']
  href: string
  source: 'fallback' | 'sanity'
  priceDisplay?: string
  personality?: string
  groupDescription?: string
  speciesTitle?: string
  birthDate?: string
  birthHeight?: string
  birthWeight?: string
  sex?: string
  genetics?: string
  groupingNote?: string
  images: PresentationImage[]
  placementIntro?: string
  placementItems?: string[]
  parentDamName?: string
  parentDamHeight?: string
  parentSireName?: string
  parentSireHeight?: string
  sizeChart?: PresentationImage
  seoTitle?: string
  seoDescription?: string
}

const MOVABLE_STATUSES = new Set(['available', 'sold'])

function cardFrom(animal: SaleAnimal, published: readonly PublishedListing[]): SaleCard {
  const match = published.find((entry) => entry.slug?.trim() === animal.slug)
  const status = match?.status?.trim()
  let sold = animal.sold
  let groupingNote: string | undefined

  if (status && MOVABLE_STATUSES.has(status)) {
    const publishedSold = status === 'sold'
    if (publishedSold !== animal.sold) {
      sold = publishedSold
      groupingNote = `${animal.name} is shown as ${publishedSold ? 'sold' : 'available'} because the published listing says ${status}.`
    }
  } else if (status) {
    groupingNote = `${animal.name} stays in the Lovable ${animal.sold ? 'sold' : 'available'} group. Published status “${status}” is not an available/sold value.`
  }

  const personality = match?.personality?.trim() || undefined
  const priceDisplay = match?.priceDisplay?.trim() || undefined

  return {
    ...animal,
    sold,
    href: salePath(animal.slug),
    source: match ? 'sanity' : 'fallback',
    personality,
    priceDisplay,
    speciesTitle: match?.speciesTitle?.trim() || undefined,
    birthDate: match?.birthDate?.trim() || undefined,
    birthHeight: match?.birthHeight?.trim() || undefined,
    birthWeight: match?.birthWeight?.trim() || undefined,
    sex: match?.sex?.trim() || undefined,
    genetics: match?.genetics?.trim() || undefined,
    groupingNote,
    images: (match?.images ?? [])
      .map((image) => presentationImage(image, 1280))
      .filter((image): image is PresentationImage => Boolean(image)),
    placementIntro: optionalText(match?.placementIntro, 800),
    placementItems: optionalItems(match?.placementItems, 8, 500),
    parentDamName: optionalText(match?.parentDamName, 80),
    parentDamHeight: optionalText(match?.parentDamHeight, 40),
    parentSireName: optionalText(match?.parentSireName, 80),
    parentSireHeight: optionalText(match?.parentSireHeight, 40),
    sizeChart: presentationImage(match?.sizeChart, 1600),
    seoTitle: optionalText(match?.seo?.title, 120),
    groupDescription: optionalText(match?.groupDescription, 800),
    seoDescription: optionalText(match?.seo?.description, 320),
  }
}

function optionalText(value: string | null | undefined, max: number): string | undefined {
  const trimmed = value?.trim() ?? ''
  if (!trimmed || trimmed.length > max) return undefined
  return trimmed
}

function optionalItems(value: string[] | null | undefined, maxItems: number, maxLength: number): string[] | undefined {
  if (!value?.length || value.length > maxItems) return undefined
  const items = value.map((item) => item.trim())
  if (items.some((item) => !item || item.length > maxLength)) return undefined
  return items
}

const PUBLIC_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type CollectionOptions = { manageCollection?: boolean }

function knownSale(slug: string): SaleAnimal | undefined {
  return ALL_SALE_ANIMALS.find((animal) => animal.slug === slug)
}

function byOrder(left: PublishedListing, right: PublishedListing) {
  const leftOrder = typeof left.sortOrder === 'number' ? left.sortOrder : Number.MAX_SAFE_INTEGER
  const rightOrder = typeof right.sortOrder === 'number' ? right.sortOrder : Number.MAX_SAFE_INTEGER
  if (leftOrder !== rightOrder) return leftOrder - rightOrder
  return (left.title ?? '').localeCompare(right.title ?? '', 'en')
}

function listingSpecies(entry: PublishedListing, known: SaleAnimal | undefined): SaleSpecies | 'other' {
  if (entry.detailsProfile === 'cattle') return 'cow'
  const title = entry.speciesTitle?.trim() ?? ''
  if (/goat/i.test(title)) return 'goat'
  if (/alpaca/i.test(title)) return 'alpaca'
  if (/highland/i.test(title)) return 'cow'
  return known?.species ?? 'other'
}

function visibleListings(published: readonly PublishedListing[]): PublishedListing[] {
  const seen = new Set<string>()
  return [...published].sort(byOrder).flatMap((entry) => {
    if (entry.active === false) return []
    const slug = entry.slug?.trim() ?? ''
    const known = knownSale(slug)
    const title = entry.title?.trim() || known?.name || ''
    if (!slug || !PUBLIC_SLUG.test(slug) || !title || seen.has(slug)) return []
    seen.add(slug)
    return [{ ...entry, slug, title }]
  })
}

function listingToCard(entry: PublishedListing): SaleCard {
  const slug = entry.slug?.trim() ?? ''
  const known = knownSale(slug)
  const name = entry.title?.trim() || known?.name || ''
  const status = entry.status?.trim()
  let sold = known?.sold ?? false
  let groupingNote: string | undefined
  if (status === 'sold' || status === 'available') {
    sold = status === 'sold'
    if (known && sold !== known.sold) {
      groupingNote = `${name} is shown as ${sold ? 'sold' : 'available'} because the published listing says ${status}.`
    }
  } else if (status) {
    sold = false
    groupingNote = `${name} is listed with the available animals. Published status “${status}” is not an available/sold value.`
  }
  return {
    name,
    slug,
    species: listingSpecies(entry, known),
    sold,
    imageKey: known?.imageKey,
    href: salePath(slug),
    source: 'sanity',
    personality: entry.personality?.trim() || undefined,
    groupDescription: optionalText(entry.groupDescription, 800),
    priceDisplay: entry.priceDisplay?.trim() || undefined,
    speciesTitle: entry.speciesTitle?.trim() || undefined,
    birthDate: entry.birthDate?.trim() || undefined,
    birthHeight: entry.birthHeight?.trim() || undefined,
    birthWeight: entry.birthWeight?.trim() || undefined,
    sex: entry.sex?.trim() || undefined,
    genetics: entry.genetics?.trim() || undefined,
    groupingNote,
    images: (entry.images ?? [])
      .map((image) => presentationImage(image, 1280))
      .filter((image): image is PresentationImage => Boolean(image)),
    placementIntro: optionalText(entry.placementIntro, 800),
    placementItems: optionalItems(entry.placementItems, 8, 500),
    parentDamName: optionalText(entry.parentDamName, 80),
    parentDamHeight: optionalText(entry.parentDamHeight, 40),
    parentSireName: optionalText(entry.parentSireName, 80),
    parentSireHeight: optionalText(entry.parentSireHeight, 40),
    sizeChart: presentationImage(entry.sizeChart, 1600),
    seoTitle: optionalText(entry.seo?.title, 120),
    seoDescription: optionalText(entry.seo?.description, 320),
  }
}

export function buildSaleLists(
  published: readonly PublishedListing[] = [],
  options: CollectionOptions = {},
): {
  available: SaleCard[]
  sold: SaleCard[]
  intro: string
} {
  const cards = published.length === 0 && options.manageCollection !== true
    ? ALL_SALE_ANIMALS.map((animal) => cardFrom(animal, published))
    : visibleListings(published).map(listingToCard)
  return {
    available: cards.filter((card) => !card.sold),
    sold: cards.filter((card) => card.sold),
    intro: SALE_PAGE.intro,
  }
}

export function findSaleAnimal(
  slug: string,
  published: readonly PublishedListing[] = [],
  manageCollection = false,
): SaleCard | undefined {
  if (published.length === 0 && !manageCollection) {
    const animal = knownSale(slug)
    return animal ? cardFrom(animal, published) : undefined
  }
  const match = visibleListings(published).find((entry) => entry.slug === slug)
  return match ? listingToCard(match) : undefined
}

export const lovableAvailableNames = FOR_SALE.map((animal) => animal.name)
export const lovableSoldNames = SOLD.map((animal) => animal.name)

function requiredText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

export type SalePrepItem = {
  title: string
  copy: string
  imageKey?: string
  image?: PresentationImage
}

export type SalePageCopy = {
  source: 'fallback' | 'sanity'
  seoSource: 'fallback' | 'sanity'
  heroLead: string
  heroAccent: string
  heroSupport: string
  heroImage?: PresentationImage
  introLead: string
  introAccent: string
  intro: string
  introImage?: PresentationImage
  introButton: string
  introButtonHref: string
  availableHeading: string
  soldLead: string
  soldAccent: string
  soldIntro: string
  prepHeading: string
  prep: readonly SalePrepItem[]
  learnMoreLabel: string
  waitlistTitle: string
  waitlistCopy: string
  detailWaitlistTitle: string
  detailWaitlistCopy: string
  contactButtonLabel: string
  buyButtonLabel: string
  contactHeading: string
  seoTitle: string
  seoDescription: string
}

function publicHref(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.trim()) return fallback
  const href = value.trim()
  if (href.startsWith('#') && href.length > 1 && !/\s/.test(href)) return href
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return href
  try {
    const parsed = new URL(href)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return href
  } catch {
    return fallback
  }
  return fallback
}

function fallbackSaleCopy(): SalePageCopy {
  return {
    source: 'fallback',
    seoSource: 'fallback',
    heroLead: SALE_PAGE.heroLead,
    heroAccent: SALE_PAGE.heroAccent,
    heroSupport: SALE_PAGE.heroSupport,
    introLead: SALE_PAGE.introLead,
    introAccent: SALE_PAGE.introAccent,
    intro: SALE_PAGE.intro,
    introButton: SALE_PAGE.introButton,
    introButtonHref: SALE_PAGE.introButtonHref,
    availableHeading: SALE_PAGE.availableHeading,
    soldLead: SALE_PAGE.soldLead,
    soldAccent: SALE_PAGE.soldAccent,
    soldIntro: SALE_PAGE.soldIntro,
    prepHeading: SALE_PAGE.prepHeading,
    prep: SALE_PREP,
    learnMoreLabel: SALE_PAGE.learnMoreLabel,
    waitlistTitle: SALE_PAGE.waitlistTitle,
    waitlistCopy: SALE_PAGE.waitlistCopy,
    detailWaitlistTitle: SALE_PAGE.detailWaitlistTitle,
    detailWaitlistCopy: SALE_PAGE.detailWaitlistCopy,
    contactButtonLabel: SALE_PAGE.contactButtonLabel,
    buyButtonLabel: SALE_PAGE.buyButtonLabel,
    contactHeading: SALE_PAGE.contactHeading,
    seoTitle: `${SALE_PAGE.title} | Udderly Ridiculous Farm Life`,
    seoDescription: SALE_PAGE.description,
  }
}

export function resolveSalePageCopy(document: Record<string, unknown> | null): SalePageCopy {
  const fallback = fallbackSaleCopy()
  if (!document) return fallback

  const seoTitle = requiredText(document.seoTitle, 70)
  const seoDescription = requiredText(document.seoDescription, 320)
  const seo = seoTitle && seoDescription
    ? { seoSource: 'sanity' as const, seoTitle, seoDescription }
    : { seoSource: 'fallback' as const, seoTitle: fallback.seoTitle, seoDescription: fallback.seoDescription }

  const heroLead = requiredText(document.heroLead, 40)
  const heroAccent = requiredText(document.heroAccent, 40)
  const heroSupport = requiredText(document.heroSupport, 300)
  const introLead = requiredText(document.introLead, 40)
  const introAccent = requiredText(document.introAccent, 40)
  const intro = requiredText(document.intro, 800)
  const introButton = requiredText(document.introButtonLabel, 40)
  const availableHeading = requiredText(document.availableHeading, 80)
  const soldLead = requiredText(document.soldLead, 40)
  const soldAccent = requiredText(document.soldAccent, 40)
  const soldIntro = requiredText(document.soldIntro, 160)
  const prepHeading = requiredText(document.prepHeading, 80)
  const learnMoreLabel = requiredText(document.learnMoreLabel, 40)
  const waitlistTitle = requiredText(document.waitlistTitle, 80)
  const waitlistCopy = requiredText(document.waitlistCopy, 400)
  const detailWaitlistTitle = requiredText(document.detailWaitlistTitle, 120)
  const detailWaitlistCopy = requiredText(document.detailWaitlistCopy, 400)
  const contactButtonLabel = requiredText(document.contactButtonLabel, 40)
  const buyButtonLabel = requiredText(document.buyButtonLabel, 40)
  const contactHeading = requiredText(document.contactHeading, 80)
  const prepItems = Array.isArray(document.prepItems) ? document.prepItems : null
  const prep = prepItems
    ?.map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const record = item as { title?: unknown; copy?: unknown; image?: SanityImage }
      const title = requiredText(record.title, 80)
      const copy = requiredText(record.copy, 500)
      if (!title || !copy) return null
      const prepared: SalePrepItem = {
        title,
        copy,
        imageKey: SALE_PREP[index]?.imageKey,
        image: presentationImage(record.image, 1024),
      }
      return prepared
    })
    .filter((item): item is SalePrepItem => item !== null)

  if (
    !heroLead || !heroAccent || !heroSupport || !introLead || !introAccent || !intro || !introButton ||
    !availableHeading || !soldLead || !soldAccent || !soldIntro || !prepHeading || !learnMoreLabel ||
    !waitlistTitle || !waitlistCopy || !detailWaitlistTitle || !detailWaitlistCopy || !contactButtonLabel ||
    !buyButtonLabel || !contactHeading ||
    !prep?.length
  ) {
    return { ...fallback, ...seo }
  }

  return {
    source: 'sanity',
    ...seo,
    heroLead,
    heroAccent,
    heroSupport,
    heroImage: presentationImage(document.heroImage as SanityImage, 1920),
    introLead,
    introAccent,
    intro,
    introImage: presentationImage(document.introImage as SanityImage, 1280),
    introButton,
    introButtonHref: publicHref(document.introButtonHref, SALE_PAGE.introButtonHref),
    availableHeading,
    soldLead,
    soldAccent,
    soldIntro,
    prepHeading,
    prep,
    learnMoreLabel,
    waitlistTitle,
    waitlistCopy,
    detailWaitlistTitle,
    detailWaitlistCopy,
    contactButtonLabel,
    buyButtonLabel,
    contactHeading,
  }
}
