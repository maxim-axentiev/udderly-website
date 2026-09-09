import { sanityClient } from './client'
import {
  experienceBySlugQuery,
  experienceHubQuery,
  experienceSitemapSlugsQuery,
} from './queries'
import type { ExperienceCardData, ExperiencePageData } from './types'

export async function fetchExperienceBySlug(
  slug: string,
): Promise<ExperiencePageData | null> {
  const experience = await sanityClient.fetch<ExperiencePageData | null>(
    experienceBySlugQuery,
    { slug },
  )

  if (!experience?.slug || !experience.title) {
    return null
  }

  if (experience.faqs?.length) {
    experience.faqs = [...experience.faqs].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
  }

  return experience
}

export async function fetchExperienceHub(): Promise<ExperienceCardData[]> {
  const experiences = await sanityClient.fetch<ExperienceCardData[] | null>(
    experienceHubQuery,
  )

  return (experiences ?? []).filter(
    (experience) => experience.slug && experience.title,
  )
}

export async function fetchExperienceSitemapSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[] | null>(
    experienceSitemapSlugsQuery,
  )

  return (slugs ?? []).filter(Boolean)
}
