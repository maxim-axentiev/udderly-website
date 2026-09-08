import {LinkIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const navLink = defineType({
  name: 'navLink',
  title: 'Navigation link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'link.label',
      linkType: 'link.linkType',
      href: 'link.href',
    },
    prepare({title, linkType, href}) {
      return {
        title: title || 'Untitled link',
        subtitle: linkType === 'external' ? href : 'Website page',
      }
    },
  },
})

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'children',
      title: 'Dropdown links',
      type: 'array',
      description: 'Optional. One level of links only — nested menus are not supported.',
      of: [defineArrayMember({type: 'navLink'})],
      validation: (rule) => rule.max(8),
    }),
  ],
  preview: {
    select: {
      title: 'link.label',
      children: 'children',
    },
    prepare({title, children}) {
      const count = Array.isArray(children) ? children.length : 0
      return {
        title: title || 'Untitled item',
        subtitle: count ? `${count} dropdown link${count === 1 ? '' : 's'}` : 'Top-level link',
      }
    },
  },
})
