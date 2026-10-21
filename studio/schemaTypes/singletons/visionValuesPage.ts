import {SparkleIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

/**
 * Copy for /vision-values. Empty fields keep the approved layout.
 * The five starter values are labeled placeholders until you replace the list.
 */

export const visionValuesPage = defineType({
  name: 'visionValuesPage',
  title: 'Vision and Values page',
  type: 'document',
  icon: SparkleIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'vision', title: 'Vision'},
    {name: 'gallery', title: 'Photos'},
    {name: 'values', title: 'Values'},
    {name: 'close', title: 'Closing'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Hero heading start',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'heroAccent',
      title: 'Hero heading accent',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'showVision',
      title: 'Show the vision section',
      type: 'boolean',
      group: 'vision',
      description: 'Leave unset to show it. Turn off to hide the whole section.',
    }),
    defineField({
      name: 'visionHeading',
      title: 'Vision heading',
      type: 'string',
      group: 'vision',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'visionParagraphs',
      title: 'Vision paragraphs',
      type: 'array',
      group: 'vision',
      of: [defineArrayMember({type: 'text', rows: 4})],
      description:
        'Leave empty to keep the labeled placeholder. Replace it with the approved vision statement when you have one.',
    }),
    defineField({
      name: 'visionImage',
      title: 'Vision photo',
      type: 'altImage',
      group: 'vision',
      description: 'Leave empty to keep the current photo.',
    }),
    defineField({
      name: 'showGallery',
      title: 'Show the photo row',
      type: 'boolean',
      group: 'gallery',
      description: 'Leave unset to show it. Turn off to hide the row.',
    }),
    defineField({
      name: 'gallery',
      title: 'Photos',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({type: 'altImage'})],
      description: 'Leave empty to keep the four approved photos.',
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'showValues',
      title: 'Show the values section',
      type: 'boolean',
      group: 'values',
      description: 'Leave unset to show it. Turn off to hide the whole section.',
    }),
    defineField({
      name: 'valuesHeading',
      title: 'Values heading',
      type: 'string',
      group: 'values',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'valuesImage',
      title: 'Values photo',
      type: 'altImage',
      group: 'values',
      description: 'Leave empty to keep the current photo.',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      group: 'values',
      of: [defineArrayMember({type: 'visionValue'})],
      description:
        'Leave empty to keep five labeled placeholders. Those placeholders are not official values. Adding real values replaces the placeholders.',
    }),
    defineField({
      name: 'showCta',
      title: 'Show the closing invitation',
      type: 'boolean',
      group: 'close',
      description: 'Leave unset to show it. Turn off to hide it.',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Closing heading',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'ctaBody',
      title: 'Closing text',
      type: 'text',
      rows: 3,
      group: 'close',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      group: 'close',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Vision and Values'}
    },
  },
})
