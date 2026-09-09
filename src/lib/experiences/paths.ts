export const RESERVED_EXPERIENCE_SLUGS = new Set([
  'experiences',
  'health',
  'studio',
])

export function experiencePath(slug: string): string {
  const trimmed = slug.replace(/^\/+|\/+$/g, '')
  return `/${trimmed}`
}

export function isReservedExperienceSlug(slug: string): boolean {
  return RESERVED_EXPERIENCE_SLUGS.has(slug)
}
