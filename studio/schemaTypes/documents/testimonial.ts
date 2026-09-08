import {CommentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {featuredField, orderRankField} from '../fields'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: 'guestName',
      title: 'Guest name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Optional, for example Google, Facebook, or a stay name.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'experience',
      title: 'Related experience',
      type: 'reference',
      to: [{type: 'experience'}],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
    }),
    featuredField(),
    orderRankField(),
  ],
  preview: {
    select: {
      title: 'guestName',
      subtitle: 'quote',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Anonymous guest',
        subtitle: subtitle,
        media,
      }
    },
  },
})
