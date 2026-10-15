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
      title: 'Button text',
      type: 'string',
      description: 'The words visitors see on the button.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'href',
      title: 'Button link',
      type: 'string',
      description:
        'The page that opens when someone clicks the button. Use a path such as /experiences, or a full https:// address.',
      validation: (rule) => rule.required().custom(validateHomepageHref),
    }),
  ]
}

function ctaField(name: string, group: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'object',
    group,
    description,
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
    {name: 'hero', title: 'Top of the page', default: true},
    {name: 'awards', title: 'Awards'},
    {name: 'experiences', title: 'Experience cards'},
    {name: 'owners', title: 'Meet the owners'},
    {name: 'media', title: 'In the media'},
    {name: 'welfare', title: 'Animal care'},
    {name: 'market', title: 'Farm market and ice cream'},
    {name: 'reviews', title: 'Google reviews'},
    {name: 'newsletter', title: 'Newsletter signup'},
    {name: 'urbort', title: 'URBORT stories'},
    {name: 'faq', title: 'Questions'},
    {name: 'seo', title: 'Search and sharing'},
  ],
  fields: [
    defineField({
      name: 'headlineBefore',
      title: 'Headline, opening words',
      type: 'string',
      group: 'hero',
      description:
        'The first words of the large headline at the top of the homepage, before the colored word.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'headlineAccent',
      title: 'Highlighted headline word',
      type: 'string',
      group: 'hero',
      description: 'The colored word in the middle of the top headline.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'headlineAfter',
      title: 'Headline, closing words',
      type: 'string',
      group: 'hero',
      description: 'The words that follow the colored word in the top headline.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroCopy',
      title: 'Intro under the headline',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: 'The paragraph directly under the top headline.',
      validation: (rule) => rule.required().max(500),
    }),
    ctaField(
      'heroCta',
      'hero',
      'Top button',
      'The button under the intro at the top of the homepage.',
    ),
    defineField({
      name: 'heroImage',
      title: 'Main photo',
      type: 'altImage',
      group: 'hero',
      description: 'The large photo on the right side of the top of the homepage.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSticker',
      title: 'Sticker on the photo',
      type: 'string',
      group: 'hero',
      description: 'The short line across the lower corner of the main photo.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'heroBadge',
      title: 'Circle above the photo',
      type: 'text',
      rows: 2,
      group: 'hero',
      description:
        'Text inside the circle above the main photo. Put each line on its own row. The live website currently draws this circle itself and does not yet read this field.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'awardsTitle',
      title: 'Awards heading',
      type: 'string',
      group: 'awards',
      description: 'The heading on the left of the award strip, just under the top of the page.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'awardsCopy',
      title: 'Line under the awards heading',
      type: 'string',
      group: 'awards',
      description: 'The smaller sentence under the awards heading.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'awardBadges',
      title: 'Award badges',
      type: 'array',
      group: 'awards',
      description: 'The round award images beside the heading, from left to right.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: 'Year',
              type: 'string',
              description:
                'Shown in the list of badges. The website uses this to tell the badges apart.',
              validation: (rule) => rule.required().max(8),
            }),
            defineField({
              name: 'image',
              title: 'Badge image',
              type: 'altImage',
              description:
                'The round award image. Describe what the badge says for visitors who cannot see it.',
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
      description: 'The first line of the large heading above the experience cards.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'experiencesHeadingSecond',
      title: 'Heading, outlined second line',
      type: 'string',
      group: 'experiences',
      description: 'The second line of that heading. The website draws it with an outline.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'experiencesIntro',
      title: 'Short intro beside the heading',
      type: 'text',
      rows: 3,
      group: 'experiences',
      description: 'The sentence to the right of the experiences heading.',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: 'experienceCards',
      title: 'Experience cards',
      type: 'array',
      group: 'experiences',
      description:
        'Up to four cards, left to right, in this order. Card tilt stays in the website.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'fact',
              title: 'Small label on the photo',
              type: 'string',
              description: 'The short label in the corner of the card photo.',
              validation: (rule) => rule.required().max(24),
            }),
            defineField({
              name: 'title',
              title: 'Card title',
              type: 'string',
              description: 'The heading on this experience card.',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'copy',
              title: 'Card text',
              type: 'text',
              rows: 4,
              description: 'The paragraph on this experience card.',
              validation: (rule) => rule.required().max(500),
            }),
            defineField({
              name: 'image',
              title: 'Card photo',
              type: 'altImage',
              description: 'The photo at the top of this card.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'cta',
              title: 'Card button',
              type: 'object',
              description: 'The button at the bottom of this card.',
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
      title: 'Small text above the heading',
      type: 'string',
      group: 'owners',
      description: 'The short italic line above the owners heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ownersTitle',
      title: 'Owners heading',
      type: 'string',
      group: 'owners',
      description: 'The large heading in the Meet the owners section.',
      validation: (rule) => rule.required().max(80),
    }),
    textListField(
      'ownersParagraphs',
      'Story paragraphs',
      'owners',
      'Each entry is one paragraph of the owners story, in the order visitors read them.',
    ),
    defineField({
      name: 'ownersFastForward',
      title: 'Line above the milestone list',
      type: 'string',
      group: 'owners',
      description: 'The short line that introduces the list of milestones.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'ownersMilestones',
      title: 'Milestone list',
      type: 'array',
      group: 'owners',
      description: 'The short milestone lines under the story, in this order.',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.required().max(80)})],
      validation: (rule) => rule.required().min(1).max(12),
    }),
    ctaField('ownersCta', 'owners', 'Story button', 'The button under the owners story.'),
    defineField({
      name: 'ownersFamilyImage',
      title: 'Family photo',
      type: 'altImage',
      group: 'owners',
      description: 'The wider photo of the owners in this section.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownersFamilyCaption',
      title: 'Caption under the family photo',
      type: 'string',
      group: 'owners',
      description: 'The short caption under the family photo.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'ownersFunImage',
      title: 'Playful photo',
      type: 'altImage',
      group: 'owners',
      description: 'The second owners photo, beside the family photo.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownersFunCaption',
      title: 'Caption under the playful photo',
      type: 'string',
      group: 'owners',
      description: 'The short caption under the playful photo.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'mediaKicker',
      title: 'Small text above the heading',
      type: 'string',
      group: 'media',
      description: 'The short italic line above the media heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'mediaTitle',
      title: 'Media heading',
      type: 'string',
      group: 'media',
      description: 'The large heading in the In the media section.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'mediaVideos',
      title: 'News videos',
      type: 'array',
      group: 'media',
      description:
        'The videos in this section, in this order. Paste a YouTube or Vimeo address. The website plays the video from that site. Do not upload a video file.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'outlet',
              title: 'News outlet',
              type: 'string',
              description:
                'The name under the video and on the logo button, such as the station name.',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'url',
              title: 'YouTube or Vimeo address',
              type: 'url',
              description:
                'The address of the video. Visitors watch it in the player on the homepage.',
              validation: (rule) => rule.required().custom(validateVideoUrl),
            }),
            defineField({
              name: 'logo',
              title: 'Outlet logo',
              type: 'image',
              description:
                'The logo button under the player. Leave the description blank when the outlet name is enough for visitors using a screen reader.',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Logo description',
                  description:
                    'Leave blank when the outlet name already tells visitors what the button is.',
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
    ctaField(
      'mediaCta',
      'media',
      'Button under the videos',
      'The button centered under the news videos.',
    ),
    defineField({
      name: 'welfareKicker',
      title: 'Small text above the heading',
      type: 'string',
      group: 'welfare',
      description: 'The short italic line above the animal-care heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'welfareTitle',
      title: 'Animal-care heading',
      type: 'string',
      group: 'welfare',
      description: 'The large heading above the animal photos.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'welfareHintDesktop',
      title: 'Hint on a computer',
      type: 'string',
      group: 'welfare',
      description: 'The hint visitors see on a larger screen, above the animal photos.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'welfareHintMobile',
      title: 'Hint on a phone',
      type: 'string',
      group: 'welfare',
      description: 'The hint visitors see on a phone, in the same spot.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'welfarePoints',
      title: 'Animal photos',
      type: 'array',
      group: 'welfare',
      description:
        'The animal photos in this section, in this order. The name sits under the photo. The text appears when a visitor hovers or taps.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name under the photo',
              type: 'string',
              description: 'The short name shown under this animal photo.',
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: 'copy',
              title: 'Text on hover or tap',
              type: 'text',
              rows: 5,
              description: 'The paragraph that appears when a visitor hovers or taps this photo.',
              validation: (rule) => rule.required().max(800),
            }),
            defineField({
              name: 'image',
              title: 'Animal photo',
              type: 'altImage',
              description: 'The photo of this animal. The name appears under it.',
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
    ctaField(
      'welfareCta',
      'welfare',
      'Button under the animal photos',
      'The button centered under the animal photos.',
    ),
    defineField({
      name: 'marketBadge',
      title: 'Small label above the market heading',
      type: 'string',
      group: 'market',
      description: 'The small colored label above the farm market heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'marketTitle',
      title: 'Market heading',
      type: 'string',
      group: 'market',
      description: 'The large heading for the farm market block.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'marketCopy',
      title: 'Market paragraph',
      type: 'text',
      rows: 5,
      group: 'market',
      description: 'The paragraph beside the farm market photo.',
      validation: (rule) => rule.required().max(1200),
    }),
    defineField({
      name: 'marketCta',
      title: 'Market button',
      type: 'object',
      group: 'market',
      description: 'The button under the farm market paragraph.',
      fields: ctaFields(),
    }),
    defineField({
      name: 'marketImage',
      title: 'Market photo',
      type: 'altImage',
      group: 'market',
      description: 'The photo beside the farm market text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'iceCreamBadge',
      title: 'Small label above the ice cream heading',
      type: 'string',
      group: 'market',
      description: 'The small colored label above the ice cream heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'iceCreamTitle',
      title: 'Ice cream heading',
      type: 'string',
      group: 'market',
      description: 'The large heading for the ice cream block.',
      validation: (rule) => rule.required().max(80),
    }),
    textListField(
      'iceCreamParagraphs',
      'Ice cream paragraphs',
      'market',
      'Each entry is one paragraph beside the ice cream photo, in reading order.',
    ),
    defineField({
      name: 'iceCreamCta',
      title: 'Ice cream button',
      type: 'object',
      group: 'market',
      description: 'The button under the ice cream paragraphs.',
      fields: ctaFields(),
    }),
    defineField({
      name: 'iceCreamImage',
      title: 'Ice cream photo',
      type: 'altImage',
      group: 'market',
      description: 'The photo beside the ice cream text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'giftGoatKicker',
      title: 'Small text above the Gift a Goat heading',
      type: 'string',
      group: 'market',
      description: 'The short italic line above the Gift a Goat heading.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'giftGoatTitle',
      title: 'Gift a Goat heading',
      type: 'string',
      group: 'market',
      description: 'The heading in the Gift a Goat block at the bottom of this section.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'giftGoatCopy',
      title: 'Gift a Goat paragraph',
      type: 'text',
      rows: 4,
      group: 'market',
      description: 'The paragraph beside the Gift a Goat logo.',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'giftGoatCount',
      title: 'Number the counter reaches',
      type: 'number',
      group: 'market',
      description:
        'The number visitors see at the end of the count-up. The counting animation stays in the website.',
      validation: (rule) => rule.required().integer().min(0).max(100000),
    }),
    defineField({
      name: 'giftGoatCountLabel',
      title: 'Words under the number',
      type: 'string',
      group: 'market',
      description: 'The caption under the Gift a Goat number.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'giftGoatImage',
      title: 'Gift a Goat logo',
      type: 'altImage',
      group: 'market',
      description: 'The round logo beside the Gift a Goat text.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reviewsTitle',
      title: 'Reviews heading',
      type: 'string',
      group: 'reviews',
      description: 'The large heading at the start of the reviews section.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'reviewsAttribution',
      title: 'Line under the heading',
      type: 'string',
      group: 'reviews',
      description:
        'The line under the reviews heading. Individual reviews, the star rating, and the Google Maps address come from Google and are not stored here.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'reviewsOrderNote',
      title: 'Note after that line',
      type: 'string',
      group: 'reviews',
      description:
        'Extra words added after the line under the heading when Google returns reviews.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'reviewsUnavailable',
      title: 'Message when reviews are missing',
      type: 'text',
      rows: 3,
      group: 'reviews',
      description: 'Shown in place of the review cards when Google reviews are not available.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'reviewsReadMoreLabel',
      title: 'Google Maps link text',
      type: 'string',
      group: 'reviews',
      description: 'The words on the link to Google Maps. The address itself comes from Google.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'reviewsReadFullLabel',
      title: 'Show the rest of a review',
      type: 'string',
      group: 'reviews',
      description: 'The button on a review card when the review is shortened.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'reviewsShowLessLabel',
      title: 'Hide the rest of a review',
      type: 'string',
      group: 'reviews',
      description: 'The button on a review card after the full review is open.',
      validation: (rule) => rule.required().max(40),
    }),
    ctaField(
      'reviewsCta',
      'reviews',
      'Button under the reviews',
      'The button centered under the review cards.',
    ),
    defineField({
      name: 'newsletterTitle',
      title: 'Newsletter heading',
      type: 'string',
      group: 'newsletter',
      description: 'The heading inside the newsletter signup box.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'newsletterCopy',
      title: 'Intro above the form',
      type: 'text',
      rows: 4,
      group: 'newsletter',
      description: 'The paragraph above the signup form. Email addresses are not stored in Sanity.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'newsletterFirstNameLabel',
      title: 'First name label',
      type: 'string',
      group: 'newsletter',
      description: 'The label above the first name box.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterFirstNamePlaceholder',
      title: 'First name example',
      type: 'string',
      group: 'newsletter',
      description: 'The grey example text inside the first name box before someone types.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'newsletterEmailLabel',
      title: 'Email label',
      type: 'string',
      group: 'newsletter',
      description: 'The label above the email box.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterEmailPlaceholder',
      title: 'Email example',
      type: 'string',
      group: 'newsletter',
      description: 'The grey example text inside the email box before someone types.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'newsletterDateOfBirthLabel',
      title: 'Date of birth label',
      type: 'string',
      group: 'newsletter',
      description: 'The label above the date of birth box.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterSubmitLabel',
      title: 'Signup button',
      type: 'string',
      group: 'newsletter',
      description:
        'The words on the button that submits the form. The form itself stays in the website.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'newsletterConfirmation',
      title: 'Message after signup',
      type: 'text',
      rows: 2,
      group: 'newsletter',
      description:
        'The sentence shown after a visitor submits the form. Leave this empty until the signup form is working. The live website still uses a temporary developer message. Do not paste that temporary message here. This can be filled later with wording the farm has approved. Email addresses are not stored in Sanity.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'newsletterMobileFirst',
      title: 'Phone photo, far left',
      type: 'altImage',
      group: 'newsletter',
      description:
        'The leftmost animal photo above the form on a phone. The website keeps this photo in that spot and sets its tilt.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileSecond',
      title: 'Phone photo, second from the left',
      description: 'The second animal photo above the form on a phone.',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileThird',
      title: 'Phone photo, third from the left',
      description: 'The third animal photo above the form on a phone.',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterMobileFourth',
      title: 'Phone photo, far right',
      type: 'altImage',
      group: 'newsletter',
      description: 'The rightmost animal photo above the form on a phone.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopLeftUpper',
      title: 'Computer photo, upper left',
      type: 'altImage',
      group: 'newsletter',
      description:
        'The upper animal photo to the left of the form on a computer. Placement stays in the website.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopLeftLower',
      title: 'Computer photo, lower left',
      description: 'The lower animal photo to the left of the form on a computer.',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopRightUpper',
      title: 'Computer photo, upper right',
      description: 'The upper animal photo to the right of the form on a computer.',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'newsletterDesktopRightLower',
      title: 'Computer photo, lower right',
      description: 'The lower animal photo to the right of the form on a computer.',
      type: 'altImage',
      group: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'urbortTitle',
      title: 'URBORT heading',
      type: 'string',
      group: 'urbort',
      description: 'The large heading in the URBORT box.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'urbortCopy',
      title: 'URBORT intro',
      type: 'text',
      rows: 4,
      group: 'urbort',
      description: 'The paragraph under the URBORT heading.',
      validation: (rule) => rule.required().max(800),
    }),
    defineField({
      name: 'urbortCardLabel',
      title: 'Button on every story card',
      type: 'string',
      group: 'urbort',
      description: 'The same button text is used on every URBORT story card.',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'urbortArticles',
      title: 'Story cards',
      type: 'array',
      group: 'urbort',
      description:
        'Up to three story cards, left to right, in this order. Card tilt stays in the website.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Story title',
              type: 'string',
              description: 'The heading on this story card.',
              validation: (rule) => rule.required().max(80),
            }),
            defineField({
              name: 'href',
              title: 'Story link',
              type: 'string',
              description:
                'The page that opens from this card. Use a path such as /urbort, or a full https:// address.',
              validation: (rule) => rule.required().custom(validateHomepageHref),
            }),
            defineField({
              name: 'image',
              title: 'Story photo',
              type: 'altImage',
              description: 'The photo on this story card.',
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
    ctaField(
      'urbortCta',
      'urbort',
      'Button under the stories',
      'The button centered under the URBORT story cards.',
    ),
    defineField({
      name: 'faqHeading',
      title: 'Questions heading',
      type: 'string',
      group: 'faq',
      description:
        'The heading above the list of questions. Choose the questions and answers in Site settings, under Homepage FAQs. Do not paste answers here.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search result title',
      type: 'string',
      group: 'seo',
      description: 'The title in Google results and the browser tab for the homepage.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search result description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The short description under the homepage title in Google results.',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'ogTitle',
      title: 'Title when the page is shared',
      type: 'string',
      group: 'seo',
      description:
        'The title shown when someone shares the homepage. It can differ from the search result title.',
      validation: (rule) => rule.required().max(70),
    }),
    defineField({
      name: 'ogDescription',
      title: 'Description when the page is shared',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'The description shown when someone shares the homepage.',
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
