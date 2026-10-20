import type { PortableTextContent, SanityImage } from '@/lib/sanity/types'

export type CmsCorporateQuote = {
  _id?: string
  quote?: string | null
  guestName?: string | null
}

export type CmsCorporateImageText = {
  title?: string | null
  body?: string | null
  image?: SanityImage
  href?: string | null
  ctaLabel?: string | null
  eyebrow?: string | null
  enabled?: boolean | null
}

export type CmsCorporateStep = {
  title?: string | null
  body?: string | null
}

export type CmsCorporateService = {
  name?: string | null
  price?: string | null
  featured?: boolean | null
  items?: Array<{ title?: string | null; body?: string | null }> | null
}

export type CmsCorporateOffering = {
  title?: string | null
  body?: string | null
  image?: SanityImage
  outcomes?: string[] | null
  ctaLabel?: string | null
}

export type CmsCorporatePerson = {
  enabled?: boolean | null
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  image?: SanityImage
  ctaLabel?: string | null
  ctaHref?: string | null
}

export type CmsCorporateBanner = {
  enabled?: boolean | null
  headingLead?: string | null
  headingAccent?: string | null
  body?: string | null
  image?: SanityImage
}

export type CmsCorporateFacility = {
  enabled?: boolean | null
  headingLead?: string | null
  headingAccent?: string | null
  items?: Array<{
    icon?: string | null
    title?: string | null
    body?: string | null
  }> | null
  gallery?: SanityImage[] | null
}

export type CmsCorporateProgram = {
  _id?: string
  title?: string | null
  heroLead?: string | null
  titleAccent?: string | null
  slug?: string | null
  shortDescription?: string | null
  heroIntro?: string | null
  heroImage?: SanityImage
  introHeading?: string | null
  introHeadingAccent?: string | null
  programDescription?: PortableTextContent
  introImage?: SanityImage
  learningOutcomes?: string[] | null
  outcomesHeading?: string | null
  duration?: string | null
  durationDetail?: string | null
  enhancements?: PortableTextContent
  enhancementsNote?: string | null
  reviewsApproved?: boolean | null
  reviewsHeading?: string | null
  testimonials?: CmsCorporateQuote[] | null
  contactHeading?: string | null
  contactIntro?: string | null
  enquiryShowPhone?: boolean | null
  enquiryPrograms?: string[] | null
  introCtaLabel?: string | null
  showAwards?: boolean | null
  activities?: CmsCorporateImageText[] | null
  mixHeading?: string | null
  mixBody?: string | null
  mixCtaLabel?: string | null
  herdHeading?: string | null
  herdHeadingAccent?: string | null
  pathHeading?: string | null
  pathSteps?: CmsCorporateStep[] | null
  consultationLabel?: string | null
  credentials?: Array<{ icon?: string | null; label?: string | null }> | null
  servicesHeading?: string | null
  services?: CmsCorporateService[] | null
  audiences?: Array<{ icon?: string | null; label?: string | null }> | null
  audienceHeading?: string | null
  audienceNote?: string | null
  offeringsHeading?: string | null
  offerings?: CmsCorporateOffering[] | null
  practicalHeading?: string | null
  practicalItems?: Array<{
    icon?: string | null
    label?: string | null
    lines?: string[] | null
  }> | null
  facilitator?: CmsCorporatePerson | null
  environment?: CmsCorporateBanner | null
  facility?: CmsCorporateFacility | null
  seo?: { title?: string | null; description?: string | null } | null
  active?: boolean | null
}

export type CmsCorporateTrainingPage = {
  _id?: string
  heroLead?: string | null
  heroAccent?: string | null
  heroIntro?: string | null
  heroImage?: SanityImage
  introLead?: string | null
  introAccent?: string | null
  introParagraphs?: string[] | null
  introGallery?: SanityImage[] | null
  introBadge?: string | null
  programsHeading?: string | null
  featuredProgram?: CmsCorporateImageText | null
  programCards?: CmsCorporateImageText[] | null
  tourismProgram?: CmsCorporateImageText | null
  showAwards?: boolean | null
  reviewsApproved?: boolean | null
  reviewsHeading?: string | null
  reviewsCtaLabel?: string | null
  reviewsCtaHref?: string | null
  testimonials?: CmsCorporateQuote[] | null
  facilitator?: CmsCorporatePerson | null
  environment?: CmsCorporateBanner | null
  facility?: CmsCorporateFacility | null
  enquiryHeading?: string | null
  enquiryIntro?: string | null
  seo?: { title?: string | null; description?: string | null } | null
}
