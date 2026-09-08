import {BoltIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {experienceCategories, experienceSeasons} from '../constants'
import {featuredField, orderRankField, slugField} from '../fields'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: BoltIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'visit', title: 'Visit info'},
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
      validation: (rule) => rule.required().max(80),
    }),
    slugField('title', 'content'),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'body',
      title: 'Full description',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'altImage'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'category',
      title: 'Experience type',
      type: 'string',
      group: 'visit',
      options: {list: [...experienceCategories]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'season',
      title: 'Season',
      type: 'string',
      group: 'visit',
      options: {list: [...experienceSeasons]},
      initialValue: 'yearRound',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'visit',
      description: 'Display text only, for example “2 hours” or “Overnight”.',
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price display',
      type: 'string',
      group: 'visit',
      description: 'Display text only, for example “From $45”. Booking systems are not connected yet.',
    }),
    defineField({
      name: 'ageGuidance',
      title: 'Age guidance',
      type: 'string',
      group: 'visit',
    }),
    defineField({
      name: 'visitorInfo',
      title: 'Accessibility and visitor information',
      type: 'portableText',
      group: 'visit',
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
      group: 'visit',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'animals',
      title: 'Animals guests will meet',
      type: 'array',
      group: 'related',
      description: 'Choose animals here. Do not also try to attach the experience from each animal.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'animal'}]})],
    }),
    defineField({
      name: 'faqs',
      title: 'Related FAQs',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
    }),
    defineField({
      name: 'testimonials',
      title: 'Related testimonials',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'sections',
      title: 'Additional page sections',
      type: 'pageBuilder',
      group: 'content',
      description: 'Optional extra sections below the main experience content.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    featuredField('settings'),
    orderRankField(undefined, 'settings'),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      active: 'active',
      category: 'category',
    },
    prepare({title, media, active, category}) {
      return {
        title: title || 'Untitled experience',
        subtitle: `${category || 'Experience'}${active === false ? ' · inactive' : ''}`,
        media,
      }
    },
  },
})
