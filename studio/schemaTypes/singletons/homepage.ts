import {ComposeIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType, type FieldDefinition} from 'sanity'

/**
 * Fixed homepage document. Section order and visual design stay in the website.
 * FAQ answers stay on siteSettings.homepageFaqs.
 * Google review records, newsletter subscribers, and FareHarbor inventory stay external.
 */

function validateHomepageHref(value: unknown) {
  if (typeof value !== 'string' || value.trim() === '') return true
  const href = value.trim()
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return true
  try {
    const url = new URL(href)
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    return 'Enter a site path starting with /, or a full https:// URL.'
  }
  return 'Enter a site path starting with /, or a full https:// URL.'
}

function validateVideoUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim() === '') return 'Enter a YouTube or Vimeo URL.'
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    if (
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host === 'vimeo.com' ||
      host === 'player.vimeo.com'
    ) {
      return true
    }
    return 'Use a YouTube or Vimeo URL. Do not upload video files.'
  } catch {
    return 'Enter a valid YouTube or Vimeo URL.'
  }
}

function ctaFields(): FieldDefinition[] {
  return [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A site path such as /experiences, or a full https:// URL.',
      validation: (rule) => rule.required().custom(validateHomepageHref),
    }),
  ]
}

function ctaField(name: string, group: string, title = 'Button') {
  return defineField({
    name,
    title,
    type: 'object',
    group,
    fields: ctaFields(),
  })
}

function textListField(name: string, title: string, group: string, description: string) {
  return defineField({
    name,
    title,
    type: 'array',
    group,
    description,
    of: [
      defineArrayMember({type: 'text', rows: 4, validation: (rule) => rule.required().max(2000)}),
    ],
    validation: (rule) => rule.required().min(1).max(8),
  })
}

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: ComposeIcon,
  description:
    'Homepage copy and images, in the order the page already uses. Publishing this document does not change the live website until a later connection step.',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'awards', title: 'Awards'},
    {name: 'experiences', title: 'Experiences'},
    {name: 'owners', title: 'Owners'},
    {name: 'media', title: 'Media'},
    {name: 'welfare', title: 'Animal care'},
    {name: 'market', title: 'Farm market'},
    {name: 'reviews', title: 'Reviews'},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'urbort', title: 'URBORT'},
    {name: 'faq', title: 'FAQs'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'headlineBefore',
      title: 'Headline, first part',
      type: 'string',
      group: 'hero',
      description: 'Text before the accent word.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'headlineAccent',
      title: 'Headline, accent word',
      type: 'string',
      group: 'hero',
      description: 'The highlighted word in the middle of the headline.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'headlineAfter',
      title: 'Headline, last part',
      type: 'string',
      group: 'hero',
      description: 'Text after the accent word.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroCopy',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'hero',
      validation: (rule) => rule.required().max(500),
    }),
    ctaField('heroCta', 'hero'),
    defineField({
      name: 'heroImage',
      title: 'Hero photo',
      type: 'altImage',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSticker',
      title: 'Photo sticker',
      type: 'string',
      group: 'hero',
      description: 'Short line over the lower corner of the photo.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroBadge',
      title: 'Round badge',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Text inside the circle above the photo. Put each line on its own row.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'awardsTitle',
      title: 'Awards heading',
      type: 'string',
      group: 'awards',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'awardsCopy',
      title: 'Awards note',
      type: 'string',
      group: 'awards',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'awardBadges',
      title: 'Award badges',
      type: 'array',
      group: 'awards',
      description: 'Shown in this order beside the awards heading.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              validation: (rule) => rule.required().max(8),
            }),
            defineField({
              name: 'image',
              title: 'Badge',
              type: 'altImage',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'year', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Award', media}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    defineField({
      name: 'experiencesHeadingFirst',
      title: 'Heading, first line',
      type: 'string',
      group: 'experiences',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'experiencesHeadingSecond',
      title: 'Heading, second line',
      type: 'string',
      group: 'experiences',
      description: 'The outlined second line of the experiences heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'experiencesIntro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      group: 'experiences',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'experienceCards',
      title: 'Cards',
      type: 'array',
      group: 'experiences',
      description: 'Up to four cards. The website places them in this order.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'fact',
              title: 'Corner label',
              type: 'string',
              validation: (rule) => rule.required().max(24),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'copy',
              title: 'Copy',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().max(500),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'altImage',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'cta',
              title: 'Link',
              type: 'object',
              fields: ctaFields(),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'fact', media: 'image'},
            prepare({title, subtitle, media}) {
              return {title: title || 'Card', subtitle, media}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: 'ownersKicker',
      title: 'Kicker',
      type: 'string',
      group: 'owners',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ownersTitle',
      title: 'Heading',
      type: 'string',
      group: 'owners',
      validation: (rule) => rule.required().max(80),
    }),
    textListField('ownersParagraphs', 'Story', 'owners', 'Shown in this order.'),
    defineField({
      name: 'ownersFastForward',
      title: 'Milestone lead-in',
      type: 'string',
      group: 'owners',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'ownersMilestones',
      title: 'Milestones',
      type: 'array',
      group: 'owners',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.required().max(80)})],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    ctaField('ownersCta', 'owners', 'Story button'),
    defineField({
      name: 'ownersFamilyImage',
      title: 'Family photo',
      type: 'altImage',
      group: 'owners',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownersFamilyCaption',
      title: 'Family photo caption',
      type: 'string',
      group: 'owners',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ownersFunImage',
      title: 'Second photo',
      type: 'altImage',
      group: 'owners',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownersFunCaption',
      title: 'Second photo caption',
      type: 'string',
      group: 'owners',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'mediaKicker',
      title: 'Kicker',
      type: 'string',
      group: 'media',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'mediaTitle',
      title: 'Heading',
      type: 'string',
      group: 'media',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'mediaVideos',
      title: 'Videos',
      type: 'array',
      group: 'media',
      description: 'YouTube or Vimeo links only. The website plays them from the video host.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'outlet',
              title: 'Outlet',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'url',
              title: 'Video URL',
              type: 'url',
              validation: (rule) => rule.required().custom(validateVideoUrl),
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
              description:
                'Shown as a button under the player. Leave alternative text blank when the outlet name is enough.',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternative text',
                  type: 'string',
                  validation: (rule) => rule.max(160),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'outlet', subtitle: 'url', media: 'logo'},
            prepare({title, subtitle, media}) {
              return {title: title || 'Video', subtitle, media}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    ctaField('mediaCta', 'media'),
    defineField({
      name: 'welfareKicker',
      title: 'Kicker',
      type: 'string',
      group: 'welfare',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'welfareTitle',
      title: 'Heading',
      type: 'string',
      group: 'welfare',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'welfareHintDesktop',
      title: 'Hint on larger screens',
      type: 'string',
      group: 'welfare',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'welfareHintMobile',
      title: 'Hint on phones',
      type: 'string',
      group: 'welfare',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'welfarePoints',
      title: 'Animal faces',
      type: 'array',
      group: 'welfare',
      description:
        'Shown in this order. The name sits under the photo. The copy appears on hover or tap.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'copy',
              title: 'Copy',
              type: 'text',
              rows: 5,
              validation: (rule) => rule.required().max(800),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'altImage',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'name', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Animal', media}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(8),
    }),
    ctaField('welfareCta', 'welfare', 'Animal care button'),
    defineField({
      name: 'marketBadge',
      title: 'Market label',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'marketTitle',
      title: 'Market heading',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'marketCopy',
      title: 'Market copy',
      type: 'text',
      rows: 5,
      group: 'market',
      validation: (rule) => rule.required().max(1200),
    }),
    defineField({
      name: 'marketCta',
      title: 'Market button',
      type: 'object',
      group: 'market',
      fields: ctaFields(),
    }),
    defineField({
      name: 'marketImage',
      title: 'Market photo',
      type: 'altImage',
      group: 'market',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iceCreamBadge',
      title: 'Ice cream label',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'iceCreamTitle',
      title: 'Ice cream heading',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(80),
    }),
    textListField('iceCreamParagraphs', 'Ice cream copy', 'market', 'Shown in this order.'),
    defineField({
      name: 'iceCreamCta',
      title: 'Ice cream button',
      type: 'object',
      group: 'market',
      fields: ctaFields(),
    }),
    defineField({
      name: 'iceCreamImage',
      title: 'Ice cream photo',
      type: 'altImage',
      group: 'market',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'giftGoatKicker',
      title: 'Gift a Goat kicker',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'giftGoatTitle',
      title: 'Gift a Goat heading',
      type: 'string',
      group: 'market',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'giftGoatCopy',
      title: 'Gift a Goat copy',
      type: 'text',
      rows: 4,
      group: 'market',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'giftGoatCount',
      title: 'Goats gifted',
      type: 'number',
      group: 'market',
      description: 'The number the counter counts up to. The animation stays in the website.',
      validation: (rule) => rule.required().integer().min(0).max(100000),
    }),
    defineField({
      name: 'giftGoatCountLabel',
      title: 'Count label',
      type: 'string',
      group: 'market',
      description: 'Words under the number, such as the current count caption.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'giftGoatImage',
      title: 'Gift a Goat image',
      type: 'altImage',
      group: 'market',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewsTitle',
      title: 'Heading',
      type: 'string',
      group: 'reviews',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'reviewsAttribution',
      title: 'Source line',
      type: 'string',
      group: 'reviews',
      description:
        'Shown with the Google rating. Individual reviews come from Google and are not stored here.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'reviewsOrderNote',
      title: 'Order note',
      type: 'string',
      group: 'reviews',
      description: 'Added after the source line when Google returns reviews.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'reviewsUnavailable',
      title: 'Empty-state message',
      type: 'text',
      rows: 3,
      group: 'reviews',
      description: 'Shown when Google reviews are not available.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'reviewsReadMoreLabel',
      title: 'Google link label',
      type: 'string',
      group: 'reviews',
      description: 'The link address comes from Google Maps, not from this field.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'reviewsReadFullLabel',
      title: 'Expand a review',
      type: 'string',
      group: 'reviews',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'reviewsShowLessLabel',
      title: 'Collapse a review',
      type: 'string',
      group: 'reviews',
      validation: (rule) => rule.required().max(40),
    }),
    ctaField('reviewsCta', 'reviews', 'Reviews button'),
    defineField({
      name: 'newsletterTitle',
      title: 'Heading',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'newsletterCopy',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'newsletter',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'newsletterFirstNameLabel',
      title: 'First name label',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterFirstNamePlaceholder',
      title: 'First name placeholder',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'newsletterEmailLabel',
      title: 'Email label',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterEmailPlaceholder',
      title: 'Email placeholder',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'newsletterDateOfBirthLabel',
      title: 'Date of birth label',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterSubmitLabel',
      title: 'Submit button',
      type: 'string',
      group: 'newsletter',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterConfirmation',
      title: 'Confirmation message',
      type: 'text',
      rows: 2,
      group: 'newsletter',
      description: 'Shown after the form is submitted. Email addresses are not stored in Sanity.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'newsletterMobileFirst',
      title: 'Phone, first animal',
      type: 'altImage',
      group: 'newsletter',
      description:
        'Leftmost photo above the form on phones. Placement and rotation stay in the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileSecond',
      title: 'Phone, second animal',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileThird',
      title: 'Phone, third animal',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileFourth',
      title: 'Phone, fourth animal',
      type: 'altImage',
      group: 'newsletter',
      description: 'Rightmost photo above the form on phones.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopLeftUpper',
      title: 'Desktop, upper left',
      type: 'altImage',
      group: 'newsletter',
      description: 'Decorative photo. Placement stays in the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopLeftLower',
      title: 'Desktop, lower left',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopRightUpper',
      title: 'Desktop, upper right',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopRightLower',
      title: 'Desktop, lower right',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'urbortTitle',
      title: 'Heading',
      type: 'string',
      group: 'urbort',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'urbortCopy',
      title: 'Intro',
      type: 'text',
      rows: 4,
      group: 'urbort',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'urbortCardLabel',
      title: 'Card button',
      type: 'string',
      group: 'urbort',
      description: 'The same label is used on every story card.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'urbortArticles',
      title: 'Stories',
      type: 'array',
      group: 'urbort',
      description: 'Up to three cards, in this order. Card tilt stays in the website.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'A site path such as /urbort, or a full https:// URL.',
              validation: (rule) => rule.required().custom(validateHomepageHref),
            }),
            defineField({
              name: 'image',
              title: 'Photo',
              type: 'altImage',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'title', media: 'image'},
            prepare({title, media}) {
              return {title: title || 'Story', media}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).max(3),
    }),
    ctaField('urbortCta', 'urbort', 'Section button'),
    defineField({
      name: 'faqHeading',
      title: 'FAQ heading',
      type: 'string',
      group: 'faq',
      description:
        'Questions and answers are chosen under Site settings, in Homepage FAQs. Do not paste answers here.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Meta title',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Social title',
      type: 'string',
      group: 'seo',
      description: 'Used when the page is shared. It can differ from the meta title.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Homepage sections',
      }
    },
  },
})
