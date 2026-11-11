export type SanityImageAsset = {
  _id: string
  _type?: string
  metadata?: {
    lqip?: string
    dimensions?: {
      width?: number
      height?: number
      aspectRatio?: number
    }
  }
}

export type SanityImage = {
  _type?: string
  alt?: string
  hotspot?: unknown
  crop?: unknown
  asset?: SanityImageAsset | { _ref: string; _type?: string }
} | null

export type PortableTextContent = Array<Record<string, unknown>> | null

export type AnimalCardData = {
  _id: string
  name: string
  slug: string | null
  shortIntro: string | null
  funFact: string | null
  status: string | null
  speciesTitle: string | null
  profileImage: SanityImage
}

export type FaqItem = {
  _id: string
  question: string
  answer: PortableTextContent
  category: string | null
  sortOrder: number | null
  active: boolean | null
}

export type TestimonialItem = {
  _id: string
  quote: string
  guestName: string
  source: string | null
  sourceUrl: string | null
  image: SanityImage
}

export type PolicyContent = {
  heading: string | null
  internalName: string | null
  content: PortableTextContent
  active: boolean | null
} | null

export type ExperienceSeo = {
  title: string | null
  description: string | null
  noIndex: boolean | null
  image: SanityImage
} | null

export type ExperienceStatement = {
  enabled?: boolean | null
  kicker?: string | null
  heading?: string | null
  body?: string | null
  href?: string | null
  image?: SanityImage
} | null

export type ExperiencePageData = {
  _id: string
  title: string
  slug: string
  shortDescription: string | null
  introductionHeading?: string | null
  body: PortableTextContent
  heroImage: SanityImage
  cardImage?: SanityImage
  gallery: SanityImage[] | null
  category: string | null
  animalSpecies: Array<{ title: string | null; slug: string | null }> | null
  season: string | null
  seasonLabel?: string | null
  duration: string | null
  priceDisplay: string | null
  groupSize: string | null
  sessionType: string | null
  ageGuidance: string | null
  practicalHeading?: string | null
  practicalTips?: string[] | null
  visitorInfo: PortableTextContent
  accessibilityInfo: PortableTextContent
  heroIntro?: string | null
  titleAccent?: string | null
  badge?: string | null
  priceOptions?: Array<{ label?: string | null; price?: string | null }> | null
  bookingUrl: string | null
  bookingVerified?: boolean | null
  bookingProvider?: string | null
  fareharborItemId?: string | null
  fareharborFlowId?: string | null
  bookingCtaLabel?: string | null
  privateBookingUrl?: string | null
  privateBookingVerified?: boolean | null
  privateBookingCtaLabel?: string | null
  privatePriceDisplay?: string | null
  privateGroupSize?: string | null
  instructor?: {
    heading?: string | null
    body?: string | null
    image?: SanityImage
    gallery?: SanityImage[] | null
  } | null
  feastOn?: ExperienceStatement
  signatureExperience?: ExperienceStatement
  designPlaceholders?: {
    enabled?: boolean | null
    awardsEnabled?: boolean | null
    reviewsHeading?: string | null
    reviews?: Array<{name?: string | null; quote?: string | null}> | null
    animalsHeading?: string | null
    animalsIntro?: string | null
    animals?: Array<{name?: string | null; lines?: string[] | null; image?: SanityImage}> | null
    welfareHeading?: string | null
    welfareBody?: string | null
    welfareImage?: SanityImage
  } | null
  reviewsHeading?: string | null
  reviewsApproved?: boolean | null
  animalsHeading?: string | null
  animalsIntro?: string | null
  faqsHeading?: string | null
  welfareCategory?: 'auto' | 'goats' | 'cows' | 'donkeys' | 'alpacas' | 'mixed' | null
  welfareHeading?: string | null
  welfareNote?: string | null
  animals: AnimalCardData[] | null
  faqs: FaqItem[] | null
  testimonials: TestimonialItem[] | null
  cancellationPolicy: PolicyContent
  welfarePolicy: PolicyContent
  seo: ExperienceSeo
}

export type ExperienceCardData = {
  _id: string
  title: string
  slug: string
  active?: boolean | null
  sortOrder?: number | null
  shortDescription: string | null
  priceDisplay: string | null
  duration: string | null
  category: string | null
  season: string | null
  sessionType: string | null
  ageGuidance: string | null
  bookingUrl: string | null
  bookingVerified?: boolean | null
  bookingProvider?: string | null
  fareharborItemId?: string | null
  fareharborFlowId?: string | null
  privateBookingUrl?: string | null
  privateBookingVerified?: boolean | null
  heroImage: SanityImage
  cardImage?: SanityImage
  animalSpecies: Array<{ title: string | null }> | null
}

export type SharedWelfareProfile = {
  heading?: string | null
  body?: string | null
  image?: SanityImage
} | null

export type ExperienceFoundation = {
  experienceAwardsEnabled?: boolean | null
  experienceAwardsTitle?: string | null
  experienceAwardsTagline?: string | null
  experienceAwardImages?: SanityImage[] | null
  experienceWelfareProfiles?: {
    goats?: SharedWelfareProfile
    cows?: SharedWelfareProfile
    donkeys?: SharedWelfareProfile
    alpacas?: SharedWelfareProfile
    mixed?: SharedWelfareProfile
  } | null
  experienceWelfareHeading?: string | null
  experienceWelfareBody?: string | null
  experienceWelfareImage?: SanityImage | null
} | null
