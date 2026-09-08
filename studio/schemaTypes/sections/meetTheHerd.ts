import {HeartIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const meetTheHerd = defineType({
  name: 'meetTheHerd',
  title: 'Meet the herd',
  type: 'object',
  icon: HeartIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Meet the herd',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Which animals to show',
      type: 'string',
      description:
        'On an experience page, “Animals from this experience” uses the animals already attached to that experience.',
      options: {
        list: [
          {title: 'Animals from this experience', value: 'fromExperience'},
          {title: 'Featured animals', value: 'featured'},
          {title: 'Selected animals', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'selected',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'animals',
      title: 'Selected animals',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'animal'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one animal.'
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
        title: title || 'Meet the herd',
        subtitle: `Meet the herd · ${source || 'selected'}`,
      }
    },
  },
})
