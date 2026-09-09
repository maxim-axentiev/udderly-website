import { describe, expect, it } from 'vitest'

import { hasPortableText } from './portable-text'

describe('hasPortableText', () => {
  it('returns false for empty values', () => {
    expect(hasPortableText(null)).toBe(false)
    expect(hasPortableText([])).toBe(false)
  })

  it('returns true when a block has text', () => {
    expect(
      hasPortableText([
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Hello' }],
        },
      ]),
    ).toBe(true)
  })
})
