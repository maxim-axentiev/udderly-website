import { describe, expect, it } from 'vitest'

import { publicExperienceSlug } from '@/lib/experiences/public-paths'
import { buildRobotsTxt } from '@/lib/seo/robots'

import {
  matchRedirect,
  matchRetiredUrl,
  migrationResponseForPath,
  MINI_HIGHLAND_COW_PATH,
  redirects,
  retiredUrls,
} from './redirects'

const permanentRedirects = [
  ['/private-mini-highland-experience', MINI_HIGHLAND_COW_PATH],
  ['/private-miniature-donkey-lunch-picnic', '/miniature-donkey-lunch-picnic'],
  ['/private-miniature-donkey-sunset-picnic', '/miniature-donkey-sunset-picnic'],
  ['/team-building-farm-experiences', '/corporate-training/team-building-experiences'],
  ['/faqs', '/faq'],
  ['/gift-certificate', '/gift-card'],
  ['/subscribe-to-newsletter', '/newsletter'],
  ['/our-vision', '/vision-values'],
  ['/privacy-policy-2', '/privacy-policy'],
  ['/experiential-tourism-development', '/corporate-training/experiential-tourism-development'],
] as const

describe('WordPress redirect infrastructure', () => {
  it('permanently redirects the known equivalent legacy URLs and keeps public experience paths', () => {
    expect(retiredUrls).toEqual([])
    expect(redirects.map((rule) => [rule.from, rule.to, rule.status])).toEqual(
      permanentRedirects.map(([from, to]) => [from, to, 301]),
    )
    expect(publicExperienceSlug('private-miniature-donkey-lunch-picnic')).toBe('miniature-donkey-lunch-picnic')
    expect(publicExperienceSlug('private-miniature-donkey-sunset-picnic')).toBe('miniature-donkey-sunset-picnic')
    expect(buildRobotsTxt(undefined)).toBe('User-agent: *\nDisallow: /\n')

    for (const [from, to] of permanentRedirects) {
      for (const path of [from, `${from}/`]) {
        const response = migrationResponseForPath(path)
        expect(response?.status).toBe(301)
        expect(response?.headers.get('Location')).toBe(to)
        expect(response?.headers.get('X-Robots-Tag')).toBeNull()
      }
    }
  })

  it('leaves uncertain legacy URLs unmatched', () => {
    for (const path of [
      '/cheryl-haskett',
      '/escape-to-the-countryside-farm-glamping',
      '/goatscaping',
      '/cow-wedding',
      '/promotions',
      '/mini-cattle-for-sale',
      '/winston',
      '/oreo',
      '/adopt-an-animal/adopt-clara',
      '/urbort-blog/alpaca-breeding',
      '/old-page',
    ]) {
      expect(matchRedirect(path)).toBeUndefined()
      expect(migrationResponseForPath(path)).toBeUndefined()
    }
    expect(matchRetiredUrl('/retired')).toBeUndefined()
  })

  it('can match a 301 redirect when rules are supplied later', () => {
    const match = matchRedirect('/old-about', [
      { from: '/old-about/', to: '/about', status: 301 },
    ])

    expect(match).toEqual({
      from: '/old-about/',
      to: '/about',
      status: 301,
    })
  })

  it('can return 410 for retired URLs', () => {
    const response = migrationResponseForPath('/gone', {
      retiredUrls: [{ from: '/gone', status: 410 }],
    })

    expect(response?.status).toBe(410)
  })
})
