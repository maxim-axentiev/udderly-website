import type { PortableTextContent, SanityImage } from '@/lib/sanity/types'

export type CmsSeo = {
  title?: string | null
  description?: string | null
  noIndex?: boolean | null
  image?: SanityImage
} | null

export type CmsStoryChapter = {
  sectionId?: string | null
  title?: string | null
  paragraphs?: Array<string | null> | null
  image?: SanityImage
  imageOnLeft?: boolean | null
  tone?: string | null
  showSignOff?: boolean | null
  signOffName?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  enabled?: boolean | null
}

export type CmsOurStoryPage = {
  heroLead?: string | null
  heroAccent?: string | null
  heroIntro?: string | null
  heroImage?: SanityImage
  chapters?: CmsStoryChapter[] | null
  seo?: CmsSeo
}

export type CmsVisionValue = {
  title?: string | null
  description?: string | null
}

export type CmsVisionValuesPage = {
  heroLead?: string | null
  heroAccent?: string | null
  heroImage?: SanityImage
  showVision?: boolean | null
  visionHeading?: string | null
  visionParagraphs?: Array<string | null> | null
  visionImage?: SanityImage
  showGallery?: boolean | null
  gallery?: SanityImage[] | null
  showValues?: boolean | null
  valuesHeading?: string | null
  valuesImage?: SanityImage
  values?: CmsVisionValue[] | null
  showCta?: boolean | null
  ctaHeading?: string | null
  ctaBody?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  seo?: CmsSeo
}

export type CmsTeamPage = {
  heroLead?: string | null
  heroAccent?: string | null
  heroIntro?: string | null
  heroImage?: SanityImage
  factLabel?: string | null
  showCta?: boolean | null
  ctaHeading?: string | null
  ctaBody?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  seo?: CmsSeo
}

export type CmsTeamMember = {
  _id?: string | null
  name?: string | null
  role?: string | null
  ridiculousFact?: string | null
  bio?: PortableTextContent
  photo?: SanityImage
  sortOrder?: number | null
  active?: boolean | null
}

export type CmsFaq = {
  _id?: string | null
  question?: string | null
  answer?: PortableTextContent
  category?: string | null
  sortOrder?: number | null
  active?: boolean | null
}

export type CmsFaqSection = {
  title?: string | null
  categories?: Array<string | null> | null
  questions?: CmsFaq[] | null
  enabled?: boolean | null
}

export type CmsFaqPage = {
  heroLead?: string | null
  heroAccent?: string | null
  heroImage?: SanityImage
  sections?: CmsFaqSection[] | null
  showCta?: boolean | null
  ctaHeading?: string | null
  ctaBody?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  seo?: CmsSeo
}
