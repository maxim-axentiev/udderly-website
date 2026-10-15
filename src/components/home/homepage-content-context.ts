import { createContext, useContext } from 'react'

import type { HomepageContent } from '@/lib/homepage/model'

export const HomepageContentContext = createContext<HomepageContent | null>(null)

export function useHomepageContent(): HomepageContent {
  const content = useContext(HomepageContentContext)
  if (!content) {
    throw new Error('Homepage content is unavailable.')
  }
  return content
}
