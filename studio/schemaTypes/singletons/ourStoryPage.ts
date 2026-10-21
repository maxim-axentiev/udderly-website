import {BookIcon} from '../../lib/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Copy for /our-story. Leave fields empty to keep the approved story.
 * Add a chapter only to change or hide that part of the story.
 */

export const ourStoryPage = defineType({
  name: 'ourStoryPage',
  title: 'Our Story page',
  type: 'document',
  icon: BookIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'story', title: 'Story'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroLead',
      title: 'Hero heading start',
      type: 'string',
      group: 'hero',
      validation: (rule) => rule.max(40),
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
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'altImage',
      group: 'hero',
      description: 'Leave empty to keep the current hero photo.',
    }),
    defineField({
      name: 'chapters',
      title: 'Chapters',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'storyChapter'})],
      description:
        'Leave this empty to keep all five approved chapters. To edit one, add it with its existing section id. Historical wording stays as written until you replace it.',
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
      return {title: 'Our Story'}
    },
  },
})
