import { describe, expect, it } from 'vitest'

import { homepageFaqs } from '@/content/homepage-faqs'
import { hasPortableText } from '@/lib/portable-text'
import {
  FAQ_QUESTION_MAX_LENGTH,
  HOMEPAGE_FAQ_ID_PREFIX,
  SANITY_FAQ_CATEGORIES,
  buildHomepageFaqDocuments,
  buildHomepageFaqDryRun,
  buildHomepageFaqReferences,
  fixtureFaqToPortableText,
  homepageFaqDocumentId,
  homepageFaqEditorialFields,
  portableTextToFixtureShape,
  refuseDatasetWrites,
} from '@/lib/migration/homepage-faqs'

describe('homepage FAQ migration documents', () => {
  const documents = buildHomepageFaqDocuments()

  it('builds exactly 11 unique FAQ documents in homepage order', () => {
    expect(homepageFaqs).toHaveLength(11)
    expect(documents).toHaveLength(11)
    expect(documents.map((document) => document.question)).toEqual(
      homepageFaqs.map((faq) => faq.q),
    )
    expect(new Set(documents.map((document) => document._id)).size).toBe(11)
    expect(new Set(documents.map((document) => document.question)).size).toBe(11)
  })

  it('uses stable prefixed IDs and required FAQ schema fields', () => {
    documents.forEach((document, index) => {
      const editorial = homepageFaqEditorialFields[index]
      expect(editorial).toBeDefined()
      expect(document._id).toBe(homepageFaqDocumentId(editorial!.slug))
      expect(document._id.startsWith(HOMEPAGE_FAQ_ID_PREFIX)).toBe(true)
      expect(document._type).toBe('faq')
      expect(document.active).toBe(true)
      expect(document.sortOrder).toBe((index + 1) * 10)
      expect(document.question.length).toBeGreaterThan(0)
      expect(document.question.length).toBeLessThanOrEqual(FAQ_QUESTION_MAX_LENGTH)
      expect(SANITY_FAQ_CATEGORIES).toContain(document.category)
      expect(hasPortableText(document.answer)).toBe(true)
    })
  })

  it('preserves wording, punctuation, paragraphs, and lists through Portable Text', () => {
    documents.forEach((document, index) => {
      const source = homepageFaqs[index]
      expect(source).toBeDefined()
      expect(portableTextToFixtureShape(document.answer)).toEqual({
        a: source!.a,
        ...('list' in source! && source.list ? { list: [...source.list] } : {}),
        ...('a2' in source! && source.a2 ? { a2: source.a2 } : {}),
        ...('list2' in source! && source.list2 ? { list2: [...source.list2] } : {}),
      })
    })
  })

  it('does not invent links or emphasis marks', () => {
    for (const document of documents) {
      for (const block of document.answer) {
        expect(block.markDefs).toEqual([])
        expect(block.children[0]?.marks).toEqual([])
      }
    }
  })

  it('converts the hours FAQ into two paragraphs and two bullet lists', () => {
    const hours = documents[8]
    const source = homepageFaqs[8]
    expect(hours?.question).toBe('What days and times are you open?')
    expect(hours?.answer.filter((block) => !block.listItem)).toHaveLength(2)
    expect(hours?.answer.filter((block) => block.listItem === 'bullet')).toHaveLength(15)
    expect(portableTextToFixtureShape(hours!.answer)).toMatchObject({
      a: source!.a,
      a2: 'a2' in source! ? source.a2 : undefined,
      list: 'list' in source! ? [...source.list] : undefined,
      list2: 'list2' in source! ? [...source.list2] : undefined,
    })
  })

  it('keeps fixture-to-Portable-Text conversion deterministic', () => {
    const first = homepageFaqs[0]
    const id = homepageFaqDocumentId(homepageFaqEditorialFields[0].slug)
    expect(fixtureFaqToPortableText(id, first)).toEqual(fixtureFaqToPortableText(id, first))
    expect(buildHomepageFaqDocuments()).toEqual(buildHomepageFaqDocuments())
  })
})

describe('homepage FAQ migration preview', () => {
  it('previews ordered siteSettings.homepageFaqs references without writing', () => {
    const preview = buildHomepageFaqDryRun()
    const references = buildHomepageFaqReferences()

    expect(preview.mode).toBe('dry-run')
    expect(preview.writesEnabled).toBe(false)
    expect(preview.homepageFaqsReferences).toEqual(references)
    expect(preview.siteSettingsPatchPreview.set.homepageFaqs).toEqual(references)
    expect(preview.mutations.every((mutation) => 'createIfNotExists' in mutation)).toBe(true)
    expect(preview.mutations.map((mutation) => mutation.createIfNotExists._id)).toEqual(
      preview.documents.map((document) => document._id),
    )
  })

  it('refuses dataset write flags', () => {
    expect(refuseDatasetWrites(['--dry-run'])).toBeUndefined()
    expect(refuseDatasetWrites(['--apply'])).toMatch(/disabled/i)
    expect(refuseDatasetWrites(['--write'])).toMatch(/disabled/i)
    expect(refuseDatasetWrites(['--publish'])).toMatch(/disabled/i)
  })
})
