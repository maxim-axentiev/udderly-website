import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { homepageFaqs } from '../../content/homepage-faqs.ts'
import {
  homepageAwards,
  homepageExperienceCards,
  homepageHero,
  homepageMedia,
  homepageNewsletter,
  homepageOwners,
  homepageReviews,
  homepageSeo,
  homepageStore,
  homepageUrbort,
  homepageWelfare,
} from '../../content/homepage.ts'

export const HOMEPAGE_DOCUMENT_ID = 'homepage'
export const HOMEPAGE_IMAGE_COUNT = 41

const ENCODING_REPLACEMENTS = [
  { from: '\u00e2\u20ac\u2122', to: '\u2019', label: 'right single quotation mark' },
  { from: '\u00e2\u20ac\u0153', to: '\u201c', label: 'left double quotation mark' },
  { from: '\u00e2\u20ac\u009d', to: '\u201d', label: 'right double quotation mark' },
  { from: '\u00e2\u20ac\u00a6', to: '\u2026', label: 'ellipsis' },
  { from: '\u00e2\u201e\u00a2', to: '\u2122', label: 'trademark sign' },
  { from: '\u00e2\u20ac\u201d', to: '\u2014', label: 'em dash' },
] as const

export type EncodingReplacement = {
  from: string
  to: string
  label: string
  count: number
}

export type EncodingCorrection = {
  location: string
  source: 'src/content/homepage.ts'
  before: string
  after: string
  replacements: EncodingReplacement[]
}

export type ImageRole = 'meaningful' | 'decorative' | 'media-logo'

export type HomepageImageManifestItem = {
  sourcePath: string
  destinationField: string
  role: ImageRole
  alt: string | null
  altSource: 'fixture' | 'missing'
  bytes: number
  sha256: string
  assetId: string
}

type PendingImage = {
  _type: 'image'
  alt?: string
  asset: {
    _type: 'reference'
    _ref: string
  }
}

type HomepageCta = {
  label: string
  href: string
}

const repoRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../../..')

export const homepageComponentCopy = {
  experiencesHeadingFirst: 'Pick your',
  experiencesHeadingSecond: 'ridiculousness.',
  experiencesIntro: 'Four ways to get ridiculous, mischievous, and happy...ous.',
  reviewsReadFullLabel: 'Read full review',
  reviewsShowLessLabel: 'Show less',
  urbortCardLabel: 'Read the article',
  faqHeading: 'You have questions. We might have answers.',
  newsletterFirstNameLabel: 'First name (required)',
  newsletterFirstNamePlaceholder: 'Cheryl',
  newsletterEmailLabel: 'Email (required)',
  newsletterEmailPlaceholder: 'you@example.com',
  newsletterDateOfBirthLabel: 'Date of birth (required)',
  newsletterSubmitLabel: 'Sign me up',
} as const

export const homepageComponentCopySources = {
  experiencesHeadingFirst: 'src/components/home/experiences-teaser.tsx',
  experiencesHeadingSecond: 'src/components/home/experiences-teaser.tsx',
  experiencesIntro: 'src/components/home/experiences-teaser.tsx',
  reviewsReadFullLabel: 'src/components/home/reviews-carousel.tsx',
  reviewsShowLessLabel: 'src/components/home/reviews-carousel.tsx',
  urbortCardLabel: 'src/components/home/urbort-section.tsx',
  faqHeading: 'src/components/home/faq-section.tsx',
  newsletterFirstNameLabel: 'src/components/home/newsletter-section.tsx',
  newsletterFirstNamePlaceholder: 'src/components/home/newsletter-section.tsx',
  newsletterEmailLabel: 'src/components/home/newsletter-section.tsx',
  newsletterEmailPlaceholder: 'src/components/home/newsletter-section.tsx',
  newsletterDateOfBirthLabel: 'src/components/home/newsletter-section.tsx',
  newsletterSubmitLabel: 'src/components/home/newsletter-section.tsx',
} as const

/**
 * The fixture badge and the two lines painted by the hero component are the same
 * text. The component does not read homepageHero.badge.
 */
export const heroBadgeDiscrepancy = {
  fixtureField: 'homepageHero.badge',
  fixtureValue: homepageHero.badge,
  component: 'src/components/home/hero-section.tsx',
  componentLines: ['Ooh,', 'amazing'] as const,
  mappedFrom: 'homepageHero.badge' as const,
}

export const homepageCodeOwned = [
  {
    name: 'Section order, spacing, color, and animation',
    source: 'src/components/home/*',
  },
  {
    name: 'Experience card tilt classes',
    source: 'homepageExperienceCards[].className',
  },
  {
    name: 'Newsletter photo rotation and position',
    source: 'homepageNewsletter mobileAnimals.rotate and desktop position classes',
  },
  {
    name: 'URBORT card tilt',
    source: 'homepageUrbort.articles[].rotate',
  },
  {
    name: 'Award badge hover rotation',
    source: 'src/components/home/awards-strip.tsx',
  },
  {
    name: 'Image width and height attributes',
    source: 'HomeImageAsset width and height',
  },
  {
    name: 'Gift a Goat count-up animation',
    source: 'src/components/home/gift-goat-counter.tsx',
  },
  {
    name: 'Hero dots, blob, and photo frame',
    source: 'src/components/home/hero-section.tsx',
  },
  {
    name: 'Awards section accessible name',
    source: 'src/components/home/awards-strip.tsx',
    value: 'TripAdvisor awards',
  },
  {
    name: 'Previous and next controls for videos and reviews',
    source: 'src/components/home/media-carousel.tsx and reviews-carousel.tsx',
  },
  {
    name: 'Google star labels and the empty-rating mark',
    source: 'src/components/home/reviews-section.tsx',
  },
  {
    name: 'Newsletter input types, required flags, autocomplete, and submit behavior',
    source: 'src/components/home/newsletter-section.tsx',
  },
  {
    name: 'YouTube embed URL conversion',
    source: 'src/lib/youtube.ts',
  },
] as const

export function repairHomepageEncoding(value: string): {
  text: string
  replacements: EncodingReplacement[]
} {
  let text = value
  const replacements: EncodingReplacement[] = []

  for (const rule of ENCODING_REPLACEMENTS) {
    const count = text.split(rule.from).length - 1
    if (count === 0) continue
    replacements.push({ from: rule.from, to: rule.to, label: rule.label, count })
    text = text.replaceAll(rule.from, rule.to)
  }

  return { text, replacements }
}

function slugKey(prefix: string, value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${prefix}-${slug}`
}

type HomepageAssetMap = {
  projectId: string
  dataset: string
  assets: Array<{
    sourcePath: string
    destinationField: string
    sha256: string
    sha1: string
    assetId: string
    bytes: number
  }>
}

function loadHomepageAssetMap(): Map<string, HomepageAssetMap['assets'][number]> {
  const file = path.join(repoRoot, 'src/lib/migration/homepage-asset-map.json')
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as HomepageAssetMap
  if (parsed.projectId !== 'umbuxpyp' || parsed.dataset !== 'production') {
    throw new Error('Homepage asset map is not for project umbuxpyp dataset production.')
  }
  const byField = new Map<string, HomepageAssetMap['assets'][number]>()
  for (const asset of parsed.assets) {
    if (byField.has(asset.destinationField)) {
      throw new Error(`Duplicate asset mapping for ${asset.destinationField}.`)
    }
    if (!asset.assetId.startsWith(`image-${asset.sha1}-`)) {
      throw new Error(`Asset id does not match its checksum for ${asset.sourcePath}.`)
    }
    byField.set(asset.destinationField, asset)
  }
  return byField
}

function readWebp(sourcePath: string): { bytes: number; sha256: string } {
  const absolute = path.join(repoRoot, sourcePath)
  const file = fs.readFileSync(absolute)
  const riff = file.subarray(0, 4).toString('ascii')
  const webp = file.subarray(8, 12).toString('ascii')
  if (riff !== 'RIFF' || webp !== 'WEBP') {
    throw new Error(`${sourcePath} is not a WebP file.`)
  }
  return {
    bytes: file.byteLength,
    sha256: createHash('sha256').update(file).digest('hex'),
  }
}

type ImageSlot = {
  sourcePath: string
  destinationField: string
  role: ImageRole
  alt: string | null
}

function imageSlots(): ImageSlot[] {
  const slots: ImageSlot[] = [
    {
      sourcePath: 'src/assets/home/homepage-hero.webp',
      destinationField: 'heroImage',
      role: 'meaningful',
      alt: homepageHero.image.alt,
    },
  ]

  homepageAwards.badges.forEach((badge, index) => {
    slots.push({
      sourcePath: `src/assets/home/tripadvisor-${badge.year}.webp`,
      destinationField: `awardBadges[${index}].image`,
      role: 'meaningful',
      alt: badge.alt,
    })
  })

  const experienceFiles = [
    'src/assets/home/homepage-experiences.webp',
    'src/assets/home/homepage-glamping.webp',
    'src/assets/home/homepage-training.webp',
    'src/assets/home/homepage-animals-for-sale.webp',
  ]
  homepageExperienceCards.forEach((card, index) => {
    const sourcePath = experienceFiles[index]
    if (!sourcePath) throw new Error(`Missing experience image for ${card.title}.`)
    slots.push({
      sourcePath,
      destinationField: `experienceCards[${index}].image`,
      role: 'meaningful',
      alt: card.image.alt,
    })
  })

  slots.push(
    {
      sourcePath: 'src/assets/home/homepage-meet-the-owners-normal-photo.webp',
      destinationField: 'ownersFamilyImage',
      role: 'meaningful',
      alt: homepageOwners.family.alt,
    },
    {
      sourcePath: 'src/assets/home/meet-the-owners-funny-picture.webp',
      destinationField: 'ownersFunImage',
      role: 'meaningful',
      alt: homepageOwners.fun.alt,
    },
  )

  const logoFiles = [
    'src/assets/home/ctv-logo.webp',
    'src/assets/home/global-news-logo.webp',
    'src/assets/home/bt-logo.webp',
    'src/assets/home/city-news-logo.webp',
    'src/assets/home/chch-logo.webp',
    'src/assets/home/fibe-logo.webp',
    'src/assets/home/rogers-logo.webp',
    'src/assets/home/yestv-logo.webp',
  ]
  homepageMedia.videos.forEach((video, index) => {
    const sourcePath = logoFiles[index]
    if (!sourcePath) throw new Error(`Missing media logo for ${video.outlet}.`)
    slots.push({
      sourcePath,
      destinationField: `mediaVideos[${index}].logo`,
      role: 'media-logo',
      alt: null,
    })
  })

  homepageWelfare.points.forEach((point, index) => {
    slots.push({
      sourcePath: `src/assets/home/welfare-${index + 1}.webp`,
      destinationField: `welfarePoints[${index}].image`,
      role: 'meaningful',
      alt: point.image.alt,
    })
  })

  slots.push(
    {
      sourcePath: 'src/assets/home/homepage-store.webp',
      destinationField: 'marketImage',
      role: 'meaningful',
      alt: homepageStore.store.image.alt,
    },
    {
      sourcePath: 'src/assets/home/homepage-ice-cream.webp',
      destinationField: 'iceCreamImage',
      role: 'meaningful',
      alt: homepageStore.iceCream.image.alt,
    },
    {
      sourcePath: 'src/assets/home/homepage-gift-a-goat.webp',
      destinationField: 'giftGoatImage',
      role: 'meaningful',
      alt: homepageStore.giftGoat.image.alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-first-mobile.webp',
      destinationField: 'newsletterMobileFirst',
      role: 'decorative',
      alt: homepageNewsletter.mobileAnimals[0].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-second-mobile.webp',
      destinationField: 'newsletterMobileSecond',
      role: 'decorative',
      alt: homepageNewsletter.mobileAnimals[1].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-third-mobile.webp',
      destinationField: 'newsletterMobileThird',
      role: 'decorative',
      alt: homepageNewsletter.mobileAnimals[2].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-fourth-mobile.webp',
      destinationField: 'newsletterMobileFourth',
      role: 'decorative',
      alt: homepageNewsletter.mobileAnimals[3].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-left-upper-desktop.webp',
      destinationField: 'newsletterDesktopLeftUpper',
      role: 'decorative',
      alt: homepageNewsletter.leftAnimals[0].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-left-lower-desktop.webp',
      destinationField: 'newsletterDesktopLeftLower',
      role: 'decorative',
      alt: homepageNewsletter.leftAnimals[1].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-right-upper-desktop.webp',
      destinationField: 'newsletterDesktopRightUpper',
      role: 'decorative',
      alt: homepageNewsletter.rightAnimals[0].alt,
    },
    {
      sourcePath: 'src/assets/home/newsletter-right-lower-desktop.webp',
      destinationField: 'newsletterDesktopRightLower',
      role: 'decorative',
      alt: homepageNewsletter.rightAnimals[1].alt,
    },
  )

  const urbortFiles = [
    'src/assets/home/urbort-1.webp',
    'src/assets/home/urbort-2.webp',
    'src/assets/home/urbort-3.webp',
  ]
  homepageUrbort.articles.forEach((article, index) => {
    const sourcePath = urbortFiles[index]
    if (!sourcePath) throw new Error(`Missing URBORT image for ${article.title}.`)
    slots.push({
      sourcePath,
      destinationField: `urbortArticles[${index}].image`,
      role: 'meaningful',
      alt: article.image.alt,
    })
  })

  return slots
}

export function buildHomepageImageManifest(
  slots: ImageSlot[] = imageSlots(),
): HomepageImageManifestItem[] {
  const assetMap = loadHomepageAssetMap()
  const manifest = slots.map((slot) => {
    const file = readWebp(slot.sourcePath)
    const uploaded = assetMap.get(slot.destinationField)
    if (!uploaded || uploaded.sourcePath !== slot.sourcePath) {
      throw new Error(`Asset map is missing ${slot.destinationField}.`)
    }
    if (uploaded.sha256 !== file.sha256 || uploaded.bytes !== file.bytes) {
      throw new Error(`Asset map checksum does not match ${slot.sourcePath}.`)
    }
    return {
      sourcePath: slot.sourcePath,
      destinationField: slot.destinationField,
      role: slot.role,
      alt: slot.alt,
      altSource: slot.alt === null ? ('missing' as const) : ('fixture' as const),
      bytes: file.bytes,
      sha256: file.sha256,
      assetId: uploaded.assetId,
    }
  })
  if (assetMap.size !== manifest.length) {
    throw new Error('Asset map contains fields that are not in the homepage image list.')
  }

  const onDisk = fs
    .readdirSync(path.join(repoRoot, 'src/assets/home'))
    .filter((name) => name.endsWith('.webp'))
    .map((name) => `src/assets/home/${name}`)
    .sort()
  const mapped = manifest.map((item) => item.sourcePath).sort()
  if (mapped.length !== HOMEPAGE_IMAGE_COUNT || onDisk.join('\n') !== mapped.join('\n')) {
    throw new Error(
      `Homepage image coverage is ${mapped.length} mapped and ${onDisk.length} files on disk.`,
    )
  }

  return manifest
}

function pendingImage(item: HomepageImageManifestItem): PendingImage {
  const image: PendingImage = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: item.assetId,
    },
  }
  if (item.alt !== null) image.alt = item.alt
  return image
}

function manifestByField(manifest: HomepageImageManifestItem[]) {
  return new Map(manifest.map((item) => [item.destinationField, item]))
}

function imageAt(manifest: Map<string, HomepageImageManifestItem>, field: string): PendingImage {
  const item = manifest.get(field)
  if (!item) throw new Error(`Missing image manifest entry for ${field}.`)
  return pendingImage(item)
}

export function buildHomepageMigration() {
  const corrections: EncodingCorrection[] = []

  function text(location: string, value: string): string {
    const repaired = repairHomepageEncoding(value)
    if (repaired.text !== value) {
      corrections.push({
        location,
        source: 'src/content/homepage.ts',
        before: value,
        after: repaired.text,
        replacements: repaired.replacements,
      })
    }
    return repaired.text
  }

  function cta(location: string, value: { label: string; href: string }): HomepageCta {
    return { label: text(`${location}.label`, value.label), href: value.href }
  }

  const manifest = buildHomepageImageManifest()
  const images = manifestByField(manifest)

  const document = {
    _id: HOMEPAGE_DOCUMENT_ID,
    _type: 'homepage' as const,
    headlineBefore: homepageHero.headlineBefore,
    headlineAccent: homepageHero.headlineAccent,
    headlineAfter: homepageHero.headlineAfter,
    heroCopy: homepageHero.copy,
    heroCta: cta('homepageHero.cta', homepageHero.cta),
    heroImage: imageAt(images, 'heroImage'),
    heroSticker: homepageHero.sticker,
    heroBadge: homepageHero.badge,
    awardsTitle: homepageAwards.title,
    awardsCopy: homepageAwards.copy,
    awardBadges: homepageAwards.badges.map((badge, index) => ({
      _key: `award-${badge.year}`,
      year: badge.year,
      image: imageAt(images, `awardBadges[${index}].image`),
    })),
    experiencesHeadingFirst: homepageComponentCopy.experiencesHeadingFirst,
    experiencesHeadingSecond: homepageComponentCopy.experiencesHeadingSecond,
    experiencesIntro: homepageComponentCopy.experiencesIntro,
    experienceCards: homepageExperienceCards.map((card, index) => ({
      _key: slugKey('experience', card.fact),
      fact: card.fact,
      title: card.title,
      copy: text(`homepageExperienceCards[${index}].copy`, card.copy),
      image: imageAt(images, `experienceCards[${index}].image`),
      cta: cta(`homepageExperienceCards[${index}].cta`, card.cta),
    })),
    ownersKicker: homepageOwners.kicker,
    ownersTitle: homepageOwners.title,
    ownersParagraphs: homepageOwners.paragraphs.map((paragraph, index) =>
      text(`homepageOwners.paragraphs[${index}]`, paragraph),
    ),
    ownersFastForward: text('homepageOwners.fastForward', homepageOwners.fastForward),
    ownersMilestones: [...homepageOwners.milestones],
    ownersCta: cta('homepageOwners.cta', homepageOwners.cta),
    ownersFamilyImage: imageAt(images, 'ownersFamilyImage'),
    ownersFamilyCaption: homepageOwners.family.caption,
    ownersFunImage: imageAt(images, 'ownersFunImage'),
    ownersFunCaption: homepageOwners.fun.caption,
    mediaKicker: homepageMedia.kicker,
    mediaTitle: homepageMedia.title,
    mediaVideos: homepageMedia.videos.map((video, index) => ({
      _key: slugKey('media', video.outlet),
      outlet: video.outlet,
      url: video.url,
      logo: imageAt(images, `mediaVideos[${index}].logo`),
    })),
    mediaCta: cta('homepageMedia.cta', homepageMedia.cta),
    welfareKicker: homepageWelfare.kicker,
    welfareTitle: homepageWelfare.title,
    welfareHintDesktop: homepageWelfare.hintDesktop,
    welfareHintMobile: homepageWelfare.hintMobile,
    welfarePoints: homepageWelfare.points.map((point, index) => ({
      _key: `welfare-${index + 1}`,
      name: point.name,
      copy: text(`homepageWelfare.points[${index}].copy`, point.copy),
      image: imageAt(images, `welfarePoints[${index}].image`),
    })),
    welfareCta: cta('homepageWelfare.cta', homepageWelfare.cta),
    marketBadge: homepageStore.store.badge,
    marketTitle: homepageStore.store.title,
    marketCopy: text('homepageStore.store.copy', homepageStore.store.copy),
    marketCta: cta('homepageStore.store.cta', homepageStore.store.cta),
    marketImage: imageAt(images, 'marketImage'),
    iceCreamBadge: homepageStore.iceCream.badge,
    iceCreamTitle: homepageStore.iceCream.title,
    iceCreamParagraphs: homepageStore.iceCream.paragraphs.map((paragraph, index) =>
      text(`homepageStore.iceCream.paragraphs[${index}]`, paragraph),
    ),
    iceCreamCta: cta('homepageStore.iceCream.cta', homepageStore.iceCream.cta),
    iceCreamImage: imageAt(images, 'iceCreamImage'),
    giftGoatKicker: homepageStore.giftGoat.kicker,
    giftGoatTitle: homepageStore.giftGoat.title,
    giftGoatCopy: text('homepageStore.giftGoat.copy', homepageStore.giftGoat.copy),
    giftGoatCount: homepageStore.giftGoat.target,
    giftGoatCountLabel: homepageStore.giftGoat.countLabel,
    giftGoatImage: imageAt(images, 'giftGoatImage'),
    reviewsTitle: homepageReviews.title,
    reviewsAttribution: homepageReviews.googleAttribution,
    reviewsOrderNote: homepageReviews.googleOrderNote,
    reviewsUnavailable: text('homepageReviews.unavailableCopy', homepageReviews.unavailableCopy),
    reviewsReadMoreLabel: homepageReviews.readMoreLabel,
    reviewsReadFullLabel: homepageComponentCopy.reviewsReadFullLabel,
    reviewsShowLessLabel: homepageComponentCopy.reviewsShowLessLabel,
    reviewsCta: cta('homepageReviews.cta', homepageReviews.cta),
    newsletterTitle: homepageNewsletter.title,
    newsletterCopy: text('homepageNewsletter.copy', homepageNewsletter.copy),
    newsletterFirstNameLabel: homepageComponentCopy.newsletterFirstNameLabel,
    newsletterFirstNamePlaceholder: homepageComponentCopy.newsletterFirstNamePlaceholder,
    newsletterEmailLabel: homepageComponentCopy.newsletterEmailLabel,
    newsletterEmailPlaceholder: homepageComponentCopy.newsletterEmailPlaceholder,
    newsletterDateOfBirthLabel: homepageComponentCopy.newsletterDateOfBirthLabel,
    newsletterSubmitLabel: homepageComponentCopy.newsletterSubmitLabel,
    newsletterMobileFirst: imageAt(images, 'newsletterMobileFirst'),
    newsletterMobileSecond: imageAt(images, 'newsletterMobileSecond'),
    newsletterMobileThird: imageAt(images, 'newsletterMobileThird'),
    newsletterMobileFourth: imageAt(images, 'newsletterMobileFourth'),
    newsletterDesktopLeftUpper: imageAt(images, 'newsletterDesktopLeftUpper'),
    newsletterDesktopLeftLower: imageAt(images, 'newsletterDesktopLeftLower'),
    newsletterDesktopRightUpper: imageAt(images, 'newsletterDesktopRightUpper'),
    newsletterDesktopRightLower: imageAt(images, 'newsletterDesktopRightLower'),
    urbortTitle: homepageUrbort.title,
    urbortCopy: homepageUrbort.copy,
    urbortCardLabel: homepageComponentCopy.urbortCardLabel,
    urbortArticles: homepageUrbort.articles.map((article, index) => ({
      _key: `urbort-${index + 1}`,
      title: article.title,
      href: article.href,
      image: imageAt(images, `urbortArticles[${index}].image`),
    })),
    urbortCta: cta('homepageUrbort.cta', homepageUrbort.cta),
    faqHeading: homepageComponentCopy.faqHeading,
    seoTitle: homepageSeo.title,
    seoDescription: homepageSeo.description,
    ogTitle: homepageSeo.ogTitle,
    ogDescription: homepageSeo.ogDescription,
  }

  const validationIssues = validateHomepageDocument(document)
  if (validationIssues.length > 0) {
    throw new Error(`Homepage migration failed validation:\n${validationIssues.join('\n')}`)
  }

  return {
    document,
    imageManifest: manifest,
    encodingCorrections: corrections,
    newsletterConfirmation: {
      status: 'OMITTED' as const,
      includedInDocument: false,
      schemaRequiresValue: false,
      source: 'src/content/homepage.ts homepageNewsletter.confirmation',
      reason:
        'The field is optional because the newsletter form is not yet functional. The developer placeholder is not copied. The field can be filled later when the form is working.',
    },
  }
}

const STRING_LIMITS: Record<string, number> = {
  headlineBefore: 40,
  headlineAccent: 40,
  headlineAfter: 40,
  heroCopy: 500,
  heroSticker: 40,
  heroBadge: 40,
  awardsTitle: 80,
  awardsCopy: 120,
  experiencesHeadingFirst: 40,
  experiencesHeadingSecond: 40,
  experiencesIntro: 240,
  ownersKicker: 40,
  ownersTitle: 80,
  ownersFastForward: 80,
  ownersFamilyCaption: 40,
  ownersFunCaption: 80,
  mediaKicker: 40,
  mediaTitle: 80,
  welfareKicker: 40,
  welfareTitle: 120,
  welfareHintDesktop: 60,
  welfareHintMobile: 60,
  marketBadge: 40,
  marketTitle: 80,
  marketCopy: 1200,
  iceCreamBadge: 40,
  iceCreamTitle: 80,
  giftGoatKicker: 40,
  giftGoatTitle: 80,
  giftGoatCopy: 800,
  giftGoatCountLabel: 40,
  reviewsTitle: 120,
  reviewsAttribution: 80,
  reviewsOrderNote: 80,
  reviewsUnavailable: 300,
  reviewsReadMoreLabel: 40,
  reviewsReadFullLabel: 40,
  reviewsShowLessLabel: 40,
  newsletterTitle: 80,
  newsletterCopy: 500,
  newsletterFirstNameLabel: 40,
  newsletterFirstNamePlaceholder: 40,
  newsletterEmailLabel: 40,
  newsletterEmailPlaceholder: 80,
  newsletterDateOfBirthLabel: 40,
  newsletterSubmitLabel: 40,
  newsletterConfirmation: 200,
  urbortTitle: 40,
  urbortCopy: 800,
  urbortCardLabel: 40,
  faqHeading: 120,
  seoTitle: 70,
  seoDescription: 180,
  ogTitle: 70,
  ogDescription: 200,
}

function isHref(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//') && !/\s/.test(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isVideoUrl(value: string): boolean {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    return (
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host === 'vimeo.com' ||
      host === 'player.vimeo.com'
    )
  } catch {
    return false
  }
}

function checkString(issues: string[], field: string, value: unknown, max: number, required = true) {
  if (typeof value !== 'string' || (required && value.trim() === '')) {
    issues.push(`${field} must be a non-empty string.`)
    return
  }
  if (value.length > max) issues.push(`${field} is ${value.length} characters; limit is ${max}.`)
}

function checkImage(issues: string[], field: string, value: unknown, altRequired: boolean) {
  if (!value || typeof value !== 'object') {
    issues.push(`${field} must be an image placeholder.`)
    return
  }
  const image = value as PendingImage
  if (image._type !== 'image') issues.push(`${field} must use _type image.`)
  if (
    image.asset?._type !== 'reference' ||
    !/^image-[a-f0-9]{40}-\d+x\d+-webp$/.test(image.asset._ref)
  ) {
    issues.push(`${field} must reference an uploaded Sanity image asset.`)
  }
  if (altRequired) {
    checkString(issues, `${field}.alt`, image.alt, 160)
  } else if (image.alt !== undefined) {
    checkString(issues, `${field}.alt`, image.alt, 160, false)
  }
}

function checkCta(issues: string[], field: string, value: unknown) {
  if (!value || typeof value !== 'object') {
    issues.push(`${field} must be a button.`)
    return
  }
  const button = value as HomepageCta
  checkString(issues, `${field}.label`, button.label, 80)
  if (typeof button.href !== 'string' || !isHref(button.href)) {
    issues.push(`${field}.href must be a site path or an http(s) URL.`)
  }
}

export function validateHomepageDocument(document: {
  giftGoatCount: number
  awardBadges: Array<{ year: string; image: PendingImage }>
  experienceCards: Array<{ fact: string; title: string; copy: string; image: PendingImage; cta: HomepageCta }>
  ownersParagraphs: string[]
  ownersMilestones: readonly string[]
  mediaVideos: Array<{ outlet: string; url: string; logo: PendingImage }>
  welfarePoints: Array<{ name: string; copy: string; image: PendingImage }>
  iceCreamParagraphs: string[]
  urbortArticles: Array<{ title: string; href: string; image: PendingImage }>
  heroCta: HomepageCta
  ownersCta: HomepageCta
  mediaCta: HomepageCta
  welfareCta: HomepageCta
  marketCta: HomepageCta
  iceCreamCta: HomepageCta
  reviewsCta: HomepageCta
  urbortCta: HomepageCta
  [key: string]: unknown
}): string[] {
  const issues: string[] = []
  const record = document as unknown as Record<string, unknown>

  for (const [field, max] of Object.entries(STRING_LIMITS)) {
    if (field === 'newsletterConfirmation') continue
    const optional = field === 'newsletterFirstNamePlaceholder' || field === 'newsletterEmailPlaceholder'
    checkString(issues, field, record[field], max, !optional)
  }
  if ('newsletterConfirmation' in record) {
    checkString(issues, 'newsletterConfirmation', record.newsletterConfirmation, 200, false)
    if (
      typeof record.newsletterConfirmation === 'string' &&
      record.newsletterConfirmation.includes('Placeholder confirmation')
    ) {
      issues.push('newsletterConfirmation must not use the developer placeholder.')
    }
  }

  checkCta(issues, 'heroCta', document.heroCta)
  checkCta(issues, 'ownersCta', document.ownersCta)
  checkCta(issues, 'mediaCta', document.mediaCta)
  checkCta(issues, 'welfareCta', document.welfareCta)
  checkCta(issues, 'marketCta', document.marketCta)
  checkCta(issues, 'iceCreamCta', document.iceCreamCta)
  checkCta(issues, 'reviewsCta', document.reviewsCta)
  checkCta(issues, 'urbortCta', document.urbortCta)

  const imageFields = [
    'heroImage',
    'ownersFamilyImage',
    'ownersFunImage',
    'marketImage',
    'iceCreamImage',
    'giftGoatImage',
    'newsletterMobileFirst',
    'newsletterMobileSecond',
    'newsletterMobileThird',
    'newsletterMobileFourth',
    'newsletterDesktopLeftUpper',
    'newsletterDesktopLeftLower',
    'newsletterDesktopRightUpper',
    'newsletterDesktopRightLower',
  ]
  for (const field of imageFields) checkImage(issues, field, record[field], true)

  if (!Number.isInteger(document.giftGoatCount) || document.giftGoatCount < 0 || document.giftGoatCount > 100000) {
    issues.push('giftGoatCount must be an integer from 0 to 100000.')
  }

  if (document.awardBadges.length < 1 || document.awardBadges.length > 8) {
    issues.push('awardBadges must contain 1 to 8 items.')
  }
  document.awardBadges.forEach((badge, index) => {
    checkString(issues, `awardBadges[${index}].year`, badge.year, 8)
    checkImage(issues, `awardBadges[${index}].image`, badge.image, true)
  })

  if (document.experienceCards.length < 1 || document.experienceCards.length > 4) {
    issues.push('experienceCards must contain 1 to 4 items.')
  }
  document.experienceCards.forEach((card, index) => {
    checkString(issues, `experienceCards[${index}].fact`, card.fact, 24)
    checkString(issues, `experienceCards[${index}].title`, card.title, 80)
    checkString(issues, `experienceCards[${index}].copy`, card.copy, 500)
    checkImage(issues, `experienceCards[${index}].image`, card.image, true)
    checkCta(issues, `experienceCards[${index}].cta`, card.cta)
  })

  if (document.ownersParagraphs.length < 1 || document.ownersParagraphs.length > 8) {
    issues.push('ownersParagraphs must contain 1 to 8 items.')
  }
  document.ownersParagraphs.forEach((paragraph, index) => {
    checkString(issues, `ownersParagraphs[${index}]`, paragraph, 2000)
  })
  if (document.ownersMilestones.length < 1 || document.ownersMilestones.length > 12) {
    issues.push('ownersMilestones must contain 1 to 12 items.')
  }
  document.ownersMilestones.forEach((milestone, index) => {
    checkString(issues, `ownersMilestones[${index}]`, milestone, 80)
  })

  if (document.mediaVideos.length < 1 || document.mediaVideos.length > 8) {
    issues.push('mediaVideos must contain 1 to 8 items.')
  }
  document.mediaVideos.forEach((video, index) => {
    checkString(issues, `mediaVideos[${index}].outlet`, video.outlet, 40)
    if (!isVideoUrl(video.url)) issues.push(`mediaVideos[${index}].url must be a YouTube or Vimeo URL.`)
    checkImage(issues, `mediaVideos[${index}].logo`, video.logo, false)
  })

  if (document.welfarePoints.length < 1 || document.welfarePoints.length > 8) {
    issues.push('welfarePoints must contain 1 to 8 items.')
  }
  document.welfarePoints.forEach((point, index) => {
    checkString(issues, `welfarePoints[${index}].name`, point.name, 40)
    checkString(issues, `welfarePoints[${index}].copy`, point.copy, 800)
    checkImage(issues, `welfarePoints[${index}].image`, point.image, true)
  })

  if (document.iceCreamParagraphs.length < 1 || document.iceCreamParagraphs.length > 8) {
    issues.push('iceCreamParagraphs must contain 1 to 8 items.')
  }
  document.iceCreamParagraphs.forEach((paragraph, index) => {
    checkString(issues, `iceCreamParagraphs[${index}]`, paragraph, 2000)
  })

  if (document.urbortArticles.length < 1 || document.urbortArticles.length > 3) {
    issues.push('urbortArticles must contain 1 to 3 items.')
  }
  document.urbortArticles.forEach((article, index) => {
    checkString(issues, `urbortArticles[${index}].title`, article.title, 80)
    if (!isHref(article.href)) issues.push(`urbortArticles[${index}].href must be a site path or an http(s) URL.`)
    checkImage(issues, `urbortArticles[${index}].image`, article.image, true)
  })

  const serialized = JSON.stringify(document)
  for (const faq of homepageFaqs) {
    if (serialized.includes(faq.q)) issues.push(`FAQ answer was copied into the homepage document: ${faq.q}`)
  }
  for (const rule of ENCODING_REPLACEMENTS) {
    if (serialized.includes(rule.from)) issues.push(`Encoding corruption remains in the homepage document: ${rule.label}.`)
  }

  return issues
}

export function buildHomepageDryRun() {
  const migration = buildHomepageMigration()
  const missingAlt = migration.imageManifest.filter((item) => item.altSource === 'missing')
  const serialized = JSON.stringify(migration.document)
  const imageRefs = serialized.match(/"_ref":"image-[a-f0-9]{40}-\d+x\d+-webp"/g) ?? []
  const blockers: string[] = []
  if ('newsletterConfirmation' in migration.document) {
    blockers.push('newsletterConfirmation is present. Leave it unset until approved copy exists.')
  }
  if (serialized.includes('Placeholder confirmation') || serialized.includes('image-pending-')) {
    blockers.push('The document still contains a placeholder confirmation or image reference.')
  }
  if (
    migration.imageManifest.length !== HOMEPAGE_IMAGE_COUNT ||
    imageRefs.length !== HOMEPAGE_IMAGE_COUNT
  ) {
    blockers.push('The document does not contain exactly 41 uploaded image references.')
  }

  return {
    mode: 'dry-run' as const,
    writesEnabled: false,
    uploadsEnabled: false,
    projectId: 'umbuxpyp',
    dataset: 'production',
    documentId: HOMEPAGE_DOCUMENT_ID,
    productionWrite: {
      allowed: blockers.length === 0,
      blockers,
    },
    newsletterConfirmation: migration.newsletterConfirmation,
    heroBadgeDiscrepancy,
    encodingCorrections: migration.encodingCorrections,
    componentCopySources: homepageComponentCopySources,
    faqAnswers: {
      includedInHomepageDocument: false,
      headingOnly: migration.document.faqHeading,
      answersRemainIn: 'siteSettings.homepageFaqs',
    },
    externalData: [
      'Google review text, ratings, author photos, and the Maps URL stay in the Google Places feed.',
      'Newsletter subscriber records stay outside Sanity. The homepage document stores form labels and leaves the confirmation empty.',
      'FareHarbor booking inventory stays external. Homepage buttons keep their existing page paths.',
    ],
    codeOwned: homepageCodeOwned,
    missingAlt,
    imageManifest: migration.imageManifest,
    document: migration.document,
    limitations: [
      'This dry-run does not query or write to Sanity and does not upload images.',
      'Image fields use the asset ids already recorded in homepage-asset-map.json.',
      'The newsletter confirmation is omitted. The field is optional until the signup form is working.',
      'FAQ questions and answers are not copied. They already live on siteSettings.homepageFaqs.',
      'The hero badge is stored from the fixture. The live hero still draws those two lines in code.',
    ],
  }
}

export function formatHomepageDryRun(): string {
  return `${JSON.stringify(buildHomepageDryRun(), null, 2)}\n`
}

export function refuseHomepageWrites(argv: readonly string[]): string | undefined {
  if (
    argv.includes('--apply') ||
    argv.includes('--write') ||
    argv.includes('--publish') ||
    argv.includes('--upload')
  ) {
    return 'Homepage migration writes and uploads are disabled. Dry-run only until explicit approval.'
  }

  return undefined
}
