import { describe, expect, it } from 'vitest'

import { experiencePath, isReservedExperienceSlug } from './paths'

describe('experience paths', () => {
  it('builds a root-level experience URL', () => {
    expect(experiencePath('mini-highland-cow-experience')).toBe(
      '/mini-highland-cow-experience',
    )
  })

  it('reserves hub and system slugs', () => {
    expect(isReservedExperienceSlug('experiences')).toBe(true)
    expect(isReservedExperienceSlug('mini-highland-cow-experience')).toBe(false)
  })
})
