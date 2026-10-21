import {MenuIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'headerItems',
      title: 'Header navigation',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
      validation: (rule) => rule.max(8),
      description: 'Leave empty to keep the approved header. A published list replaces it. Explore and About can be dropdowns without their own page.',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      description: 'Leave empty to keep the approved footer columns. A published list replaces those columns.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Column title',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({type: 'navLink'})],
              validation: (rule) => rule.min(1).max(8),
            }),
          ],
          preview: {
            select: {title: 'title'},
            prepare({title}) {
              return {title: title || 'Footer column'}
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'footerItems',
      title: 'Extra footer links',
      type: 'array',
      description: 'Optional flat list. The columns above are the footer people see when they are published.',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.max(16),
    }),
    defineField({
      name: 'legalItems',
      title: 'Footer legal links',
      type: 'array',
      description:
        'Privacy Policy, Terms of Service, and Cookies Policy. Leave empty to keep the current website links. Do not paste policy text here.',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Navigation',
        subtitle: 'Header and footer',
      }
    },
  },
})
