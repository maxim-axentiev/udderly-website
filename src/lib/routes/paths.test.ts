import { describe, expect, it } from 'vitest'

import {
  INTERNAL_DOCUMENT_TYPES,
  RESERVED_SLUGS,
  documentPath,
  resolveDocumentPath,
  routableExperienceSlug,
} from './paths'

describe('experience URLs', () => {
  it('builds a root-level path for a valid experience slug', () => {
    expect(resolveDocumentPath('experience', 'mini-highland-cow-experience')).toEqual({
      ok: true,
      href: '/mini-highland-cow-experience',
    })
    expect(documentPath('experience', 'goat-yoga')).toBe('/goat-yoga')
  })

  it('trims a valid slug before building the path', () => {
    expect(documentPath('experience', '  alpaca-walks  ')).toBe('/alpaca-walks')
  })
})

describe('reserved route collisions', () => {
  it('rejects every reserved slug for an experience', () => {
    for (const slug of RESERVED_SLUGS) {
      expect(resolveDocumentPath('experience', slug)).toEqual({
        ok: false,
        reason: 'reserved-slug',
      })
      expect(routableExperienceSlug(slug)).toBeUndefined()
    }
  })

  it('rejects reserved slugs for the other supported document types', () => {
    for (const type of INTERNAL_DOCUMENT_TYPES) {
      if (type === 'experience') continue
      expect(resolveDocumentPath(type, 'contact')).toEqual({
        ok: false,
        reason: 'reserved-slug',
      })
    }
  })
})

describe('missing and invalid slugs', () => {
  it('rejects missing slugs', () => {
    expect(resolveDocumentPath('experience', null)).toEqual({
      ok: false,
      reason: 'missing-slug',
    })
    expect(resolveDocumentPath('experience', '   ')).toEqual({
      ok: false,
      reason: 'missing-slug',
    })
    expect(resolveDocumentPath('page', undefined)).toEqual({
      ok: false,
      reason: 'missing-slug',
    })
  })

  it('rejects slugs that are not a single lowercase path segment', () => {
    const invalid = [
      'Goat-Yoga',
      'goat_yoga',
      'goat yoga',
      'goat/yoga',
      '/goat-yoga',
      'goat--yoga',
      '..',
    ]
    for (const slug of invalid) {
      expect(resolveDocumentPath('experience', slug)).toEqual({
        ok: false,
        reason: 'invalid-slug',
      })
    }
  })
})

describe('document types without an implemented route', () => {
  it.each([
    ['page', 'our-story'],
    ['animal', 'clara'],
    ['animalListing', 'mini-highland-calf-june'],
    ['adoptionOffering', 'adopt-clara'],
    ['corporateProgram', 'beyond-engagement'],
    ['urbortArticle', 'worlds-first-cow-wedding'],
  ] as const)('leaves %s / %s unresolved', (type, slug) => {
    expect(resolveDocumentPath(type, slug)).toEqual({
      ok: false,
      reason: 'route-not-implemented',
    })
    expect(documentPath(type, slug)).toBeUndefined()
  })
})

describe('unknown document types', () => {
  it('fails closed for missing and unsupported types', () => {
    expect(resolveDocumentPath(null, 'goat-yoga')).toEqual({
      ok: false,
      reason: 'unsupported-type',
    })
    expect(resolveDocumentPath('promotion', 'spring-offer')).toEqual({
      ok: false,
      reason: 'unsupported-type',
    })
    expect(resolveDocumentPath('faq', 'parking')).toEqual({
      ok: false,
      reason: 'unsupported-type',
    })
  })
})

describe('experience catch-all slug', () => {
  it('accepts a valid experience splat', () => {
    expect(routableExperienceSlug('goat-yoga')).toBe('goat-yoga')
    expect(routableExperienceSlug('/goat-yoga/')).toBe('goat-yoga')
  })

  it('rejects nested, empty, invalid, and reserved splats', () => {
    expect(routableExperienceSlug(undefined)).toBeUndefined()
    expect(routableExperienceSlug('')).toBeUndefined()
    expect(routableExperienceSlug('/')).toBeUndefined()
    expect(routableExperienceSlug('corporate/beyond-engagement')).toBeUndefined()
    expect(routableExperienceSlug('meet-the-herd')).toBeUndefined()
    expect(routableExperienceSlug('robots.txt')).toBeUndefined()
    expect(routableExperienceSlug('sitemap.xml')).toBeUndefined()
    expect(routableExperienceSlug('Our-Farm')).toBeUndefined()
  })
})
