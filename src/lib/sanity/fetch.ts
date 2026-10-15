import type { CmsHomepageDocument } from '@/lib/homepage/cms'
import { homepageContentOrFixture } from '@/lib/homepage/cms'
import type { HomepageContent } from '@/lib/homepage/model'
import type { CmsHomepageFaqsDocument } from '@/lib/homepage-faqs'
import type { CmsNavigation, CmsSiteSettings, SiteChromeDocuments } from '@/lib/site-chrome'

import { sanityClient } from './client'
import {
  experienceBySlugQuery,
  experienceHubQuery,
  experienceSitemapSlugsQuery,
  homepageFaqsQuery,
  homepageQuery,
  navigationQuery,
  siteSettingsQuery,
} from './queries'
import type { ExperienceCardData, ExperiencePageData } from './types'

const CHROME_FETCH_TIMEOUT_MS = 4000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Sanity request timed out')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

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

export async function fetchSiteChromeDocuments(): Promise<SiteChromeDocuments> {
  try {
    const [navigationResult, siteSettingsResult] = await withTimeout(
      Promise.allSettled([
        sanityClient.fetch<CmsNavigation>(navigationQuery),
        sanityClient.fetch<CmsSiteSettings>(siteSettingsQuery),
      ]),
      CHROME_FETCH_TIMEOUT_MS,
    )

    return {
      navigation:
        navigationResult.status === 'fulfilled' ? navigationResult.value ?? null : null,
      siteSettings:
        siteSettingsResult.status === 'fulfilled'
          ? siteSettingsResult.value ?? null
          : null,
    }
  } catch {
    return {
      navigation: null,
      siteSettings: null,
    }
  }
}

export async function fetchPublishedHomepage(): Promise<CmsHomepageDocument> {
  try {
    const document = await withTimeout(
      sanityClient.fetch<CmsHomepageDocument>(homepageQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return document ?? null
  } catch {
    return null
  }
}

export async function loadHomepageContent(): Promise<HomepageContent> {
  return homepageContentOrFixture(await fetchPublishedHomepage())
}

export async function fetchHomepageFaqDocument(): Promise<CmsHomepageFaqsDocument> {
  try {
    const document = await withTimeout(
      sanityClient.fetch<CmsHomepageFaqsDocument>(homepageFaqsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )

    return document ?? null
  } catch {
    return null
  }
}
