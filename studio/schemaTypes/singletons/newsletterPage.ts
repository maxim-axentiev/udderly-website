import {CommentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const newsletterPage = defineType({
  name: 'newsletterPage',
  title: 'Newsletter page',
  type: 'document',
  icon: CommentIcon,
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'form', title: 'Form'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      group: 'page',
      description: 'Leave empty to keep the approved newsletter heading.',
    }),
    defineField({
      name: 'copy',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'page',
    }),
    defineField({
      name: 'firstNameLabel',
      title: 'First name label',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'emailLabel',
      title: 'Email label',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'dateOfBirthLabel',
      title: 'Date of birth label',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Button label',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'unavailableMessage',
      title: 'Unavailable message',
      type: 'text',
      rows: 2,
      group: 'form',
      description:
        'Signup is not connected. This sentence stays visible and the button stays off. Do not say someone has subscribed.',
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
      return {title: 'Newsletter page'}
    },
  },
})