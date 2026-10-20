import {defineArrayMember, defineField, defineType} from 'sanity'

export const adoptionPackage = defineType({
  name: 'adoptionPackage',
  title: 'Adoption package',
  type: 'object',
  fields: [
    defineField({
      name: 'kicker',
      title: 'Badge',
      type: 'string',
      description: 'Small label above the package name, for example “Silver Pail”.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'name',
      title: 'Package name',
      type: 'string',
      description: 'For example Silver or Gold.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Short line under the package name. Display text only.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price shown on the website',
      type: 'string',
      description: 'Display text only, for example “$35”. This does not start a payment.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'checkoutUrl',
      title: 'Checkout URL',
      type: 'url',
      description:
        'Leave empty until a real payment page exists. The website keeps the button inactive without an https:// address.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
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
