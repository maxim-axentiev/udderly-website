import {DocumentTextIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Page copy for /animals-for-sale. Individual animals stay on Animal for sale
 * documents. The website keeps the Lovable page until every field here is filled.
 */

export const animalsForSalePage = defineType({
  name: 'animalsForSalePage',
  title: 'Animals for Sale page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'heroSupport',
      title: 'Hero supporting line',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      group: 'content',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'soldIntro',
      title: 'Sold section introduction',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'prepItems',
      title: 'Preparing for a new animal',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(80)}),
            defineField({name: 'copy', title: 'Copy', type: 'text', rows: 4, validation: (rule) => rule.required().max(500)}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'waitlistTitle',
      title: 'Waitlist heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'waitlistCopy',
      title: 'Waitlist introduction',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(400),
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
      return {title: 'Animals for Sale page', subtitle: 'Page copy. Listings stay on animal records.'}
    },
  },
})
