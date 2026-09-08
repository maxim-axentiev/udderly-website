import {defineArrayMember, defineType} from 'sanity'

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Page sections',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'richTextSection'}),
    defineArrayMember({type: 'imageText'}),
    defineArrayMember({type: 'experienceGrid'}),
    defineArrayMember({type: 'meetTheHerd'}),
    defineArrayMember({type: 'faqSection'}),
    defineArrayMember({type: 'testimonialsSection'}),
    defineArrayMember({type: 'gallery'}),
    defineArrayMember({type: 'ctaSection'}),
    defineArrayMember({type: 'videoEmbed'}),
    defineArrayMember({type: 'listingGrid'}),
    defineArrayMember({type: 'postGrid'}),
    defineArrayMember({type: 'promotionBanner'}),
  ],
  options: {
    insertMenu: {
      filter: true,
      views: [{name: 'list'}],
    },
  },
})
