import { ExperienceDetail } from '@/components/experience/experience-detail'
import { resolveExperienceDetail, type DetailImageKey } from '@/lib/experiences/detail'
import type { ExperienceFoundation, ExperiencePageData } from '@/lib/sanity/types'

export function ExperienceTemplate({
  experience,
  images,
  awards,
  foundation = null,
}: {
  experience: ExperiencePageData
  images: Partial<Record<DetailImageKey, string>>
  awards: readonly { year: string; src: string }[]
  foundation?: ExperienceFoundation
}) {
  return <ExperienceDetail page={resolveExperienceDetail(experience, images, foundation)} awards={awards} />
}
