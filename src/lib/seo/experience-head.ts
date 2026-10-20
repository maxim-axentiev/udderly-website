import { cmsImageUrl } from '@/lib/sanity/image'
import { createPageHead, type PageHead } from '@/lib/seo/page-head'
import type { ExperiencePageData } from '@/lib/sanity/types'
import { publicExperienceSlug } from '@/lib/experiences/public-paths'
import { SITE_NAME } from '@/lib/site'

export function createExperienceHead(
  experience: ExperiencePageData,
  env?: Record<string, string | undefined>,
): PageHead {
  const title = experience.seo?.title?.trim() || `${experience.title} | ${SITE_NAME}`
  const description =
    experience.seo?.description?.trim() ||
    experience.shortDescription?.trim() ||
    undefined
  const imageUrl =
    cmsImageUrl(experience.seo?.image, 1200) ??
    cmsImageUrl(experience.heroImage, 1200)

  return createPageHead({
    title,
    description,
    path: `/${publicExperienceSlug(experience.slug)}`,
    imageUrl,
    noindex: Boolean(experience.seo?.noIndex),
    ogType: 'website',
  }, env)
}
