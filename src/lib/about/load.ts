import {
  getFaqPageFn,
  getOurStoryPageFn,
  getPublishedFaqsFn,
  getTeamMembersFn,
  getTeamPageFn,
  getVisionValuesPageFn,
} from '@/lib/sanity/server'

import type { CmsFaq, CmsFaqPage, CmsOurStoryPage, CmsTeamMember, CmsTeamPage, CmsVisionValuesPage } from './cms'

export async function loadOurStory(): Promise<CmsOurStoryPage | null> {
  try {
    return (await getOurStoryPageFn()) ?? null
  } catch {
    return null
  }
}

export async function loadVisionValues(): Promise<CmsVisionValuesPage | null> {
  try {
    return (await getVisionValuesPageFn()) ?? null
  } catch {
    return null
  }
}

export async function loadTeam(): Promise<{ page: CmsTeamPage | null; members: CmsTeamMember[] }> {
  try {
    const [page, members] = await Promise.all([getTeamPageFn(), getTeamMembersFn()])
    return { page: page ?? null, members: members ?? [] }
  } catch {
    return { page: null, members: [] }
  }
}

export async function loadFaqPage(): Promise<{ page: CmsFaqPage | null; faqs: CmsFaq[] }> {
  try {
    const [page, faqs] = await Promise.all([getFaqPageFn(), getPublishedFaqsFn()])
    return { page: page ?? null, faqs: faqs ?? [] }
  } catch {
    return { page: null, faqs: [] }
  }
}
