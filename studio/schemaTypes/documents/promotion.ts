import {StarIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {activeField} from '../fields'

export const promotion = defineType({
  name: 'promotion',
  title: 'Promotion',
  type: 'document',
  icon: StarIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      group: 'settings',
      description: 'Studio-only name so you can tell promotions apart.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Public heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'copy',
      title: 'Copy',
      type: 'text',
      rows: 4,
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      group: 'content',
    }),
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'link',
      group: 'content',
    }),
    defineField({
      name: 'startDate',
      title: 'Start date',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'endDate',
      title: 'End date',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'pages',
      title: 'Applicable pages',
      type: 'array',
      group: 'settings',
      of: [defineArrayMember({type: 'reference', to: [{type: 'page'}]})],
    }),
    defineField({
      name: 'experiences',
      title: 'Applicable experiences',
      type: 'array',
      group: 'settings',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    }),
    activeField('Active', 'settings'),
  ],
  preview: {
    select: {
      title: 'internalName',
      subtitle: 'heading',
      media: 'image',
      active: 'active',
    },
    prepare({title, subtitle, media, active}) {
      return {
        title: title || subtitle || 'Untitled promotion',
        subtitle: `${subtitle || 'Promotion'}${active === false ? ' · inactive' : ''}`,
        media,
      }
    },
  },
})
