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

/** Path, in-page anchor, or absolute http(s) URL. Empty is allowed. */
export function optionalPublicHrefRule(value: unknown) {
  if (value == null || value === '') return true
  if (typeof value !== 'string') {
    return 'Enter a path, an in-page link, or a full https:// URL.'
  }
  const href = value.trim()
  if (href.startsWith('#') && href.length > 1 && !/\s/.test(href)) return true
  if (href.startsWith('/') && !href.startsWith('//') && !/\s/.test(href)) return true
  try {
    const url = new URL(href)
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    return 'Enter a path starting with /, an in-page link starting with #, or a full https:// URL.'
  }
  return 'Enter a path starting with /, an in-page link starting with #, or a full https:// URL.'
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
