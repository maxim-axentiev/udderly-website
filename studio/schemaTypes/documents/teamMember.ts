import {UsersIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {activeField, orderRankField} from '../fields'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'altImage',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
    }),
    orderRankField(),
    activeField(),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
      active: 'active',
    },
    prepare({title, subtitle, media, active}) {
      return {
        title: title || 'Unnamed team member',
        subtitle: `${subtitle || 'Team'}${active === false ? ' · inactive' : ''}`,
        media,
      }
    },
  },
})
