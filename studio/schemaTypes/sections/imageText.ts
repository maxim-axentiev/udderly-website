import {ComposeIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const imageText = defineType({
  name: 'imageText',
  title: 'Image + text',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Text',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      description: 'The website will keep this responsive. You are choosing a layout, not custom CSS.',
      options: {
        list: [
          {title: 'Image on the left', value: 'imageLeft'},
          {title: 'Image on the right', value: 'imageRight'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'imageLeft',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Image + text',
        subtitle: 'Image + text',
        media,
      }
    },
  },
})
