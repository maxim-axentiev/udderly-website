import {ImagesIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'altImage'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.required().min(1).max(24),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'images.0',
    },
    prepare({title, media}) {
      return {
        title: title || 'Gallery',
        subtitle: 'Gallery',
        media,
      }
    },
  },
})
