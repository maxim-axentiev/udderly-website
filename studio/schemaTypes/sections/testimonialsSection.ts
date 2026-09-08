import {CommentIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials',
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'What guests say',
    }),
    defineField({
      name: 'source',
      title: 'Which testimonials to show',
      type: 'string',
      options: {
        list: [
          {title: 'Featured testimonials', value: 'featured'},
          {title: 'Selected testimonials', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'featured',
    }),
    defineField({
      name: 'testimonials',
      title: 'Selected testimonials',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one testimonial.'
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
        title: title || 'Testimonials',
        subtitle: 'Testimonials',
      }
    },
  },
})
