import {HelpCircleIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ section',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Frequently asked questions',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'FAQs',
        subtitle: 'FAQ section',
      }
    },
  },
})
