import {HeartFilledIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {adoptionAvailabilities} from '../constants'
import {featuredField, orderRankField, slugField} from '../fields'

export const adoptionOffering = defineType({
  name: 'adoptionOffering',
  title: 'Adoption offering',
  type: 'document',
  icon: HeartFilledIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'package', title: 'Packages'},
    {name: 'seo', title: 'SEO'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Display title',
      type: 'string',
      group: 'content',
      description: 'Usually the animal’s name, or a public title if you need something different.',
      validation: (rule) => rule.required().max(80),
    }),
    slugField('title', 'content'),
    defineField({
      name: 'animal',
      title: 'Animal',
      type: 'reference',
      group: 'content',
      description: 'Photo, personality, and story come from this Meet the Herd animal.',
      to: [{type: 'animal'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availability',
      title: 'Adoption availability',
      type: 'string',
      group: 'settings',
      options: {list: [...adoptionAvailabilities]},
      initialValue: 'available',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Adoption introduction',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'Optional extra copy for this adoption page. Do not repeat the animal’s full story here.',
    }),
    defineField({
      name: 'packages',
      title: 'Adoption packages',
      type: 'array',
      group: 'package',
      description: 'For example Silver and Gold. Prices are display text only.',
      of: [defineArrayMember({type: 'adoptionPackage'})],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'cta',
      title: 'Adopt button',
      type: 'link',
      group: 'package',
    }),
    defineField({
      name: 'howItHelps',
      title: 'How the adoption helps',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'terms',
      title: 'Important information / terms',
      type: 'reference',
      group: 'content',
      description: 'Reuse an Adoption Terms policy when possible.',
      to: [{type: 'policy'}],
    }),
    defineField({
      name: 'termsNotes',
      title: 'Additional terms notes',
      type: 'portableText',
      group: 'content',
      description: 'Optional extra notes if this animal needs something beyond the shared policy.',
    }),
    defineField({
      name: 'galleryOverride',
      title: 'Gallery override',
      type: 'array',
      group: 'content',
      description: 'Leave empty to use the animal’s gallery. Add images only if this page needs different photos.',
      of: [defineArrayMember({type: 'altImage'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'active',
      title: 'Show on the website',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
    featuredField('settings'),
    orderRankField('Lower numbers appear first on Adopt an Animal.', 'settings'),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'animal.profileImage',
      availability: 'availability',
      active: 'active',
    },
    prepare({title, media, availability, active}) {
      return {
        title: title || 'Untitled adoption',
        subtitle: `${availability || 'adoption'}${active === false ? ' · hidden' : ''}`,
        media,
      }
    },
  },
})
