import {defineArrayMember, defineField, defineType} from 'sanity'

import {optionalPublicHrefRule} from '../fields'

const facilityIcons = [
  {title: 'Capacity', value: 'capacity'},
  {title: 'Audio and visual', value: 'av'},
  {title: 'Catering', value: 'catering'},
  {title: 'Parking', value: 'parking'},
  {title: 'Outdoors', value: 'outdoors'},
]

const credentialIcons = [
  {title: 'Award', value: 'award'},
  {title: 'Star', value: 'star'},
  {title: 'People', value: 'people'},
  {title: 'Reviews', value: 'reviews'},
  {title: 'Sparkle', value: 'sparkle'},
  {title: 'Heart', value: 'heart'},
  {title: 'Views', value: 'views'},
  {title: 'Media', value: 'media'},
  {title: 'Business', value: 'business'},
  {title: 'Experience', value: 'experience'},
]

const audienceIcons = [
  {title: 'Farm', value: 'farm'},
  {title: 'Stay', value: 'stay'},
  {title: 'Restaurant', value: 'restaurant'},
  {title: 'Artisan', value: 'artisan'},
  {title: 'Museum', value: 'museum'},
  {title: 'Brewery or winery', value: 'beverage'},
  {title: 'Specialist', value: 'specialist'},
]

const practicalIcons = [
  {title: 'Duration', value: 'duration'},
  {title: 'Add-ons', value: 'addons'},
  {title: 'Customization', value: 'custom'},
]

export const corporateHighlight = defineType({
  name: 'corporateHighlight',
  title: 'Program highlight',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show this block',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Short label above the title, when this layout has one.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A page path such as /corporate-training/disc-assessment, or an in-page link such as #contact.',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button label',
      type: 'string',
      validation: (rule) => rule.max(40),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow', media: 'image'},
    prepare({title, subtitle, media}) {
      return {title: title || 'Program highlight', subtitle, media}
    },
  },
})

export const corporateStep = defineType({
  name: 'corporateStep',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'body'},
  },
})

export const corporateServiceItem = defineType({
  name: 'corporateServiceItem',
  title: 'Service item',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.max(80)}),
    defineField({name: 'body', title: 'Description', type: 'text', rows: 2, validation: (rule) => rule.max(300)}),
  ],
})

export const corporateService = defineType({
  name: 'corporateService',
  title: 'Service',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.max(80)}),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Confirm the current fee before publishing. The design text is not a verified rate.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'featured',
      title: 'Feature this service',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'items',
      title: 'Included items',
      type: 'array',
      of: [defineArrayMember({type: 'corporateServiceItem'})],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'price'},
  },
})

export const corporateOffering = defineType({
  name: 'corporateOffering',
  title: 'Offering',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.max(90)}),
    defineField({name: 'body', title: 'Description', type: 'text', rows: 4, validation: (rule) => rule.max(700)}),
    defineField({name: 'image', title: 'Image', type: 'altImage'}),
    defineField({
      name: 'outcomes',
      title: 'Learning outcomes',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string', validation: (rule) => rule.max(60)}),
  ],
  preview: {
    select: {title: 'title', media: 'image'},
  },
})

export const corporateIconLabel = defineType({
  name: 'corporateIconLabel',
  title: 'Label',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: [...credentialIcons, ...audienceIcons]},
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.max(80)}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'icon'},
  },
})

export const corporatePracticalItem = defineType({
  name: 'corporatePracticalItem',
  title: 'Practical detail',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: practicalIcons},
    }),
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.max(40)}),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})

export const corporateFacilityItem = defineType({
  name: 'corporateFacilityItem',
  title: 'Facility detail',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: {list: facilityIcons},
    }),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.max(60)}),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Capacity, equipment, and amenity details should be confirmed before they are treated as current facts.',
      validation: (rule) => rule.max(500),
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})

export const corporatePerson = defineType({
  name: 'corporatePerson',
  title: 'Facilitator',
  type: 'object',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Show this section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.max(60)}),
    defineField({name: 'title', title: 'Heading', type: 'string', validation: (rule) => rule.max(80)}),
    defineField({name: 'body', title: 'Biography', type: 'text', rows: 5, validation: (rule) => rule.max(800)}),
    defineField({name: 'image', title: 'Photo', type: 'altImage'}),
    defineField({name: 'ctaLabel', title: 'Button label', type: 'string', validation: (rule) => rule.max(40)}),
    defineField({
      name: 'ctaHref',
      title: 'Button link',
      type: 'string',
      description: 'Leave empty to scroll to the enquiry form.',
      validation: (rule) => rule.custom(optionalPublicHrefRule),
    }),
  ],
})

export const corporateBanner = defineType({
  name: 'corporateBanner',
  title: 'Farm banner',
  type: 'object',
  fields: [
    defineField({name: 'enabled', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'headingLead', title: 'Heading start', type: 'string', validation: (rule) => rule.max(80)}),
    defineField({name: 'headingAccent', title: 'Heading accent', type: 'string', validation: (rule) => rule.max(40)}),
    defineField({name: 'body', title: 'Text', type: 'text', rows: 3, validation: (rule) => rule.max(400)}),
    defineField({name: 'image', title: 'Background image', type: 'altImage'}),
  ],
})

export const corporateFacilityBlock = defineType({
  name: 'corporateFacilityBlock',
  title: 'Facility',
  type: 'object',
  fields: [
    defineField({name: 'enabled', title: 'Show this section', type: 'boolean', initialValue: true}),
    defineField({name: 'headingLead', title: 'Heading start', type: 'string', validation: (rule) => rule.max(40)}),
    defineField({name: 'headingAccent', title: 'Heading accent', type: 'string', validation: (rule) => rule.max(40)}),
    defineField({
      name: 'items',
      title: 'Details',
      type: 'array',
      of: [defineArrayMember({type: 'corporateFacilityItem'})],
    }),
    defineField({
      name: 'gallery',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({type: 'altImage'})],
      validation: (rule) => rule.max(8),
    }),
  ],
})
