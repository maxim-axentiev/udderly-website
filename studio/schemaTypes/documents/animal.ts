import {HeartIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {animalStatuses, listingSexes} from '../constants'
import {featuredField, orderRankField, slugField} from '../fields'

export const animal = defineType({
  name: 'animal',
  title: 'Animal',
  type: 'document',
  icon: HeartIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Details'},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(60),
    }),
    slugField('name', 'content'),
    defineField({
      name: 'species',
      title: 'Species',
      type: 'reference',
      group: 'details',
      to: [{type: 'animalSpecies'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'breed',
      title: 'Breed',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'sex',
      title: 'Sex',
      type: 'string',
      group: 'details',
      options: {list: [...listingSexes]},
    }),
    defineField({
      name: 'birthYear',
      title: 'Birth year',
      type: 'number',
      group: 'details',
      description: 'Use a year if the exact date is unknown.',
      validation: (rule) => rule.min(1980).max(new Date().getFullYear()).integer(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth date',
      type: 'date',
      group: 'details',
      description: 'Optional if the exact date is known.',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile image',
      type: 'altImage',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'altImage'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'shortIntro',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Used on Meet the Herd cards and experience “meet the herd” sections.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'story',
      title: 'Personality and story',
      type: 'portableText',
      group: 'content',
      description: 'Used on the animal’s own page and anywhere else this animal is featured.',
    }),
    defineField({
      name: 'funFacts',
      title: 'Fun facts',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'settings',
      options: {list: [...animalStatuses]},
      initialValue: 'active',
      validation: (rule) => rule.required(),
    }),
    featuredField('settings'),
    orderRankField(undefined, 'settings'),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'profileImage',
      species: 'species.title',
      status: 'status',
    },
    prepare({title, media, species, status}) {
      return {
        title: title || 'Unnamed animal',
        subtitle: [species, status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
