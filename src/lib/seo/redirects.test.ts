import { describe, expect, it } from 'vitest'

import {
  matchRedirect,
  matchRetiredUrl,
  migrationResponseForPath,
  redirects,
  retiredUrls,
} from './redirects'

describe('WordPress redirect infrastructure', () => {
  it('starts with no invented redirects or retired URLs', () => {
    expect(redirects).toEqual([])
    expect(retiredUrls).toEqual([])
    expect(matchRedirect('/old-page')).toBeUndefined()
    expect(matchRetiredUrl('/retired')).toBeUndefined()
    expect(migrationResponseForPath('/anything')).toBeUndefined()
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
