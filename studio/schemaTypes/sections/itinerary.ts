import {TaskIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const itinerary = defineType({
  name: 'itinerary',
  title: 'Itinerary',
  type: 'object',
  icon: TaskIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Itinerary',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [defineArrayMember({type: 'itineraryStep'})],
      validation: (rule) => rule.required().min(2),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Itinerary',
        subtitle: 'Itinerary',
      }
    },
  },
})
