import {HelpCircleIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {faqCategories} from '../constants'
import {activeField, orderRankField} from '../fields'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Shown on the website. Choose the FAQ category so pages can reuse the same questions.',
      options: {list: [...faqCategories]},
      initialValue: 'general',
      validation: (rule) => rule.required(),
    }),
    orderRankField(),
    activeField(),
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      active: 'active',
    },
    prepare({title, category, active}) {
      return {
        title: title || 'Untitled question',
        subtitle: `${category || 'general'}${active === false ? ' · inactive' : ''}`,
      }
    },
  },
})
