import { createServerFn } from '@tanstack/react-start'

import { isCorporateProgramSlug } from '@/lib/corporate/slugs'
import { resolveHomepageFaqs } from '@/lib/homepage-faqs'
import { mergeSiteChrome } from '@/lib/site-chrome'

import {
  fetchCorporateProgram,
  fetchCorporateProgramCards,
  fetchCorporateTrainingPage,
  fetchExperienceBySlug,
  fetchExperienceFoundation,
  fetchExperienceHub,
  fetchHomepageFaqDocument,
  fetchSiteChromeDocuments,
  fetchAdoptionOfferings,
  fetchAdoptionPageDocument,
  fetchAnimalListings,
  fetchAnimalsForSalePageDocument,
  fetchPublishedExperiencesHub,
  loadExperiencesHubContent,
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

export const getExperienceFoundationFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchExperienceFoundation())

export const getExperienceHubFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchExperienceHub())

export const getExperiencesHubContentFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => loadExperiencesHubContent())

export const getExperiencesHubDocumentFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchPublishedExperiencesHub())

export const getSiteChromeFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => {
  const documents = await fetchSiteChromeDocuments()
  return mergeSiteChrome(documents)
})

export const getAdoptionPageFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => {
  const [page, offerings] = await Promise.all([
    fetchAdoptionPageDocument(),
    fetchAdoptionOfferings(),
  ])
  return { page, offerings }
})

export const getAnimalsForSalePageFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => {
  const [page, listings] = await Promise.all([
    fetchAnimalsForSalePageDocument(),
    fetchAnimalListings(),
  ])
  return { page, listings }
})

export const getCorporateTrainingPageFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchCorporateTrainingPage())

export const getCorporateProgramCardsFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchCorporateProgramCards())

export const getCorporateProgramFn = createServerFn({ method: 'GET', strict: false })
  .validator((data: unknown) => {
    if (typeof data !== 'string' || !isCorporateProgramSlug(data)) {
      throw new Error('Unknown corporate program.')
    }
    return data
  })
  .handler(async ({ data }) => fetchCorporateProgram(data))

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
