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
      name: 'menuLabel',
      title: 'Menu label',
      type: 'string',
      description: 'Use this for a dropdown that has no page of its own, such as Explore or About. Leave empty to use the link label.',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      description: 'Optional when this item only opens a dropdown.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {children?: unknown[]} | undefined
          if (Array.isArray(parent?.children) && parent.children.length > 0) return true
          if (!value) return 'Add a link, or add dropdown links.'
          return true
        }),
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
      title: 'menuLabel',
      linkTitle: 'link.label',
      children: 'children',
    },
    prepare({title, linkTitle, children}: {title?: string; linkTitle?: string; children?: unknown}) {
      const count = Array.isArray(children) ? children.length : 0
      return {
        title: title || linkTitle || 'Untitled item',
        subtitle: count ? `${count} dropdown link${count === 1 ? '' : 's'}` : 'Top-level link',
      }
    },
  },
})
