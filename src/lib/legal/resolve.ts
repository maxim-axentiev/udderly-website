import type { CmsSeo } from '@/lib/about/cms'
import { hasPortableText } from '@/lib/portable-text'
import type { PageSeoInput } from '@/lib/seo/page-head'
import type { PortableTextContent } from '@/lib/sanity/types'

import type { CmsLegalPolicy } from './cms'
import { legalFallbackText } from './fallback-text'
import { legalSeo, type LegalSlug } from './model'
import { parseLegalText, type LegalBlock } from './parse'

export type LegalPageContent = {
  slug: LegalSlug
  title: string
  blocks: LegalBlock[]
  body?: PortableTextContent
  seo: PageSeoInput
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function text(value: string | null | undefined, fallback: string): string {
  return clean(value) ?? fallback
}

function seoFor(seo: CmsSeo | undefined, fallback: PageSeoInput): PageSeoInput {
  const description = text(seo?.description, fallback.description ?? '')
  return {
    title: text(seo?.title, fallback.title),
    description,
    ogDescription: clean(seo?.description) ? description : fallback.ogDescription,
    path: fallback.path,
    ogType: 'website',
    noindex: seo?.noIndex === true,
  }
}

function listedPolicy(policy: CmsLegalPolicy, slug: LegalSlug): policy is NonNullable<CmsLegalPolicy> {
  if (!policy?._id || policy._id.startsWith('drafts.')) return false
  if (policy.active === false) return false
  const expectedType: Record<LegalSlug, string> = {
    'privacy-policy': 'privacy',
    'terms-of-service': 'terms',
    'cookies-policy': 'cookies',
  }
  return policy.policyType === expectedType[slug] && policy.publicSlug === slug
}

export function resolveLegalPage(slug: LegalSlug, policy: CmsLegalPolicy): LegalPageContent {
  const fallback = parseLegalText(legalFallbackText[slug])
  const listed = listedPolicy(policy, slug) && hasPortableText(policy.content) ? policy : null
  const seo = seoFor(listed?.seo, {
    title: legalSeo[slug].title,
    description: legalSeo[slug].description,
    path: `/${slug}`,
  })

  if (!listed) {
    return {
      slug,
      title: fallback.title,
      blocks: fallback.blocks,
      seo,
    }
  }

  return {
    slug,
    title: text(listed.heading, fallback.title),
    blocks: [],
    body: listed.content,
    seo,
  }
}
