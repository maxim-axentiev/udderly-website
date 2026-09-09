import { createClient } from '@sanity/client'

import { sanityConfig } from './config'

/**
 * Public published-content client. No token — only what is already live in
 * the production dataset.
 */
export const sanityClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  useCdn: sanityConfig.useCdn,
  perspective: 'published',
})
