import {defineArrayMember, defineField, defineType} from 'sanity'

export const adoptionPackage = defineType({
  name: 'adoptionPackage',
  title: 'Adoption package',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Package name',
      type: 'string',
      description: 'For example Silver or Gold.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price shown on the website',
      type: 'string',
      description: 'Display text only, for example “$150 / year”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'includes',
      title: 'What this package includes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'priceDisplay'},
  },
})
