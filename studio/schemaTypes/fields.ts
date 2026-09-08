import {defineField} from 'sanity'

type FieldGroup = string | undefined

export function slugField(source = 'title', group?: FieldGroup) {
  return defineField({
    name: 'slug',
    title: 'URL slug',
    type: 'slug',
    group,
    description: 'Used in the website address. Keep it short and stable.',
    options: {
      source,
      maxLength: 96,
    },
    validation: (rule) => rule.required(),
  })
}

export function orderRankField(description?: string, group?: FieldGroup) {
  return defineField({
    name: 'sortOrder',
    title: 'Display order',
    type: 'number',
    group,
    description: description ?? 'Lower numbers appear first.',
    initialValue: 100,
    validation: (rule) => rule.integer().min(0),
  })
}

export function activeField(title = 'Active', group?: FieldGroup) {
  return defineField({
    name: 'active',
    title,
    type: 'boolean',
    group,
    initialValue: true,
  })
}

export function featuredField(group?: FieldGroup) {
  return defineField({
    name: 'featured',
    title: 'Featured',
    type: 'boolean',
    group,
    description: 'Show this item in featured website placements.',
    initialValue: false,
  })
}
