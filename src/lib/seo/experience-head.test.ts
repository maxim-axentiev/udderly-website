import { describe, expect, it } from 'vitest'

import { createPageHead } from './page-head'
import { createExperienceHead } from './experience-head'
import type { ExperiencePageData } from '@/lib/sanity/types'

const experience = {
  _id: 'exp-1',
  title: 'Mini Highland Cow Experience',
  slug: 'mini-highland-cow-experience',
  shortDescription: 'Meet the cows.',
  body: null,
  heroImage: null,
  gallery: null,
  category: 'farmExperience',
  animalSpecies: null,
  season: 'yearRound',
  duration: '2 hours',
  priceDisplay: 'From $45',
  groupSize: null,
  sessionType: null,
  ageGuidance: null,
  visitorInfo: null,
  accessibilityInfo: null,
  bookingUrl: null,
  animals: null,
  faqs: null,
  testimonials: null,
  cancellationPolicy: null,
  welfarePolicy: null,
  seo: {
    title: 'SEO title',
    description: 'SEO description',
    noIndex: false,
    image: null,
  },
} satisfies ExperiencePageData

describe('createExperienceHead', () => {
  it('uses Sanity SEO fields and the root-level path', () => {
    const head = createExperienceHead(experience)

    expect(head.meta).toContainEqual({ title: 'SEO title' })
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'SEO description',
    })
  })

  it('canonicalizes the stored private donkey slug to the approved path', () => {
    const head = createExperienceHead({
      ...experience,
      title: 'Private Miniature Donkey Lunch Picnic',
      slug: 'private-miniature-donkey-lunch-picnic',
    }, { PUBLIC_CANONICAL_ORIGIN: 'https://staging.udderlyridiculousfarmlife.com' })

    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://staging.udderlyridiculousfarmlife.com/miniature-donkey-lunch-picnic',
    })
  })

  it('keeps the Mini Highland Cow canonical path and adds private intent only when no description exists', () => {
    const head = createExperienceHead(
      {
        ...experience,
        seo: { title: '', description: '', noIndex: false, image: null },
        shortDescription: null,
      },
      { PUBLIC_CANONICAL_ORIGIN: 'https://staging.udderlyridiculousfarmlife.com' },
    )

    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://staging.udderlyridiculousfarmlife.com/mini-highland-cow-experience',
    })
    expect(head.meta).toContainEqual({
      name: 'description',
      content: 'Meet mini Highland cows on an open visit, or book a private session for your group.',
    })

    const stored = createExperienceHead(experience, {
      PUBLIC_CANONICAL_ORIGIN: 'https://staging.udderlyridiculousfarmlife.com',
    })
    expect(stored.meta).toContainEqual({ name: 'description', content: 'SEO description' })
    expect(JSON.stringify(stored.meta)).not.toContain('private session')
  })

  it('does not emit a canonical URL without PUBLIC_CANONICAL_ORIGIN', () => {
    const head = createPageHead(
      {
        title: 'SEO title',
        path: '/mini-highland-cow-experience',
      },
      { PUBLIC_CANONICAL_ORIGIN: '' },
    )

    expect(head.links.find((link) => link.rel === 'canonical')).toBeUndefined()
    expect(head.meta).toContainEqual({
      name: 'robots',
      content: 'noindex, nofollow, noarchive',
    })
  })
})
