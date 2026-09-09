import {defineField, defineType} from 'sanity'

import {weekDays} from '../constants'

export const dayHours = defineType({
  name: 'dayHours',
  title: 'Hours for a day',
  type: 'object',
  fields: [
    defineField({
      name: 'day',
      title: 'Day',
      type: 'string',
      options: {list: [...weekDays]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'closed',
      title: 'Closed this day',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'openTime',
      title: 'Opens',
      type: 'string',
      description: 'For example 10:00 am.',
      hidden: ({parent}) => Boolean(parent?.closed),
    }),
    defineField({
      name: 'closeTime',
      title: 'Closes',
      type: 'string',
      description: 'For example 4:00 pm.',
      hidden: ({parent}) => Boolean(parent?.closed),
    }),
  ],
  preview: {
    select: {
      day: 'day',
      closed: 'closed',
      openTime: 'openTime',
      closeTime: 'closeTime',
    },
    prepare({day, closed, openTime, closeTime}) {
      const label = weekDays.find((item) => item.value === day)?.title || day
      return {
        title: label || 'Hours',
        subtitle: closed ? 'Closed' : [openTime, closeTime].filter(Boolean).join(' – ') || 'Hours to be added',
      }
    },
  },
})
