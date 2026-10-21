import { cmsImageUrl } from '@/lib/sanity/image'
import type { ExperienceFoundation, PortableTextContent, SanityImage } from '@/lib/sanity/types'
import { hasPortableText } from '@/lib/portable-text'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type {
  CmsCorporateBanner,
  CmsCorporateFacility,
  CmsCorporateImageText,
  CmsCorporatePerson,
  CmsCorporateProgram,
  CmsCorporateQuote,
  CmsCorporateTrainingPage,
} from './cms'
import type { CorporateImages } from './images'
import {
  DISC_PROGRAM_OPTIONS,
  LANDING_REVIEWS_HEADING,
  SHARED_PROGRAM_OUTCOMES,
  corporateEnquiry,
  corporateEnvironment,
  corporateFacilitator,
  corporateFacility,
  discFallback,
  landingFallback,
  sharedProgramFallback,
  teamBuildingFallback,
  tourismFallback,
  type AudienceIcon,
  type CorporateAwards,
  type CorporateCard,
  type CorporateClose,
  type CorporateLandingPage,
  type CorporatePicture,
  type CredentialIcon,
  type DiscPage,
  type FacilityIcon,
  type PracticalIcon,
  type SharedProgramPage,
  type TeamBuildingPage,
  type TourismPage,
} from './model'
import type { CorporateProgramSlug } from './slugs'

const FACILITY_ICONS = new Set<FacilityIcon>(['capacity', 'av', 'catering', 'parking', 'outdoors'])
const CREDENTIAL_ICONS = new Set<CredentialIcon>([
  'award',
  'star',
  'people',
  'reviews',
  'sparkle',
  'heart',
  'views',
  'media',
  'business',
  'experience',
])
const AUDIENCE_ICONS = new Set<AudienceIcon>([
  'farm',
  'stay',
  'restaurant',
  'artisan',
  'museum',
  'beverage',
  'specialist',
])
const PRACTICAL_ICONS = new Set<PracticalIcon>(['duration', 'addons', 'custom'])

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.replace(/\s+/g, ' ').trim()
  return trimmed || undefined
}

function lines(value: string[] | null | undefined): string[] {
  return (value ?? []).map((item) => item.trim()).filter(Boolean)
}

/** A shorter published list updates matching items and keeps the rest of the approved section. */
function mergeSection<T>(fallback: readonly T[], incoming: readonly T[], key: (item: T) => string): T[] {
  if (!incoming.length) return [...fallback]
  if (incoming.length >= fallback.length) return [...incoming]
  const byKey = new Map(incoming.map((item) => [key(item), item]))
  const used = new Set<string>()
  const merged = fallback.map((item) => {
    const next = byKey.get(key(item))
    if (!next) return item
    used.add(key(item))
    return next
  })
  for (const item of incoming) {
    if (!used.has(key(item))) merged.push(item)
  }
  return merged
}

function text(value: string | null | undefined, fallback: string): string {
  return clean(value) ?? fallback
}

function rich(value: PortableTextContent | undefined): PortableTextContent | undefined {
  return hasPortableText(value) ? value : undefined
}

function picture(
  image: SanityImage | null | undefined,
  fallback: CorporatePicture,
  width = 1600,
): CorporatePicture {
  const src = cmsImageUrl(image ?? undefined, width)
  if (!src) return fallback
  return { src, alt: image?.alt?.trim() || fallback.alt }
}

function gallery(
  images: SanityImage[] | null | undefined,
  fallback: CorporatePicture[],
  width = 1400,
): CorporatePicture[] {
  const resolved = (images ?? []).flatMap((image) => {
    const src = cmsImageUrl(image, width)
    const alt = image?.alt?.trim()
    return src && alt ? [{ src, alt }] : []
  })
  return resolved.length ? resolved : fallback
}

function href(value: string | null | undefined, fallback: string): string {
  const next = value?.trim() ?? ''
  if (!next || /\s/.test(next)) return fallback
  if (next.startsWith('#') && next.length > 1) return next
  if (next.startsWith('/') && !next.startsWith('//')) return next
  try {
    const url = new URL(next)
    if (url.protocol === 'http:' || url.protocol === 'https:') return next
  } catch {
    return fallback
  }
  return fallback
}

function awardsFor(
  foundation: ExperienceFoundation,
  images: CorporateImages,
  pageShow?: boolean | null,
): CorporateAwards {
  const show = typeof pageShow === 'boolean' ? pageShow : foundation?.experienceAwardsEnabled !== false
  const cmsImages = (foundation?.experienceAwardImages ?? []).flatMap((image) => {
    const src = cmsImageUrl(image, 320)
    const alt = image?.alt?.trim()
    return src && alt ? [{ src, alt }] : []
  })
  return {
    show,
    title: text(foundation?.experienceAwardsTitle, "TripAdvisor Travellers' Choice"),
    tagline: text(foundation?.experienceAwardsTagline, 'Top 10% of attractions worldwide by Tripadvisor.'),
    images: cmsImages.length
      ? cmsImages
      : images.awards.map((award) => ({
          src: award.src,
          alt: `TripAdvisor Travellers' Choice Award ${award.year}`,
        })),
  }
}

function seoFor(fallback: PageSeoInput, seo?: { title?: string | null; description?: string | null } | null): PageSeoInput {
  return {
    ...fallback,
    title: text(seo?.title, fallback.title),
    description: text(seo?.description, fallback.description ?? ''),
  }
}

function quotes(items: CmsCorporateQuote[] | null | undefined) {
  return (items ?? [])
    .map((item) => ({
      name: clean(item.guestName),
      quote: clean(item.quote),
    }))
    .filter((item): item is { name: string; quote: string } => Boolean(item.name && item.quote))
}

function reviewsFor(
  approved: boolean | null | undefined,
  heading: string | null | undefined,
  items: CmsCorporateQuote[] | null | undefined,
  fallbackHeading: string,
  cta?: { label?: string | null; href?: string | null },
) {
  if (approved !== true) return null
  const visible = quotes(items)
  if (!visible.length) return null
  const label = clean(cta?.label)
  const link = label ? href(cta?.href, '') : ''
  return {
    heading: text(heading, fallbackHeading),
    items: visible,
    ...(label && link ? { ctaLabel: label, ctaHref: link } : {}),
  }
}

function publishedProgram(program: CmsCorporateProgram | null | undefined, slug: string) {
  if (!program || program.active === false || program.slug !== slug || !clean(program.title)) {
    return null
  }
  return program
}

function cardFrom(
  source: CmsCorporateImageText | null | undefined,
  fallback: CorporateCard,
): CorporateCard {
  return {
    title: text(source?.title, fallback.title),
    body: text(source?.body, fallback.body),
    image: picture(source?.image, fallback.image, 1200),
    href: href(source?.href, fallback.href),
    ctaLabel: text(source?.ctaLabel, fallback.ctaLabel),
  }
}

function overlayProgram<T extends CorporateCard>(card: T, program: CmsCorporateProgram | undefined): T {
  if (!program) return card
  return {
    ...card,
    title: text(program.title, card.title),
    body: text(program.shortDescription, card.body),
    image: picture(program.heroImage, card.image, 1200),
  }
}

function programByHref(programs: CmsCorporateProgram[], link: string) {
  const slug = link.split('/').filter(Boolean).at(-1)
  if (!slug) return undefined
  return programs.find((program) => program.slug === slug && program.active !== false && clean(program.title))
}

function person(
  source: CmsCorporatePerson | null | undefined,
  fallback: NonNullable<CorporateClose['facilitator']>,
): CorporateClose['facilitator'] {
  if (source?.enabled === false) return null
  return {
    eyebrow: text(source?.eyebrow, fallback.eyebrow),
    title: text(source?.title, fallback.title),
    body: text(source?.body, fallback.body),
    image: picture(source?.image, fallback.image, 1200),
    ctaLabel: text(source?.ctaLabel, fallback.ctaLabel),
    ctaHref: href(source?.ctaHref, fallback.ctaHref),
  }
}

function banner(
  source: CmsCorporateBanner | null | undefined,
  fallback: NonNullable<CorporateClose['environment']>,
): CorporateClose['environment'] {
  if (source?.enabled === false) return null
  return {
    lead: text(source?.headingLead, fallback.lead),
    accent: text(source?.headingAccent, fallback.accent),
    body: text(source?.body, fallback.body),
    image: picture(source?.image, fallback.image, 1920),
    label: fallback.label,
  }
}

function facility(
  source: CmsCorporateFacility | null | undefined,
  fallback: NonNullable<CorporateClose['facility']>,
): CorporateClose['facility'] {
  if (source?.enabled === false) return null
  const items = (source?.items ?? [])
    .map((item, index) => {
      const title = clean(item.title)
      const body = clean(item.body)
      if (!title || !body) return null
      const icon = FACILITY_ICONS.has(item.icon as FacilityIcon)
        ? (item.icon as FacilityIcon)
        : fallback.items[index]?.icon ?? 'capacity'
      return { icon, title, body }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  return {
    lead: text(source?.headingLead, fallback.lead),
    accent: text(source?.headingAccent, fallback.accent),
    items: mergeSection(fallback.items, items, (item) => item.title),
    gallery: gallery(source?.gallery, fallback.gallery),
  }
}

function closeFor(
  source: {
    reviewsApproved?: boolean | null
    reviewsHeading?: string | null
    testimonials?: CmsCorporateQuote[] | null
    facilitator?: CmsCorporatePerson | null
    environment?: CmsCorporateBanner | null
    facility?: CmsCorporateFacility | null
    contactHeading?: string | null
    contactIntro?: string | null
    enquiryShowPhone?: boolean | null
    enquiryPrograms?: string[] | null
    reviewsCtaLabel?: string | null
    reviewsCtaHref?: string | null
  },
  images: CorporateImages,
  options: {
    reviewsHeading: string
    contactHeading: string
    contactBody: string
    showPhone: boolean
    programOptions?: string[]
    reviewsCta?: { label: string; href: string }
  },
): CorporateClose {
  const optionsList = lines(source.enquiryPrograms)
  return {
    reviews: reviewsFor(
      source.reviewsApproved,
      source.reviewsHeading,
      source.testimonials,
      options.reviewsHeading,
      options.reviewsCta
        ? { label: source.reviewsCtaLabel ?? options.reviewsCta.label, href: source.reviewsCtaHref ?? options.reviewsCta.href }
        : undefined,
    ),
    facilitator: person(source.facilitator, corporateFacilitator(images)),
    environment: banner(source.environment, corporateEnvironment(images)),
    facility: facility(source.facility, corporateFacility(images)),
    enquiry: {
      ...corporateEnquiry(
        text(source.contactHeading, options.contactHeading),
        text(source.contactIntro, options.contactBody),
        typeof source.enquiryShowPhone === 'boolean' ? source.enquiryShowPhone : options.showPhone,
        optionsList.length ? optionsList : options.programOptions ?? [],
      ),
    },
  }
}

export function resolveCorporateLanding(
  page: CmsCorporateTrainingPage | null | undefined,
  programs: CmsCorporateProgram[] | null | undefined,
  foundation: ExperienceFoundation,
  images: CorporateImages,
): CorporateLandingPage {
  const fallback = landingFallback(images)
  const published = (programs ?? []).filter((program) => program.active !== false && clean(program.title))
  const featured = page?.featuredProgram?.enabled === false
    ? null
    : overlayProgram(
        {
          ...cardFrom(page?.featuredProgram, fallback.featured!),
          eyebrow: text(page?.featuredProgram?.eyebrow, fallback.featured!.eyebrow),
        },
        programByHref(published, href(page?.featuredProgram?.href, fallback.featured!.href)),
      )
  const customCards = (page?.programCards ?? [])
    .map((card) => {
      if (card.enabled === false) return null
      const title = clean(card.title)
      const link = clean(card.href)
      if (!title || !link) return null
      const base = cardFrom(card, {
        title,
        body: '',
        image: fallback.cards[0]!.image,
        href: link,
        ctaLabel: 'Learn More',
      })
      return overlayProgram(base, programByHref(published, base.href))
    })
    .filter((card): card is CorporateCard => Boolean(card))
  const hiddenCardHrefs = new Set(
    (page?.programCards ?? []).flatMap((card) => {
      const link = clean(card.href)
      return card.enabled === false && link ? [link] : []
    }),
  )
  const cards = mergeSection(
    fallback.cards.filter((card) => !hiddenCardHrefs.has(card.href)),
    customCards,
    (card) => card.href,
  ).map((card) => overlayProgram(card, programByHref(published, card.href)))
  const tourism = page?.tourismProgram?.enabled === false
    ? null
    : overlayProgram(
        {
          ...cardFrom(page?.tourismProgram, fallback.tourism!),
          eyebrow: text(page?.tourismProgram?.eyebrow, fallback.tourism!.eyebrow),
        },
        programByHref(published, href(page?.tourismProgram?.href, fallback.tourism!.href)),
      )
  const introParagraphs = lines(page?.introParagraphs)

  return {
    hero: {
      lead: text(page?.heroLead, fallback.hero.lead),
      accent: text(page?.heroAccent, fallback.hero.accent),
      intro: text(page?.heroIntro, fallback.hero.intro),
      image: picture(page?.heroImage, fallback.hero.image, 1920),
    },
    awards: awardsFor(foundation, images, page?.showAwards),
    introduction: {
      lead: text(page?.introLead, fallback.introduction.lead),
      accent: text(page?.introAccent, fallback.introduction.accent),
      paragraphs: introParagraphs.length ? introParagraphs : fallback.introduction.paragraphs,
      gallery: gallery(page?.introGallery, fallback.introduction.gallery),
      badge: text(page?.introBadge, fallback.introduction.badge),
    },
    programsHeading: text(page?.programsHeading, fallback.programsHeading),
    featured,
    cards,
    tourism,
    close: closeFor(
      {
        reviewsApproved: page?.reviewsApproved,
        reviewsHeading: page?.reviewsHeading,
        testimonials: page?.testimonials,
        facilitator: page?.facilitator,
        environment: page?.environment,
        facility: page?.facility,
        contactHeading: page?.enquiryHeading,
        contactIntro: page?.enquiryIntro,
        reviewsCtaLabel: page?.reviewsCtaLabel,
        reviewsCtaHref: page?.reviewsCtaHref,
      },
      images,
      {
        reviewsHeading: LANDING_REVIEWS_HEADING,
        contactHeading: fallback.close.enquiry.heading,
        contactBody: fallback.close.enquiry.body,
        showPhone: true,
        reviewsCta: { label: 'See Training Programs', href: '#training-programs' },
      },
    ),
    seo: seoFor(fallback.seo, page?.seo),
  }
}

function sharedIntroduction(
  program: CmsCorporateProgram | null,
  fallback: ReturnType<typeof sharedProgramFallback>['introduction'],
) {
  return {
    lead: text(program?.introHeading, fallback.lead),
    accent: text(program?.introHeadingAccent, fallback.accent),
    paragraphs: lines(program?.introParagraphs).length ? lines(program?.introParagraphs) : fallback.paragraphs,
    richText: rich(program?.programDescription),
    image: picture(program?.introImage, fallback.image, 1400),
    ctaLabel: text(program?.introCtaLabel, fallback.ctaLabel),
    ctaHref: '#contact',
  }
}

export function resolveSharedProgram(
  slug: Extract<
    CorporateProgramSlug,
    | 'the-power-of-conversation'
    | 'alpaca-emotional-intelligence'
    | 'beyond-engagement'
    | 'innovation-on-the-farm'
  >,
  program: CmsCorporateProgram | null | undefined,
  foundation: ExperienceFoundation,
  images: CorporateImages,
): SharedProgramPage {
  const fallback = sharedProgramFallback(slug, images)
  const published = publishedProgram(program, slug)
  const outcomes = lines(published?.learningOutcomes)
  return {
    hero: {
      lead: text(published?.heroLead, fallback.hero.lead),
      accent: text(published?.titleAccent, fallback.hero.accent),
      intro: text(published?.heroIntro, fallback.hero.intro),
      image: picture(published?.heroImage, fallback.hero.image, 1920),
    },
    awards: awardsFor(foundation, images, published?.showAwards),
    introduction: sharedIntroduction(published, fallback.introduction),
    outcomes: {
      heading: text(published?.outcomesHeading, fallback.outcomes.heading),
      items: mergeSection(SHARED_PROGRAM_OUTCOMES, outcomes, (item) => item),
      durationTitle: fallback.outcomes.durationTitle,
      durationBody: text(published?.durationDetail ?? published?.duration, fallback.outcomes.durationBody),
      enhancementsTitle: fallback.outcomes.enhancementsTitle,
      enhancementsRich: rich(published?.enhancements),
      enhancementsBody: text(published?.enhancementsNote, fallback.outcomes.enhancementsBody),
    },
    close: closeFor(published ?? {}, images, {
      reviewsHeading: fallback.reviewsHeading,
      contactHeading: fallback.contactHeading,
      contactBody: fallback.contactBody,
      showPhone: true,
    }),
    seo: seoFor(fallback.seo, published?.seo),
  }
}

export function resolveTeamBuilding(
  program: CmsCorporateProgram | null | undefined,
  foundation: ExperienceFoundation,
  images: CorporateImages,
): TeamBuildingPage {
  const fallback = teamBuildingFallback(images)
  const published = publishedProgram(program, 'team-building-experiences')
  const hiddenActivityTitles = new Set(
    (published?.activities ?? []).flatMap((activity) => {
      const title = clean(activity.title)
      return activity.enabled === false && title ? [title] : []
    }),
  )
  const activities = (published?.activities ?? [])
    .filter((activity) => activity.enabled !== false)
    .map((activity, index) => {
      const title = clean(activity.title)
      if (!title) return null
      const base = fallback.activities[index] ?? fallback.activities[0]!
      return cardFrom(activity, { ...base, title, href: '#contact', ctaLabel: 'Contact Us' })
    })
    .filter((activity): activity is CorporateCard => Boolean(activity))
  return {
    hero: {
      lead: text(published?.heroLead, fallback.hero.lead),
      accent: text(published?.titleAccent, fallback.hero.accent),
      intro: text(published?.heroIntro, fallback.hero.intro),
      image: picture(published?.heroImage, fallback.hero.image, 1920),
    },
    awards: awardsFor(foundation, images, published?.showAwards),
    headingLead: text(published?.herdHeading, fallback.headingLead),
    headingAccent: text(published?.herdHeadingAccent, fallback.headingAccent),
    activities: mergeSection(
      fallback.activities.filter((activity) => !hiddenActivityTitles.has(activity.title)),
      activities,
      (activity) => activity.title,
    ),
    mix: {
      title: text(published?.mixHeading, fallback.mix.title),
      body: text(published?.mixBody, fallback.mix.body),
      ctaLabel: text(published?.mixCtaLabel, fallback.mix.ctaLabel),
      ctaHref: '#contact',
    },
    close: closeFor(published ?? {}, images, {
      reviewsHeading: fallback.reviewsHeading,
      contactHeading: fallback.contactHeading,
      contactBody: fallback.contactBody,
      showPhone: true,
    }),
    seo: seoFor(fallback.seo, published?.seo),
  }
}

export function resolveTourism(
  program: CmsCorporateProgram | null | undefined,
  foundation: ExperienceFoundation,
  images: CorporateImages,
): TourismPage {
  const fallback = tourismFallback(images)
  const published = publishedProgram(program, 'experiential-tourism-development')
  void foundation
  const steps = (published?.pathSteps ?? [])
    .map((step) => {
      const title = clean(step.title)
      const body = clean(step.body)
      return title && body ? { title, body } : null
    })
    .filter((step): step is { title: string; body: string } => Boolean(step))
  const credentials = (published?.credentials ?? [])
    .map((item, index) => {
      const label = clean(item.label)
      if (!label) return null
      const icon = CREDENTIAL_ICONS.has(item.icon as CredentialIcon)
        ? (item.icon as CredentialIcon)
        : fallback.credentials[index]?.icon ?? 'award'
      return { icon, label }
    })
    .filter((item): item is { icon: CredentialIcon; label: string } => Boolean(item))
  const services = (published?.services ?? [])
    .map((service) => {
      const name = clean(service.name)
      const price = clean(service.price)
      if (!name || !price) return null
      const items = (service.items ?? [])
        .map((item) => {
          const title = clean(item.title)
          const body = clean(item.body)
          return title && body ? { title, body } : null
        })
        .filter((item): item is { title: string; body: string } => Boolean(item))
      return {
        name,
        price,
        featured: service.featured === true,
        items,
      }
    })
    .filter((service): service is TourismPage['services'][number] => Boolean(service))
  const audiences = (published?.audiences ?? [])
    .map((item, index) => {
      const label = clean(item.label)
      if (!label) return null
      const icon = AUDIENCE_ICONS.has(item.icon as AudienceIcon)
        ? (item.icon as AudienceIcon)
        : fallback.audiences[index]?.icon ?? 'farm'
      return { icon, label }
    })
    .filter((item): item is { icon: AudienceIcon; label: string } => Boolean(item))
  const consultation = text(published?.consultationLabel, fallback.pathCtaLabel)
  return {
    hero: {
      lead: text(published?.heroLead, fallback.hero.lead),
      accent: text(published?.titleAccent, fallback.hero.accent),
      intro: text(published?.heroIntro, fallback.hero.intro),
      image: picture(published?.heroImage, fallback.hero.image, 1920),
    },
    introduction: {
      ...sharedIntroduction(published, fallback.introduction),
      ctaLabel: text(published?.introCtaLabel, fallback.introduction.ctaLabel),
    },
    portrait: picture(published?.facilitator?.image, fallback.portrait, 1200),
    pathHeading: text(published?.pathHeading, fallback.pathHeading),
    path: mergeSection(fallback.path, steps, (step) => step.title),
    pathCtaLabel: consultation,
    pathCtaHref: '#contact',
    credentials: mergeSection(fallback.credentials, credentials, (item) => item.label),
    servicesHeading: text(published?.servicesHeading, fallback.servicesHeading),
    services: mergeSection(fallback.services, services, (service) => service.name),
    servicesCtaLabel: consultation,
    servicesCtaHref: '#contact',
    audienceHeading: text(published?.audienceHeading, fallback.audienceHeading),
    audiences: mergeSection(fallback.audiences, audiences, (item) => item.label),
    audienceNote: text(published?.audienceNote, fallback.audienceNote),
    audienceCtaLabel: consultation,
    audienceCtaHref: '#contact',
    enquiry: corporateEnquiry(
      text(published?.contactHeading, fallback.enquiry.heading),
      text(published?.contactIntro, fallback.enquiry.body),
      published?.enquiryShowPhone === true,
      [],
    ),
    seo: seoFor(fallback.seo, published?.seo),
  }
}

export function resolveDisc(
  program: CmsCorporateProgram | null | undefined,
  foundation: ExperienceFoundation,
  images: CorporateImages,
): DiscPage {
  const fallback = discFallback(images)
  const published = publishedProgram(program, 'disc-assessment')
  const offerings = (published?.offerings ?? [])
    .map((offering, index) => {
      const title = clean(offering.title)
      const body = clean(offering.body)
      if (!title || !body) return null
      const base = fallback.offerings[index] ?? fallback.offerings[0]!
      const outcomes = lines(offering.outcomes)
      return {
        title,
        body,
        image: picture(offering.image, base.image, 1200),
        outcomes: outcomes.length ? outcomes : base.outcomes,
        ctaLabel: text(offering.ctaLabel, `Ask about ${title}`),
        ctaHref: '#contact',
      }
    })
    .filter((offering): offering is DiscPage['offerings'][number] => Boolean(offering))
  const practical = (published?.practicalItems ?? [])
    .map((item, index) => {
      const label = clean(item.label)
      const itemLines = lines(item.lines)
      if (!label || !itemLines.length) return null
      const icon = PRACTICAL_ICONS.has(item.icon as PracticalIcon)
        ? (item.icon as PracticalIcon)
        : fallback.practical[index]?.icon ?? 'duration'
      return { icon, label, lines: itemLines }
    })
    .filter((item): item is DiscPage['practical'][number] => Boolean(item))
  const programOptions = lines(published?.enquiryPrograms)
  return {
    hero: {
      lead: text(published?.heroLead, fallback.hero.lead),
      accent: text(published?.titleAccent, fallback.hero.accent),
      intro: text(published?.heroIntro, fallback.hero.intro),
      image: picture(published?.heroImage, fallback.hero.image, 1920),
    },
    awards: awardsFor(foundation, images, published?.showAwards),
    introduction: sharedIntroduction(published, fallback.introduction),
    offeringsHeading: text(published?.offeringsHeading, fallback.offeringsHeading),
    offerings: mergeSection(fallback.offerings, offerings, (offering) => offering.title),
    practicalHeading: text(published?.practicalHeading, fallback.practicalHeading),
    practical: mergeSection(fallback.practical, practical, (item) => item.label),
    close: closeFor(published ?? {}, images, {
      reviewsHeading: fallback.reviewsHeading,
      contactHeading: fallback.contactHeading,
      contactBody: fallback.contactBody,
      showPhone: true,
      programOptions: programOptions.length ? programOptions : DISC_PROGRAM_OPTIONS,
    }),
    seo: seoFor(fallback.seo, published?.seo),
  }
}
