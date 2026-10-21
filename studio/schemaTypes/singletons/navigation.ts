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
      description:
        'Leave this empty to keep the approved header. A published list replaces it only when every current destination is included or marked hidden. A shorter list keeps the approved header, including Farm Glamping, Corporate Training, and the other current links. Use a site path for pages that are not experiences or articles.',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      description:
        'Leave this empty to keep the approved footer. A published set of columns replaces it only when every current footer destination is included or marked hidden. A shorter set keeps the approved footer.',
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
        'Privacy Policy, Terms of Service, and Cookies Policy. Leave empty to keep those three links. A published list replaces them only when all three destinations are included or marked hidden. Do not paste policy text here.',
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
