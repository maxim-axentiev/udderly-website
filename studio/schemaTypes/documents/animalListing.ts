import {TagIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {listingDetailProfiles, listingSexes, listingStatuses} from '../constants'
import {featuredField, orderRankField, slugField} from '../fields'

function isCattleListing(document?: Record<string, unknown>) {
  return document?.detailsProfile === 'cattle'
}

export const animalListing = defineType({
  name: 'animalListing',
  title: 'Animal for sale',
  type: 'document',
  icon: TagIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Details'},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Listing name',
      type: 'string',
      group: 'content',
      description: 'Public name of this listing. This is website content only, not a sales record.',
      validation: (rule) => rule.required().max(80),
    }),
    slugField('title', 'content'),
    defineField({
      name: 'status',
      title: 'Listing status',
      type: 'string',
      group: 'settings',
      description: 'What visitors should see. Applicant and sales-pipeline information is not stored here.',
      options: {list: [...listingStatuses]},
      initialValue: 'available',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'species',
      title: 'Species',
      type: 'reference',
      group: 'details',
      to: [{type: 'animalSpecies'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detailsProfile',
      title: 'Listing details',
      type: 'string',
      group: 'details',
      description: 'Cattle listings show lineage, genetics, colour, and size. Other species hide those fields.',
      options: {list: [...listingDetailProfiles], layout: 'radio'},
      initialValue: 'general',
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
      validation: (rule) => rule.min(1980).max(new Date().getFullYear()).integer(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'colour',
      title: 'Colour',
      type: 'string',
      group: 'details',
      hidden: ({document}) => !isCattleListing(document as Record<string, unknown> | undefined),
    }),
    defineField({
      name: 'parents',
      title: 'Parents / lineage',
      type: 'text',
      rows: 3,
      group: 'details',
      hidden: ({document}) => !isCattleListing(document as Record<string, unknown> | undefined),
    }),
    defineField({
      name: 'genetics',
      title: 'Genetics / chondro status',
      type: 'string',
      group: 'details',
      hidden: ({document}) => !isCattleListing(document as Record<string, unknown> | undefined),
    }),
    defineField({
      name: 'expectedSize',
      title: 'Expected size',
      type: 'string',
      group: 'details',
      hidden: ({document}) => !isCattleListing(document as Record<string, unknown> | undefined),
    }),
    defineField({
      name: 'readyDate',
      title: 'Ready date',
      type: 'date',
      group: 'details',
      description: 'Optional public date, if this animal is not ready yet.',
    }),
    defineField({
      name: 'personality',
      title: 'Personality',
      type: 'text',
      rows: 3,
      group: 'content',
    }),
    defineField({
      name: 'placementRequirements',
      title: 'Placement requirements',
      type: 'portableText',
      group: 'details',
      description: 'Public requirements for a suitable home. Do not store applicant answers here.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'altImage'})],
      options: {layout: 'grid'},
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price shown on the website',
      type: 'string',
      group: 'details',
      description: 'Optional public text, for example “Contact for price”.',
    }),
    defineField({
      name: 'traits',
      title: 'Other traits',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'string'})],
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
      title: 'title',
      media: 'images.0',
      status: 'status',
      species: 'species.title',
    },
    prepare({title, media, status, species}) {
      return {
        title: title || 'Untitled listing',
        subtitle: [species, status].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
