import { ExperienceDetail } from '@/components/experience/experience-detail'
import { resolveExperienceDetail, type DetailImageKey } from '@/lib/experiences/detail'
import type { ExperiencePageData } from '@/lib/sanity/types'

export function ExperienceTemplate({
  experience,
  images,
  awards,
}: {
  experience: ExperiencePageData
  images: Partial<Record<DetailImageKey, string>>
  awards: readonly { year: string; src: string }[]
}) {
  return <ExperienceDetail page={resolveExperienceDetail(experience, images)} awards={awards} />
}
