import {BookIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

export const urbortBlogPage = defineType({
  name: 'urbortBlogPage',
  title: 'URBORT board',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'board', title: 'Board', default: true},
    {name: 'close', title: 'Closing band'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'titleLead',
      title: 'Heading start',
      type: 'string',
      group: 'board',
      description: 'Leave empty to keep “URBORT:”.',
    }),
    defineField({
      name: 'titleAccent',
      title: 'Heading accent',
      type: 'string',
      group: 'board',
      description: 'Leave empty to keep the approved board name.',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'board',
      description: 'Leave empty to keep the approved introduction.',
    }),
    defineField({
      name: 'showPlaceholderCards',
      title: 'Show the six approved titles when an article is not published',
      type: 'boolean',
      group: 'board',
      initialValue: true,
      description:
        'These cards are display placeholders. They are not links and they are not published articles. A published URBORT article replaces the matching card.',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Closing heading',
      type: 'string',
      group: 'close',
    }),
    defineField({
      name: 'ctaBody',
      title: 'Closing text',
      type: 'text',
      rows: 2,
      group: 'close',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Closing button',
      type: 'string',
      group: 'close',
    }),
    defineField({
      name: 'ctaHref',
      title: 'Closing link',
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
      return {title: 'URBORT board'}
    },
  },
})
