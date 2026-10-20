import {CaseIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Copy for /corporate-training. Leave fields empty to keep the approved page
 * design. Program cards can also be updated by a published, visible corporate
 * program with the matching address.
 */

export const corporateTrainingPage = defineType({
  name: 'corporateTrainingPage',
  title: 'Corporate Training page',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'intro', title: 'Introduction'},
    {name: 'programs', title: 'Programs'},
    {name: 'close', title: 'Facilitator and facility'},
    {name: 'enquiry', title: 'Enquiry'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Hero heading start',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(120),
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
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'showAwards',
      title: 'Show TripAdvisor awards',
      type: 'boolean',
      group: 'hero',
      description: 'Leave unset to follow the shared awards setting. Turn off to hide the strip on this page.',
    }),
    defineField({
      name: 'introLead',
      title: 'Introduction heading start',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'introAccent',
      title: 'Introduction heading accent',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'introParagraphs',
      title: 'Introduction paragraphs',
      type: 'array',
      group: 'intro',
      of: [defineArrayMember({type: 'text', rows: 4})],
      description: 'Leave empty to keep the approved introduction.',
    }),
    defineField({
      name: 'introGallery',
      title: 'Introduction photos',
      type: 'array',
      group: 'intro',
      of: [defineArrayMember({type: 'altImage'})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'introBadge',
      title: 'Introduction badge',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'programsHeading',
      title: 'Programs heading',
      type: 'string',
      group: 'programs',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'featuredProgram',
      title: 'Featured team-building block',
      type: 'corporateHighlight',
      group: 'programs',
      description: 'The large coloured card. A published Team Building program can replace its title, description, and image.',
    }),
    defineField({
      name: 'programCards',
      title: 'Program cards',
      type: 'array',
      group: 'programs',
      description:
        'Leave empty to keep the five approved cards. A published program replaces the card that links to its page.',
      of: [defineArrayMember({type: 'corporateHighlight'})],
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'tourismProgram',
      title: 'Tourism block',
      type: 'corporateHighlight',
      group: 'programs',
    }),
    defineField({
      name: 'reviewsApproved',
      title: 'Show approved testimonials',
      type: 'boolean',
      group: 'close',
      initialValue: false,
      description: 'Design placeholder reviews are never shown. Turn this on only after real testimonials are selected below.',
    }),
    defineField({
      name: 'reviewsHeading',
      title: 'Testimonials heading',
      type: 'string',
      group: 'close',
      hidden: ({document}) => document?.reviewsApproved !== true,
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      group: 'close',
      hidden: ({document}) => document?.reviewsApproved !== true,
      of: [defineArrayMember({type: 'reference', to: [{type: 'testimonial'}]})],
    }),
    defineField({
      name: 'reviewsCtaLabel',
      title: 'Testimonials button label',
      type: 'string',
      group: 'close',
      hidden: ({document}) => document?.reviewsApproved !== true,
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'reviewsCtaHref',
      title: 'Testimonials button link',
      type: 'string',
      group: 'close',
      hidden: ({document}) => document?.reviewsApproved !== true,
      initialValue: '#training-programs',
    }),
    defineField({
      name: 'facilitator',
      title: 'Facilitator',
      type: 'corporatePerson',
      group: 'close',
      description: 'The current biography is design placeholder copy. Replace it before treating it as a finished profile.',
    }),
    defineField({
      name: 'environment',
      title: 'Farm banner',
      type: 'corporateBanner',
      group: 'close',
    }),
    defineField({
      name: 'facility',
      title: 'Facility',
      type: 'corporateFacilityBlock',
      group: 'close',
    }),
    defineField({
      name: 'enquiryHeading',
      title: 'Enquiry heading',
      type: 'string',
      group: 'enquiry',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'enquiryIntro',
      title: 'Enquiry introduction',
      type: 'text',
      rows: 3,
      group: 'enquiry',
      description: 'The form stays visible but does not send messages until an enquiry destination is connected.',
      validation: (rule) => rule.max(400),
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
      return {title: 'Corporate Training page', subtitle: '/corporate-training'}
    },
  },
})
