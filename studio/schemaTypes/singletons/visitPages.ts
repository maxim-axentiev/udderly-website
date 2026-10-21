import {DocumentTextIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

const pageGroup = {name: 'page', title: 'Page', default: true}
const mediaGroup = {name: 'media', title: 'Images'}
const seoGroup = {name: 'seo', title: 'SEO'}

function textField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'text',
    rows: 4,
    group: 'page',
    description,
  })
}

function stringField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: 'string',
    group: 'page',
    description,
  })
}

function flag(name: string, title: string) {
  return defineField({
    name,
    title,
    type: 'boolean',
    group: 'page',
    initialValue: true,
    description: 'Turn off to hide this section. Leave on to show the approved design.',
  })
}

const seoField = defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'})

export const farmMarketPage = defineType({
  name: 'farmMarketPage',
  title: 'Farm Market Store',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [pageGroup, mediaGroup, seoGroup],
  fields: [
    stringField('heroLead', 'Hero first line'),
    stringField('heroAccent', 'Hero accent line'),
    stringField('introHeading', 'Intro heading'),
    textField('intro', 'Intro'),
    stringField('localHeading', 'Local shopping heading'),
    defineField({
      name: 'localParagraphs',
      title: 'Local shopping paragraphs',
      type: 'array',
      group: 'page',
      of: [defineArrayMember({type: 'text', rows: 3})],
      description: 'Leave empty to keep the approved store story.',
    }),
    flag('showStat', 'Show producer count'),
    stringField('statValue', 'Producer count', 'Design figure. Replace it only when the farm confirms a new count.'),
    stringField('statLabel', 'Producer count label'),
    flag('showGallery', 'Show photo gallery'),
    defineField({
      name: 'heroImage',
      title: 'Intro image',
      type: 'altImage',
      group: 'media',
      description: 'Leave empty to keep the store photo already in the website.',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'altImage'})],
      description: 'Leave empty to keep the website photos. A published gallery replaces them.',
    }),
    flag('showIceCream', 'Show ice cream feature'),
    stringField('iceHeading', 'Ice cream heading'),
    textField('iceCopy', 'Ice cream text'),
    stringField('iceCta', 'Ice cream link label'),
    stringField('closeHeading', 'Booking heading'),
    textField('closeCopy', 'Booking text'),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Farm Market Store'})},
})

export const iceCreamPage = defineType({
  name: 'iceCreamPage',
  title: 'Goat milk ice cream',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [pageGroup, mediaGroup, {name: 'video', title: 'Video'}, seoGroup],
  fields: [
    stringField('heroLead', 'Hero first line'),
    stringField('heroAccent', 'Hero accent line'),
    stringField('introHeading', 'Intro heading'),
    flag('showFlavours', 'Show flavour gallery'),
    defineField({
      name: 'flavours',
      title: 'Flavours',
      type: 'array',
      group: 'page',
      description: 'Leave empty to keep the four approved flavours. Names and ingredient lists are product copy, not a checkout.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'story', title: 'Story', type: 'text', rows: 4, validation: (rule) => rule.required()}),
            defineField({name: 'ingredients', title: 'Ingredients', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'name'}},
        }),
      ],
    }),
    flag('showGift', 'Show Gift a Goat'),
    flag('showVideo', 'Show video area'),
    defineField({
      name: 'videoHeading',
      title: 'Video heading',
      type: 'string',
      group: 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'video',
      description: 'Optional https link. Leave empty. The page will not invent a clip or a product checkout.',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'poster',
      title: 'Video poster',
      type: 'altImage',
      group: 'video',
      description: 'Optional still image shown with the video link.',
    }),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Goat milk ice cream'})},
})

export const giftCardPage = defineType({
  name: 'giftCardPage',
  title: 'Gift card',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [pageGroup, mediaGroup, seoGroup],
  fields: [
    stringField('heroLead', 'Hero first line'),
    stringField('heroAccent', 'Hero accent line'),
    textField('intro', 'Intro', 'Design copy. This page does not sell gift cards.'),
    defineField({
      name: 'amounts',
      title: 'Gift amounts',
      type: 'array',
      group: 'page',
      description:
        'Optional labels only. They are not a verified purchase menu, and the buy button stays off until a real destination exists.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', title: 'Amount or name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'name'}},
        }),
      ],
    }),
    flag('showThings', 'Show things to know'),
    defineField({
      name: 'things',
      title: 'Things to know',
      type: 'array',
      group: 'page',
      of: [defineArrayMember({type: 'text', rows: 2})],
      description: 'Design notes. Do not treat them as a live redemption policy until purchase is connected.',
    }),
    flag('showGallery', 'Show photo gallery'),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'altImage'})],
    }),
    flag('showRainbow', 'Show Rainbow Registered'),
    flag('showFeast', 'Show FeastON'),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Gift card'})},
})

export const farmGlampingPage = defineType({
  name: 'farmGlampingPage',
  title: 'Farm glamping',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [pageGroup, mediaGroup, seoGroup],
  fields: [
    stringField('heroLead', 'Hero first line'),
    stringField('heroAccent', 'Hero accent line'),
    textField('intro', 'Intro', 'Design copy. Booking stays off until a verified destination exists.'),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'media',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({type: 'altImage'})],
      description: 'Leave empty to keep the website photos.',
    }),
    flag('showAmenities', 'Show amenities'),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      group: 'page',
      of: [defineArrayMember({type: 'string'})],
      description: 'Leave empty to keep the approved amenity list.',
    }),
    flag('showAddOns', 'Show add-ons'),
    defineField({
      name: 'addOnsNote',
      title: 'Add-on note',
      type: 'text',
      rows: 2,
      group: 'page',
      description: 'Prices in the design are not a live checkout.',
    }),
    flag('showInfo', 'Show things to know'),
    flag('showCancellation', 'Show cancellation wording'),
    defineField({
      name: 'cancellationNote',
      title: 'Cancellation note',
      type: 'text',
      rows: 3,
      group: 'page',
      description: 'This is design wording, not a published legal policy. Booking stays off.',
    }),
    flag('showCheese', 'Show cheese trail'),
    seoField,
  ],
  preview: {prepare: () => ({title: 'Farm glamping'})},
})
