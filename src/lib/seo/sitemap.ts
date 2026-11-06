import { publicExperienceSlug } from '@/lib/experiences/public-paths'
import { routableExperienceSlug, resolveDocumentPath } from '@/lib/routes/paths'

import { normalizePath } from './page-head'

export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export type SitemapEntry = {
  path: string
  lastModified?: string
  changeFrequency?: SitemapChangeFrequency
  priority?: number
}

/**
 * Static routes that should appear in the sitemap.
 * Future Sanity pages, experiences, URBORT articles, and cattle listings can be
 * concatenated onto this list from a CMS query.
 */
export function getStaticSitemapEntries(): SitemapEntry[] {
  return [
    {
      path: '/',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      path: '/experiences',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      path: '/tower-of-goats-discovery-trail',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      path: '/adopt-an-animal',
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      path: '/animals-for-sale',
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      path: '/corporate-training',
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      path: '/corporate-training/team-building-experiences',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/experiential-tourism-development',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/disc-assessment',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/the-power-of-conversation',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/alpaca-emotional-intelligence',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/beyond-engagement',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/corporate-training/innovation-on-the-farm',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/our-story',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/vision-values',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/team',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/faq',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/urbort-blog',
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      path: '/contact',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      path: '/newsletter',
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      path: '/farm-market-store',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      path: '/ice-cream',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      path: '/gift-card',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      path: '/farm-glamping',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      path: '/privacy-policy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      path: '/terms-of-service',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      path: '/cookies-policy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}

/** Canonical public experience paths, never stored slugs that only redirect. */
export function publicExperienceSitemapEntries(slugs: readonly string[]): SitemapEntry[] {
  const seen = new Set<string>()
  return slugs.flatMap((storedSlug) => {
    const slug = publicExperienceSlug(storedSlug)
    if (!routableExperienceSlug(slug) || seen.has(slug)) return []
    seen.add(slug)
    return [{ path: `/${slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }]
  })
}

/** Only published articles with an implemented public route belong in the sitemap. */
export function publicUrbortSitemapEntries(slugs: readonly string[]): SitemapEntry[] {
  const seen = new Set<string>()
  return slugs.flatMap((slug) => {
    const resolved = resolveDocumentPath('urbortArticle', slug)
    if (!resolved.ok || seen.has(resolved.href)) return []
    seen.add(resolved.href)
    return [{ path: resolved.href, changeFrequency: 'monthly' as const, priority: 0.5 }]
  })
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const { fetchExperienceSitemapSlugs, fetchUrbortSitemapSlugs } = await import('@/lib/sanity/fetch')

  const [slugs, articleSlugs] = await Promise.all([
    fetchExperienceSitemapSlugs().catch(() => [] as string[]),
    fetchUrbortSitemapSlugs().catch(() => [] as string[]),
  ])
  return [
    ...getStaticSitemapEntries(),
    ...publicExperienceSitemapEntries(slugs),
    ...publicUrbortSitemapEntries(articleSlugs),
  ]
}

export function isSitemapPathExcluded(path: string): boolean {
  const normalized = normalizePath(path)
  return normalized === '/health'
}

export function buildSitemapXml(origin: string, entries: SitemapEntry[]): string {
  const urls = entries
    .filter((entry) => !isSitemapPathExcluded(entry.path))
    .map((entry) => {
      const loc = `${origin}${normalizePath(entry.path)}`
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified}</lastmod>`
        : ''
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : ''
      const priority =
        typeof entry.priority === 'number'
          ? `\n    <priority>${entry.priority.toFixed(1)}</priority>`
          : ''

      return `  <url>\n    <loc>${loc}</loc>${lastmod}${changefreq}${priority}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
