import {DocumentTextIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

/**
 * Fixed Experiences hub document. Experience cards stay on experience documents.
 * The website uses this document only when every required field is present.
 */

export const experiencesHub = defineType({
  name: 'experiencesHub',
  title: 'Experiences hub',
  type: 'document',
  icon: DocumentTextIcon,
  description:
    'The heading, introduction, and empty-state text for the Experiences page. Individual experiences, prices, and booking links stay on Experience documents.',
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page heading',
      type: 'string',
      group: 'content',
      description: 'The large heading at the top of the Experiences page.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      group: 'content',
      description:
        'The paragraph under the heading. Filters are not on the page yet, so do not promise filters or booking here.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'emptyHeading',
      title: 'Empty-state heading',
      type: 'string',
      group: 'content',
      description:
        'The short line inside the box visitors see when no experiences are published. The box is hidden once an experience is published.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Empty-state message',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'The sentence under the empty-state heading.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search result title',
      type: 'string',
      group: 'seo',
      description: 'The title in Google results and the browser tab for the Experiences page.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The short description under the Experiences page title in Google results.',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Title when the page is shared',
      type: 'string',
      group: 'seo',
      description:
        'The title shown when someone shares the Experiences page. It can differ from the search result title.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Description when the page is shared',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The description shown when someone shares the Experiences page.',
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Experiences hub',
        subtitle: 'Page heading, introduction, and search text',
      }
    },
  },
})
