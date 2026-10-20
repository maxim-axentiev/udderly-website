import {
  getCorporateProgramCardsFn,
  getCorporateProgramFn,
  getCorporateTrainingPageFn,
  getExperienceFoundationFn,
} from '@/lib/sanity/server'

import type { CmsCorporateProgram, CmsCorporateTrainingPage } from './cms'
import type { ExperienceFoundation } from '@/lib/sanity/types'
import type { CorporateProgramSlug } from './slugs'

export async function loadCorporateLanding(): Promise<{
  page: CmsCorporateTrainingPage | null
  programs: CmsCorporateProgram[]
  foundation: ExperienceFoundation
}> {
  try {
    const [page, programs, foundation] = await Promise.all([
      getCorporateTrainingPageFn(),
      getCorporateProgramCardsFn(),
      getExperienceFoundationFn(),
    ])
    return {
      page: page ?? null,
      programs: programs ?? [],
      foundation: foundation ?? null,
    }
  } catch {
    return { page: null, programs: [], foundation: null }
  }
}

export async function loadCorporateProgram(slug: CorporateProgramSlug): Promise<{
  program: CmsCorporateProgram | null
  foundation: ExperienceFoundation
}> {
  try {
    const [program, foundation] = await Promise.all([
      getCorporateProgramFn({ data: slug }),
      getExperienceFoundationFn(),
    ])
    return { program: program ?? null, foundation: foundation ?? null }
  } catch {
    return { program: null, foundation: null }
  }
}
