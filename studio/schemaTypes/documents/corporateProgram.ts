import {CaseIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {featuredField, orderRankField, slugField} from '../fields'

export const corporateProgram = defineType({
  name: 'corporateProgram',
  title: 'Corporate program',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'program', title: 'Program details'},
    {name: 'related', title: 'Related'},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'For example DISC Assessment or Alpaca Emotional Intelligence.',
      validation: (rule) => rule.required().max(90),
    }),
    slugField('title', 'content'),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Used on the Corporate Training hub.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'content',
    }),
    defineField({
      name: 'businessProblem',
      title: 'Business problem / positioning',
      type: 'portableText',
      group: 'content',
      description: 'The workplace challenge this program addresses.',
    }),
    defineField({
      name: 'programDescription',
      title: 'Program description',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'learningOutcomes',
      title: 'Learning outcomes',
      type: 'array',
      group: 'program',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      group: 'program',
      description: 'For example workshop, half-day, or facilitated session.',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'program',
    }),
    defineField({
      name: 'farmComponent',
      title: 'Farm / animal component',
      type: 'portableText',
      group: 'program',
      description: 'How the farm and animals are part of the program.',
    }),
    defineField({
      name: 'enhancements',
      title: 'Optional enhancements',
      type: 'portableText',
      group: 'program',
    }),
    defineField({
      name: 'testimonials',
      title: 'Relevant testimonials',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'inquiryCta',
      title: 'Inquiry button',
      type: 'link',
      group: 'related',
      description: 'Where “Ask about this program” should go.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'active',
      title: 'Show on the website',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    featuredField('settings'),
    orderRankField('Lower numbers appear first on the Corporate Training hub.', 'settings'),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      active: 'active',
    },
    prepare({title, media, active}) {
      return {
        title: title || 'Untitled program',
        subtitle: `Corporate program${active === false ? ' · hidden' : ''}`,
        media,
      }
    },
  },
})
