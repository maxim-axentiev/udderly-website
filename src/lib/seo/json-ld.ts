export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data),
  }
}

export function createWebSiteJsonLd(options: {
  name: string
  url?: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: options.name,
    ...(options.url ? { url: options.url } : {}),
  }
}

/**
 * Placeholder factories for later CMS-backed structured data.
 * Do not invent organization details until they are confirmed.
 */
export function createOrganizationJsonLdPlaceholder(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  }
}

export function createBreadcrumbListJsonLdPlaceholder(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  }
}

export function createArticleJsonLdPlaceholder(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
  }
}

export function createFaqPageJsonLdPlaceholder(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [],
  }
}
