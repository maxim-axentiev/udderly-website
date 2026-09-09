import { createServerFn } from '@tanstack/react-start'

import {
  fetchExperienceBySlug,
  fetchExperienceHub,
} from './fetch'

export const getExperienceBySlugFn = createServerFn({ method: 'GET', strict: false })
  .validator((data: unknown) => {
    if (typeof data !== 'string' || !data) {
      throw new Error('A slug is required.')
    }

    return data
  })
  .handler(async ({ data }) => fetchExperienceBySlug(data))

export const getExperienceHubFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchExperienceHub())
