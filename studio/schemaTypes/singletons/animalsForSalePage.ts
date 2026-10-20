import {DocumentTextIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

/**
 * Page copy for /animals-for-sale. Individual animals stay on Animal for sale
 * documents. The website keeps the Lovable page until every field here is filled.
 */

export const animalsForSalePage = defineType({
  name: 'animalsForSalePage',
  title: 'Animals for Sale page',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Hero heading start',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroAccent',
      title: 'Hero heading accent',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'content',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'heroSupport',
      title: 'Hero supporting line',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'introLead',
      title: 'Introduction heading start',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'introAccent',
      title: 'Introduction heading accent',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'introImage',
      title: 'Introduction image',
      type: 'altImage',
      group: 'content',
      description: 'Leave empty to keep the current photo.',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      group: 'content',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'introButtonLabel',
      title: 'Introduction button label',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'introButtonHref',
      title: 'Introduction button link',
      type: 'string',
      group: 'content',
      description: 'Usually #waitlist. Leave empty to use that link.',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
    defineField({
      name: 'manageCollection',
      title: 'Manage the animal list in Sanity',
      type: 'boolean',
      group: 'content',
      initialValue: false,
      description:
        'Turn this on when Animals for Sale should list only published listings. After it is on, unpublishing every listing leaves the list empty instead of restoring the original cards.',
    }),
    defineField({
      name: 'availableHeading',
      title: 'Available heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'soldLead',
      title: 'Sold heading start',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'soldAccent',
      title: 'Sold heading accent',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'soldIntro',
      title: 'Sold section introduction',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'prepItems',
      title: 'Preparing for a new animal',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(80)}),
            defineField({name: 'copy', title: 'Copy', type: 'text', rows: 4, validation: (rule) => rule.required().max(500)}),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'altImage',
              description: 'Leave empty to keep the current photo for this card.',
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    defineField({
      name: 'prepHeading',
      title: 'Preparation heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'learnMoreLabel',
      title: 'Learn more label',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'waitlistTitle',
      title: 'Waitlist heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'waitlistCopy',
      title: 'Waitlist introduction',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'detailWaitlistTitle',
      title: 'Detail waitlist heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'detailWaitlistCopy',
      title: 'Detail waitlist introduction',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'buyButtonLabel',
      title: 'Buy button label',
      type: 'string',
      group: 'content',
      description: 'The button that scrolls to the inquiry form. It is not a payment link.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'contactHeading',
      title: 'Inquiry heading',
      type: 'string',
      group: 'content',
      description: 'Use {name} where the listing name should appear.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'contactButtonLabel',
      title: 'Inquiry button label',
      type: 'string',
      group: 'content',
      description: 'The inquiry form does not send a message. This label is display text only.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search result title',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.required().max(320),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Animals for Sale page', subtitle: 'Page copy. Listings stay on animal records.'}
    },
  },
})
