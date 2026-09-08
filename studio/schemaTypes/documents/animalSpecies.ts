import {TagIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {orderRankField, slugField} from '../fields'

export const animalSpecies = defineType({
  name: 'animalSpecies',
  title: 'Animal species',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      description: 'Singular name, for example “Highland cow” or “Goat”.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'pluralTitle',
      title: 'Plural name',
      type: 'string',
      description: 'For example “Highland cows” or “Goats”.',
      validation: (rule) => rule.max(60),
    }),
    slugField('title'),
    orderRankField('Used when grouping animals on Meet the Herd.'),
  ],
  preview: {
    select: {
      title: 'title',
      pluralTitle: 'pluralTitle',
    },
    prepare({title, pluralTitle}) {
      return {
        title: title || 'Untitled species',
        subtitle: pluralTitle || 'Species',
      }
    },
  },
})
