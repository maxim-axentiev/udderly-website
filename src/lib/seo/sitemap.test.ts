import { describe, expect, it } from 'vitest'
import { experienceSitemapSlugsQuery, urbortSitemapSlugsQuery } from '@/lib/sanity/queries'
import { selectIndexableExperienceSlugs } from '@/lib/experiences/public-paths'

import {
  buildSitemapXml,
  getStaticSitemapEntries,
  isSitemapPathExcluded,
  publicExperienceSitemapEntries,
  publicUrbortSitemapEntries,
} from './sitemap'

describe('sitemap foundation', () => {
  it('includes the homepage and excludes the health endpoint', () => {
    const entries = getStaticSitemapEntries()

    expect(entries.map((entry) => entry.path)).toEqual([
      '/',
      '/experiences',
      '/tower-of-goats-discovery-trail',
      '/adopt-an-animal',
      '/animals-for-sale',
      '/corporate-training',
      '/corporate-training/team-building-experiences',
      '/corporate-training/experiential-tourism-development',
      '/corporate-training/disc-assessment',
      '/corporate-training/the-power-of-conversation',
      '/corporate-training/alpaca-emotional-intelligence',
      '/corporate-training/beyond-engagement',
      '/corporate-training/innovation-on-the-farm',
      '/our-story',
      '/vision-values',
      '/team',
      '/faq',
      '/urbort-blog',
      '/contact',
      '/newsletter',
      '/farm-market-store',
      '/ice-cream',
      '/gift-card',
      '/farm-glamping',
      '/privacy-policy',
      '/terms-of-service',
      '/cookies-policy',
    ])
    expect(isSitemapPathExcluded('/health')).toBe(true)
    expect(isSitemapPathExcluded('/')).toBe(false)
  })

  it('uses canonical public paths instead of redirected stored donkey picnic slugs', () => {
    const entries = publicExperienceSitemapEntries([
      'goat-cuddles',
      'private-miniature-donkey-lunch-picnic',
      'private-miniature-donkey-sunset-picnic',
      'miniature-donkey-lunch-picnic',
      '../invalid',
    ])
    expect(entries.map((entry) => entry.path)).toEqual([
      '/goat-cuddles',
      '/miniature-donkey-lunch-picnic',
      '/miniature-donkey-sunset-picnic',
    ])
    const xml = buildSitemapXml('https://udderlyridiculousfarmlife.com', entries)
    expect(xml).not.toContain('/private-miniature-donkey')
    expect(xml).toContain('/miniature-donkey-lunch-picnic')
  })

  it('excludes reserved and unrouteable experience slugs', () => {
    expect(publicExperienceSitemapEntries([
      'goat-cuddles', 'contact', 'experiences', 'health', 'robots.txt',
      'mini-cattle-for-sale', 'promotions', 'cow-wedding', 'cheryl-haskett',
      'escape-to-the-countryside-farm-glamping', 'goatscaping',
      'goat-cuddles', 'bad/path', 'valid-experience',
    ]).map((entry) => entry.path)).toEqual(['/goat-cuddles', '/valid-experience'])
  })

  it('applies indexing settings from the preferred public record, not an older alias', () => {
    const records = [
      { slug: 'private-miniature-donkey-lunch-picnic', noIndex: false },
      { slug: 'miniature-donkey-lunch-picnic', noIndex: true },
      { slug: 'private-miniature-donkey-sunset-picnic', noIndex: true },
      { slug: 'miniature-donkey-sunset-picnic', noIndex: false },
      { slug: 'goat-yoga', noIndex: false },
      { slug: 'goat-cuddles', noIndex: true },
    ]
    const expected = ['miniature-donkey-sunset-picnic', 'goat-yoga']
    for (const input of [records, [...records].reverse()]) {
      expect(selectIndexableExperienceSlugs(input).sort()).toEqual([...expected].sort())
      expect(publicExperienceSitemapEntries(selectIndexableExperienceSlugs(input)).map((entry) => entry.path).sort())
        .toEqual(['/goat-yoga', '/miniature-donkey-sunset-picnic'])
    }
    expect(selectIndexableExperienceSlugs([
      { slug: 'private-miniature-donkey-lunch-picnic', noIndex: false },
    ])).toEqual(['miniature-donkey-lunch-picnic'])
  })

  it('only emits validated, unique, routable URBORT article paths', () => {
    const entries = publicUrbortSitemapEntries([
      'alpaca-breeding', 'alpaca-breeding', '../unapproved', 'contact',
      'farm-update', 'bad<xml', 'robots.txt', 'two/slugs', '',
    ])
    expect(entries.map((entry) => entry.path)).toEqual([
      '/urbort-blog/alpaca-breeding', '/urbort-blog/farm-update',
    ])
    const xml = buildSitemapXml('https://udderlyridiculousfarmlife.com', entries)
    expect(xml).not.toContain('bad&lt;xml')
    expect(xml.match(/<url>/g)).toHaveLength(2)
  })

  it('excludes experiences explicitly hidden from search from the CMS sitemap query', () => {
    expect(experienceSitemapSlugsQuery).toContain('active != false')
    expect(experienceSitemapSlugsQuery).toContain('defined(title) && title != ""')
    expect(experienceSitemapSlugsQuery).toContain('"noIndex": seo.noIndex')
    expect(urbortSitemapSlugsQuery).toContain('seo.noIndex != true')
    expect(urbortSitemapSlugsQuery).toContain('count(body) > 0')
  })

  it('builds loc URLs from the canonical origin', () => {
    const xml = buildSitemapXml('https://example.com', [
      ...getStaticSitemapEntries(),
      { path: '/health' },
    ])

    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).not.toContain('/health')
  })
})
