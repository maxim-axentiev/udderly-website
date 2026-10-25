import { cmsImageUrl } from '@/lib/sanity/image'
import type { ExperienceCardData, SanityImage } from '@/lib/sanity/types'

import {
  EXPERIENCES_HERO,
  FEAST_ON,
  TOWER_OF_GOATS_PATH,
  isFarmHoppingListing,
  publicBookingUrl,
  resolvePublicBooking,
  resolveVerifiedExternalBooking,
} from './approved-listing'
import { experienceSlugAliases, publicExperienceSlug } from './public-paths'

export type HubImageKey =
  | 'hero'
  | 'goats'
  | 'glamping'
  | 'training'
  | 'calves'
  | 'ice-cream'
  | 'goat-cuddles'
  | 'highland-hero'
  | 'highland-cta'
  | 'alpaca-walk'
  | 'donkey-picnic'
  | 'feast'

export type HubPicture = { src: string; alt: string }

type CmsImage = SanityImage

export type HubExperienceCard = {
  key: string
  title: string
  slug?: string
  description?: string
  season?: string
  age?: string
  badge?: 'limited' | 'signature'
  imageKey?: HubImageKey
  imageAlt?: string
  image?: HubPicture
  href?: string
  bookingUrl?: string
  bookingOverlay?: boolean
  bookingActions?: HubBookingAction[]
}

export type HubBookingAction = {
  label: string
  href: string
  overlay: boolean
}

export type HubCategory = {
  title: string
  note: string
  href: string
  imageKey?: HubImageKey
  image?: HubPicture
}

export type HubFeature = {
  key: string
  kicker?: string
  title: string
  copy?: string
  season?: string
  age?: string
  imageKey?: HubImageKey
  image?: HubPicture
  learnMoreHref?: string
  ctaLabel?: string
  ctaHref?: string
  limited?: boolean
}

export type HubStatement = {
  kicker: string
  heading: string
  headingAccent?: string
  paragraphs: string[]
  href?: string
  imageKey?: HubImageKey
  image?: HubPicture
  imageAlt: string
}

export type ExperiencesHubPageModel = {
  hero: {
    lead: string
    accent: string
    supporting: string
    imageAlt: string
    image?: HubPicture
  }
  chooser: { headingLead: string; headingAccent: string; note: string }
  categories: HubCategory[]
  experiencesHeading: string
  experiencesIntro: string
  cards: HubExperienceCard[]
  staysIntro: { kicker: string; heading: string; copy: string }
  stays: HubFeature[]
  giftsIntro: { headingLead: string; headingAccent: string; copy: string }
  gifts: HubFeature[]
  programsIntro: { headingLead: string; headingAccent: string; copy: string }
  programs: HubFeature[]
  rainbow: HubStatement
  feast: HubStatement
  newsletter: { title: string; copy: string; unavailable: string }
  location: { headingLead: string; headingAccent: string; note: string }
  emptyHeading: string
  emptyMessage: string
}

const PAGE_ANCHORS = new Set([
  '#categories',
  '#farm-experiences',
  '#farm-stays',
  '#gifts',
  '#for-businesses',
  '#reviews',
  '#rainbow-registered',
  '#feast-on',
  '#newsletter',
  '#location',
])

const INTERNAL_PATHS = new Set([
  '/',
  '/experiences',
  '/adopt-an-animal',
  '/animals-for-sale',
  TOWER_OF_GOATS_PATH,
  '/farm-market-store',
  '/ice-cream',
  '/gift-card',
  '/farm-glamping',
  '/corporate-training',
  '/corporate-training/team-building-experiences',
  '/corporate-training/experiential-tourism-development',
  '/corporate-training/disc-assessment',
  '/corporate-training/the-power-of-conversation',
  '/corporate-training/alpaca-emotional-intelligence',
  '/corporate-training/beyond-engagement',
  '/corporate-training/innovation-on-the-farm',
  '/our-story',
  '/vision-values',
  '/team',
  '/faq',
  '/urbort-blog',
  '/contact',
  '/newsletter',
  '/privacy-policy',
  '/terms-of-service',
  '/cookies-policy',
])

const lovableCards: HubExperienceCard[] = [
  card('Goat Yoga', 'goat-yoga', 'May to October', '16+', 'goat-cuddles', 'Goats climbing on guests during a farm yoga class'),
  card('Goat Recess', 'goat-recess', 'May to October', 'All ages', 'goats', 'Guest surrounded by playful goats in the pasture'),
  card('Goat Cuddles', 'goat-cuddles', 'November to April', 'All ages', 'goat-cuddles', 'Guest cuddling a goat inside the barn'),
  card('Baby Goat Playtime & Snuggles', 'baby-goat-playtime-and-snuggles', 'Select dates', 'All ages', 'goat-cuddles', 'Baby goats being cuddled by guests', 'limited'),
  card('Mini Highland Cow Experience', 'mini-highland-cow-experience', 'Year-round', '12+', 'highland-hero', 'Guest brushing a fluffy mini Highland cow'),
  card('Mini Highland Calf Meet & Greet', 'mini-highland-calf-meet-and-greet', 'Select dates', 'All ages', 'calves', 'Two mini Highland calves in a sunny pasture', 'limited'),
  card('Alpaca Lunch Picnic', 'alpaca-lunch-picnic', 'May to October', '16+', 'alpaca-walk', 'Alpacas beside a picnic table on the farm'),
  card('Alpaca Sunset Picnic', 'alpaca-sunset-picnic', 'May to October', '16+', 'highland-cta', 'Sunset over the farm pasture with animals grazing'),
  card('Alpaca Walks', 'alpaca-walks', 'May to October · November to April by request', '14+', 'alpaca-walk', 'Guest walking an alpaca along a farm path'),
  card('Alpaca Experience & Fibre Nesting Ball Workshop', 'alpaca-experience-and-fibre-nesting-ball-workshop', 'Year-round', '10+', 'alpaca-walk', 'Alpaca fibre being handled during a workshop'),
  card('Miniature Donkey Visits', 'miniature-donkey-visits', 'Year-round', '10+', 'donkey-picnic', 'Miniature donkeys greeting guests at the fence'),
  card('Private Miniature Donkey Lunch Picnic', 'private-miniature-donkey-lunch-picnic', 'May to October', '16+', 'donkey-picnic', 'Private picnic set up beside miniature donkeys'),
  card('Private Miniature Donkey Sunset Picnic', 'private-miniature-donkey-sunset-picnic', 'May to October', '16+', 'highland-cta', 'Sunset picnic setting on the farm'),
  {
    key: TOWER_OF_GOATS_PATH,
    title: 'General Admission – Tower of Goats Discovery Trail',
    season: 'May to October',
    age: 'All ages',
    imageKey: 'goats',
    imageAlt: 'Goats climbing the tower structure on the discovery trail',
    href: TOWER_OF_GOATS_PATH,
  },
  card('Taste of Farm Life', 'taste-of-farm-life', 'May to October', '16+', 'highland-hero', 'Guests enjoying a long farm tasting experience', 'signature'),
  card('Taste of Farm Life Family Friendly', 'taste-of-farm-life-family-friendly', 'May to October', 'All ages', 'training', 'Family enjoying food and animals under the farm shelter', 'signature'),
]

function card(
  title: string,
  slug: string,
  season: string,
  age: string,
  imageKey: HubImageKey,
  imageAlt: string,
  badge?: 'limited' | 'signature',
): HubExperienceCard {
  return { key: slug, title, slug, season, age, imageKey, imageAlt, badge }
}

const fallbackPage = {
  chooser: {
    headingLead: 'What are you',
    headingAccent: 'in the mood for?',
    note: 'Click on what you want. Magically teleport to it.',
  },
  experiencesHeading: 'Farm Experiences',
  categories: [
    { title: 'Farm Experiences', note: '16 ways to get licked', href: '#farm-experiences', imageKey: 'goats' as const },
    { title: 'Farm Stays & Packages', note: 'Sleep here, obviously', href: '#farm-stays', imageKey: 'glamping' as const },
    { title: 'Gifts', note: 'Better than socks', href: '#gifts', imageKey: 'ice-cream' as const },
    { title: 'For Businesses', note: 'Grown-up ridiculous', href: '#for-businesses', imageKey: 'training' as const },
  ],
  experiencesIntro:
    'Get up close with the animals who actually run this place. From Highland cows and goats to alpacas and miniature donkeys, these immersive experiences are designed for real connection, ridiculous memories, and a whole lot of personality.',
  staysIntro: {
    kicker: 'Stay a while',
    heading: 'Farm Stays & Packages',
    copy: 'Why leave after a few hours when you can stay right here? Spend the night on the farm or turn your visit into a full countryside getaway with animals, food, and experiences built right in.',
  },
  stays: [
    {
      key: 'farm-glamping',
      title: 'Farm Glamping',
      season: 'May to October',
      age: 'All ages',
      imageKey: 'glamping' as const,
      learnMoreHref: '/farm-glamping',
    },
  ] satisfies HubFeature[],
  giftsIntro: {
    headingLead: 'Give something',
    headingAccent: 'less boring.',
    copy: 'Skip the candles and socks. Give someone a ridiculous farm experience, or let them symbolically adopt one of the animals and support the care that keeps this place running.',
  },
  gifts: [
    {
      key: 'gift-card',
      kicker: 'Gift Card',
      title: 'A ridiculous day, wrapped',
      imageKey: 'ice-cream' as const,
      learnMoreHref: '/gift-card',
    },
    {
      key: 'adopt',
      kicker: 'Adopt an Animal',
      title: 'Symbolically theirs. Actually ours.',
      imageKey: 'goat-cuddles' as const,
      ctaLabel: 'Meet the Adoptable Animals',
      ctaHref: '/adopt-an-animal',
    },
  ] satisfies HubFeature[],
  programsIntro: {
    headingLead: 'Yes, we also do',
    headingAccent: 'grown-up stuff.',
    copy: 'The farm is ridiculous, but the work is serious. We help teams, leaders, and tourism businesses build stronger relationships, develop better experiences, and occasionally learn something useful from an alpaca.',
  },
  programs: [
    {
      key: 'corporate',
      title: 'Corporate Training & Team-Building',
      imageKey: 'training' as const,
      ctaLabel: 'Explore Corporate Programs',
      ctaHref: '/corporate-training',
    },
    {
      key: 'tourism',
      title: 'Experiential Tourism Development',
      imageKey: 'alpaca-walk' as const,
      ctaLabel: 'Explore Tourism Development',
      ctaHref: '/corporate-training/experiential-tourism-development',
    },
  ] satisfies HubFeature[],
  rainbow: {
    kicker: 'Proudly Rainbow Registered',
    heading: 'Everyone is',
    headingAccent: 'welcome here.',
    paragraphs: [
      'Udderly Ridiculous Farm Life is a Rainbow Registered business, which means we are committed to providing a welcoming, safe and inclusive environment for 2SLGBTQI+ visitors, families, employees and community members. Everybody gets the same warm welcome here, and the animals genuinely do not care who you are — they just want the brush.',
    ],
    href: 'https://www.rainbowregistered.com/',
    imageAlt: 'Rainbow Registered / Arc-en-ciel Officiel accreditation logo',
  },
  newsletter: {
    title: 'The Udderly Update',
    copy: 'Sign up for our monthly email newsletter to be the first to know about special promotions, new experiences, farm & animal updates, and just ridiculous content that’ll make you gasp, ooh, aw, and woah!',
    unavailable: 'Newsletter signup is not available yet.',
  },
  location: {
    headingLead: 'Come find us.',
    headingAccent: 'We’re out here somewhere.',
    note: 'Roughly 30 minutes from Kitchener-Waterloo, past the part where your GPS gets confident.',
  },
}

export const UNRESOLVED_EXPERIENCE_LINKS = [
  'corporate program booking',
  'experience detail pages other than Tower of Goats',
  'verified FareHarbor booking URLs',
  'newsletter submission',
  'Rainbow Registered logo file',
] as const

type RawDocument = {
  heroLead?: string | null
  heroAccent?: string | null
  heroSupporting?: string | null
  heroImage?: CmsImage
  categories?: unknown
  experienceCards?: unknown
  stays?: unknown
  gifts?: unknown
  programs?: unknown
  rainbow?: unknown
  feastOn?: unknown
  newsletterTitle?: string | null
  newsletterCopy?: string | null
  locationHeading?: string | null
  locationNote?: string | null
  emptyHeading?: string | null
  emptyMessage?: string | null
  categoryIntro?: unknown
  farmExperiencesIntro?: unknown
  staysIntro?: unknown
  giftsIntro?: unknown
  programsIntro?: unknown
} | null

function text(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max || /^placeholder\b/i.test(trimmed)) return undefined
  return trimmed
}

function picture(image: unknown, width: number): HubPicture | undefined {
  if (!image || typeof image !== 'object') return undefined
  const source = image as CmsImage
  const src = source ? cmsImageUrl(source, width) : undefined
  const alt = source?.alt?.trim() ?? ''
  if (!src || !alt) return undefined
  return { src, alt }
}

export function safeHubHref(
  value: unknown,
  publishedSlugs: ReadonlySet<string>,
): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  if (!href || isFarmHoppingListing({ title: href, slug: href })) return undefined
  if (PAGE_ANCHORS.has(href)) return href
  if (INTERNAL_PATHS.has(href)) return href
  if (href.startsWith('/') && !href.startsWith('//')) {
    const slug = href.slice(1)
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && publishedSlugs.has(slug)) return href
    return undefined
  }
  return publicBookingUrl(href)
}

function byOrder<T extends { sortOrder?: unknown }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      const leftOrder = typeof left.item.sortOrder === 'number' ? left.item.sortOrder : left.index
      const rightOrder = typeof right.item.sortOrder === 'number' ? right.item.sortOrder : right.index
      return leftOrder - rightOrder || left.index - right.index
    })
    .map((entry) => entry.item)
}

function records(value: unknown): Record<string, unknown>[] | null {
  if (!Array.isArray(value)) return null
  return value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
}

const DUAL_BOOKING_SLUGS = new Set([
  'mini-highland-cow-experience',
  'mini-highland-calf-meet-and-greet',
])

const PRIVATE_BOOKING_SLUGS = new Set([
  'miniature-donkey-lunch-picnic',
  'miniature-donkey-sunset-picnic',
])

function publishedMatch(slug: string | undefined, published: readonly ExperienceCardData[]) {
  if (!slug) return undefined
  const keys = new Set(experienceSlugAliases(slug))
  return published.find((item) => keys.has(item.slug))
}

function bookingAction(
  label: string,
  booking: { href?: string; overlay: boolean },
): HubBookingAction | undefined {
  if (!booking.href) return undefined
  return { label, href: booking.href, overlay: booking.overlay }
}

function hubBookingActions(experience: ExperienceCardData): HubBookingAction[] {
  const slug = publicExperienceSlug(experience.slug)
  const openBooking = resolvePublicBooking(experience)
  if (DUAL_BOOKING_SLUGS.has(slug)) {
    return [
      bookingAction('Book Public Experience', openBooking),
      bookingAction(
        'Book Private Experience',
        resolveVerifiedExternalBooking(experience.privateBookingVerified, experience.privateBookingUrl),
      ),
    ].filter((action): action is HubBookingAction => Boolean(action))
  }
  if (PRIVATE_BOOKING_SLUGS.has(slug)) {
    const action = bookingAction('Book Private Experience', openBooking)
    return action ? [action] : []
  }
  const action = bookingAction('Book Experience', openBooking)
  return action ? [action] : []
}

function applyBooking(entry: HubExperienceCard, match: ExperienceCardData): HubExperienceCard {
  const bookingActions = hubBookingActions(match)
  return {
    ...entry,
    title: match.title.trim() || entry.title,
    description: text(match.shortDescription, 500) ?? entry.description,
    href: `/${publicExperienceSlug(match.slug)}`,
    bookingActions: bookingActions.length ? bookingActions : undefined,
    bookingUrl: bookingActions[0]?.href,
    bookingOverlay: bookingActions.some((action) => action.overlay) ? true : undefined,
  }
}

function overlayPublished(
  entry: HubExperienceCard,
  published: readonly ExperienceCardData[],
): HubExperienceCard {
  const match = publishedMatch(entry.slug, published)
  if (!match) return { ...entry, bookingUrl: undefined, bookingOverlay: undefined, bookingActions: undefined }
  return applyBooking(entry, match)
}

function cardsFromCms(
  value: unknown,
  published: readonly ExperienceCardData[],
  publishedSlugs: ReadonlySet<string>,
): HubExperienceCard[] {
  const rows = records(value) ?? []
  const seen = new Set<string>()
  return byOrder(rows).flatMap((row) => {
    const title = text(row.title, 120)
    const slug = text(row.slug, 80)
    if (!title || isFarmHoppingListing({ title, slug })) return []
    const key = slug || title
    if (seen.has(key)) return []
    seen.add(key)
    const badge: HubExperienceCard['badge'] =
      row.badge === 'limited' || row.badge === 'signature' ? row.badge : undefined
    const image = picture(row.image, 1280)
    const local = image ? undefined : localExperience(slug, title)
    return [{
      key,
      title,
      slug,
      description: text(row.description, 500),
      season: text(row.season, 80),
      age: text(row.age, 40),
      badge,
      image,
      imageKey: local?.imageKey,
      imageAlt: image?.alt ?? local?.imageAlt,
      href: safeHubHref(row.learnMoreHref, publishedSlugs) ?? (slug && publishedSlugs.has(slug) ? `/${slug}` : undefined),
    }]
  }).map((entry) => overlayPublished(entry, published))
}

function featuresFromCms(
  value: unknown,
  publishedSlugs: ReadonlySet<string>,
  group: 'stays' | 'gifts' | 'programs',
): HubFeature[] | null {
  const rows = records(value)
  if (!rows) return null
  const seen = new Set<string>()
  return byOrder(rows).flatMap((row) => {
    const title = text(row.title, 120)
    if (!title || isFarmHoppingListing({ title, slug: title })) return []
    if (seen.has(title)) return []
    seen.add(title)
    const image = picture(row.image, 1280)
    return [{
      key: title,
      kicker: text(row.kicker, 40),
      title,
      copy: text(row.copy, 800),
      season: text(row.season, 80),
      age: text(row.age, 40),
      image,
      imageKey: image ? undefined : localFeatureImage(title, group),
      learnMoreHref: safeHubHref(row.learnMoreHref, publishedSlugs),
      ctaLabel: text(row.ctaLabel, 60),
      ctaHref: safeHubHref(row.ctaHref, publishedSlugs),
      limited: row.limited === true,
    }]
  })
}

function categoriesFromCms(value: unknown, publishedSlugs: ReadonlySet<string>): HubCategory[] | null {
  const rows = records(value)
  if (!rows) return null
  return byOrder(rows).flatMap((row) => {
    const title = text(row.title, 80)
    const href = safeHubHref(row.href, publishedSlugs)
    if (!title || !href) return []
    const image = picture(row.image, 1024)
    const local = image
      ? undefined
      : fallbackPage.categories.find((item) => item.href === href || item.title === title)
    return [{
      title,
      note: text(row.note, 80) ?? '',
      href,
      image,
      imageKey: local?.imageKey,
    }]
  })
}

function fieldText(value: unknown, key: string, max: number): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  return text((value as Record<string, unknown>)[key], max)
}

function designedLines(
  value: string | undefined,
  lead: string,
  accent: string,
): { lead: string; accent: string } {
  if (!value) return { lead, accent }
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (lines.length >= 2) return { lead: lines[0], accent: lines.slice(1).join(' ') }
  const joined = `${lead} ${accent}`.replace(/\s+/g, ' ').trim()
  if (value.replace(/\s+/g, ' ').trim() === joined) return { lead, accent }
  return { lead: value, accent: '' }
}

function splitParagraphs(body: string): string[] {
  return body.split(/\n+/).map((paragraph) => paragraph.trim()).filter(Boolean)
}

function localExperience(slug?: string, title?: string): HubExperienceCard | undefined {
  return lovableCards.find((card) => (slug && card.slug === slug) || card.title === title)
}

function localFeatureImage(title: string, group: 'stays' | 'gifts' | 'programs'): HubImageKey | undefined {
  return fallbackPage[group].find((item) => item.title === title)?.imageKey
}

function statementFromCms(value: unknown, fallback: HubStatement): HubStatement {
  if (!value || typeof value !== 'object') return fallback
  const row = value as Record<string, unknown>
  const body = text(row.body, 800)
  const lines = designedLines(text(row.heading, 120), fallback.heading, fallback.headingAccent ?? '')
  return {
    ...fallback,
    kicker: text(row.kicker, 80) ?? fallback.kicker,
    heading: lines.lead,
    headingAccent: lines.accent || undefined,
    paragraphs: body ? splitParagraphs(body) : fallback.paragraphs,
    href: publicBookingUrl(typeof row.href === 'string' ? row.href : undefined) ?? fallback.href,
    image: picture(row.image, 1200) ?? fallback.image,
  }
}

export function resolveExperiencesHubPage(
  document: RawDocument,
  published: readonly ExperienceCardData[] = [],
): ExperiencesHubPageModel {
  const visible = published.filter((item) => item.title?.trim() && item.slug?.trim() && !isFarmHoppingListing(item))
  const publishedSlugs = new Set(visible.map((item) => item.slug))
  const cmsCards = document && Array.isArray(document.experienceCards) ? document.experienceCards : null
  const baseCards = cmsCards
    ? cardsFromCms(cmsCards, visible, publishedSlugs)
    : lovableCards.map((entry) => overlayPublished(entry, visible))
  const used = new Set(baseCards.flatMap((entry) => (entry.slug ? experienceSlugAliases(entry.slug) : [])))
  const extras = cmsCards
    ? []
    : visible
        .filter((item) => !experienceSlugAliases(item.slug).some((slug) => used.has(slug)))
        .map((item) => {
          const slug = publicExperienceSlug(item.slug)
          return applyBooking({
            key: item._id,
            title: item.title.trim(),
            slug,
            description: text(item.shortDescription, 500),
            href: `/${slug}`,
          }, item)
        })

  const feastFallback: HubStatement = {
    kicker: FEAST_ON.kicker,
    heading: FEAST_ON.headingLead,
    headingAccent: FEAST_ON.headingAccent,
    paragraphs: [...FEAST_ON.paragraphs],
    href: FEAST_ON.href,
    imageKey: 'feast',
    imageAlt: FEAST_ON.imageAlt,
  }

  return {
    hero: {
      lead: text(document?.heroLead, 40) ?? EXPERIENCES_HERO.headingLead,
      accent: text(document?.heroAccent, 40) ?? EXPERIENCES_HERO.headingAccent,
      supporting: text(document?.heroSupporting, 300) ?? EXPERIENCES_HERO.supporting,
      imageAlt: picture(document?.heroImage, 1920)?.alt ?? EXPERIENCES_HERO.imageAlt,
      image: picture(document?.heroImage, 1920),
    },
    chooser: {
      headingLead: fieldText(document?.categoryIntro, 'headingLead', 80) ?? fallbackPage.chooser.headingLead,
      headingAccent: fieldText(document?.categoryIntro, 'headingAccent', 80) ?? fallbackPage.chooser.headingAccent,
      note: fieldText(document?.categoryIntro, 'copy', 240) ?? fallbackPage.chooser.note,
    },
    categories: categoriesFromCms(document?.categories, publishedSlugs) ?? fallbackPage.categories,
    experiencesHeading: fieldText(document?.farmExperiencesIntro, 'heading', 120) ?? fallbackPage.experiencesHeading,
    experiencesIntro: fieldText(document?.farmExperiencesIntro, 'copy', 800) ?? fallbackPage.experiencesIntro,
    cards: [...baseCards, ...extras],
    staysIntro: {
      kicker: fieldText(document?.staysIntro, 'kicker', 80) ?? fallbackPage.staysIntro.kicker,
      heading: fieldText(document?.staysIntro, 'heading', 120) ?? fallbackPage.staysIntro.heading,
      copy: fieldText(document?.staysIntro, 'copy', 800) ?? fallbackPage.staysIntro.copy,
    },
    stays: featuresFromCms(document?.stays, publishedSlugs, 'stays') ?? fallbackPage.stays,
    giftsIntro: {
      headingLead: fieldText(document?.giftsIntro, 'headingLead', 80) ?? fallbackPage.giftsIntro.headingLead,
      headingAccent: fieldText(document?.giftsIntro, 'headingAccent', 80) ?? fallbackPage.giftsIntro.headingAccent,
      copy: fieldText(document?.giftsIntro, 'copy', 800) ?? fallbackPage.giftsIntro.copy,
    },
    gifts: featuresFromCms(document?.gifts, publishedSlugs, 'gifts') ?? fallbackPage.gifts,
    programsIntro: {
      headingLead: fieldText(document?.programsIntro, 'headingLead', 80) ?? fallbackPage.programsIntro.headingLead,
      headingAccent: fieldText(document?.programsIntro, 'headingAccent', 80) ?? fallbackPage.programsIntro.headingAccent,
      copy: fieldText(document?.programsIntro, 'copy', 800) ?? fallbackPage.programsIntro.copy,
    },
    programs: featuresFromCms(document?.programs, publishedSlugs, 'programs') ?? fallbackPage.programs,
    rainbow: statementFromCms(document?.rainbow, fallbackPage.rainbow),
    feast: statementFromCms(document?.feastOn, feastFallback),
    newsletter: {
      title: text(document?.newsletterTitle, 80) ?? fallbackPage.newsletter.title,
      copy: text(document?.newsletterCopy, 400) ?? fallbackPage.newsletter.copy,
      unavailable: fallbackPage.newsletter.unavailable,
    },
    location: (() => {
      const lines = designedLines(
        text(document?.locationHeading, 80),
        fallbackPage.location.headingLead,
        fallbackPage.location.headingAccent,
      )
      return {
        headingLead: lines.lead,
        headingAccent: lines.accent,
        note: text(document?.locationNote, 240) ?? fallbackPage.location.note,
      }
    })(),
    emptyHeading: text(document?.emptyHeading, 80) ?? '',
    emptyMessage: text(document?.emptyMessage, 500) ?? '',
  }
}
