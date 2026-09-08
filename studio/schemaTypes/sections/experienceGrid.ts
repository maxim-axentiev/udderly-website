import {BoltIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const experienceGrid = defineType({
  name: 'experienceGrid',
  title: 'Experience grid',
  type: 'object',
  icon: BoltIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Which experiences to show',
      type: 'string',
      options: {
        list: [
          {title: 'All active experiences', value: 'all'},
          {title: 'Featured experiences', value: 'featured'},
          {title: 'Selected experiences', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'experiences',
      title: 'Selected experiences',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one experience.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      source: 'source',
    },
    prepare({title, source}) {
      return {
        title: title || 'Experiences',
        subtitle: `Experience grid · ${source || 'all'}`,
      }
    },
  },
})
