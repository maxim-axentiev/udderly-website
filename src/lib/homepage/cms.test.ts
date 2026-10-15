import fs from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { homepageExperienceCards, homepageHero, homepageSeo } from '@/content/homepage'
import { buildHomepageDryRun } from '@/lib/migration/homepage'
import assetMap from '@/lib/migration/homepage-asset-map.json'
import { sanityClient } from '@/lib/sanity/client'
import { loadHomepageContent } from '@/lib/sanity/fetch'
import { homepageQuery } from '@/lib/sanity/queries'

import { homepageContentOrFixture, resolveHomepageContent, type CmsHomepageDocument } from './cms'
import { homepageSectionOrder, localHomepageContent } from './model'

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: {
    fetch: vi.fn(),
    config: () => ({ perspective: 'published', useCdn: true }),
  },
}))

const dimensions = new Map(
  assetMap.assets.map((asset) => [asset.assetId, { width: asset.width, height: asset.height }]),
)

function expandImages(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(expandImages)
  if (!value || typeof value !== 'object') return value
  const record = value as Record<string, unknown>
  const asset = record.asset as { _ref?: string } | undefined
  if (record._type === 'image' && asset?._ref) {
    const size = dimensions.get(asset._ref)
    return {
      alt: record.alt,
      asset: {
        _id: asset._ref,
        metadata: { dimensions: size },
      },
    }
  }
  return Object.fromEntries(Object.entries(record).map(([key, child]) => [key, expandImages(child)]))
}

const publishedDocument = expandImages(buildHomepageDryRun().document) as CmsHomepageDocument

describe('homepage CMS content', () => {
  beforeEach(() => {
    vi.mocked(sanityClient.fetch).mockReset()
  })

  it('queries only the published homepage document', () => {
    expect(homepageQuery).toContain('*[_id == "homepage"][0]')
    expect(homepageQuery).not.toContain('drafts.homepage')
  })

  it('keeps the current homepage when nothing is published', () => {
    const local = localHomepageContent()
    expect(resolveHomepageContent(null)).toBeNull()
    expect(resolveHomepageContent({ _id: 'drafts.homepage' })).toBeNull()
    expect(homepageContentOrFixture(null)).toEqual(local)
    expect(local.source).toBe('fixture')
    expect(local.hero.headlineBefore).toBe(homepageHero.headlineBefore)
    expect(local.hero.badgeLines).toEqual(['Ooh,', 'amazing'])
    expect(local.hero.image.srcSet).toBeUndefined()
    expect(local.seo).toEqual(homepageSeo)
    expect(local.newsletter.confirmation).toContain('Placeholder confirmation')
    expect(local.experiences.cards.map((card) => card.className)).toEqual(
      homepageExperienceCards.map((card) => card.className),
    )
  })

  it('renders a complete published document with Sanity image URLs', () => {
    const content = resolveHomepageContent(publishedDocument)
    expect(content?.source).toBe('cms')
    expect(content?.hero.image.src).toContain('https://cdn.sanity.io/images/umbuxpyp/production/')
    expect(content?.hero.image.srcSet).toContain('1024w')
    expect(content?.hero.image.alt).toBe(homepageHero.image.alt)
    expect(content?.hero.badgeLines).toEqual(['Ooh,', 'amazing'])
    expect(content?.experiences.cards.map((card) => card.title)).toEqual(
      homepageExperienceCards.map((card) => card.title),
    )
    expect(content?.experiences.cards[0]?.cta.href).toBe('/experiences')
    expect(content?.media.videos[7]?.url).toContain('t=277s')
    expect(content?.media.videos[7]?.embedUrl).toContain('start=277')
    expect(content?.giftGoat.count).toBe(118)
    expect(content?.newsletter.confirmation).toBeNull()
    expect(content?.seo.title).toBe(homepageSeo.title)
    expect(JSON.stringify(content)).not.toContain('image-pending')
    expect(JSON.stringify(content)).not.toContain('drafts.homepage')
  })

  it('rejects incomplete CMS content instead of mixing it with the fixture', () => {
    const broken = {
      ...publishedDocument,
      headlineBefore: 'Changed in the CMS',
      heroCopy: '',
    }
    expect(resolveHomepageContent(broken)).toBeNull()
    const fallback = homepageContentOrFixture(broken)
    expect(fallback.source).toBe('fixture')
    expect(fallback.hero.headlineBefore).toBe(homepageHero.headlineBefore)
    expect(fallback.hero.headlineBefore).not.toBe('Changed in the CMS')
  })

  it('uses the fixture when the published query fails', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('network down'))
    await expect(loadHomepageContent()).resolves.toMatchObject({ source: 'fixture' })

    vi.mocked(sanityClient.fetch).mockResolvedValue(null as never)
    await expect(loadHomepageContent()).resolves.toMatchObject({
      source: 'fixture',
      seo: homepageSeo,
    })
  })

  it('keeps homepage sections in their current order', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/home/home-page.tsx'),
      'utf8',
    )
    const rendered = [...source.matchAll(/<(HeroSection|AwardsStrip|ExperiencesTeaser|OwnersSection|MediaSection|WelfareSection|StoreSection|ReviewsSection|NewsletterSection|UrbortSection|FaqSection)/g)].map(
      (match) => match[1],
    )
    expect(rendered).toEqual([
      'HeroSection',
      'AwardsStrip',
      'ExperiencesTeaser',
      'OwnersSection',
      'MediaSection',
      'WelfareSection',
      'StoreSection',
      'ReviewsSection',
      'NewsletterSection',
      'UrbortSection',
      'FaqSection',
    ])
    expect(homepageSectionOrder).toEqual([
      'hero',
      'awards',
      'experiences',
      'owners',
      'media',
      'welfare',
      'store',
      'reviews',
      'newsletter',
      'urbort',
      'faq',
    ])
  })
})
