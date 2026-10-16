import {
  ADOPTION_ANIMALS,
  ADOPT_PAGE,
  adoptionPath,
  type AdoptionAnimal,
} from './content'

export type PublishedAdoption = {
  title?: string | null
  slug?: string | null
  introduction?: string | null
  availability?: string | null
  speciesTitle?: string | null
}

export type AdoptionCard = AdoptionAnimal & {
  href: string
  blurb: string
  source: 'fallback' | 'sanity'
  speciesNote?: string
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
  intro: string
  awardsTagline: string
  sponsorParagraphs: readonly string[]
  animalsIntro: string
  supportParagraphs: readonly string[]
  seoTitle: string
  seoDescription: string
}

export function resolveAdoptionPageCopy(document: Record<string, unknown> | null): AdoptionPageCopy {
  const fallback: AdoptionPageCopy = {
    source: 'fallback',
    intro: ADOPT_PAGE.intro,
    awardsTagline: ADOPT_PAGE.awardsTagline,
    sponsorParagraphs: ADOPT_PAGE.sponsorParagraphs,
    animalsIntro: ADOPT_PAGE.animalsIntro,
    supportParagraphs: ADOPT_PAGE.supportParagraphs,
    seoTitle: `${ADOPT_PAGE.title} | Udderly Ridiculous Farm Life`,
    seoDescription: ADOPT_PAGE.intro,
  }
  if (!document) return fallback

  const intro = requiredText(document.heroIntro, 500)
  const awardsTagline = requiredText(document.awardsTagline, 120)
  const sponsorParagraphs = requiredParagraphs(document.sponsorParagraphs, 4)
  const animalsIntro = requiredText(document.animalsIntro, 300)
  const supportParagraphs = requiredParagraphs(document.supportParagraphs, 4)
  const seoTitle = requiredText(document.seoTitle, 70)
  const seoDescription = requiredText(document.seoDescription, 200)
  if (!intro || !awardsTagline || !sponsorParagraphs || !animalsIntro || !supportParagraphs || !seoTitle || !seoDescription) {
    return fallback
  }

  return {
    source: 'sanity',
    intro,
    awardsTagline,
    sponsorParagraphs,
    animalsIntro,
    supportParagraphs,
    seoTitle,
    seoDescription,
  }
}
