import {defineField, defineType} from 'sanity'

export const itineraryStep = defineType({
  name: 'itineraryStep',
  title: 'Itinerary step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Step title',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'timeLabel',
      title: 'Time or order label',
      type: 'string',
      description: 'Optional, for example “2:00 pm” or “Day 1”.',
    }),
    defineField({
      name: 'detail',
      title: 'What happens',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'timeLabel'},
  },
})
