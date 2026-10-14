import { homepageFaqs } from '../../content/homepage-faqs.ts'
import { hasPortableText } from '../portable-text.ts'

export const HOMEPAGE_FAQ_ID_PREFIX = 'homepageFaq-'
export const FAQ_QUESTION_MAX_LENGTH = 160
export const SANITY_FAQ_CATEGORIES = [
  'visiting',
  'booking',
  'animals',
  'glamping',
  'adoption',
  'corporate',
  'accessibility',
  'general',
] as const

export type SanityFaqCategory = (typeof SANITY_FAQ_CATEGORIES)[number]

export type HomepageFaqSource = (typeof homepageFaqs)[number]

export type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: 'normal'
  markDefs: []
  children: [PortableTextSpan]
  listItem?: 'bullet'
  level?: number
}

export type HomepageFaqDocument = {
  _id: string
  _type: 'faq'
  question: string
  answer: PortableTextBlock[]
  category: SanityFaqCategory
  sortOrder: number
  active: true
}

export type HomepageFaqReference = {
  _type: 'reference'
  _ref: string
  _key: string
}

/**
 * Editorial metadata only. Category is required by the FAQ schema and is not
 * present in the homepage fixture. IDs are stable. The hyphen keeps each ID on
 * Sanity's public root path; a period would make the document private.
 */
export const homepageFaqEditorialFields = [
  { slug: '01-are-you-a-petting-farm', category: 'animals' },
  { slug: '02-is-your-farm-pet-friendly', category: 'animals' },
  { slug: '03-are-kids-allowed-on-the-farm', category: 'visiting' },
  { slug: '04-do-i-need-a-reservation-to-visit-the-farm', category: 'booking' },
  { slug: '05-is-the-farm-wheelchair-accessible', category: 'accessibility' },
  { slug: '06-is-parking-available', category: 'visiting' },
  { slug: '07-what-is-your-cancellation-policy', category: 'booking' },
  { slug: '08-what-happens-when-there-is-bad-weather', category: 'booking' },
  { slug: '09-what-days-and-times-are-you-open', category: 'visiting' },
  { slug: '10-how-early-should-i-arrive-before-my-experience-begins', category: 'booking' },
  { slug: '11-is-there-a-washroom-on-site', category: 'visiting' },
] as const satisfies ReadonlyArray<{ slug: string; category: SanityFaqCategory }>

export function homepageFaqDocumentId(slug: string): string {
  return `${HOMEPAGE_FAQ_ID_PREFIX}${slug}`
}

function paragraphBlock(id: string, part: string, text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: `${id}.${part}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `${id}.${part}.span`,
        text,
        marks: [],
      },
    ],
  }
}

function bulletBlock(id: string, part: string, index: number, text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: `${id}.${part}.${index}`,
    style: 'normal',
    markDefs: [],
    listItem: 'bullet',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: `${id}.${part}.${index}.span`,
        text,
        marks: [],
      },
    ],
  }
}

export function fixtureFaqToPortableText(
  id: string,
  faq: HomepageFaqSource,
): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [paragraphBlock(id, 'a', faq.a)]

  if ('list' in faq && faq.list) {
    faq.list.forEach((item, index) => {
      blocks.push(bulletBlock(id, 'list', index, item))
    })
  }

  if ('a2' in faq && faq.a2) {
    blocks.push(paragraphBlock(id, 'a2', faq.a2))
  }

  if ('list2' in faq && faq.list2) {
    faq.list2.forEach((item, index) => {
      blocks.push(bulletBlock(id, 'list2', index, item))
    })
  }

  return blocks
}

export function portableTextToFixtureShape(blocks: PortableTextBlock[]) {
  const paragraphs: string[] = []
  const lists: string[][] = []
  let currentList: string[] | undefined

  const flushList = () => {
    if (currentList) {
      lists.push(currentList)
      currentList = undefined
    }
  }

  for (const block of blocks) {
    const text = block.children[0]?.text ?? ''

    if (block.listItem === 'bullet') {
      currentList ??= []
      currentList.push(text)
      continue
    }

    flushList()
    paragraphs.push(text)
  }

  flushList()

  return {
    a: paragraphs[0] ?? '',
    ...(lists[0] ? { list: lists[0] } : {}),
    ...(paragraphs[1] ? { a2: paragraphs[1] } : {}),
    ...(lists[1] ? { list2: lists[1] } : {}),
  }
}

export function buildHomepageFaqDocuments(): HomepageFaqDocument[] {
  if (homepageFaqs.length !== homepageFaqEditorialFields.length) {
    throw new Error('Homepage FAQ source and editorial metadata are out of sync.')
  }

  return homepageFaqs.map((faq, index) => {
    const editorial = homepageFaqEditorialFields[index]
    if (!editorial) {
      throw new Error(`Missing editorial metadata for homepage FAQ ${index + 1}.`)
    }

    const _id = homepageFaqDocumentId(editorial.slug)
    const answer = fixtureFaqToPortableText(_id, faq)

    if (faq.q.length > FAQ_QUESTION_MAX_LENGTH) {
      throw new Error(`Question exceeds ${FAQ_QUESTION_MAX_LENGTH} characters: ${faq.q}`)
    }

    if (!hasPortableText(answer)) {
      throw new Error(`Portable Text answer is empty for ${_id}.`)
    }

    return {
      _id,
      _type: 'faq',
      question: faq.q,
      answer,
      category: editorial.category,
      sortOrder: (index + 1) * 10,
      active: true,
    }
  })
}

export function buildHomepageFaqReferences(
  documents: HomepageFaqDocument[] = buildHomepageFaqDocuments(),
): HomepageFaqReference[] {
  return documents.map((document, index) => ({
    _type: 'reference' as const,
    _ref: document._id,
    _key: `homepageFaq.ref.${String(index + 1).padStart(2, '0')}`,
  }))
}

export function buildHomepageFaqCreateIfNotExistsMutations(
  documents: HomepageFaqDocument[] = buildHomepageFaqDocuments(),
) {
  return documents.map((document) => ({
    createIfNotExists: document,
  }))
}

export function buildHomepageFaqDryRun() {
  const documents = buildHomepageFaqDocuments()

  return {
    mode: 'dry-run' as const,
    writesEnabled: false,
    projectId: 'umbuxpyp',
    dataset: 'production',
    documentCount: documents.length,
    documents,
    mutations: buildHomepageFaqCreateIfNotExistsMutations(documents),
    homepageFaqsReferences: buildHomepageFaqReferences(documents),
    siteSettingsPatchPreview: {
      id: 'siteSettings',
      set: {
        homepageFaqs: buildHomepageFaqReferences(documents),
      },
    },
    limitations: [
      'Fixture answers have no links or emphasis marks; none were added.',
      'Portable Text list/paragraph spacing on the CMS homepage path may differ slightly from the fixture accordion.',
      'Document IDs match the published public FAQs. This dry-run does not query or write to production.',
      'createIfNotExists would leave an existing hyphenated FAQ unchanged. It must not target the private dotted IDs.',
      'siteSettings.homepageFaqs is previewed only and is not patched.',
    ],
  }
}

export function formatHomepageFaqDryRun(): string {
  return `${JSON.stringify(buildHomepageFaqDryRun(), null, 2)}\n`
}

export function refuseDatasetWrites(argv: readonly string[]): string | undefined {
  if (argv.includes('--apply') || argv.includes('--write') || argv.includes('--publish')) {
    return 'Homepage FAQ migration writes are disabled. Dry-run only until explicit approval.'
  }

  return undefined
}
