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
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'footerItems',
      title: 'Footer navigation',
      type: 'array',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.max(12),
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
