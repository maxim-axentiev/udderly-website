import { getCanonicalOrigin, isIndexingEnabled } from './canonical'

export type PageSeoInput = {
  title: string
  description?: string
  path?: string
  canonicalPath?: string
  imageUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogType?: string
  robots?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

export type PageHead = {
  meta: Array<Record<string, string>>
  links: Array<{ rel: string; href: string }>
  scripts: Array<{ type: string; children: string }>
}

export function createPageHead(
  input: PageSeoInput,
  env?: Record<string, string | undefined>,
): PageHead {
  const origin = getCanonicalOrigin(env)
  const indexingEnabled = isIndexingEnabled(env)

  const path = normalizePath(input.canonicalPath ?? input.path ?? '/')
  const canonicalUrl = origin ? `${origin}${path}` : undefined
  const title = input.title
  const description = input.description
  const ogTitle = input.ogTitle ?? title
  const ogDescription = input.ogDescription ?? description
  const ogImage = input.imageUrl
  const robots = resolveRobots({
    noindex: input.noindex,
    robots: input.robots,
    indexingEnabled,
  })

  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'robots', content: robots },
  ]

  if (description) {
    meta.push({ name: 'description', content: description })
  }

  meta.push({ property: 'og:title', content: ogTitle })
  meta.push({ property: 'og:type', content: input.ogType ?? 'website' })

  if (ogDescription) {
    meta.push({ property: 'og:description', content: ogDescription })
  }

  if (ogImage) {
    meta.push({ property: 'og:image', content: ogImage })
  }

  if (canonicalUrl) {
    meta.push({ property: 'og:url', content: canonicalUrl })
  }

  meta.push({ name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' })
  meta.push({ name: 'twitter:title', content: ogTitle })

  if (ogDescription) {
    meta.push({ name: 'twitter:description', content: ogDescription })
  }

  if (ogImage) {
    meta.push({ name: 'twitter:image', content: ogImage })
  }

  const links: Array<{ rel: string; href: string }> = []
  if (canonicalUrl) {
    links.push({ rel: 'canonical', href: canonicalUrl })
  }

  const scripts: Array<{ type: string; children: string }> = []
  if (input.jsonLd) {
    const documents = Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]
    for (const document of documents) {
      scripts.push({
        type: 'application/ld+json',
        children: JSON.stringify(document),
      })
    }
  }

  return { meta, links, scripts }
}

export function resolveRobots(options: {
  noindex?: boolean
  robots?: string
  indexingEnabled: boolean
}): string {
  if (options.noindex || !options.indexingEnabled) {
    return 'noindex, nofollow, noarchive'
  }

  return options.robots ?? 'index, follow'
}

export function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path.startsWith('/') ? path : `/${path}`
}
