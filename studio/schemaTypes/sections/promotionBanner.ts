import {StarIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const promotionBanner = defineType({
  name: 'promotionBanner',
  title: 'Promotion banner',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'promotion',
      title: 'Promotion',
      type: 'reference',
      to: [{type: 'promotion'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'promotion.heading',
      media: 'promotion.image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Promotion',
        subtitle: 'Promotion banner',
        media,
      }
    },
  },
})
