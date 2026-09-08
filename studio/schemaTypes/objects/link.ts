import {LinkIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {internalLinkTypes} from '../constants'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          {title: 'Website page', value: 'internal'},
          {title: 'External website', value: 'external'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'internalLink',
      title: 'Website page',
      type: 'reference',
      to: internalLinkTypes,
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'internal' && !value) {
            return 'Choose a page, experience, or other website item.'
          }
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'External URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string} | undefined
          if (parent?.linkType === 'external' && !value) {
            return 'Enter a full URL, including https://'
          }
          return true
        }).uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in a new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'linkType',
      href: 'href',
    },
    prepare({title, linkType, href}) {
      return {
        title: title || 'Untitled link',
        subtitle: linkType === 'external' ? href : 'Website page',
      }
    },
  },
})
