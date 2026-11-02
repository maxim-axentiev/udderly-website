import { cmsImageUrl } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

import {
  ADOPTION_ANIMALS,
  ADOPT_PAGE,
  adoptionPath,
  type AdoptionAnimal,
} from './content'

export type PresentationImage = { src: string; alt: string }

export type AdoptionPackageView = {
  name: string
  kicker: string
  subtitle: string
  price: string
  items: readonly string[]
  checkoutUrl?: string
}

export type PublishedAdoption = {
  title?: string | null
  slug?: string | null
  introduction?: string | null
  availability?: string | null
  sortOrder?: number | null
  active?: boolean | null
  speciesTitle?: string | null
  tagline?: string | null
  storyParagraphs?: string[] | null
  supportParagraphs?: string[] | null
  termsItems?: string[] | null
  cardImage?: SanityImage
  galleryOverride?: SanityImage[] | null
  packages?: Array<{
    name?: string | null
    kicker?: string | null
    subtitle?: string | null
    priceDisplay?: string | null
    includes?: string[] | null
    checkoutUrl?: string | null
  }> | null
  seo?: { title?: string | null; description?: string | null } | null
}

export function checkoutHref(url: string | null | undefined): string | undefined {
  const trimmed = url?.trim() ?? ''
  if (!trimmed) return undefined
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined
    return trimmed
  } catch {
    return undefined
  }
}

export function presentationImage(
  image: SanityImage | null | undefined,
  width: number,
): PresentationImage | undefined {
  if (!image) return undefined
  const src = cmsImageUrl(image, width)
  const alt = image.alt?.trim() ?? ''
  if (!src || !alt) return undefined
  return { src, alt }
}

export type AdoptionCard = Omit<AdoptionAnimal, 'imageKey'> & {
  imageKey?: AdoptionAnimal['imageKey']
  href: string
  blurb: string
  source: 'fallback' | 'sanity'
  speciesNote?: string
  portrait?: PresentationImage
}

export type CollectionOptions = { manageCollection?: boolean }

const PUBLIC_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SEO_TITLE_MAX = 120

function knownAdoption(slug: string): AdoptionAnimal | undefined {
  return ADOPTION_ANIMALS.find((animal) => animal.slug === slug)
}

function byOrder(left: { sortOrder?: number | null; title?: string | null }, right: { sortOrder?: number | null; title?: string | null }) {
  const leftOrder = typeof left.sortOrder === 'number' ? left.sortOrder : Number.MAX_SAFE_INTEGER
  const rightOrder = typeof right.sortOrder === 'number' ? right.sortOrder : Number.MAX_SAFE_INTEGER
  if (leftOrder !== rightOrder) return leftOrder - rightOrder
  return (left.title ?? '').localeCompare(right.title ?? '', 'en')
}

function visibleOfferings(published: readonly PublishedAdoption[]): PublishedAdoption[] {
  const seen = new Set<string>()
  return [...published].sort(byOrder).flatMap((entry) => {
    if (entry.active === false || entry.availability === 'unavailable') return []
    const slug = entry.slug?.trim() ?? ''
    const known = knownAdoption(slug)
    const title = entry.title?.trim() || known?.name || ''
    if (!slug || !PUBLIC_SLUG.test(slug) || !title || seen.has(slug)) return []
    seen.add(slug)
    return [{ ...entry, slug, title }]
  })
}

function cardFromOffering(entry: PublishedAdoption): AdoptionCard {
  const slug = entry.slug?.trim() ?? ''
  const known = knownAdoption(slug)
  const name = entry.title?.trim() || known?.name || ''
  const introduction = entry.introduction?.trim()
  const tagline = entry.tagline?.trim()
  return {
    name,
    slug,
    alt: entry.cardImage?.alt?.trim() || name,
    tagline: tagline && !/^placeholder\b/i.test(tagline) ? tagline : '',
    showGold: false,
    href: adoptionPath(slug),
    blurb: introduction && !/^placeholder\b/i.test(introduction) ? introduction : '',
    source: 'sanity',
    portrait: presentationImage(entry.cardImage, 1024),
  }
}

export function buildAdoptionCards(
  published: readonly PublishedAdoption[] = [],
  options: CollectionOptions = {},
): AdoptionCard[] {
  void options
  return visibleOfferings(published).map(cardFromOffering)
}

export function findAdoptionAnimal(
  slug: string,
  published: readonly PublishedAdoption[] = [],
  manageCollection = false,
): AdoptionCard | undefined {
  void manageCollection
  const match = visibleOfferings(published).find((entry) => entry.slug === slug)
  return match ? cardFromOffering(match) : undefined
}

function requiredText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

function requiredParagraphs(value: unknown, maxItems: number): string[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > maxItems) return null
  const paragraphs = value.map((item) => (typeof item === 'string' ? item.trim() : ''))
  if (paragraphs.some((item) => !item || item.length > 800)) return null
  return paragraphs
}

export type AdoptionPageCopy = {
  source: 'fallback' | 'sanity'
  seoSource: 'fallback' | 'sanity'
  heroLead: string
  heroAccent: string
  intro: string
  heroImage?: PresentationImage
  awardsTitle: string
  awardsTagline: string
  awardImages: PresentationImage[]
  sponsorLead: string
  sponsorAccent: string
  sponsorParagraphs: readonly string[]
  sponsorNote: string
  sponsorImage?: PresentationImage
  animalsHeading: string
  animalsIntro: string
  learnMoreLabel: string
  adoptButtonLabel: string
  supportLead: string
  supportAccent: string
  supportParagraphs: readonly string[]
  supportButton: string
  supportButtonHref: string
  supportImage?: PresentationImage
  meetLead: string
  packageLead: string
  packageAccent: string
  packageIntroGold: string
  packageIntroSingle: string
  finePrintLead: string
  finePrintAccent: string
  detailSupportLead: string
  detailSupportAccent: string
  seoTitle: string
  seoDescription: string
}

const SEO_DESCRIPTION_MAX = 320

function fallbackAdoptionCopy(): AdoptionPageCopy {
  return {
    source: 'fallback',
    seoSource: 'fallback',
    heroLead: ADOPT_PAGE.heroLead,
    heroAccent: ADOPT_PAGE.heroAccent,
    intro: ADOPT_PAGE.intro,
    awardsTitle: ADOPT_PAGE.awardsTitle,
    awardsTagline: ADOPT_PAGE.awardsTagline,
    awardImages: [],
    sponsorLead: ADOPT_PAGE.sponsorLead,
    sponsorAccent: ADOPT_PAGE.sponsorAccent,
    sponsorParagraphs: ADOPT_PAGE.sponsorParagraphs,
    sponsorNote: ADOPT_PAGE.sponsorNote,
    animalsHeading: ADOPT_PAGE.animalsHeading,
    animalsIntro: ADOPT_PAGE.animalsIntro,
    learnMoreLabel: ADOPT_PAGE.learnMoreLabel,
    adoptButtonLabel: ADOPT_PAGE.adoptButtonLabel,
    supportLead: ADOPT_PAGE.supportLead,
    supportAccent: ADOPT_PAGE.supportAccent,
    supportParagraphs: ADOPT_PAGE.supportParagraphs,
    supportButton: ADOPT_PAGE.supportButton,
    supportButtonHref: ADOPT_PAGE.supportButtonHref,
    meetLead: ADOPT_PAGE.meetLead,
    packageLead: ADOPT_PAGE.packageLead,
    packageAccent: ADOPT_PAGE.packageAccent,
    packageIntroGold: ADOPT_PAGE.packageIntroGold,
    packageIntroSingle: ADOPT_PAGE.packageIntroSingle,
    finePrintLead: ADOPT_PAGE.finePrintLead,
    finePrintAccent: ADOPT_PAGE.finePrintAccent,
    detailSupportLead: ADOPT_PAGE.detailSupportLead,
    detailSupportAccent: ADOPT_PAGE.detailSupportAccent,
    seoTitle: `${ADOPT_PAGE.title} | Udderly Ridiculous Farm Life`,
    seoDescription: ADOPT_PAGE.intro,
  }
}

function publicHref(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.trim()) return fallback
  const href = value.trim()
  if (href.startsWith('#') && href.length > 1 && !/\s/.test(href)) return href
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return href
  return checkoutHref(href) ?? fallback
}

function imageList(value: unknown, width: number, max: number): PresentationImage[] {
  if (!Array.isArray(value)) return []
  return value
    .slice(0, max)
    .map((item) => presentationImage(item as SanityImage, width))
    .filter((item): item is PresentationImage => Boolean(item))
}

export function fillName(template: string, name: string): string {
  return template.replaceAll('{name}', name)
}

export function resolveAdoptionPageCopy(document: Record<string, unknown> | null): AdoptionPageCopy {
  const fallback = fallbackAdoptionCopy()
  if (!document) return fallback

  const seoTitle = requiredText(document.seoTitle, 70)
  const seoDescription = requiredText(document.seoDescription, SEO_DESCRIPTION_MAX)
  const seo = seoTitle && seoDescription
    ? { seoSource: 'sanity' as const, seoTitle, seoDescription }
    : { seoSource: 'fallback' as const, seoTitle: fallback.seoTitle, seoDescription: fallback.seoDescription }

  const heroLead = requiredText(document.heroLead, 40)
  const heroAccent = requiredText(document.heroAccent, 40)
  const intro = requiredText(document.heroIntro, 500)
  const awardsTitle = requiredText(document.awardsTitle, 80)
  const awardsTagline = requiredText(document.awardsTagline, 120)
  const sponsorLead = requiredText(document.sponsorLead, 40)
  const sponsorAccent = requiredText(document.sponsorAccent, 40)
  const sponsorParagraphs = requiredParagraphs(document.sponsorParagraphs, 4)
  const sponsorNote = requiredText(document.sponsorNote, 120)
  const animalsHeading = requiredText(document.animalsHeading, 80)
  const animalsIntro = requiredText(document.animalsIntro, 300)
  const learnMoreLabel = requiredText(document.learnMoreLabel, 40)
  const adoptButtonLabel = requiredText(document.adoptButtonLabel, 40)
  const supportLead = requiredText(document.supportLead, 40)
  const supportAccent = requiredText(document.supportAccent, 40)
  const supportParagraphs = requiredParagraphs(document.supportParagraphs, 4)
  const supportButton = requiredText(document.supportButtonLabel, 80)
  const meetLead = requiredText(document.meetLead, 40)
  const packageLead = requiredText(document.packageLead, 40)
  const packageAccent = requiredText(document.packageAccent, 40)
  const packageIntroGold = requiredText(document.packageIntroGold, 160)
  const packageIntroSingle = requiredText(document.packageIntroSingle, 160)
  const finePrintLead = requiredText(document.finePrintLead, 40)
  const finePrintAccent = requiredText(document.finePrintAccent, 40)
  const detailSupportLead = requiredText(document.detailSupportLead, 40)
  const detailSupportAccent = requiredText(document.detailSupportAccent, 80)

  if (
    !heroLead || !heroAccent || !intro || !awardsTitle || !awardsTagline || !sponsorLead || !sponsorAccent ||
    !sponsorParagraphs || !sponsorNote || !animalsHeading || !animalsIntro || !learnMoreLabel || !adoptButtonLabel ||
    !supportLead || !supportAccent || !supportParagraphs || !supportButton || !meetLead || !packageLead ||
    !packageAccent || !packageIntroGold || !packageIntroSingle || !finePrintLead || !finePrintAccent ||
    !detailSupportLead || !detailSupportAccent
  ) {
    return { ...fallback, ...seo }
  }

  return {
    source: 'sanity',
    ...seo,
    heroLead,
    heroAccent,
    intro,
    heroImage: presentationImage(document.heroImage as SanityImage, 1920),
    awardsTitle,
    awardsTagline,
    awardImages: imageList(document.awardImages, 400, 8),
    sponsorLead,
    sponsorAccent,
    sponsorParagraphs,
    sponsorNote,
    sponsorImage: presentationImage(document.sponsorImage as SanityImage, 1024),
    animalsHeading,
    animalsIntro,
    learnMoreLabel,
    adoptButtonLabel,
    supportLead,
    supportAccent,
    supportParagraphs,
    supportButton,
    supportButtonHref: publicHref(document.supportButtonHref, ADOPT_PAGE.supportButtonHref),
    supportImage: presentationImage(document.supportImage as SanityImage, 1024),
    meetLead,
    packageLead,
    packageAccent,
    packageIntroGold,
    packageIntroSingle,
    finePrintLead,
    finePrintAccent,
    detailSupportLead,
    detailSupportAccent,
  }
}

export type AdoptionDetail = {
  tagline: string
  story: readonly string[]
  support: readonly string[]
  terms: readonly string[]
  packages: readonly AdoptionPackageView[]
  gallery: readonly PresentationImage[]
  seoTitle?: string
  seoDescription?: string
}

function publishedPackages(packages: PublishedAdoption['packages']): AdoptionPackageView[] | null {
  if (!packages?.length) return null
  const views = packages.flatMap((item) => {
    const name = item.name?.trim() ?? ''
    const price = item.priceDisplay?.trim() ?? ''
    const items = (item.includes ?? []).map((entry) => entry.trim()).filter((entry) => entry && !/^placeholder\b/i.test(entry))
    const checkoutUrl = checkoutHref(item.checkoutUrl)
    if (
      !name || name.length > 40 || !price || price.length > 40 || /^placeholder\b/i.test(price) || price === '$X,XXX' ||
      items.length < 1 || !checkoutUrl
    ) return []
    return [{
      name,
      kicker: item.kicker?.trim() || name,
      subtitle: item.subtitle?.trim() || '',
      price,
      items,
      checkoutUrl,
    }]
  })
  return views.length ? views : null
}

function publishedParagraphs(
  value: string[] | null | undefined,
  maxItems: number,
  maxLength = 800,
): string[] | null {
  if (!value?.length || value.length > maxItems) return null
  const paragraphs = value.map((item) => item.trim())
  if (paragraphs.some((item) => !item || item.length > maxLength)) return null
  const approved = paragraphs.filter((item) => !/^placeholder\b/i.test(item))
  return approved.length ? approved : null
}

export function resolveAdoptionDetail(
  animal: { name: string; slug: string; tagline: string; showGold: boolean },
  published: readonly PublishedAdoption[] = [],
): AdoptionDetail {
  const match = published.find((entry) => entry.slug?.trim() === animal.slug)
  const tagline = match?.tagline?.trim()
  const seoTitle = match?.seo?.title?.trim()
  const seoDescription = match?.seo?.description?.trim()
  return {
    tagline: tagline && tagline.length <= 80 && !/^placeholder\b/i.test(tagline) ? tagline : '',
    story: publishedParagraphs(match?.storyParagraphs, 4) ?? [],
    support: publishedParagraphs(match?.supportParagraphs, 4) ?? [],
    terms: publishedParagraphs(match?.termsItems, 8, 300) ?? [],
    packages: publishedPackages(match?.packages) ?? [],
    gallery: imageList(match?.galleryOverride, 1024, 6),
    seoTitle: seoTitle && seoTitle.length <= SEO_TITLE_MAX ? seoTitle : undefined,
    seoDescription: seoDescription && seoDescription.length <= SEO_DESCRIPTION_MAX ? seoDescription : undefined,
  }
}
