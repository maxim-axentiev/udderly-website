import {UsersIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {activeField, orderRankField} from '../fields'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'profile', title: 'Profile', default: true},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'profile',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'profile',
      description: 'Optional. Shown under the name when you add one.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'altImage',
      group: 'profile',
      description: 'Use a photo of this person. Animal photos are only the temporary page stand-in before anyone is published.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'portableText',
      group: 'profile',
      description: 'Write the real bio. Leave this empty rather than publishing a placeholder.',
    }),
    defineField({
      name: 'ridiculousFact',
      title: 'Udderly ridiculous fact',
      type: 'text',
      rows: 3,
      group: 'profile',
      description: 'A short true fact. Leave empty until you have one.',
      validation: (rule) => rule.max(240),
    }),
    orderRankField('Lower numbers appear first on the team page.', 'settings'),
    activeField('Show on the team page', 'settings'),
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
        subtitle: `${subtitle || 'Team'}${active === false ? ' · hidden' : ''}`,
        media,
      }
    },
  },
})
