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

export type ExperiencePageData = {
  _id: string
  title: string
  slug: string
  shortDescription: string | null
  body: PortableTextContent
  heroImage: SanityImage
  gallery: SanityImage[] | null
  category: string | null
  animalSpecies: Array<{ title: string | null; slug: string | null }> | null
  season: string | null
  duration: string | null
  priceDisplay: string | null
  groupSize: string | null
  sessionType: string | null
  ageGuidance: string | null
  visitorInfo: PortableTextContent
  accessibilityInfo: PortableTextContent
  bookingUrl: string | null
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
  shortDescription: string | null
  priceDisplay: string | null
  duration: string | null
  category: string | null
  season: string | null
  sessionType: string | null
  ageGuidance: string | null
  heroImage: SanityImage
  animalSpecies: Array<{ title: string | null }> | null
}
