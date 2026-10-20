import {DocumentTextIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

import {policyTypes} from '../constants'
import {activeField} from '../fields'

export const policy = defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'internalName',
      title: 'Internal name',
      type: 'string',
      description: 'Studio-only name, for example “Standard Farm Experience Cancellation Policy”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Public heading',
      type: 'string',
      description: 'Optional heading shown on the website. Leave blank to use the internal name. Do not publish this policy until the wording is approved.',
    }),
    defineField({
      name: 'policyType',
      title: 'Type',
      type: 'string',
      options: {list: [...policyTypes]},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Policy content',
      type: 'portableText',
      description: 'Experience pages show this only after the policy itself is published. Draft wording stays off the website.',
      validation: (rule) => rule.required(),
    }),
    activeField('In use'),
  ],
  preview: {
    select: {
      title: 'internalName',
      policyType: 'policyType',
      active: 'active',
    },
    prepare({title, policyType, active}) {
      return {
        title: title || 'Untitled policy',
        subtitle: `${policyType || 'policy'}${active === false ? ' · inactive' : ''}`,
      }
    },
  },
})
