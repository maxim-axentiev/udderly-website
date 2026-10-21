import { hasPortableText } from '@/lib/portable-text'
import { cmsImageUrl } from '@/lib/sanity/image'
import type { PortableTextContent, SanityImage } from '@/lib/sanity/types'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type {
  CmsFaq,
  CmsFaqPage,
  CmsFaqSection,
  CmsOurStoryPage,
  CmsSeo,
  CmsStoryChapter,
  CmsTeamMember,
  CmsTeamPage,
  CmsVisionValuesPage,
} from './cms'
import type { AboutImages } from './images'
import {
  DEFAULT_FAQ_GROUPS,
  FAQ_CATEGORY_LABELS,
  faqPageFallback,
  ourStoryFallback,
  teamPageFallback,
  visionValuesFallback,
  type AboutCta,
  type AboutPicture,
  type AboutTone,
  type FaqEntry,
  type FaqGroup,
  type FaqPage,
  type OurStoryPage,
  type StoryChapter,
  type TeamPage,
  type TeamProfile,
  type VisionValuesPage,
} from './model'

const TONES = new Set<AboutTone>(['default', 'beige', 'blue'])

function clean(value: string | null | undefined): string | undefined {
  const text = value?.trim()
  return text ? text : undefined
}

function text(value: string | null | undefined, fallback: string): string {
  return clean(value) ?? fallback
}

function lines(value: Array<string | null> | null | undefined): string[] {
  return (value ?? []).map((item) => clean(item)).filter((item): item is string => Boolean(item))
}

function href(value: string | null | undefined, fallback: string): string {
  const raw = clean(value)
  if (!raw) return fallback
  if (raw.startsWith('#') && raw.length > 1 && !/\s/.test(raw)) return raw
  if (raw.startsWith('/') && !raw.startsWith('//') && !/\s/.test(raw)) return raw
  try {
    const url = new URL(raw)
    if (url.protocol === 'http:' || url.protocol === 'https:') return raw
  } catch {
    return fallback
  }
  return fallback
}

function picture(
  image: SanityImage | null | undefined,
  fallback: AboutPicture,
  width: number,
): AboutPicture {
  const src = cmsImageUrl(image ?? undefined, width)
  if (!src) return fallback
  return { src, alt: text(image?.alt, fallback.alt) }
}

function galleryPictures(
  images: SanityImage[] | null | undefined,
  fallback: AboutPicture[],
): AboutPicture[] {
  const photos = (images ?? [])
    .map((image) => {
      const src = cmsImageUrl(image ?? undefined, 1200)
      const alt = clean(image?.alt)
      return src && alt ? { src, alt } : null
    })
    .filter((image): image is AboutPicture => Boolean(image))
  return photos.length ? photos : fallback
}

function seoFor(
  seo: CmsSeo | undefined,
  fallback: PageSeoInput,
  imageWidth = 1200,
): PageSeoInput {
  const description = text(seo?.description, fallback.description ?? '')
  const override = clean(seo?.description)
  return {
    title: text(seo?.title, fallback.title),
    description,
    ogDescription: override ? description : fallback.ogDescription,
    path: fallback.path,
    noindex: seo?.noIndex === true,
    imageUrl: cmsImageUrl(seo?.image ?? undefined, imageWidth),
  }
}

function tone(value: string | null | undefined, fallback: AboutTone): AboutTone {
  return value && TONES.has(value as AboutTone) ? (value as AboutTone) : fallback
}

function mergeChapter(fallback: StoryChapter, chapter: CmsStoryChapter): StoryChapter {
  const paragraphs = lines(chapter.paragraphs)
  const signOff =
    chapter.showSignOff === false
      ? undefined
      : chapter.showSignOff === true || fallback.signOff
        ? {
            name: text(chapter.signOffName, fallback.signOff?.name ?? 'Cheryl'),
            ctaLabel: text(chapter.ctaLabel, fallback.signOff?.ctaLabel ?? 'Book an Experience'),
            ctaHref: href(chapter.ctaHref, fallback.signOff?.ctaHref ?? '/experiences'),
          }
        : undefined
  return {
    id: fallback.id,
    title: text(chapter.title, fallback.title),
    paragraphs: paragraphs.length ? paragraphs : fallback.paragraphs,
    image: picture(chapter.image, fallback.image, 1400),
    imageOnLeft: typeof chapter.imageOnLeft === 'boolean' ? chapter.imageOnLeft : fallback.imageOnLeft,
    tone: tone(chapter.tone, fallback.tone),
    ...(signOff ? { signOff } : {}),
  }
}

function extraChapter(chapter: CmsStoryChapter): StoryChapter | null {
  const title = clean(chapter.title)
  const paragraphs = lines(chapter.paragraphs)
  const src = cmsImageUrl(chapter.image ?? undefined, 1400)
  const alt = clean(chapter.image?.alt)
  if (!title || !paragraphs.length || !src || !alt) return null
  const id = clean(chapter.sectionId) ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const signOff =
    chapter.showSignOff === true
      ? {
          name: text(chapter.signOffName, 'Cheryl'),
          ctaLabel: text(chapter.ctaLabel, 'Book an Experience'),
          ctaHref: href(chapter.ctaHref, '/experiences'),
        }
      : undefined
  return {
    id: id || 'story',
    title,
    paragraphs,
    image: { src, alt },
    imageOnLeft: chapter.imageOnLeft === true,
    tone: tone(chapter.tone, 'default'),
    ...(signOff ? { signOff } : {}),
  }
}

function chaptersFor(page: CmsOurStoryPage | null, fallback: StoryChapter[]): StoryChapter[] {
  const incoming = page?.chapters ?? []
  if (!incoming.length) return fallback
  const known = new Set(fallback.map((chapter) => chapter.id))
  const byId = new Map(
    incoming
      .map((chapter) => [clean(chapter.sectionId), chapter] as const)
      .filter((entry): entry is [string, CmsStoryChapter] => Boolean(entry[0])),
  )
  const merged = fallback.flatMap((chapter) => {
    const override = byId.get(chapter.id)
    if (!override) return [chapter]
    if (override.enabled === false) return []
    return [mergeChapter(chapter, override)]
  })
  const extras = incoming.flatMap((chapter) => {
    const id = clean(chapter.sectionId)
    if (id && known.has(id)) return []
    if (chapter.enabled === false) return []
    const built = extraChapter(chapter)
    return built ? [built] : []
  })
  return [...merged, ...extras]
}

export function resolveOurStory(page: CmsOurStoryPage | null, images: AboutImages): OurStoryPage {
  const fallback = ourStoryFallback(images)
  return {
    hero: {
      lead: text(page?.heroLead, fallback.hero.lead),
      accent: text(page?.heroAccent, fallback.hero.accent),
      intro: text(page?.heroIntro, fallback.hero.intro),
      image: picture(page?.heroImage, fallback.hero.image, 1920),
    },
    chapters: chaptersFor(page, fallback.chapters),
    seo: seoFor(page?.seo, fallback.seo),
  }
}

function ctaFor(
  source: {
    showCta?: boolean | null
    ctaHeading?: string | null
    ctaBody?: string | null
    ctaLabel?: string | null
    ctaHref?: string | null
  } | null,
  fallback: AboutCta | null,
): AboutCta | null {
  if (!fallback || source?.showCta === false) return null
  const body = clean(source?.ctaBody) ?? fallback.body
  return {
    heading: text(source?.ctaHeading, fallback.heading),
    ...(body ? { body } : {}),
    label: text(source?.ctaLabel, fallback.label),
    href: href(source?.ctaHref, fallback.href),
  }
}

export function resolveVisionValues(
  page: CmsVisionValuesPage | null,
  images: AboutImages,
): VisionValuesPage {
  const fallback = visionValuesFallback(images)
  const paragraphs = lines(page?.visionParagraphs)
  const values = (page?.values ?? [])
    .map((value) => {
      const title = clean(value.title)
      const description = clean(value.description)
      return title && description ? { title, description } : null
    })
    .filter((value): value is { title: string; description: string } => Boolean(value))
  return {
    hero: {
      lead: text(page?.heroLead, fallback.hero.lead),
      accent: text(page?.heroAccent, fallback.hero.accent),
      image: picture(page?.heroImage, fallback.hero.image, 1920),
    },
    vision:
      page?.showVision === false || !fallback.vision
        ? null
        : {
            heading: text(page?.visionHeading, fallback.vision.heading),
            paragraphs: paragraphs.length ? paragraphs : fallback.vision.paragraphs,
            image: picture(page?.visionImage, fallback.vision.image, 1400),
          },
    gallery:
      page?.showGallery === false || !fallback.gallery
        ? null
        : galleryPictures(page?.gallery, fallback.gallery),
    values:
      page?.showValues === false || !fallback.values
        ? null
        : {
            heading: text(page?.valuesHeading, fallback.values.heading),
            image: picture(page?.valuesImage, fallback.values.image, 1400),
            items: values.length ? values : fallback.values.items,
          },
    cta: ctaFor(page, fallback.cta),
    seo: seoFor(page?.seo, fallback.seo),
  }
}

function publishedMember(member: CmsTeamMember): boolean {
  return Boolean(
    member &&
      clean(member.name) &&
      member.active !== false &&
      member._id &&
      !member._id.startsWith('drafts.'),
  )
}

function memberProfile(member: CmsTeamMember, factLabel: string): TeamProfile | null {
  const name = clean(member.name)
  if (!name || !member._id) return null
  const role = clean(member.role)
  const fact = clean(member.ridiculousFact)
  const src = cmsImageUrl(member.photo ?? undefined, 1200)
  const alt = clean(member.photo?.alt)
  return {
    id: member._id,
    name,
    ...(role ? { role } : {}),
    paragraphs: [],
    ...(hasPortableText(member.bio) ? { bio: member.bio } : {}),
    ...(fact ? { fact: fact.startsWith(factLabel) ? fact.slice(factLabel.length).trim() : fact } : {}),
    ...(src && alt ? { image: { src, alt } } : {}),
    placeholder: false,
  }
}

export function resolveTeam(
  page: CmsTeamPage | null,
  members: CmsTeamMember[] | null | undefined,
  images: AboutImages,
): TeamPage {
  const fallback = teamPageFallback(images)
  const factLabel = text(page?.factLabel, fallback.factLabel)
  const published = (members ?? [])
    .filter(publishedMember)
    .sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100) || (a.name ?? '').localeCompare(b.name ?? ''))
    .map((member) => memberProfile(member, factLabel))
    .filter((member): member is TeamProfile => Boolean(member))
  return {
    hero: {
      lead: text(page?.heroLead, fallback.hero.lead),
      accent: text(page?.heroAccent, fallback.hero.accent),
      intro: text(page?.heroIntro, fallback.hero.intro),
      image: picture(page?.heroImage, fallback.hero.image, 1920),
    },
    factLabel,
    members: published.length ? published : fallback.members,
    placeholders: published.length === 0,
    cta: ctaFor(page, fallback.cta),
    seo: seoFor(page?.seo, fallback.seo),
  }
}

function publishedFaq(faq: CmsFaq | null | undefined): faq is CmsFaq & { _id: string; question: string; answer: PortableTextContent } {
  return Boolean(
    faq?._id &&
      !faq._id.startsWith('drafts.') &&
      faq.active !== false &&
      clean(faq.question) &&
      hasPortableText(faq.answer),
  )
}

function sortFaqs(faqs: CmsFaq[]): CmsFaq[] {
  return [...faqs].sort(
    (a, b) =>
      (a.sortOrder ?? 100) - (b.sortOrder ?? 100) ||
      (a.question ?? '').localeCompare(b.question ?? ''),
  )
}

function toEntry(faq: CmsFaq): FaqEntry {
  return {
    id: faq._id ?? '',
    question: clean(faq.question) ?? '',
    answer: faq.answer ?? [],
  }
}

function groupByCategory(faqs: CmsFaq[]): FaqGroup[] {
  const categories = [...new Set(faqs.map((faq) => clean(faq.category) ?? 'general'))]
  return categories.flatMap((category) => {
    const items = faqs.filter((faq) => (clean(faq.category) ?? 'general') === category).map(toEntry)
    if (!items.length) return []
    return [
      {
        id: category,
        title: FAQ_CATEGORY_LABELS[category] ?? category,
        items,
      },
    ]
  })
}

function defaultGroups(faqs: CmsFaq[]): FaqGroup[] {
  const used = new Set<string>()
  const groups = DEFAULT_FAQ_GROUPS.flatMap((group) => {
    const items = faqs.filter((faq) => group.categories.includes(clean(faq.category) ?? 'general'))
    items.forEach((faq) => used.add(faq._id ?? ''))
    if (!items.length) return []
    return [{ id: group.id, title: group.title, items: items.map(toEntry) }]
  })
  const rest = faqs.filter((faq) => !used.has(faq._id ?? ''))
  return [...groups, ...groupByCategory(rest)]
}

function sectionItems(section: CmsFaqSection, faqs: CmsFaq[], used: Set<string>): CmsFaq[] {
  const picked = (section.questions ?? []).filter(publishedFaq)
  if (picked.length) return picked.filter((faq) => !used.has(faq._id))
  const categories = new Set((section.categories ?? []).map((category) => clean(category)).filter(Boolean))
  if (!categories.size) return []
  return faqs.filter(
    (faq) => categories.has(clean(faq.category) ?? 'general') && !used.has(faq._id ?? ''),
  )
}

export function resolveFaqPage(
  page: CmsFaqPage | null,
  faqs: CmsFaq[] | null | undefined,
  images: AboutImages,
): FaqPage {
  const fallback = faqPageFallback(images)
  const published = sortFaqs((faqs ?? []).filter(publishedFaq))
  const cmsSections = page?.sections ?? []
  const usable = cmsSections.filter(
    (section) =>
      section.enabled !== false &&
      ((section.questions ?? []).some(publishedFaq) ||
        (section.categories ?? []).some((category) => clean(category))),
  )
  let groups: FaqGroup[]
  if (!usable.length) {
    groups = defaultGroups(published)
  } else {
    const used = new Set<string>()
    groups = usable.flatMap((section, index) => {
      const items = sectionItems(section, published, used)
      items.forEach((faq) => used.add(faq._id ?? ''))
      if (!items.length) return []
      return [
        {
          id: `group-${index + 1}`,
          title: text(section.title, 'Questions'),
          items: items.map(toEntry),
        },
      ]
    })
    const suppressed = new Set<string>()
    for (const section of cmsSections) {
      if (section.enabled !== false) continue
      for (const faq of section.questions ?? []) {
        if (faq?._id) suppressed.add(faq._id)
      }
      for (const category of section.categories ?? []) {
        const value = clean(category)
        if (value) suppressed.add(`category:${value}`)
      }
    }
    const rest = published.filter(
      (faq) =>
        !used.has(faq._id ?? '') &&
        !suppressed.has(faq._id ?? '') &&
        !suppressed.has(`category:${clean(faq.category) ?? 'general'}`),
    )
    groups = [...groups, ...groupByCategory(rest)]
  }
  return {
    hero: {
      lead: text(page?.heroLead, fallback.hero.lead),
      accent: text(page?.heroAccent, fallback.hero.accent),
      image: picture(page?.heroImage, fallback.hero.image, 1920),
    },
    groups,
    cta: ctaFor(page, fallback.cta),
    seo: seoFor(page?.seo, fallback.seo),
  }
}
