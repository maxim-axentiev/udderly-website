import {SearchIcon} from '../../lib/icons'
import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fieldsets: [
    {
      name: 'advanced',
      title: 'Advanced',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Leave blank to use the page title. Aim for about 50–60 characters.',
      validation: (rule) => rule.max(70).warning('Keep this under 70 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Short summary for search results. Aim for about 150–160 characters.',
      validation: (rule) => rule.max(180).warning('Keep this under 180 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'altImage',
      description: 'Optional override. Recommended size 1200×630.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Turn this on only for pages that should not appear in Google.',
      initialValue: false,
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL override',
      type: 'url',
      fieldset: 'advanced',
      description:
        'Leave blank in almost every case. The website already builds the correct canonical URL. Only fill this in if a developer has asked you to.',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),
  ],
})
