import type { CmsSeo } from '@/lib/about/cms'
import type { PortableTextContent } from '@/lib/sanity/types'

export type CmsLegalPolicy = {
  _id?: string | null
  heading?: string | null
  policyType?: string | null
  publicSlug?: string | null
  revisionLabel?: string | null
  content?: PortableTextContent
  active?: boolean | null
  seo?: CmsSeo
} | null
