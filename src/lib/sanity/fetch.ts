import {
  experiencesHubOrFallback,
  type CmsExperiencesHubDocument,
  type ExperiencesHubContent,
} from '@/lib/experiences/hub'
import { experienceSlugAliases, publicExperienceSlug } from '@/lib/experiences/public-paths'
import type { CmsHomepageDocument } from '@/lib/homepage/cms'
import { homepageContentOrFixture } from '@/lib/homepage/cms'
import type { HomepageContent } from '@/lib/homepage/model'
import type { CmsHomepageFaqsDocument } from '@/lib/homepage-faqs'
import type { CmsNavigation, CmsSiteSettings, SiteChromeDocuments } from '@/lib/site-chrome'

import { sanityClient } from './client'
import {
  experienceBySlugQuery,
  experienceFoundationQuery,
  experienceHubQuery,
  experienceSitemapSlugsQuery,
  adoptionOfferingsQuery,
  adoptionPageQuery,
  animalListingsQuery,
  animalsForSalePageQuery,
  experiencesHubContentQuery,
  homepageFaqsQuery,
  homepageQuery,
  navigationQuery,
  siteSettingsQuery,
} from './queries'
import type { PublishedAdoption } from '@/lib/adopt/resolve'
import type { PublishedListing } from '@/lib/sale/resolve'

import type { ExperienceCardData, ExperienceFoundation, ExperiencePageData } from './types'

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
    { slug, slugs: experienceSlugAliases(slug) },
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

export async function fetchPublishedExperiencesHub(): Promise<CmsExperiencesHubDocument> {
  try {
    const document = await withTimeout(
      sanityClient.fetch<CmsExperiencesHubDocument>(experiencesHubContentQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return document ?? null
  } catch {
    return null
  }
}

export async function loadExperiencesHubContent(): Promise<ExperiencesHubContent> {
  return experiencesHubOrFallback(await fetchPublishedExperiencesHub())
}

export async function fetchExperienceSitemapSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<string[] | null>(
    experienceSitemapSlugsQuery,
  )

  return [...new Set((slugs ?? []).filter(Boolean).map(publicExperienceSlug))]
}

export async function fetchExperienceFoundation(): Promise<ExperienceFoundation> {
  try {
    return await sanityClient.fetch<ExperienceFoundation>(experienceFoundationQuery)
  } catch {
    return null
  }
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

export async function fetchAdoptionPageDocument(): Promise<Record<string, unknown> | null> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<Record<string, unknown> | null>(adoptionPageQuery),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
  }
}

export async function fetchAdoptionOfferings(): Promise<PublishedAdoption[]> {
  try {
    const offerings = await withTimeout(
      sanityClient.fetch<PublishedAdoption[] | null>(adoptionOfferingsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return offerings ?? []
  } catch {
    return []
  }
}

export async function fetchAnimalsForSalePageDocument(): Promise<Record<string, unknown> | null> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<Record<string, unknown> | null>(animalsForSalePageQuery),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
  }
}

export async function fetchAnimalListings(): Promise<PublishedListing[]> {
  try {
    const listings = await withTimeout(
      sanityClient.fetch<PublishedListing[] | null>(animalListingsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return listings ?? []
  } catch {
    return []
  }
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
