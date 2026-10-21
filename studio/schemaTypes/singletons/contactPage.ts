import {CommentIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  icon: CommentIcon,
  groups: [
    {name: 'page', title: 'Page', default: true},
    {name: 'form', title: 'Form'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Heading start',
      type: 'string',
      group: 'page',
      description: 'Leave empty to keep “Say”.',
    }),
    defineField({
      name: 'heroAccent',
      title: 'Heading accent',
      type: 'string',
      group: 'page',
      description: 'Leave empty to keep “hello”.',
    }),
    defineField({
      name: 'businessName',
      title: 'Name under the heading',
      type: 'string',
      group: 'page',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      group: 'page',
      description: 'Optional line under the business name. Leave empty to hide it.',
    }),
    defineField({
      name: 'formHeading',
      title: 'Form heading',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'nameLabel',
      title: 'Name label',
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
      name: 'messageLabel',
      title: 'Message label',
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
        'The form does not send messages. This sentence stays visible. Do not say a message was sent.',
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
      return {title: 'Contact page'}
    },
  },
})
