import {ImageIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const altImage = defineType({
  name: 'altImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for visitors who cannot see it. Do not start with “image of”.',
      validation: (rule) => rule.required().max(160),
    }),
  ],
})
