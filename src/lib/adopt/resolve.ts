import { cmsImageUrl } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

import {
  ADOPTION_ANIMALS,
  ADOPT_PAGE,
  GOLD_PRICE,
  SILVER_PRICE,
  adoptionPath,
  adoptionStory,
  adoptionSupportCopy,
  goldItems,
  importantInfo,
  silverItems,
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

export type AdoptionCard = AdoptionAnimal & {
  href: string
  blurb: string
  source: 'fallback' | 'sanity'
  speciesNote?: string
  portrait?: PresentationImage
}

const CLARA_SPECIES = 'Mini Highland cow'

export function buildAdoptionCards(
  published: readonly PublishedAdoption[] = [],
): AdoptionCard[] {
  return ADOPTION_ANIMALS.map((animal) => {
    const match = published.find((entry) => entry.slug?.trim() === animal.slug)
    const introduction = match?.introduction?.trim()
    const species = match?.speciesTitle?.trim()
    const speciesNote =
      animal.slug === 'clara' && species && !/highland/i.test(species)
        ? `${animal.name} is a ${CLARA_SPECIES}. Published species “${species}” is not used on this card.`
        : undefined

    return {
      ...animal,
      href: adoptionPath(animal.slug),
      blurb: introduction || ADOPT_PAGE.cardBlurb,
      source: introduction ? 'sanity' : 'fallback',
      speciesNote,
      portrait: presentationImage(match?.cardImage, 1024),
    }
  })
}

export function findAdoptionAnimal(slug: string): AdoptionAnimal | undefined {
  return ADOPTION_ANIMALS.find((animal) => animal.slug === slug)
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

function localPackages(animal: AdoptionAnimal): AdoptionPackageView[] {
  const silver: AdoptionPackageView = {
    name: 'Silver',
    kicker: 'Silver Pail',
    subtitle: 'The classic farm supporter.',
    price: SILVER_PRICE,
    items: silverItems(animal.name),
  }
  if (!animal.showGold) return [silver]
  return [
    silver,
    {
      name: 'Gold',
      kicker: 'Gold Hay Bale',
      subtitle: 'The royal treatment.',
      price: GOLD_PRICE,
      items: goldItems(animal.name),
    },
  ]
}

function publishedPackages(packages: PublishedAdoption['packages']): AdoptionPackageView[] | null {
  if (!packages?.length) return null
  const views = packages.flatMap((item) => {
    const name = item.name?.trim() ?? ''
    const price = item.priceDisplay?.trim() ?? ''
    const items = (item.includes ?? []).map((entry) => entry.trim()).filter(Boolean)
    if (!name || name.length > 40 || !price || price.length > 40 || items.length < 1) return []
    return [{
      name,
      kicker: item.kicker?.trim() || name,
      subtitle: item.subtitle?.trim() || '',
      price,
      items,
      checkoutUrl: checkoutHref(item.checkoutUrl),
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
  return paragraphs
}

export function resolveAdoptionDetail(
  animal: AdoptionAnimal,
  published: readonly PublishedAdoption[] = [],
): AdoptionDetail {
  const match = published.find((entry) => entry.slug?.trim() === animal.slug)
  const tagline = match?.tagline?.trim()
  const seoTitle = match?.seo?.title?.trim()
  const seoDescription = match?.seo?.description?.trim()
  return {
    tagline: tagline && tagline.length <= 80 ? tagline : animal.tagline,
    story: publishedParagraphs(match?.storyParagraphs, 4) ?? adoptionStory(animal.name),
    support: publishedParagraphs(match?.supportParagraphs, 4) ?? adoptionSupportCopy(animal.name),
    terms: publishedParagraphs(match?.termsItems, 8, 300) ?? importantInfo(animal.name),
    packages: publishedPackages(match?.packages) ?? localPackages(animal),
    gallery: imageList(match?.galleryOverride, 1024, 6),
    seoTitle: seoTitle && seoTitle.length <= 70 ? seoTitle : undefined,
    seoDescription: seoDescription && seoDescription.length <= SEO_DESCRIPTION_MAX ? seoDescription : undefined,
  }
}
