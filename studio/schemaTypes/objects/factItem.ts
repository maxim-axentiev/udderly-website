import {defineField, defineType} from 'sanity'

export const factItem = defineType({
  name: 'factItem',
  title: 'Quick fact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
