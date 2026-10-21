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
    ['page', 'gift-cards'],
    ['animal', 'clara'],
    ['animalListing', 'mini-highland-calf-june'],
    ['adoptionOffering', 'adopt-clara'],
    ['corporateProgram', 'future-program'],
  ] as const)('leaves %s / %s without a public route', (type, slug) => {
    expect(resolveDocumentPath(type, slug)).toEqual({
      ok: false,
      reason: 'route-not-implemented',
    })
    expect(documentPath(type, slug)).toBeUndefined()
  })
})

describe('about page URLs', () => {
  it('builds the four about paths and keeps them out of the experience catch-all', () => {
    expect(documentPath('page', 'our-story')).toBe('/our-story')
    expect(documentPath('page', 'vision-values')).toBe('/vision-values')
    expect(documentPath('page', 'team')).toBe('/team')
    expect(documentPath('page', 'faq')).toBe('/faq')
    expect(routableExperienceSlug('our-story')).toBeUndefined()
    expect(routableExperienceSlug('vision-values')).toBeUndefined()
    expect(routableExperienceSlug('team')).toBeUndefined()
    expect(routableExperienceSlug('faq')).toBeUndefined()
  })

  it('routes published URBORT articles under the board and keeps the board out of experiences', () => {
    expect(documentPath('urbortArticle', 'worlds-first-cow-wedding')).toBe(
      '/urbort-blog/worlds-first-cow-wedding',
    )
    expect(routableExperienceSlug('urbort-blog')).toBeUndefined()
    expect(routableExperienceSlug('contact')).toBeUndefined()
    expect(routableExperienceSlug('newsletter')).toBeUndefined()
    expect(routableExperienceSlug('privacy-policy')).toBeUndefined()
    expect(routableExperienceSlug('terms-of-service')).toBeUndefined()
    expect(routableExperienceSlug('cookies-policy')).toBeUndefined()
  })
})

describe('corporate program URLs', () => {
  it('builds the approved program paths', () => {
    expect(documentPath('corporateProgram', 'beyond-engagement')).toBe(
      '/corporate-training/beyond-engagement',
    )
    expect(documentPath('corporateProgram', 'disc-assessment')).toBe(
      '/corporate-training/disc-assessment',
    )
  })

  it('keeps corporate-training itself out of the experience catch-all', () => {
    expect(routableExperienceSlug('corporate-training')).toBeUndefined()
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
