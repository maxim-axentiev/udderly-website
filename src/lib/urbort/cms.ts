import type { CmsSeo } from '@/lib/about/cms'
import type { PortableTextContent, SanityImage } from '@/lib/sanity/types'

export type CmsUrbortLink = {
  label?: string | null
  linkType?: string | null
  href?: string | null
  internalLink?: {
    _type?: string | null
    slug?: string | null
  } | null
} | null

export type CmsUrbortArticle = {
  _id?: string | null
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  heroImage?: SanityImage
  publishedAt?: string | null
  author?: string | null
  body?: PortableTextContent
  gallery?: SanityImage[] | null
  tags?: Array<string | null> | null
  externalLinks?: CmsUrbortLink[] | null
  active?: boolean | null
  seo?: CmsSeo
} | null

export type CmsUrbortBlogPage = {
  titleLead?: string | null
  titleAccent?: string | null
  intro?: string | null
  showPlaceholderCards?: boolean | null
  ctaHeading?: string | null
  ctaBody?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  seo?: CmsSeo
} | null
