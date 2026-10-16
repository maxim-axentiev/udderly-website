import {DocumentTextIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page copy for /adopt-an-animal. Animal cards stay on Adoption offering
 * documents. The website keeps the Lovable page until every field here is filled.
 */

export const adoptionPage = defineType({
  name: 'adoptionPage',
  title: 'Adopt an Animal page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'heroIntro',
      title: 'Hero introduction',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'awardsTagline',
      title: 'Awards line',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'sponsorParagraphs',
      title: 'Sponsor section paragraphs',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'text', rows: 4})],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'animalsIntro',
      title: 'Animals introduction',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'supportParagraphs',
      title: 'How adoption helps',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'text', rows: 4})],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search result title',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Adopt an Animal page', subtitle: 'Page copy. Animals stay on adoption offerings.'}
    },
  },
})
