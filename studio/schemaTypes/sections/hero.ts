import {ImageIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'primaryCta',
      title: 'Button',
      type: 'link',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled hero',
        subtitle: 'Hero',
        media,
      }
    },
  },
})
