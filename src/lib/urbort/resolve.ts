import type { CmsSeo } from '@/lib/about/cms'
import { hasPortableText } from '@/lib/portable-text'
import { documentPath } from '@/lib/routes/paths'
import { cmsImageUrl } from '@/lib/sanity/image'
import type { PageSeoInput } from '@/lib/seo/page-head'
import type { PortableTextContent } from '@/lib/sanity/types'

import type { CmsUrbortArticle, CmsUrbortBlogPage, CmsUrbortLink } from './cms'
import {
  URBORT_PATH,
  urbortBoardFallback,
  urbortPlaceholders,
  urbortRotations,
  type UrbortImageKey,
} from './model'

export type UrbortImages = Record<UrbortImageKey, string>

export type UrbortCard = {
  slug: string
  title: string
  excerpt: string
  imageSrc?: string
  imageAlt: string
  rotate: string
  href?: string
  published: boolean
}

export type UrbortBoard = {
  titleLead: string
  titleAccent: string
  intro: string
  cards: UrbortCard[]
  cta: { heading: string; body?: string; label: string; href: string }
  seo: PageSeoInput
}

export type UrbortArticlePage = {
  slug: string
  title: string
  excerpt?: string
  imageSrc?: string
  imageAlt: string
  rotate: string
  author?: string
  publishedLabel?: string
  tags: string[]
  body: PortableTextContent
  gallery: Array<{ src: string; alt: string }>
  links: Array<{ label: string; href: string }>
  cta: UrbortBoard['cta']
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
    ogType: fallback.ogType,
    path: fallback.path,
    noindex: seo?.noIndex === true,
    imageUrl: cmsImageUrl(seo?.image ?? undefined, 1200) ?? fallback.imageUrl,
  }
}

function safeHref(value: string | null | undefined): string | undefined {
  const href = clean(value)
  if (!href) return undefined
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return href
  try {
    const url = new URL(href)
    if (url.protocol === 'https:' || url.protocol === 'http:') return url.toString()
  } catch {
    return undefined
  }
  return undefined
}

function isPublicArticle(article: CmsUrbortArticle): article is NonNullable<CmsUrbortArticle> {
  if (!article?._id || article._id.startsWith('drafts.')) return false
  if (article.active === false) return false
  if (!clean(article.slug) || !clean(article.title)) return false
  return hasPortableText(article.body)
}

function publishedLabel(value: string | null | undefined): string | undefined {
  const raw = clean(value)
  if (!raw) return undefined
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(date)
}

function linkHref(link: CmsUrbortLink): string | undefined {
  if (!link) return undefined
  if (link.linkType === 'internal') {
    return documentPath(link.internalLink?._type, link.internalLink?.slug)
  }
  return safeHref(link.href)
}

function linksFor(links: CmsUrbortLink[] | null | undefined) {
  return (links ?? []).flatMap((link) => {
    const href = linkHref(link)
    const label = clean(link?.label)
    return href && label ? [{ label, href }] : []
  })
}

function galleryFor(article: NonNullable<CmsUrbortArticle>) {
  return (article.gallery ?? []).flatMap((image) => {
    const src = cmsImageUrl(image, 1600)
    const alt = clean(image?.alt)
    return src && alt ? [{ src, alt }] : []
  })
}

function cardFromArticle(
  article: NonNullable<CmsUrbortArticle>,
  images: UrbortImages,
  index: number,
): UrbortCard {
  const slug = clean(article.slug) ?? ''
  const title = clean(article.title) ?? ''
  const placeholder = urbortPlaceholders.find((item) => item.slug === slug)
  const cmsSrc = cmsImageUrl(article.heroImage, 1024)
  const cmsAlt = clean(article.heroImage?.alt)
  return {
    slug,
    title,
    excerpt: clean(article.excerpt) ?? '',
    imageSrc: cmsSrc ?? (placeholder ? images[placeholder.imageKey] : undefined),
    imageAlt: cmsAlt ?? `${title}. Photo from the URBORT board.`,
    rotate: placeholder?.rotate ?? urbortRotations[index % urbortRotations.length],
    href: `${URBORT_PATH}/${slug}`,
    published: true,
  }
}

function placeholderCard(images: UrbortImages, item: (typeof urbortPlaceholders)[number]): UrbortCard {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    imageSrc: images[item.imageKey],
    imageAlt: `${item.title}. Placeholder board photo, not a published article.`,
    rotate: item.rotate,
    published: false,
  }
}

function ctaFor(page: CmsUrbortBlogPage): UrbortBoard['cta'] {
  return {
    heading: text(page?.ctaHeading, urbortBoardFallback.ctaHeading),
    body: clean(page?.ctaBody),
    label: text(page?.ctaLabel, urbortBoardFallback.ctaLabel),
    href: safeHref(page?.ctaHref) ?? urbortBoardFallback.ctaHref,
  }
}

export function resolveUrbortBoard(
  page: CmsUrbortBlogPage,
  articles: CmsUrbortArticle[] | null | undefined,
  images: UrbortImages,
): UrbortBoard {
  const published = (articles ?? []).filter(isPublicArticle)
  const used = new Set<string>()
  const cards: UrbortCard[] = []
  const showPlaceholders = page?.showPlaceholderCards !== false

  if (showPlaceholders) {
    urbortPlaceholders.forEach((item) => {
      const match = published.find((article) => clean(article.slug) === item.slug)
      if (match) {
        cards.push(cardFromArticle(match, images, cards.length))
        used.add(item.slug)
      } else {
        cards.push(placeholderCard(images, item))
      }
    })
  }

  published.forEach((article) => {
    const slug = clean(article.slug) ?? ''
    if (used.has(slug)) return
    cards.push(cardFromArticle(article, images, cards.length))
  })

  return {
    titleLead: text(page?.titleLead, urbortBoardFallback.titleLead),
    titleAccent: text(page?.titleAccent, urbortBoardFallback.titleAccent),
    intro: text(page?.intro, urbortBoardFallback.intro),
    cards,
    cta: ctaFor(page),
    seo: seoFor(page?.seo, {
      title: urbortBoardFallback.seoTitle,
      description: urbortBoardFallback.seoDescription,
      path: URBORT_PATH,
      ogType: 'website',
    }),
  }
}

export function resolveUrbortArticle(
  article: CmsUrbortArticle,
  page: CmsUrbortBlogPage,
  images: UrbortImages,
): UrbortArticlePage | null {
  if (!isPublicArticle(article)) return null
  const card = cardFromArticle(article, images, 0)
  const title = card.title
  const excerpt = clean(article.excerpt)
  return {
    slug: card.slug,
    title,
    excerpt,
    imageSrc: card.imageSrc,
    imageAlt: card.imageAlt,
    rotate: card.rotate,
    author: clean(article.author),
    publishedLabel: publishedLabel(article.publishedAt),
    tags: (article.tags ?? []).flatMap((tag) => {
      const label = clean(tag)
      return label ? [label] : []
    }),
    body: article.body ?? [],
    gallery: galleryFor(article),
    links: linksFor(article.externalLinks),
    cta: ctaFor(page),
    seo: seoFor(article.seo, {
      title: `${title} — URBORT`,
      description: excerpt ?? urbortBoardFallback.seoDescription,
      path: card.href,
      ogType: 'article',
    }),
  }
}
