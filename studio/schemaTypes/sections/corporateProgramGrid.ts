import {CaseIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const corporateProgramGrid = defineType({
  name: 'corporateProgramGrid',
  title: 'Corporate program grid',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Corporate training programs',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'source',
      title: 'Which programs to show',
      type: 'string',
      options: {
        list: [
          {title: 'All active programs', value: 'all'},
          {title: 'Featured programs', value: 'featured'},
          {title: 'Selected programs', value: 'selected'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'programs',
      title: 'Selected programs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'corporateProgram'}]})],
      hidden: ({parent}) => parent?.source !== 'selected',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source === 'selected' && (!value || value.length === 0)) {
            return 'Choose at least one corporate program.'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Corporate programs',
        subtitle: 'Corporate program grid',
      }
    },
  },
})
