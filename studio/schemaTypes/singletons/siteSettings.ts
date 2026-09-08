import {CogIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'business', title: 'Business', default: true},
    {name: 'seo', title: 'Default SEO'},
    {name: 'notice', title: 'Announcement'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      group: 'business',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Primary address',
      type: 'address',
      group: 'business',
    }),
    defineField({
      name: 'email',
      title: 'General email',
      type: 'string',
      group: 'business',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      group: 'business',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'socialLinks',
      group: 'business',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Used when a page does not provide its own title, description, or social image.',
    }),
    defineField({
      name: 'announcementEnabled',
      title: 'Show site-wide announcement',
      type: 'boolean',
      group: 'notice',
      initialValue: false,
    }),
    defineField({
      name: 'announcement',
      title: 'Announcement message',
      type: 'string',
      group: 'notice',
      hidden: ({document}) => !document?.announcementEnabled,
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'announcementLink',
      title: 'Announcement link',
      type: 'link',
      group: 'notice',
      hidden: ({document}) => !document?.announcementEnabled,
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
    },
    prepare({title}) {
      return {
        title: title || 'Site settings',
        subtitle: 'Global website information',
      }
    },
  },
})
