import { describe, expect, it } from 'vitest'

import {
  matchRedirect,
  matchRetiredUrl,
  migrationResponseForPath,
  MINI_HIGHLAND_COW_PATH,
  redirects,
  retiredUrls,
} from './redirects'

describe('WordPress redirect infrastructure', () => {
  it('redirects only the consolidated private Mini Highland Cow URL', () => {
    expect(retiredUrls).toEqual([])
    expect(redirects).toEqual([
      {
        from: '/private-mini-highland-experience',
        to: MINI_HIGHLAND_COW_PATH,
        status: 301,
      },
    ])
    expect(matchRedirect('/old-page')).toBeUndefined()
    expect(matchRetiredUrl('/retired')).toBeUndefined()
    expect(migrationResponseForPath('/anything')).toBeUndefined()

    for (const path of ['/private-mini-highland-experience', '/private-mini-highland-experience/']) {
      const response = migrationResponseForPath(path)
      expect(response?.status).toBe(301)
      expect(response?.headers.get('Location')).toBe(MINI_HIGHLAND_COW_PATH)
    }
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
