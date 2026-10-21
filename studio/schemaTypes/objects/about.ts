import {defineArrayMember, defineField, defineType} from 'sanity'

import {faqCategories} from '../constants'
import {optionalPublicHrefRule} from '../fields'

export const storyChapter = defineType({
  name: 'storyChapter',
  title: 'Story chapter',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section id',
      type: 'string',
      description:
        'Use how-it-all-began, growing-together, the-ice-cream-idea, alvins-legacy, or where-our-journey-meets-yours to edit that chapter. A new id adds a chapter.',
      validation: (rule) =>
        rule.custom((value) => {
          if (value == null || value === '') return true
          if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
            return 'Use lowercase words separated by hyphens.'
          }
          return true
        }),
    }),
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 5})],
      description: 'Leave empty to keep the approved text for an existing chapter.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'altImage',
      description: 'Leave empty to keep the current photo for an existing chapter.',
    }),
    defineField({
      name: 'imageOnLeft',
      title: 'Place the photo on the left',
      type: 'boolean',
      description: 'Leave unset to keep the approved side.',
    }),
    defineField({
      name: 'tone',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'default'},
          {title: 'Beige', value: 'beige'},
          {title: 'Blue', value: 'blue'},
        ],
      },
      description: 'Leave unset to keep the approved background.',
    }),
    defineField({
      name: 'showSignOff',
      title: 'Show the closing signature and button',
      type: 'boolean',
      description: 'Leave unset to keep the approved closing on the last chapter only.',
    }),
    defineField({
      name: 'signOffName',
      title: 'Signature name',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      description: 'A path such as /experiences, an in-page link, or a full https:// URL.',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
    defineField({
      name: 'enabled',
      title: 'Show this chapter',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', sectionId: 'sectionId', enabled: 'enabled'},
    prepare({title, sectionId, enabled}) {
      return {
        title: title || sectionId || 'Story chapter',
        subtitle: enabled === false ? 'Hidden' : 'Shown',
      }
    },
  },
})

export const visionValue = defineType({
  name: 'visionValue',
  title: 'Value',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
    prepare({title, subtitle}) {
      return {title: title || 'Untitled value', subtitle}
    },
  },
})

export const faqPageSection = defineType({
  name: 'faqPageSection',
  title: 'FAQ group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {list: [...faqCategories]},
        }),
      ],
      description:
        'Published, visible questions in these categories appear when you do not hand-pick questions below.',
    }),
    defineField({
      name: 'questions',
      title: 'Hand-picked questions',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      description:
        'Optional. This order is used on the page. Drafts and hidden questions are ignored. Leave empty to use the categories.',
    }),
    defineField({
      name: 'enabled',
      title: 'Show this group',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this heading and the categories or questions listed here.',
    }),
  ],
  preview: {
    select: {title: 'title', enabled: 'enabled'},
    prepare({title, enabled}) {
      return {title: title || 'FAQ group', subtitle: enabled === false ? 'Hidden' : 'Shown'}
    },
  },
})
