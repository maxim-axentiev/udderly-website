import {UsersIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

/**
 * Page copy for /team. People are edited as Team members.
 * Until a visible team member is published, the page shows labeled design placeholders.
 */

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team page',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'profiles', title: 'Profiles'},
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
      name: 'heroIntro',
      title: 'Hero introduction',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'factLabel',
      title: 'Ridiculous-fact label',
      type: 'string',
      group: 'profiles',
      description: 'Shown before each person’s fact. Leave empty to keep “Udderly ridiculous fact:”.',
      validation: (rule) => rule.max(60),
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
      return {title: 'Team'}
    },
  },
})
