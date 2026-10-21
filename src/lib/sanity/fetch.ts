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
  corporateProgramBySlugQuery,
  corporateProgramCardsQuery,
  corporateTrainingPageQuery,
  faqPageQuery,
  homepageFaqsQuery,
  ourStoryPageQuery,
  publishedFaqsQuery,
  teamMembersQuery,
  teamPageQuery,
  visionValuesPageQuery,
  contactPageQuery,
  contactSettingsQuery,
  homepageQuery,
  legalPolicyQuery,
  navigationQuery,
  farmGlampingPageQuery,
  farmMarketPageQuery,
  giftCardPageQuery,
  iceCreamPageQuery,
  newsletterPageQuery,
  siteSettingsQuery,
  urbortArticleBySlugQuery,
  urbortArticlesQuery,
  urbortBlogPageQuery,
  urbortSitemapSlugsQuery,
} from './queries'
import type { CmsFaq, CmsFaqPage, CmsOurStoryPage, CmsTeamMember, CmsTeamPage, CmsVisionValuesPage } from '@/lib/about/cms'
import type { CmsContactPage, CmsContactSettings } from '@/lib/contact/cms'
import type { CmsLegalPolicy } from '@/lib/legal/cms'
import type { LegalSlug } from '@/lib/legal/model'
import type { CmsNewsletterPage } from '@/lib/newsletter/cms'
import type { CmsUrbortArticle, CmsUrbortBlogPage } from '@/lib/urbort/cms'
import type { CmsCorporateProgram, CmsCorporateTrainingPage } from '@/lib/corporate/cms'
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

export async function fetchCorporateTrainingPage(): Promise<CmsCorporateTrainingPage | null> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<CmsCorporateTrainingPage | null>(corporateTrainingPageQuery),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
  }
}

export async function fetchCorporateProgramCards(): Promise<CmsCorporateProgram[]> {
  try {
    const programs = await withTimeout(
      sanityClient.fetch<CmsCorporateProgram[] | null>(corporateProgramCardsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return programs ?? []
  } catch {
    return []
  }
}

export async function fetchCorporateProgram(slug: string): Promise<CmsCorporateProgram | null> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<CmsCorporateProgram | null>(corporateProgramBySlugQuery, { slug }),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
  }
}

async function fetchAboutDocument<T>(query: string): Promise<T | null> {
  try {
    return (await withTimeout(sanityClient.fetch<T | null>(query), CHROME_FETCH_TIMEOUT_MS)) ?? null
  } catch {
    return null
  }
}

export function fetchOurStoryPage(): Promise<CmsOurStoryPage | null> {
  return fetchAboutDocument<CmsOurStoryPage>(ourStoryPageQuery)
}

export function fetchVisionValuesPage(): Promise<CmsVisionValuesPage | null> {
  return fetchAboutDocument<CmsVisionValuesPage>(visionValuesPageQuery)
}

export function fetchTeamPage(): Promise<CmsTeamPage | null> {
  return fetchAboutDocument<CmsTeamPage>(teamPageQuery)
}

export function fetchFaqPage(): Promise<CmsFaqPage | null> {
  return fetchAboutDocument<CmsFaqPage>(faqPageQuery)
}

export async function fetchTeamMembers(): Promise<CmsTeamMember[]> {
  try {
    const members = await withTimeout(
      sanityClient.fetch<CmsTeamMember[] | null>(teamMembersQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return members ?? []
  } catch {
    return []
  }
}

export async function fetchPublishedFaqs(): Promise<CmsFaq[]> {
  try {
    const faqs = await withTimeout(
      sanityClient.fetch<CmsFaq[] | null>(publishedFaqsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return faqs ?? []
  } catch {
    return []
  }
}

export function fetchUrbortBlogPage(): Promise<CmsUrbortBlogPage> {
  return fetchAboutDocument<CmsUrbortBlogPage>(urbortBlogPageQuery)
}

export async function fetchUrbortArticles(): Promise<CmsUrbortArticle[]> {
  try {
    const articles = await withTimeout(
      sanityClient.fetch<CmsUrbortArticle[] | null>(urbortArticlesQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return articles ?? []
  } catch {
    return []
  }
}

export async function fetchUrbortArticle(slug: string): Promise<CmsUrbortArticle> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<CmsUrbortArticle>(urbortArticleBySlugQuery, { slug }),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
  }
}

export async function fetchUrbortSitemapSlugs(): Promise<string[]> {
  try {
    const slugs = await withTimeout(
      sanityClient.fetch<string[] | null>(urbortSitemapSlugsQuery),
      CHROME_FETCH_TIMEOUT_MS,
    )
    return (slugs ?? []).filter((slug) => typeof slug === 'string' && slug.length > 0)
  } catch {
    return []
  }
}

export function fetchContactPage(): Promise<CmsContactPage> {
  return fetchAboutDocument<CmsContactPage>(contactPageQuery)
}

export function fetchContactSettings(): Promise<CmsContactSettings> {
  return fetchAboutDocument<CmsContactSettings>(contactSettingsQuery)
}

export function fetchNewsletterPage(): Promise<CmsNewsletterPage> {
  return fetchAboutDocument<CmsNewsletterPage>(newsletterPageQuery)
}

export function fetchFarmMarketPage() {
  return fetchAboutDocument<Parameters<typeof import('@/lib/visit/resolve').resolveFarmMarket>[0]>(farmMarketPageQuery)
}

export function fetchIceCreamPage() {
  return fetchAboutDocument<Parameters<typeof import('@/lib/visit/resolve').resolveIceCream>[0]>(iceCreamPageQuery)
}

export function fetchGiftCardPage() {
  return fetchAboutDocument<Parameters<typeof import('@/lib/visit/resolve').resolveGiftCard>[0]>(giftCardPageQuery)
}

export function fetchFarmGlampingPage() {
  return fetchAboutDocument<Parameters<typeof import('@/lib/visit/resolve').resolveGlamping>[0]>(farmGlampingPageQuery)
}

export async function fetchLegalPolicy(slug: LegalSlug): Promise<CmsLegalPolicy> {
  try {
    return (
      (await withTimeout(
        sanityClient.fetch<CmsLegalPolicy>(legalPolicyQuery, { slug }),
        CHROME_FETCH_TIMEOUT_MS,
      )) ?? null
    )
  } catch {
    return null
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
