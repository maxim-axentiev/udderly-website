import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { homepageFaqs } from '@/content/homepage-faqs'
import {
  homepageAwards,
  homepageExperienceCards,
  homepageHero,
  homepageMedia,
  homepageOwners,
  homepageReviews,
  homepageSeo,
  homepageStore,
  homepageUrbort,
  homepageWelfare,
} from '@/content/homepage'
import {
  HOMEPAGE_DOCUMENT_ID,
  HOMEPAGE_IMAGE_COUNT,
  buildHomepageDryRun,
  heroBadgeDiscrepancy,
  refuseHomepageWrites,
  repairHomepageEncoding,
} from '@/lib/migration/homepage'

const dryRun = buildHomepageDryRun()
const document = dryRun.document
const assetMap = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'src/lib/migration/homepage-asset-map.json'), 'utf8'),
) as {
  assets: Array<{ destinationField: string; assetId: string; alt: string | null }>
}
const source = fs.readFileSync(
  path.resolve(process.cwd(), 'src/content/homepage.ts'),
  'utf8',
)

describe('homepage migration content', () => {
  it('builds the homepage singleton from the fixture in section order', () => {
    expect(document._id).toBe(HOMEPAGE_DOCUMENT_ID)
    expect(document._type).toBe('homepage')
    expect(document.headlineBefore).toBe(homepageHero.headlineBefore)
    expect(document.headlineAccent).toBe(homepageHero.headlineAccent)
    expect(document.headlineAfter).toBe(homepageHero.headlineAfter)
    expect(document.heroCopy).toBe(homepageHero.copy)
    expect(document.heroCta).toEqual(homepageHero.cta)
    expect(document.heroSticker).toBe(homepageHero.sticker)
    expect(document.experienceCards.map((card) => card.title)).toEqual(
      homepageExperienceCards.map((card) => card.title),
    )
    expect(document.experienceCards.map((card) => card.cta.href)).toEqual([
      '/experiences',
      '/farm-glamping',
      '/corporate-training',
      '/animals-for-sale',
    ])
    expect(document.mediaVideos.map((video) => video.url)).toEqual(
      homepageMedia.videos.map((video) => video.url),
    )
    expect(document.welfarePoints.map((point) => point.name)).toEqual(
      homepageWelfare.points.map((point) => point.name),
    )
    expect(document.urbortArticles.map((article) => article.href)).toEqual([
      '/urbort-blog',
      '/urbort-blog',
      '/urbort-blog',
    ])
    expect(document.urbortArticles.map((article) => article.title)).toEqual(
      homepageUrbort.articles.map((article) => article.title),
    )
    expect(document.ownersMilestones).toEqual([...homepageOwners.milestones])
    expect(document.giftGoatCount).toBe(homepageStore.giftGoat.target)
    expect(document.seoTitle).toBe(homepageSeo.title)
    expect(document.seoDescription).toBe(homepageSeo.description)
    expect(document.ogTitle).toBe(homepageSeo.ogTitle)
    expect(document.ogDescription).toBe(homepageSeo.ogDescription)
    expect(document.awardsTitle).toBe(homepageAwards.title)
    expect(document.reviewsTitle).toBe(homepageReviews.title)
    expect(document.faqHeading).toBe('You have questions. We might have answers.')
  })

  it('keeps FAQ answers out of the homepage document', () => {
    const serialized = JSON.stringify(document)
    for (const faq of homepageFaqs) {
      expect(serialized).not.toContain(faq.q)
      expect(serialized).not.toContain(faq.a)
    }
    expect(dryRun.faqAnswers.includedInHomepageDocument).toBe(false)
    expect(dryRun.faqAnswers.answersRemainIn).toBe('siteSettings.homepageFaqs')
  })

  it('records every encoding repair and removes the corrupted sequences', () => {
    const rules = [
      { from: '\u00e2\u20ac\u2122', to: '\u2019', count: 14 },
      { from: '\u00e2\u20ac\u0153', to: '\u201c', count: 1 },
      { from: '\u00e2\u20ac\u009d', to: '\u201d', count: 1 },
      { from: '\u00e2\u20ac\u00a6', to: '\u2026', count: 3 },
      { from: '\u00e2\u201e\u00a2', to: '\u2122', count: 1 },
      { from: '\u00e2\u20ac\u201d', to: '\u2014', count: 1 },
    ]

    for (const rule of rules) {
      expect(source.split(rule.from).length - 1).toBe(rule.count)
    }

    const repairedCounts = new Map<string, number>()
    for (const correction of dryRun.encodingCorrections) {
      expect(correction.location).not.toBe('homepageNewsletter.confirmation')
      expect(source).toContain(correction.before)
      expect(correction.before).not.toBe(correction.after)
      expect(repairHomepageEncoding(correction.before).text).toBe(correction.after)
      for (const replacement of correction.replacements) {
        repairedCounts.set(
          replacement.from,
          (repairedCounts.get(replacement.from) ?? 0) + replacement.count,
        )
      }
    }

    for (const rule of rules) {
      const applied = rule.from === '\u00e2\u20ac\u201d' ? undefined : rule.count
      expect(repairedCounts.get(rule.from)).toBe(applied)
    }
    expect(JSON.stringify(document)).not.toContain('\u00e2\u20ac')
    expect(document.giftGoatCopy).toContain('\u2122')
    expect(document.ownersFastForward.endsWith('\u2026')).toBe(true)
  })

  it('leaves the optional newsletter confirmation unset and marks the document ready', () => {
    expect(dryRun.newsletterConfirmation.status).toBe('OMITTED')
    expect(dryRun.newsletterConfirmation.includedInDocument).toBe(false)
    expect(dryRun.newsletterConfirmation.schemaRequiresValue).toBe(false)
    expect(document).not.toHaveProperty('newsletterConfirmation')
    expect(JSON.stringify(document)).not.toContain('Placeholder confirmation')
    expect(JSON.stringify(document)).not.toContain('image-pending-')
    expect(dryRun.productionWrite.allowed).toBe(true)
    expect(dryRun.productionWrite.blockers).toEqual([])
    expect(dryRun.writesEnabled).toBe(false)
    expect(dryRun.uploadsEnabled).toBe(false)
  })

  it('maps the fixture hero badge and records the hardcoded component lines', () => {
    expect(heroBadgeDiscrepancy.componentLines.join('\n')).toBe(homepageHero.badge)
    expect(document.heroBadge).toBe(homepageHero.badge)
    expect(heroBadgeDiscrepancy.component).toBe('src/components/home/hero-section.tsx')
  })
})

describe('homepage image manifest', () => {
  it('covers every homepage WebP once, with checksums and existing alt text', () => {
    expect(dryRun.imageManifest).toHaveLength(HOMEPAGE_IMAGE_COUNT)
    const fields = dryRun.imageManifest.map((item) => item.destinationField)
    expect(new Set(fields).size).toBe(HOMEPAGE_IMAGE_COUNT)

    const fixtureSource = source
    for (const item of dryRun.imageManifest) {
      const absolute = path.resolve(process.cwd(), item.sourcePath)
      const file = fs.readFileSync(absolute)
      expect(file.subarray(0, 4).toString('ascii')).toBe('RIFF')
      expect(file.subarray(8, 12).toString('ascii')).toBe('WEBP')
      expect(item.bytes).toBe(file.byteLength)
      expect(item.sha256).toBe(createHash('sha256').update(file).digest('hex'))
      const mapped = assetMap.assets.find((asset) => asset.destinationField === item.destinationField)
      expect(mapped?.assetId).toBe(item.assetId)
      expect(item.assetId).toMatch(/^image-[a-f0-9]{40}-\d+x\d+-webp$/)
      expect(fixtureSource).toContain(item.sourcePath.replace('src/', '@/'))

      if (item.role === 'media-logo') {
        expect(item.alt).toBeNull()
        expect(item.altSource).toBe('missing')
      } else {
        expect(item.alt && item.alt.length > 0 && item.alt.length <= 160).toBe(true)
        expect(item.altSource).toBe('fixture')
      }
    }

    expect(dryRun.missingAlt.map((item) => item.sourcePath)).toEqual([
      'src/assets/home/ctv-logo.webp',
      'src/assets/home/global-news-logo.webp',
      'src/assets/home/bt-logo.webp',
      'src/assets/home/city-news-logo.webp',
      'src/assets/home/chch-logo.webp',
      'src/assets/home/fibe-logo.webp',
      'src/assets/home/rogers-logo.webp',
      'src/assets/home/yestv-logo.webp',
    ])
    expect(dryRun.imageManifest.filter((item) => item.role === 'decorative')).toHaveLength(8)

    const refs = JSON.stringify(document).match(/"_ref":"[^"]+"/g) ?? []
    expect(refs).toHaveLength(HOMEPAGE_IMAGE_COUNT)
    expect(JSON.stringify(document)).not.toContain('image-pending-')
    const expectedRefs = new Set(assetMap.assets.map((asset) => asset.assetId))
    for (const ref of refs) {
      expect(expectedRefs.has(ref.slice('"_ref":"'.length, -1))).toBe(true)
    }
  })
})

describe('homepage migration dry-run protection', () => {
  it('refuses write, apply, publish, and upload flags', () => {
    expect(refuseHomepageWrites([])).toBeUndefined()
    for (const flag of ['--apply', '--write', '--publish', '--upload']) {
      expect(refuseHomepageWrites([flag])).toMatch(/disabled/i)
    }
    expect(dryRun.writesEnabled).toBe(false)
    expect(dryRun.uploadsEnabled).toBe(false)
  })
})
