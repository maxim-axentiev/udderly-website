import {LaunchIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const ctaSection = defineType({
  name: 'ctaSection',
  title: 'Call to action',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'copy',
      title: 'Copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'link',
      title: 'Button',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Call to action',
        subtitle: 'CTA',
      }
    },
  },
})
