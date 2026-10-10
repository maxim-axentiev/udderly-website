import {CogIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'business', title: 'Business', default: true},
    {name: 'seo', title: 'Default SEO'},
    {name: 'notice', title: 'Announcement'},
    {name: 'hours', title: 'Hours'},
    {name: 'homepage', title: 'Homepage'},
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
      title: 'Social profiles',
      type: 'socialLinks',
      group: 'business',
    }),
    defineField({
      name: 'bookingCta',
      title: 'Book an Experience button',
      type: 'link',
      group: 'business',
      description:
        'Used in the website header. Experience pages still use each experience’s own booking link.',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'string',
      group: 'business',
      initialValue: 'Come Do Something Udderly Ridiculous',
      description: 'Short line under the footer wordmark.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'homepageFaqs',
      title: 'Homepage FAQs',
      type: 'array',
      group: 'homepage',
      description:
        'Choose and order existing FAQ documents for the homepage accordion. Only these selected questions appear. Leave empty to keep the current website copy. Cancellation and opening-hours answers must live on complete FAQ documents — weekly hours and policy documents are not used here.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'faq'}]})],
      validation: (rule) => rule.unique().max(20),
    }),
    defineField({
      name: 'hoursNote',
      title: 'Current / seasonal hours note',
      type: 'text',
      rows: 2,
      group: 'hours',
      description: 'Optional note used on Contact and Farm Market, for example winter hours.',
    }),
    defineField({
      name: 'weeklyHours',
      title: 'Weekly hours',
      type: 'array',
      group: 'hours',
      description: 'Shared hours for Contact and Farm Market. Add a row for each day you want to show.',
      of: [{type: 'dayHours'}],
      validation: (rule) => rule.max(7),
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
