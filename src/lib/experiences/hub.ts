import type { ExperienceCardData } from '@/lib/sanity/types'
import type { PageSeoInput } from '@/lib/seo/page-head'
import { SITE_NAME } from '@/lib/site'

/**
 * The Experiences page uses a published experiencesHub document only when
 * every field below is present and within its limit. A missing document, a
 * failed request, or any invalid field returns this complete local fallback.
 * CMS copy is never combined with these strings.
 *
 * The current page has no empty-state heading, so the fallback heading is
 * blank and the existing placeholder stays one paragraph.
 */
export const experiencesHubFallback = {
  heading: 'Experiences',
  intro:
    'Choose a visit. Filters for animal, season, age, and private or shared sessions can be added here later.',
  emptyHeading: '',
  emptyMessage:
    'No published experiences yet. Add an Experience in Sanity, set it to show on the website, and it will appear here.',
  seo: {
    title: `Experiences | ${SITE_NAME}`,
    description:
      'Farm experiences at Udderly Ridiculous Farm Life — animals, time outdoors, and a little personality.',
    ogTitle: `Experiences | ${SITE_NAME}`,
    ogDescription:
      'Farm experiences at Udderly Ridiculous Farm Life — animals, time outdoors, and a little personality.',
  },
} as const

export type ExperiencesHubContent = {
  heading: string
  intro: string
  emptyHeading: string
  emptyMessage: string
  seo: {
    title: string
    description: string
    ogTitle: string
    ogDescription: string
  }
}

export type CmsExperiencesHubDocument = {
  _id?: string | null
  heading?: string | null
  intro?: string | null
  emptyHeading?: string | null
  emptyMessage?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
} | null

const LIMITS = {
  heading: 80,
  intro: 500,
  emptyHeading: 80,
  emptyMessage: 500,
  seoTitle: 70,
  seoDescription: 180,
  ogTitle: 70,
  ogDescription: 200,
} as const

function requiredText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) return null
  return trimmed
}

export function resolveExperiencesHub(
  document: CmsExperiencesHubDocument,
): ExperiencesHubContent | null {
  if (!document) return null

  const heading = requiredText(document.heading, LIMITS.heading)
  const intro = requiredText(document.intro, LIMITS.intro)
  const emptyHeading = requiredText(document.emptyHeading, LIMITS.emptyHeading)
  const emptyMessage = requiredText(document.emptyMessage, LIMITS.emptyMessage)
  const seoTitle = requiredText(document.seoTitle, LIMITS.seoTitle)
  const seoDescription = requiredText(document.seoDescription, LIMITS.seoDescription)
  const ogTitle = requiredText(document.ogTitle, LIMITS.ogTitle)
  const ogDescription = requiredText(document.ogDescription, LIMITS.ogDescription)

  if (
    !heading ||
    !intro ||
    !emptyHeading ||
    !emptyMessage ||
    !seoTitle ||
    !seoDescription ||
    !ogTitle ||
    !ogDescription
  ) {
    return null
  }

  return {
    heading,
    intro,
    emptyHeading,
    emptyMessage,
    seo: {
      title: seoTitle,
      description: seoDescription,
      ogTitle,
      ogDescription,
    },
  }
}

export function experiencesHubOrFallback(
  document: CmsExperiencesHubDocument,
): ExperiencesHubContent {
  return resolveExperiencesHub(document) ?? experiencesHubFallback
}

export type ExperiencesHubView = {
  heading: string
  intro: string
  cards: ExperienceCardData[]
  emptyHeading: string
  emptyMessage: string
}

/** Cards come only from published experience documents. An empty list keeps the empty state. */
export function experiencesHubView(
  content: ExperiencesHubContent,
  experiences: ExperienceCardData[],
): ExperiencesHubView {
  const cards = experiences.filter((experience) => experience.title && experience.slug)

  return {
    heading: content.heading,
    intro: content.intro,
    cards,
    emptyHeading: cards.length === 0 ? content.emptyHeading : '',
    emptyMessage: cards.length === 0 ? content.emptyMessage : '',
  }
}

export function experiencesHubSeoInput(content: ExperiencesHubContent): PageSeoInput {
  return {
    title: content.seo.title,
    description: content.seo.description,
    ogTitle: content.seo.ogTitle,
    ogDescription: content.seo.ogDescription,
    path: '/experiences',
  }
}
