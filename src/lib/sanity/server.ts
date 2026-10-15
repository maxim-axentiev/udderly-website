import { createServerFn } from '@tanstack/react-start'

import { resolveHomepageFaqs } from '@/lib/homepage-faqs'
import { mergeSiteChrome } from '@/lib/site-chrome'

import {
  fetchExperienceBySlug,
  fetchExperienceHub,
  fetchHomepageFaqDocument,
  fetchSiteChromeDocuments,
  loadHomepageContent,
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

export const getSiteChromeFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => {
  const documents = await fetchSiteChromeDocuments()
  return mergeSiteChrome(documents)
})

export const getHomepageContentFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => loadHomepageContent())

export const getHomepageFaqsFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => {
  const document = await fetchHomepageFaqDocument()
  return resolveHomepageFaqs(document)
})
