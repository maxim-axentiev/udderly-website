import {HeartFilledIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const adoptionGrid = defineType({
  name: 'adoptionGrid',
  title: 'Adoption offering grid',
  type: 'object',
  icon: HeartFilledIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Adopt an animal',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Which offerings to show',
      type: 'string',
      options: {
        list: [
          {title: 'All active offerings', value: 'all'},
          {title: 'Featured offerings', value: 'featured'},
          {title: 'Selected offerings', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'offerings',
      title: 'Selected offerings',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'adoptionOffering'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one adoption offering.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Adopt an animal',
        subtitle: 'Adoption offering grid',
      }
    },
  },
})
