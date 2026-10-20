/**
 * Internal URL rules for Sanity documents.
 *
 * Experience details are served at `/{slug}`. Hub and system paths are reserved
 * so an experience document cannot occupy them. Other document types stay
 * unresolved until their routes exist. A root-level slug for those types would
 * either hit the experience catch-all or a reserved path that is still a 404.
 */

export const RESERVED_SLUGS = [
  'experiences',
  'tower-of-goats-discovery-trail',
  'meet-the-herd',
  'stay',
  'adopt',
  'adopt-an-animal',
  'corporate',
  'corporate-training',
  'our-farm',
  'animals-for-sale',
  'urbort',
  'contact',
  'privacy',
  'terms',
  'health',
  'studio',
  'robots.txt',
  'sitemap.xml',
] as const

export type ReservedSlug = (typeof RESERVED_SLUGS)[number]

const RESERVED_SLUG_SET = new Set<string>(RESERVED_SLUGS)

export const INTERNAL_DOCUMENT_TYPES = [
  'experience',
  'page',
  'animal',
  'animalListing',
  'adoptionOffering',
  'corporateProgram',
  'urbortArticle',
] as const

export type InternalDocumentType = (typeof INTERNAL_DOCUMENT_TYPES)[number]

const INTERNAL_DOCUMENT_TYPE_SET = new Set<string>(INTERNAL_DOCUMENT_TYPES)

/** Document types whose public route is implemented. */
const ROUTED_DOCUMENT_TYPES = new Set<InternalDocumentType>(['experience'])

const CORPORATE_PROGRAM_SLUGS = new Set<string>([
  'team-building-experiences',
  'experiential-tourism-development',
  'disc-assessment',
  'the-power-of-conversation',
  'alpaca-emotional-intelligence',
  'beyond-engagement',
  'innovation-on-the-farm',
])

const EXPERIENCE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export type PathFailureReason =
  | 'missing-slug'
  | 'invalid-slug'
  | 'reserved-slug'
  | 'unsupported-type'
  | 'route-not-implemented'

export type DocumentPath =
  | { ok: true; href: string }
  | { ok: false; reason: PathFailureReason }

export function isReservedSlug(slug: string): slug is ReservedSlug {
  return RESERVED_SLUG_SET.has(slug)
}

export function isInternalDocumentType(type: string): type is InternalDocumentType {
  return INTERNAL_DOCUMENT_TYPE_SET.has(type)
}

export function resolveDocumentPath(
  type: string | null | undefined,
  slug: string | null | undefined,
): DocumentPath {
  if (!type || !isInternalDocumentType(type)) {
    return { ok: false, reason: 'unsupported-type' }
  }

  const normalized = slug?.trim() ?? ''
  if (!normalized) {
    return { ok: false, reason: 'missing-slug' }
  }

  if (isReservedSlug(normalized)) {
    return { ok: false, reason: 'reserved-slug' }
  }

  if (!EXPERIENCE_SLUG.test(normalized)) {
    return { ok: false, reason: 'invalid-slug' }
  }

  if (type === 'corporateProgram') {
    if (!CORPORATE_PROGRAM_SLUGS.has(normalized)) {
      return { ok: false, reason: 'route-not-implemented' }
    }
    return { ok: true, href: `/corporate-training/${normalized}` }
  }

  if (!ROUTED_DOCUMENT_TYPES.has(type)) {
    return { ok: false, reason: 'route-not-implemented' }
  }

  return { ok: true, href: `/${normalized}` }
}

export function documentPath(
  type: string | null | undefined,
  slug: string | null | undefined,
): string | undefined {
  const resolved = resolveDocumentPath(type, slug)
  return resolved.ok ? resolved.href : undefined
}

/**
 * Slug from a single-segment catch-all splat that may be rendered as an
 * experience. Reserved, invalid, and nested paths return undefined so the
 * route can 404 without querying Sanity.
 */
export function routableExperienceSlug(splat: string | undefined): string | undefined {
  if (!splat) {
    return undefined
  }

  const slug = splat.replace(/^\/+|\/+$/g, '')
  if (!slug || slug.includes('/')) {
    return undefined
  }

  const resolved = resolveDocumentPath('experience', slug)
  return resolved.ok ? slug : undefined
}
