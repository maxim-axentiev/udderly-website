import {BookIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const postGrid = defineType({
  name: 'postGrid',
  title: 'Farm updates',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Farm updates',
    }),
    defineField({
      name: 'source',
      title: 'Which posts to show',
      type: 'string',
      options: {
        list: [
          {title: 'Latest posts', value: 'latest'},
          {title: 'Selected posts', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'limit',
      title: 'How many posts',
      type: 'number',
      initialValue: 3,
      hidden: ({parent}) => parent?.source !== 'latest',
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
    defineField({
      name: 'posts',
      title: 'Selected posts',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'post'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one farm update.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Farm updates',
        subtitle: 'Farm updates',
      }
    },
  },
})
