import {BookIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {slugField} from '../fields'

export const urbortArticle = defineType({
  name: 'urbortArticle',
  title: 'URBORT article',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'related', title: 'Related'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(110),
    }),
    slugField('title', 'content'),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary for the URBORT hub and sharing cards.',
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'portableText',
      group: 'content',
      description: 'You can add headings, images, galleries, and YouTube or Vimeo videos in the article.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'externalLinks',
      title: 'External / media links',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'link'})],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      description: 'Optional labels such as animal story or farm experiment.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'relatedAnimals',
      title: 'Related animals',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'animal'}]})],
    }),
    defineField({
      name: 'relatedExperiences',
      title: 'Related experiences',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'experience'}]})],
    }),
    defineField({
      name: 'relatedArticles',
      title: 'Related URBORT articles',
      type: 'array',
      group: 'related',
      of: [defineArrayMember({type: 'reference', to: [{type: 'urbortArticle'}]})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      publishedAt: 'publishedAt',
    },
    prepare({title, media, publishedAt}) {
      return {
        title: title || 'Untitled URBORT article',
        subtitle: publishedAt ? new Date(publishedAt).toLocaleDateString() : 'No publish date',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Publish date, newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
