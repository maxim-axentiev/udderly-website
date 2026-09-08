import { describe, expect, it } from 'vitest'

import { getCanonicalOrigin, isIndexingEnabled } from './canonical'
import { createPageHead, resolveRobots } from './page-head'

const productionEnv = {
  PUBLIC_CANONICAL_ORIGIN: 'https://example.com',
}

const stagingEnv = {
  PUBLIC_CANONICAL_ORIGIN: '',
}

describe('canonical origin', () => {
  it('returns a trimmed origin without a trailing slash', () => {
    expect(
      getCanonicalOrigin({
        PUBLIC_CANONICAL_ORIGIN: 'https://example.com/',
      }),
    ).toBe('https://example.com')
  })

  it('does not invent a canonical origin when unset', () => {
    expect(getCanonicalOrigin(stagingEnv)).toBeUndefined()
    expect(isIndexingEnabled(stagingEnv)).toBe(false)
  })

  it('enables indexing only when a canonical origin is configured', () => {
    expect(isIndexingEnabled(productionEnv)).toBe(true)
  })
})

describe('createPageHead', () => {
  it('emits canonical and Open Graph URLs in production', () => {
    const head = createPageHead(
      {
        title: 'Home',
        description: 'A description',
        path: '/',
        imageUrl: 'https://example.com/og.jpg',
      },
      productionEnv,
    )

    expect(head.meta).toContainEqual({ title: 'Home' })
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'A description',
    })
    expect(head.meta).toContainEqual({
      property: 'og:url',
      content: 'https://example.com/',
    })
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://example.com/',
    })
    expect(head.meta).toContainEqual({
      name: 'robots',
      content: 'index, follow',
    })
  })

  it('does not emit fake canonical URLs without a canonical origin', () => {
    const head = createPageHead(
      {
        title: 'Home',
        description: 'A description',
        path: '/',
      },
      stagingEnv,
    )

    expect(head.links.find((link) => link.rel === 'canonical')).toBeUndefined()
    expect(
      head.meta.find((entry) => entry.property === 'og:url'),
    ).toBeUndefined()
    expect(head.meta).toContainEqual({
      name: 'robots',
      content: 'noindex, nofollow, noarchive',
    })
  })

  it('forces noindex for pages that opt out even in production', () => {
    const head = createPageHead(
      {
        title: 'Missing',
        noindex: true,
      },
      productionEnv,
    )

    expect(head.meta).toContainEqual({
      name: 'robots',
      content: 'noindex, nofollow, noarchive',
    })
  })

  it('includes JSON-LD scripts when provided', () => {
    const head = createPageHead(
      {
        title: 'Home',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Udderly Ridiculous Farm Life',
        },
      },
      productionEnv,
    )

    expect(head.scripts[0]?.type).toBe('application/ld+json')
    expect(head.scripts[0]?.children).toContain('"@type":"WebSite"')
  })
})

describe('resolveRobots', () => {
  it('disallows indexing when indexing is disabled', () => {
    expect(
      resolveRobots({ indexingEnabled: false }),
    ).toBe('noindex, nofollow, noarchive')
  })
})
