import {HelpCircleIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

/**
 * Headings for /faq. Questions come from published FAQ documents.
 * Leave the groups empty to use the approved headings and each question’s category.
 * Placeholder questions are never shown.
 */

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ page',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'groups', title: 'Question groups'},
    {name: 'close', title: 'Closing'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Hero heading start',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'heroAccent',
      title: 'Hero heading accent',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'sections',
      title: 'Question groups',
      type: 'array',
      group: 'groups',
      of: [defineArrayMember({type: 'faqPageSection'})],
      description:
        'Leave empty to group published FAQs under the approved headings. The homepage keeps its own selected list. Drafts and hidden questions stay off this page.',
    }),
    defineField({
      name: 'showCta',
      title: 'Show the closing invitation',
      type: 'boolean',
      group: 'close',
      description: 'Leave unset to show it. Turn off to hide it.',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Closing heading',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'ctaBody',
      title: 'Closing text',
      type: 'text',
      rows: 3,
      group: 'close',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'FAQ'}
    },
  },
})
