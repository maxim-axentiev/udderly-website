/**
 * Approved public paths that differ from slugs already stored on drafts.
 * Documents are not rewritten here. Both the stored slug and the public slug
 * resolve to the same experience until a later content migration.
 */
const STORED_TO_PUBLIC_SLUG: Record<string, string> = {
  'private-miniature-donkey-lunch-picnic': 'miniature-donkey-lunch-picnic',
  'private-miniature-donkey-sunset-picnic': 'miniature-donkey-sunset-picnic',
}

const PUBLIC_TO_STORED_SLUG = Object.fromEntries(
  Object.entries(STORED_TO_PUBLIC_SLUG).map(([stored, publicSlug]) => [publicSlug, stored]),
)

export const LIMITED_TIME_EXPERIENCE_SLUGS = [
  'baby-goat-playtime-and-snuggles',
  'mini-highland-calf-meet-and-greet',
] as const

export function publicExperienceSlug(slug: string): string {
  return STORED_TO_PUBLIC_SLUG[slug] ?? slug
}

/** Match detail-page alias preference before applying SEO exclusion. */
export function selectIndexableExperienceSlugs(
  records: readonly { slug: string; noIndex?: boolean | null }[],
): string[] {
  const selected = new Map<string, { slug: string; noIndex?: boolean | null }>()
  for (const record of records) {
    if (!record || typeof record.slug !== 'string' || !record.slug.trim()) continue
    const publicSlug = publicExperienceSlug(record.slug)
    const previous = selected.get(publicSlug)
    if (!previous || (record.slug === publicSlug && previous.slug !== publicSlug)) {
      selected.set(publicSlug, record)
    }
  }
  return [...selected].filter(([, record]) => record.noIndex !== true).map(([slug]) => slug)
}

export function experienceSlugAliases(slug: string): string[] {
  const stored = PUBLIC_TO_STORED_SLUG[slug]
  const published = STORED_TO_PUBLIC_SLUG[slug]
  return [...new Set([slug, stored, published].filter((value): value is string => Boolean(value)))]
}
