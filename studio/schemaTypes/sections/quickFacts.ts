import {CalendarIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const quickFacts = defineType({
  name: 'quickFacts',
  title: 'Quick facts',
  type: 'object',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Quick facts',
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [defineArrayMember({type: 'factItem'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Quick facts',
        subtitle: 'Quick facts',
      }
    },
  },
})
