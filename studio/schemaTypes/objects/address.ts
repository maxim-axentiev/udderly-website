import {defineField, defineType} from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({
      name: 'line1',
      title: 'Street address',
      type: 'string',
    }),
    defineField({
      name: 'line2',
      title: 'Street address line 2',
      type: 'string',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
    }),
    defineField({
      name: 'region',
      title: 'Province / state',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal code',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
  ],
})
