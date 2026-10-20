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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      description: 'The line under the name on the adoption page.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'animal',
      title: 'Animal',
      type: 'reference',
      group: 'content',
      description:
        'Optional link to a Meet the Herd animal. Leave empty when that animal record does not exist yet. This page can still be edited on its own.',
      to: [{type: 'animal'}],
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
      title: 'Card description',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'The short paragraph on the Adopt an Animal card.',
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'storyParagraphs',
      title: 'Introduction paragraphs',
      type: 'array',
      group: 'content',
      description: 'The paragraphs beside the gallery on this animal’s page.',
      of: [defineArrayMember({type: 'text', rows: 4, validation: (rule) => rule.required().max(800)})],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'cardImage',
      title: 'Card image',
      type: 'altImage',
      group: 'content',
      description: 'Portrait on the Adopt an Animal card. Leave empty to keep the current page image.',
    }),
    defineField({
      name: 'supportParagraphs',
      title: 'How this adoption helps',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'text', rows: 4, validation: (rule) => rule.required().max(800)})],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'termsItems',
      title: 'Fine print',
      type: 'array',
      group: 'content',
      description: 'The bullet list under “The fine print.” Leave empty to keep the current page text.',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.required().max(300)})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'packages',
      title: 'Adoption packages',
      type: 'array',
      group: 'package',
      of: [defineArrayMember({type: 'adoptionPackage'})],
      description:
        'For example Silver and Gold. Prices are display text only. Leave empty to keep the packages already on the page. A checkout URL is optional and does not turn the button into a payment link until it is an https:// address.',
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
      description: 'Photos for this adoption page. Leave empty to keep the photos already on the page.',
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
