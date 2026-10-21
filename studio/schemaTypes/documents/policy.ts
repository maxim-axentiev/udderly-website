import {DocumentTextIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {policyTypes} from '../constants'
import {activeField} from '../fields'

const APPROVAL =
  'Design fallback dated October 10, 2026. This wording is not legally approved. Do not create or publish a legal policy until the farm approves it. Leave this empty on the cancellation policy.'

export const policy = defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Policy', default: true},
    {name: 'website', title: 'Website page'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      group: 'content',
      description: 'Studio-only name, for example “Standard Farm Experience Cancellation Policy”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Public heading',
      type: 'string',
      group: 'content',
      description:
        'Optional heading shown on the website. Leave blank to use the internal name. Do not publish this policy until the wording is approved.',
    }),
    defineField({
      name: 'policyType',
      title: 'Type',
      type: 'string',
      group: 'content',
      options: {list: [...policyTypes]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Policy content',
      type: 'portableText',
      group: 'content',
      description:
        'Experience pages show a cancellation policy only after that policy itself is published. Draft wording stays off the website. Legal page wording here replaces the design fallback only after this document is published.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publicSlug',
      title: 'Public legal page',
      type: 'string',
      group: 'website',
      description: APPROVAL,
      options: {
        list: [
          {title: 'Privacy policy (/privacy-policy)', value: 'privacy-policy'},
          {title: 'Terms of service (/terms-of-service)', value: 'terms-of-service'},
          {title: 'Cookies policy (/cookies-policy)', value: 'cookies-policy'},
        ],
      },
    }),
    defineField({
      name: 'revisionLabel',
      title: 'Effective or updated date',
      type: 'string',
      group: 'website',
      description: 'Shown on the public legal page, for example “Last Updated: October 10, 2026”. Leave blank to keep the design date.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    activeField('In use', 'content'),
  ],
  preview: {
    select: {
      title: 'internalName',
      policyType: 'policyType',
      publicSlug: 'publicSlug',
      active: 'active',
    },
    prepare({title, policyType, publicSlug, active}) {
      const page = publicSlug ? ` · /${publicSlug}` : ''
      return {
        title: title || 'Untitled policy',
        subtitle: `${policyType || 'policy'}${page}${active === false ? ' · inactive' : ''}`,
      }
    },
  },
})
