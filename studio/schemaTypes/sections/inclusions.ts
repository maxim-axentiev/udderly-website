import {ListIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const inclusions = defineType({
  name: 'inclusions',
  title: 'What’s included',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'What’s included',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'items',
      title: 'Included items',
      type: 'array',
      of: [defineArrayMember({type: 'inclusionItem'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'What’s included',
        subtitle: 'What’s included',
      }
    },
  },
})
