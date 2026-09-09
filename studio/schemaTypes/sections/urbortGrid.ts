import {BookIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const urbortGrid = defineType({
  name: 'urbortGrid',
  title: 'URBORT grid',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'URBORT',
    }),
    defineField({
      name: 'source',
      title: 'Which articles to show',
      type: 'string',
      options: {
        list: [
          {title: 'Latest articles', value: 'latest'},
          {title: 'Selected articles', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'limit',
      title: 'How many articles',
      type: 'number',
      initialValue: 3,
      hidden: ({parent}) => parent?.source !== 'latest',
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
    defineField({
      name: 'articles',
      title: 'Selected articles',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'urbortArticle'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one URBORT article.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'URBORT',
        subtitle: 'URBORT grid',
      }
    },
  },
})
