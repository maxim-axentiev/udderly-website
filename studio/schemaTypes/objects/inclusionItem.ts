import {defineField, defineType} from 'sanity'

export const inclusionItem = defineType({
  name: 'inclusionItem',
  title: 'Included item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Item',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'detail',
      title: 'Optional detail',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'detail'},
  },
})
