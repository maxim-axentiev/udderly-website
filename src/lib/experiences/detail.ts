import { cmsImageUrl, isSanityImage } from '@/lib/sanity/image'
import type {
  AnimalCardData,
  ExperiencePageData,
  PolicyContent,
  PortableTextContent,
  SanityImage,
  TestimonialItem,
} from '@/lib/sanity/types'

import { FEAST_ON, publicBookingUrl } from './approved-listing'
import type { HubImageKey } from './hub-page'

/**
 * Cancellation copy is shown only when the published query resolves a policy.
 * The three existing experience drafts strongly reference
 * drafts.policy-experience-cancellation. That policy stays hidden until it is
 * published and those references can resolve. This module does not weaken
 * those references or invent the Lovable cancellation bullets.
 */

export type DetailImageKey = HubImageKey | 'goat-icon-1' | 'goat-icon-2' | 'goat-icon-3'

export type DetailPicture = { src: string; alt: string }

export type ExperienceDetailModel = {
  titleLead: string
  titleAccent: string
  hero?: DetailPicture
  intro?: string
  introduction?: { lead: string; accent?: string }
  description?: PortableTextContent
  gallery: DetailPicture[]
  details: Array<{ label: string; value: string }>
  bookingUrl?: string
  bookingLabel: string
  practical?: { lead: string; accent?: string }
  tips: string[]
  visitorInfo?: PortableTextContent
  accessibilityInfo?: PortableTextContent
  cancellation?: NonNullable<PolicyContent>
  reviewsHeading: string
  reviews: Array<{ quote: string; name: string }>
  animalsIntro: string
  animals: Array<{ name: string; lines: string[]; image?: DetailPicture }>
  instructor?: { heading: string; paragraphs: string[]; image?: DetailPicture }
  welfare?: {
    lead: string
    accent?: string
    paragraphs: string[]
    policy?: NonNullable<PolicyContent>
    image?: DetailPicture
  }
  signature?: {
    kicker: string
    lead: string
    accent?: string
    paragraphs: string[]
    href?: string
    image?: DetailPicture
  }
  feast?: {
    kicker: string
    lead: string
    accent?: string
    paragraphs: string[]
    href?: string
    image?: DetailPicture
  }
  newsletter: { title: string; copy: string; unavailable: string }
  location: { headingLead: string; headingAccent: string; note: string }
  awardsTagline: string
}

const SEASON_LABELS: Record<string, string> = {
  yearRound: 'Year-round',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
}

const LOCAL_ALT: Record<DetailImageKey, string> = {
  hero: 'Visitors on the farm during an experience',
  goats: 'Goats crowding around a laughing visitor in the pasture',
  glamping: 'Farm glamping accommodation',
  training: 'A group gathered for a farm program',
  calves: 'Mini Highland calves in a sunny pasture',
  'ice-cream': 'Farm ice cream',
  'goat-cuddles': 'Guest cuddling a goat inside the barn',
  'highland-hero': 'Guest brushing a fluffy mini Highland cow',
  'highland-cta': 'Highland cattle on the farm',
  'alpaca-walk': 'Guest walking an alpaca along a farm path',
  'donkey-picnic': 'Miniature donkeys greeting guests at the fence',
  feast: 'FeastON Certified Local by the Culinary Tourism Alliance logo',
  'goat-icon-1': 'Curious brown and white goat looking straight at the camera',
  'goat-icon-2': 'Goat standing on a straw bale in the barn',
  'goat-icon-3': 'Fluffy goat kid being held in a visitor’s arms at golden hour',
}

const GOAT_GALLERY: DetailImageKey[] = ['goat-cuddles', 'goats', 'goat-icon-1', 'goat-icon-3']

const OSW_HREF = 'https://www.ontariosouthwest.com/'

const SHARED_NEWSLETTER = {
  title: 'The Udderly Update',
  copy: 'Sign up for our monthly email newsletter to be the first to know about special promotions, new experiences, farm & animal updates, and just ridiculous content that’ll make you gasp, ooh, aw, and woah!',
  unavailable: 'Newsletter signup is not available yet.',
}

const SHARED_LOCATION = {
  headingLead: 'Come find us.',
  headingAccent: 'We’re out here somewhere.',
  note: 'Roughly 30 minutes from Kitchener-Waterloo, past the part where your GPS gets confident.',
}

function clean(value: unknown, max = 800): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max || /^placeholder\b/i.test(trimmed)) return undefined
  return trimmed
}

function paragraphs(value: string | undefined): string[] {
  if (!value) return []
  return value.split(/\n+/).map((paragraph) => paragraph.trim()).filter((paragraph) => clean(paragraph))
}

function designedLines(value: string | undefined, lead: string, accent: string): { lead: string; accent?: string } {
  if (!value) return { lead, accent: accent || undefined }
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length >= 2) return { lead: lines[0], accent: lines.slice(1).join(' ') }
  const joined = `${lead} ${accent}`.replace(/\s+/g, ' ').trim()
  if (accent && value.replace(/\s+/g, ' ').trim() === joined) return { lead, accent }
  return { lead: value }
}

function titleLines(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: title.trim() }
  return { lead: words.slice(0, -1).join(' '), accent: words[words.length - 1] }
}

function picture(image: SanityImage | undefined, width: number): DetailPicture | undefined {
  if (!isSanityImage(image)) return undefined
  const src = cmsImageUrl(image, width)
  const alt = image.alt?.trim() ?? ''
  if (!src || !alt || /^placeholder\b/i.test(alt)) return undefined
  return { src, alt }
}

function localPicture(
  key: DetailImageKey | undefined,
  images: Partial<Record<DetailImageKey, string>>,
): DetailPicture | undefined {
  if (!key) return undefined
  const src = images[key]
  if (!src) return undefined
  return { src, alt: LOCAL_ALT[key] }
}

function speciesKey(slug: string): 'goat' | 'alpaca' | 'highland' | 'donkey' | undefined {
  if (slug.includes('goat')) return 'goat'
  if (slug.includes('alpaca')) return 'alpaca'
  if (slug.includes('highland')) return 'highland'
  if (slug.includes('donkey')) return 'donkey'
  return undefined
}

function speciesGallery(slug: string): DetailImageKey[] {
  const species = speciesKey(slug)
  if (species === 'goat') return GOAT_GALLERY
  if (species === 'alpaca') return ['alpaca-walk']
  if (species === 'highland') return ['highland-hero']
  if (species === 'donkey') return ['donkey-picnic']
  return []
}

function usablePortableText(value: PortableTextContent): PortableTextContent | undefined {
  if (!Array.isArray(value)) return undefined
  const blocks = value.filter((block) => {
    if (!block || typeof block !== 'object') return false
    const children = (block as { children?: Array<{ text?: string }> }).children
    if (!children?.length) return true
    const text = children.map((child) => child.text ?? '').join('').trim()
    return Boolean(text) && !/^placeholder\b/i.test(text)
  })
  return blocks.length ? blocks : undefined
}

function policyContent(policy: PolicyContent): NonNullable<PolicyContent> | undefined {
  if (!policy || policy.active === false || !usablePortableText(policy.content)) return undefined
  return policy
}

function reviewItems(items: TestimonialItem[] | null): ExperienceDetailModel['reviews'] {
  return (items ?? []).flatMap((item) => {
    const quote = clean(item.quote, 2000)
    const name = clean(item.guestName, 80)
    if (!quote || !name) return []
    return [{ quote, name }]
  })
}

function animalCards(
  animals: AnimalCardData[] | null,
): ExperienceDetailModel['animals'] {
  return (animals ?? []).flatMap((animal) => {
    const name = clean(animal.name, 80)
    if (!name) return []
    const lines = [clean(animal.shortIntro, 240), clean(animal.funFact, 240)].filter(
      (line): line is string => Boolean(line),
    )
    return [{ name, lines, image: picture(animal.profileImage, 1024) }]
  })
}

function detailFacts(experience: ExperiencePageData): ExperienceDetailModel['details'] {
  const season = clean(experience.seasonLabel, 80) ?? (experience.season ? SEASON_LABELS[experience.season] : undefined)
  const pairs: Array<[string, string | undefined]> = [
    ['Price', clean(experience.priceDisplay, 80)],
    ['Duration', clean(experience.duration, 80)],
    ['Capacity', clean(experience.groupSize, 80)],
    ['Age', clean(experience.ageGuidance, 80)],
    ['Season', season],
  ]
  return pairs.flatMap(([label, value]) => (value ? [{ label, value }] : []))
}

export function resolveExperienceDetail(
  experience: ExperiencePageData,
  images: Partial<Record<DetailImageKey, string>> = {},
): ExperienceDetailModel {
  const slug = experience.slug
  const localGallery = speciesGallery(slug).flatMap((key) => {
    const photo = localPicture(key, images)
    return photo ? [photo] : []
  })
  const cmsGallery = (experience.gallery ?? []).flatMap((image) => {
    const photo = picture(image, 1280)
    return photo ? [photo] : []
  })
  const gallery = cmsGallery.length ? cmsGallery : localGallery
  const hero = picture(experience.heroImage, 1920) ?? gallery[0]
  const title = titleLines(clean(experience.title, 120) ?? experience.title)
  const introduction = clean(experience.introductionHeading, 120)
  const practical = clean(experience.practicalHeading, 120)
  const instructorParagraphs = paragraphs(clean(experience.instructor?.body))
  const instructorHeading = clean(experience.instructor?.heading, 120)
  const feastEnabled = experience.feastOn?.enabled === true
  const signatureEnabled = experience.signatureExperience?.enabled === true
  const feastBody = paragraphs(clean(experience.feastOn?.body))
  const feastHeading = clean(experience.feastOn?.heading, 120)
  const signatureBody = paragraphs(clean(experience.signatureExperience?.body))
  const signatureHeading = clean(experience.signatureExperience?.heading, 120)
  const welfareParagraphs = paragraphs(clean(experience.welfareNote))
  const welfarePolicy = policyContent(experience.welfarePolicy)
  const welfareHeading = clean(experience.welfareHeading, 120)
  const cancellation = policyContent(experience.cancellationPolicy)

  return {
    titleLead: title.lead,
    titleAccent: title.accent,
    hero,
    intro: clean(experience.shortDescription, 300),
    introduction: introduction ? designedLines(introduction, introduction, '') : undefined,
    description: usablePortableText(experience.body),
    gallery,
    details: detailFacts(experience),
    bookingUrl: publicBookingUrl(experience.bookingUrl),
    bookingLabel: `Book ${clean(experience.title, 120) ?? experience.title}`,
    practical: practical ? designedLines(practical, practical, '') : undefined,
    tips: (experience.practicalTips ?? []).flatMap((tip) => {
      const value = clean(tip, 240)
      return value ? [value] : []
    }),
    visitorInfo: usablePortableText(experience.visitorInfo),
    accessibilityInfo: usablePortableText(experience.accessibilityInfo),
    cancellation,
    reviewsHeading: clean(experience.reviewsHeading, 120) ?? 'Reviews',
    reviews: reviewItems(experience.testimonials),
    animalsIntro: 'There are a lot more animals than this. These are a few of the personalities who might be part of your visit.',
    animals: animalCards(experience.animals),
    instructor: instructorHeading || instructorParagraphs.length
      ? {
          heading: instructorHeading ?? 'Your instructor',
          paragraphs: instructorParagraphs,
          image: picture(experience.instructor?.image, 1200),
        }
      : undefined,
    welfare: welfareParagraphs.length || welfarePolicy
      ? {
          ...(welfareHeading ? designedLines(welfareHeading, welfareHeading, '') : { lead: 'Animal care' }),
          paragraphs: welfareParagraphs,
          policy: welfarePolicy,
          image: speciesKey(slug) === 'goat' ? localPicture('goat-icon-2', images) : undefined,
        }
      : undefined,
    signature: signatureEnabled
      ? {
          kicker: clean(experience.signatureExperience?.kicker, 80) ?? "An Ontario's Southwest Signature Experience",
          ...(signatureHeading
            ? designedLines(signatureHeading, 'Officially', 'a big deal.')
            : { lead: 'Officially', accent: 'a big deal.' }),
          paragraphs: signatureBody,
          href: publicBookingUrl(experience.signatureExperience?.href) ?? OSW_HREF,
          image: picture(experience.signatureExperience?.image, 1080),
        }
      : undefined,
    feast: feastEnabled
      ? {
          kicker: clean(experience.feastOn?.kicker, 80) ?? FEAST_ON.kicker,
          ...(feastHeading
            ? designedLines(feastHeading, FEAST_ON.headingLead, FEAST_ON.headingAccent)
            : { lead: FEAST_ON.headingLead, accent: FEAST_ON.headingAccent }),
          paragraphs: feastBody.length ? feastBody : [...FEAST_ON.paragraphs],
          href: publicBookingUrl(experience.feastOn?.href) ?? FEAST_ON.href,
          image: localPicture('feast', images),
        }
      : undefined,
    newsletter: SHARED_NEWSLETTER,
    location: SHARED_LOCATION,
    awardsTagline: 'Top 10% of attractions worldwide by Tripadvisor.',
  }
}
