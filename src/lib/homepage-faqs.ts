import { homepageFaqs } from '@/content/homepage'
import { hasPortableText } from '@/lib/portable-text'
import type { PortableTextContent } from '@/lib/sanity/types'

export type CmsHomepageFaqSlot = {
  _key?: string | null
  faq?: {
    _id?: string | null
    question?: string | null
    answer?: PortableTextContent
    active?: boolean | null
  } | null
} | null

export type CmsHomepageFaqsDocument = {
  homepageFaqs?: CmsHomepageFaqSlot[] | null
} | null

export type HomepageFaqItem =
  | {
      source: 'fixture'
      question: string
      a: string
      list?: readonly string[]
      a2?: string
      list2?: readonly string[]
    }
  | {
      source: 'cms'
      id: string
      question: string
      answer: PortableTextContent
    }

function fixtureHomepageFaqs(): HomepageFaqItem[] {
  return homepageFaqs.map((faq) => ({
    source: 'fixture' as const,
    question: faq.q,
    a: faq.a,
    ...('list' in faq && faq.list ? { list: faq.list } : {}),
    ...('a2' in faq && faq.a2 ? { a2: faq.a2 } : {}),
    ...('list2' in faq && faq.list2 ? { list2: faq.list2 } : {}),
  }))
}

export function resolveHomepageFaqs(
  document: CmsHomepageFaqsDocument,
): HomepageFaqItem[] {
  const slots = document?.homepageFaqs
  if (!Array.isArray(slots) || slots.length === 0) {
    return fixtureHomepageFaqs()
  }

  const resolved: HomepageFaqItem[] = []

  for (const slot of slots) {
    const faq = slot?.faq
    const question = faq?.question?.trim()
    const answer = faq?.answer

    if (
      !faq?._id ||
      faq.active === false ||
      !question ||
      !answer ||
      !hasPortableText(answer)
    ) {
      return fixtureHomepageFaqs()
    }

    resolved.push({
      source: 'cms',
      id: faq._id,
      question,
      answer,
    })
  }

  return resolved
}
