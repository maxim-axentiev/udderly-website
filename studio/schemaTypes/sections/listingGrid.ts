import {TagIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const listingGrid = defineType({
  name: 'listingGrid',
  title: 'Animals for sale',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Animals for sale',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Which listings to show',
      type: 'string',
      options: {
        list: [
          {title: 'Available listings', value: 'available'},
          {title: 'Featured listings', value: 'featured'},
          {title: 'Selected listings', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
    }),
    defineField({
      name: 'listings',
      title: 'Selected listings',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'animalListing'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one listing.'
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
        title: title || 'Animals for sale',
        subtitle: 'Animals for sale',
      }
    },
  },
})
