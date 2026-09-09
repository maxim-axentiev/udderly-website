import {CommentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {testimonialTopics} from '../constants'
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
      name: 'topic',
      title: 'Used for',
      type: 'string',
      description: 'Helps pick the right quotes for Experiences, Corporate, Glamping, or Adoption pages.',
      options: {list: [...testimonialTopics]},
      initialValue: 'general',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'experience',
      title: 'Related experience',
      type: 'reference',
      to: [{type: 'experience'}],
      hidden: ({document}) => document?.topic !== 'experience',
    }),
    defineField({
      name: 'corporateProgram',
      title: 'Related corporate program',
      type: 'reference',
      to: [{type: 'corporateProgram'}],
      hidden: ({document}) => document?.topic !== 'corporate',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Optional, for example Google or Facebook.',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
      topic: 'topic',
    },
    prepare({title, subtitle, media, topic}) {
      return {
        title: title || 'Anonymous guest',
        subtitle: topic ? `${topic} · ${subtitle || ''}` : subtitle,
        media,
      }
    },
  },
})
