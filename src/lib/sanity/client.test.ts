import { describe, expect, it } from 'vitest'

import { sanityClient } from './client'

describe('public Sanity client', () => {
  it('reads published content without a token', () => {
    const config = sanityClient.config()
    expect(config.projectId).toBe('umbuxpyp')
    expect(config.dataset).toBe('production')
    expect(config.perspective).toBe('published')
    expect(config.useCdn).toBe(true)
    expect(config.token).toBeUndefined()
  })
})
