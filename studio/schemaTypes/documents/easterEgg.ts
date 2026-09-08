import {SparkleIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {easterEggTypes} from '../constants'
import {activeField} from '../fields'

export const easterEgg = defineType({
  name: 'easterEgg',
  title: 'Easter egg',
  type: 'document',
  icon: SparkleIcon,
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eggType',
      title: 'Type',
      type: 'string',
      group: 'settings',
      description: 'Choose a supported easter egg. Custom code is not allowed.',
      options: {list: [...easterEggTypes]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'targetPages',
      title: 'Target pages',
      type: 'array',
      group: 'settings',
      description: 'Leave empty to allow this easter egg site-wide.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'page'}, {type: 'experience'}]})],
    }),
    defineField({
      name: 'heading',
      title: 'Text',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Additional text',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      group: 'content',
      hidden: ({parent}) => parent?.eggType === 'clickSound' || parent?.eggType === 'keyboardPhrase',
    }),
    defineField({
      name: 'audio',
      title: 'Sound',
      type: 'file',
      group: 'content',
      options: {accept: 'audio/*'},
      hidden: ({parent}) => parent?.eggType === 'hiddenImage' || parent?.eggType === 'seasonalMessage',
    }),
    defineField({
      name: 'triggerPhrase',
      title: 'Keyboard phrase',
      type: 'string',
      group: 'settings',
      description: 'Letters and numbers only. The website will listen for this phrase.',
      hidden: ({parent}) => parent?.eggType !== 'keyboardPhrase',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {eggType?: string} | undefined
          if (parent?.eggType === 'keyboardPhrase' && !value) {
            return 'Enter the phrase visitors type.'
          }
          if (value && !/^[a-z0-9 ]+$/i.test(value)) {
            return 'Use letters, numbers, and spaces only.'
          }
          return true
        }),
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
    activeField('Enabled', 'settings'),
  ],
  preview: {
    select: {
      title: 'internalName',
      eggType: 'eggType',
      enabled: 'active',
      media: 'image',
    },
    prepare({title, eggType, enabled, media}) {
      return {
        title: title || 'Untitled easter egg',
        subtitle: `${eggType || 'easter egg'}${enabled === false ? ' · off' : ''}`,
        media,
      }
    },
  },
})
