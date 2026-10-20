import {DocumentTextIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Fixed Experiences hub document. New section fields are optional so the
 * published document keeps working when they are absent.
 */

const hubFeatureMember = () =>
  defineArrayMember({
    type: 'object',
    fields: [
      defineField({name: 'kicker', title: 'Kicker', type: 'string', validation: (rule) => rule.max(40)}),
      defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(120)}),
      defineField({name: 'copy', title: 'Copy', type: 'text', rows: 4, validation: (rule) => rule.max(800)}),
      defineField({name: 'season', title: 'Season', type: 'string', validation: (rule) => rule.max(80)}),
      defineField({name: 'age', title: 'Age', type: 'string', validation: (rule) => rule.max(40)}),
      defineField({name: 'image', title: 'Image', type: 'altImage'}),
      defineField({name: 'learnMoreHref', title: 'Learn more link', type: 'string'}),
      defineField({name: 'ctaLabel', title: 'Button label', type: 'string', validation: (rule) => rule.max(60)}),
      defineField({name: 'ctaHref', title: 'Button link', type: 'string'}),
      defineField({name: 'limited', title: 'Limited time', type: 'boolean'}),
      defineField({name: 'sortOrder', title: 'Display order', type: 'number'}),
    ],
    preview: {select: {title: 'title', subtitle: 'kicker'}},
  })

const hubStatementFields = () => [
  defineField({name: 'kicker', title: 'Kicker', type: 'string', validation: (rule) => rule.max(80)}),
  defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.max(120)}),
  defineField({name: 'body', title: 'Body', type: 'text', rows: 5, validation: (rule) => rule.max(800)}),
  defineField({name: 'href', title: 'Link', type: 'url'}),
  defineField({name: 'image', title: 'Image', type: 'altImage'}),
]

const hubIntroFields = () => [
  defineField({name: 'kicker', title: 'Kicker', type: 'string', validation: (rule) => rule.max(80)}),
  defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.max(120)}),
  defineField({name: 'headingLead', title: 'Heading first line', type: 'string', validation: (rule) => rule.max(80)}),
  defineField({name: 'headingAccent', title: 'Heading second line', type: 'string', validation: (rule) => rule.max(80)}),
  defineField({name: 'copy', title: 'Introduction', type: 'text', rows: 4, validation: (rule) => rule.max(800)}),
]

export const experiencesHub = defineType({
  name: 'experiencesHub',
  title: 'Experiences hub',
  type: 'document',
  icon: DocumentTextIcon,
  description:
    'The heading, introduction, and empty-state text for the Experiences page. Individual experiences, prices, and booking links stay on Experience documents.',
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Page heading',
      type: 'string',
      group: 'content',
      description: 'Kept for the existing page record. The visible hero uses Hero first line when that field is set.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      group: 'content',
      description:
        'Kept for the existing page record. The visible hero paragraph uses Hero supporting text when that field is set.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'emptyHeading',
      title: 'Empty-state heading',
      type: 'string',
      group: 'content',
      description:
        'Shown only when the farm experience card list is published as empty.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Empty-state message',
      type: 'text',
      rows: 4,
      group: 'content',
      description: 'The sentence under the empty-state heading.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search result title',
      type: 'string',
      group: 'seo',
      description: 'The title in Google results and the browser tab for the Experiences page.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The short description under the Experiences page title in Google results.',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Title when the page is shared',
      type: 'string',
      group: 'seo',
      description:
        'The title shown when someone shares the Experiences page. It can differ from the search result title.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Description when the page is shared',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The description shown when someone shares the Experiences page.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'heroLead',
      title: 'Hero first line',
      type: 'string',
      group: 'content',
      description: 'Optional. Leave empty to keep “Udderly Ridiculous”.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'heroAccent',
      title: 'Hero second line',
      type: 'string',
      group: 'content',
      description: 'Optional. Leave empty to keep “Farm Experiences”.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'heroSupporting',
      title: 'Hero supporting text',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Optional text under the hero heading.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'content',
      description: 'Optional. Leave empty to keep the current hero photograph.',
    }),
    defineField({
      name: 'categoryIntro',
      title: 'Category chooser introduction',
      type: 'object',
      group: 'content',
      fields: hubIntroFields(),
    }),
    defineField({
      name: 'categories',
      title: 'Category chooser',
      type: 'array',
      group: 'content',
      description: 'Leave this unset to keep the current four categories. Publish an empty list to hide the chooser.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required().max(80)}),
            defineField({name: 'note', title: 'Note', type: 'string', validation: (rule) => rule.max(80)}),
            defineField({name: 'href', title: 'Link', type: 'string', description: 'An on-page anchor such as #farm-stays, or an existing internal path.'}),
            defineField({name: 'image', title: 'Image', type: 'altImage'}),
            defineField({name: 'sortOrder', title: 'Display order', type: 'number'}),
          ],
          preview: {select: {title: 'title', subtitle: 'note'}},
        }),
      ],
    }),
    defineField({
      name: 'farmExperiencesIntro',
      title: 'Farm experiences introduction',
      type: 'object',
      group: 'content',
      fields: hubIntroFields(),
    }),
    defineField({
      name: 'experienceCards',
      title: 'Farm experience cards',
      type: 'array',
      group: 'content',
      description: 'Leave this unset to keep the current experience cards. Publish an empty list to remove them. Farm Hopping is never shown.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Name', type: 'string', validation: (rule) => rule.required().max(120)}),
            defineField({name: 'slug', title: 'Experience slug', type: 'string', description: 'Used for /{slug} only when that experience is published.'}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3, validation: (rule) => rule.max(500)}),
            defineField({name: 'season', title: 'Season', type: 'string', validation: (rule) => rule.max(80)}),
            defineField({name: 'age', title: 'Age', type: 'string', validation: (rule) => rule.max(40)}),
            defineField({name: 'badge', title: 'Badge', type: 'string', options: {list: ['none', 'limited', 'signature']}}),
            defineField({name: 'image', title: 'Image', type: 'altImage'}),
            defineField({name: 'learnMoreHref', title: 'Learn more link', type: 'string'}),
            defineField({name: 'bookingUrl', title: 'Booking link', type: 'url', description: 'Only an absolute https booking page. Leave empty until the destination is verified.'}),
            defineField({name: 'sortOrder', title: 'Display order', type: 'number'}),
          ],
          preview: {select: {title: 'title', subtitle: 'season'}},
        }),
      ],
    }),
    defineField({
      name: 'staysIntro',
      title: 'Farm stays introduction',
      type: 'object',
      group: 'content',
      fields: hubIntroFields(),
    }),
    defineField({
      name: 'stays',
      title: 'Farm stays',
      type: 'array',
      group: 'content',
      description: 'Leave unset to keep Farm Glamping. Do not add Farm Hopping.',
      of: [hubFeatureMember()],
    }),
    defineField({
      name: 'giftsIntro',
      title: 'Gifts introduction',
      type: 'object',
      group: 'content',
      fields: hubIntroFields(),
    }),
    defineField({
      name: 'gifts',
      title: 'Gifts',
      type: 'array',
      group: 'content',
      description: 'Leave unset to keep the current gift cards.',
      of: [hubFeatureMember()],
    }),
    defineField({
      name: 'programsIntro',
      title: 'Business programs introduction',
      type: 'object',
      group: 'content',
      fields: hubIntroFields(),
    }),
    defineField({
      name: 'programs',
      title: 'Business programs',
      type: 'array',
      group: 'content',
      description: 'Leave unset to keep the current corporate cards.',
      of: [hubFeatureMember()],
    }),
    defineField({
      name: 'rainbow',
      title: 'Rainbow Registered',
      type: 'object',
      group: 'content',
      fields: hubStatementFields(),
    }),
    defineField({
      name: 'feastOn',
      title: 'Feast On',
      type: 'object',
      group: 'content',
      fields: hubStatementFields(),
    }),
    defineField({
      name: 'newsletterTitle',
      title: 'Newsletter heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'newsletterCopy',
      title: 'Newsletter text',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'locationHeading',
      title: 'Location heading',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'locationNote',
      title: 'Location note',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: title || 'Experiences hub',
        subtitle: 'Page heading, introduction, and search text',
      }
    },
  },
})
