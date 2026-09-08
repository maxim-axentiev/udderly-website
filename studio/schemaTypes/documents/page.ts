import {DocumentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {slugField} from '../fields'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'internalTitle',
      title: 'Internal name',
      type: 'string',
      group: 'settings',
      description: 'Optional Studio-only label when several pages have similar public titles.',
    }),
    slugField('title', 'content'),
    defineField({
      name: 'sections',
      title: 'Page sections',
      type: 'pageBuilder',
      group: 'content',
      description: 'Add and reorder sections. The website controls how each section looks.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'socialImage',
      title: 'Social sharing image',
      type: 'altImage',
      group: 'seo',
      description: 'Optional. Overrides the SEO social image for this page.',
    }),
    defineField({
      name: 'visible',
      title: 'Show on the website',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      internalTitle: 'internalTitle',
      slug: 'slug.current',
      visible: 'visible',
    },
    prepare({title, internalTitle, slug, visible}) {
      return {
        title: internalTitle || title || 'Untitled page',
        subtitle: `${slug ? `/${slug}` : 'No slug'}${visible === false ? ' · hidden' : ''}`,
      }
    },
  },
})
