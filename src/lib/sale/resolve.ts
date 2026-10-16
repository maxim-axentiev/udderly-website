import {
  ALL_SALE_ANIMALS,
  FOR_SALE,
  SALE_PAGE,
  SALE_PREP,
  SOLD,
  salePath,
  type SaleAnimal,
} from './content'

export type PublishedListing = {
  title?: string | null
  slug?: string | null
  status?: string | null
  priceDisplay?: string | null
  personality?: string | null
  speciesTitle?: string | null
  birthHeight?: string | null
  birthWeight?: string | null
  birthDate?: string | null
  sex?: string | null
  genetics?: string | null
}

export type SaleCard = SaleAnimal & {
  href: string
  source: 'fallback' | 'sanity'
  priceDisplay?: string
  personality?: string
  speciesTitle?: string
  birthDate?: string
  birthHeight?: string
  birthWeight?: string
  sex?: string
  genetics?: string
  groupingNote?: string
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
  }
}

export function buildSaleLists(published: readonly PublishedListing[] = []): {
  available: SaleCard[]
  sold: SaleCard[]
  intro: string
} {
  const cards = ALL_SALE_ANIMALS.map((animal) => cardFrom(animal, published))
  return {
    available: cards.filter((card) => !card.sold),
    sold: cards.filter((card) => card.sold),
    intro: SALE_PAGE.intro,
  }
}

export function findSaleAnimal(slug: string, published: readonly PublishedListing[] = []): SaleCard | undefined {
  const animal = ALL_SALE_ANIMALS.find((entry) => entry.slug === slug)
  return animal ? cardFrom(animal, published) : undefined
}

export const lovableAvailableNames = FOR_SALE.map((animal) => animal.name)
export const lovableSoldNames = SOLD.map((animal) => animal.name)

function requiredText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

export type SalePageCopy = {
  source: 'fallback' | 'sanity'
  heroSupport: string
  intro: string
  soldIntro: string
  prep: ReadonlyArray<{ title: string; copy: string; imageKey?: string }>
  waitlistTitle: string
  waitlistCopy: string
  seoTitle: string
  seoDescription: string
}

export function resolveSalePageCopy(document: Record<string, unknown> | null): SalePageCopy {
  const fallback: SalePageCopy = {
    source: 'fallback',
    heroSupport: SALE_PAGE.heroSupport,
    intro: SALE_PAGE.intro,
    soldIntro: SALE_PAGE.soldIntro,
    prep: SALE_PREP,
    waitlistTitle: SALE_PAGE.waitlistTitle,
    waitlistCopy: SALE_PAGE.waitlistCopy,
    seoTitle: `${SALE_PAGE.title} | Udderly Ridiculous Farm Life`,
    seoDescription: SALE_PAGE.description,
  }
  if (!document) return fallback

  const heroSupport = requiredText(document.heroSupport, 300)
  const intro = requiredText(document.intro, 800)
  const soldIntro = requiredText(document.soldIntro, 160)
  const waitlistTitle = requiredText(document.waitlistTitle, 80)
  const waitlistCopy = requiredText(document.waitlistCopy, 400)
  const seoTitle = requiredText(document.seoTitle, 70)
  const seoDescription = requiredText(document.seoDescription, 200)
  const prepItems = Array.isArray(document.prepItems) ? document.prepItems : null
  const prep = prepItems
    ?.map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as { title?: unknown; copy?: unknown }
      const title = requiredText(record.title, 80)
      const copy = requiredText(record.copy, 500)
      return title && copy ? { title, copy } : null
    })
    .filter((item): item is { title: string; copy: string } => Boolean(item))

  if (!heroSupport || !intro || !soldIntro || !waitlistTitle || !waitlistCopy || !seoTitle || !seoDescription || !prep?.length) {
    return fallback
  }

  return {
    source: 'sanity',
    heroSupport,
    intro,
    soldIntro,
    prep,
    waitlistTitle,
    waitlistCopy,
    seoTitle,
    seoDescription,
  }
}
