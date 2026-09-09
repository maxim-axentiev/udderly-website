import type { ExperienceCardData } from '@/lib/sanity/types'

/**
 * Filter shape for a later Experiences hub. The hub currently returns the
 * full published list; these fields are already on each card payload.
 */
export type ExperienceHubFilters = {
  animal?: string
  season?: string
  age?: string
  sessionType?: string
}

export function filterExperienceCards(
  experiences: ExperienceCardData[],
  filters: ExperienceHubFilters = {},
): ExperienceCardData[] {
  return experiences.filter((experience) => {
    if (filters.season && experience.season !== filters.season) {
      return false
    }

    if (filters.sessionType && experience.sessionType !== filters.sessionType) {
      return false
    }

    if (filters.age && experience.ageGuidance !== filters.age) {
      return false
    }

    if (filters.animal) {
      const titles = experience.animalSpecies?.map((species) => species.title) ?? []
      if (!titles.includes(filters.animal)) {
        return false
      }
    }

    return true
  })
}
