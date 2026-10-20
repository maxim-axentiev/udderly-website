import { documentPath } from '@/lib/routes/paths'
import type { ExperienceCardData } from '@/lib/sanity/types'

import { publicExperienceSlug } from './public-paths'

export const EXPERIENCES_HERO = {
  headingLead: 'Udderly Ridiculous',
  headingAccent: 'Farm Experiences',
  supporting:
    'Award-Winning farm experiences with mini Highland cows, mini donkeys, mini goats, alpacas, and local food.',
  imageAlt:
    'A guest holding a fluffy Highland calf on the farm with other visitors in the background',
} as const

export const FEAST_ON = {
  kicker: 'Certified Local by FeastON',
  headingLead: 'We eat',
  headingAccent: 'and serve local.',
  paragraphs: [
    'FeastON officially verifies that a significant portion of our ingredients and products are sourced right here in Ontario. We only support local, Ontario-made products, and so far we have had the privilege of supporting more than 140 local producers through everything we serve, sell and celebrate on the farm.',
    'When you visit, you are not just meeting the animals — you are tasting the neighbourhood.',
  ],
  href: 'https://feaston.com/',
  imageAlt: 'FeastON Certified Local by the Culinary Tourism Alliance logo',
} as const

export const TOWER_OF_GOATS_PATH = '/tower-of-goats-discovery-trail'

/** Future launch redirect only. This path is not registered. */
export const TOWER_OF_GOATS_FUTURE_REDIRECT = {
  from: '/tower-of-goats',
  to: TOWER_OF_GOATS_PATH,
} as const

type ApprovedExperience = {
  name: string
  slug: string
  href?: never
}

type ApprovedPage = {
  name: string
  href: string
  slug?: never
}

export const APPROVED_EXPERIENCES = [
  { name: 'Goat Yoga', slug: 'goat-yoga' },
  { name: 'Goat Recess', slug: 'goat-recess' },
  { name: 'Goat Cuddles', slug: 'goat-cuddles' },
  { name: 'Baby Goat Playtime & Snuggles', slug: 'baby-goat-playtime-and-snuggles' },
  { name: 'Mini Highland Cow Experience', slug: 'mini-highland-cow-experience' },
  { name: 'Mini Highland Calf Meet & Greet', slug: 'mini-highland-calf-meet-and-greet' },
  { name: 'Alpaca Lunch Picnic', slug: 'alpaca-lunch-picnic' },
  { name: 'Alpaca Sunset Picnic', slug: 'alpaca-sunset-picnic' },
  { name: 'Alpaca Walks', slug: 'alpaca-walks' },
  {
    name: 'Alpaca Experience & Fibre Nesting Ball Workshop',
    slug: 'alpaca-experience-and-fibre-nesting-ball-workshop',
  },
  { name: 'Miniature Donkey Visits', slug: 'miniature-donkey-visits' },
  { name: 'Private Miniature Donkey Lunch Picnic', slug: 'private-miniature-donkey-lunch-picnic' },
  { name: 'Private Miniature Donkey Sunset Picnic', slug: 'private-miniature-donkey-sunset-picnic' },
  {
    name: 'General Admission – Tower of Goats Discovery Trail',
    href: TOWER_OF_GOATS_PATH,
  },
  { name: 'Taste of Farm Life', slug: 'taste-of-farm-life' },
  { name: 'Taste of Farm Life Family Friendly', slug: 'taste-of-farm-life-family-friendly' },
  { name: 'Farm Glamping', slug: 'farm-glamping' },
] as const satisfies readonly (ApprovedExperience | ApprovedPage)[]

export type ExperienceListingCard = {
  key: string
  name: string
  description?: string
  priceDisplay?: string
  duration?: string
  href?: string
  bookingUrl?: string
}

export function isFarmHoppingListing(input: {
  title?: string | null
  slug?: string | null
}): boolean {
  const title = input.title?.trim().toLowerCase() ?? ''
  const slug = input.slug?.trim().toLowerCase() ?? ''
  return title.includes('farm hopping') || slug.includes('farm-hopping')
}

const FAREHARBOR_SHORTNAME = 'udderlyridiculousfarmlife'

export type BookingSource = {
  bookingUrl?: string | null
  bookingVerified?: boolean | null
  bookingProvider?: string | null
  fareharborItemId?: string | null
  fareharborFlowId?: string | null
}

export type PublicBooking = {
  href?: string
  overlay: boolean
}

/**
 * A booking action is shown only after an editor marks that exact link verified.
 * FareHarbor item IDs are used only when the editor entered digits. This does
 * not invent an item ID or turn on a stored URL by itself.
 */
export function resolvePublicBooking(source: BookingSource | null | undefined): PublicBooking {
  if (source?.bookingVerified !== true) {
    return { overlay: false }
  }

  if (source.bookingProvider === 'fareharbor') {
    const itemId = source.fareharborItemId?.trim() ?? ''
    if (!/^\d{3,}$/.test(itemId)) {
      return { overlay: false }
    }
    const flow = source.fareharborFlowId?.trim() ?? ''
    const flowQuery = /^\d{3,}$/.test(flow) ? `&flow=${flow}` : ''
    return {
      href: `https://fareharbor.com/embeds/book/${FAREHARBOR_SHORTNAME}/items/${itemId}/?full-items=yes${flowQuery}`,
      overlay: true,
    }
  }

  const href = publicBookingUrl(source.bookingUrl)
  if (!href) {
    return { overlay: false }
  }

  return {
    href,
    overlay: href.startsWith('https://fareharbor.com/embeds/book/'),
  }
}

/** A booking action is allowed only for an absolute http(s) URL from Sanity. */
export function publicBookingUrl(url: string | null | undefined): string | undefined {
  const trimmed = url?.trim() ?? ''
  if (!trimmed || trimmed.startsWith('#')) {
    return undefined
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined
    }
    return trimmed
  } catch {
    return undefined
  }
}

function optionalText(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim() ?? ''
  return trimmed || undefined
}

export function buildApprovedExperienceListing(
  published: readonly ExperienceCardData[],
): ExperienceListingCard[] {
  const available = published.filter(
    (card) => card.title?.trim() && card.slug?.trim() && !isFarmHoppingListing(card),
  )
  const used = new Set<string>()

  const approved = APPROVED_EXPERIENCES.map((entry) => {
    if ('href' in entry) {
      return {
        key: entry.href,
        name: entry.name,
        href: entry.href,
      }
    }

    const match = available.find((card) => card.slug === entry.slug)
    if (match) {
      used.add(match._id)
    }

    return {
      key: match?._id ?? entry.slug,
      name: match?.title.trim() || entry.name,
      description: optionalText(match?.shortDescription),
      priceDisplay: optionalText(match?.priceDisplay),
      duration: optionalText(match?.duration),
      href: match ? documentPath('experience', publicExperienceSlug(match.slug)) : undefined,
      bookingUrl: match ? resolvePublicBooking(match).href : undefined,
    }
  })

  const extras = available
    .filter((card) => !used.has(card._id))
    .map((card) => ({
      key: card._id,
      name: card.title.trim(),
      description: optionalText(card.shortDescription),
      priceDisplay: optionalText(card.priceDisplay),
      duration: optionalText(card.duration),
      href: documentPath('experience', publicExperienceSlug(card.slug)),
      bookingUrl: resolvePublicBooking(card).href,
    }))

  return [...approved, ...extras]
}
