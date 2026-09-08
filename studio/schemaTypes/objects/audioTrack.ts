import {PlayIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const audioTrack = defineType({
  name: 'audioTrack',
  title: 'Audio track',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Track title',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'file',
      title: 'Audio file',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Accessibility description',
      type: 'text',
      rows: 2,
      description: 'Optional. Describe the sounds for visitors using assistive technology.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled track',
        subtitle: 'Farm sound',
      }
    },
  },
})
