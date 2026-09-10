import { describe, expect, it } from 'vitest'

import {
  collapseReviewText,
  REVIEW_COLLAPSE_CHARS,
  shouldCollapseReview,
} from './collapse'
import {
  canMoveCarousel,
  clampCarouselIndex,
  maxCarouselIndex,
  reviewCarouselColumns,
} from './carousel'

describe('review text collapse', () => {
  it('leaves short reviews unchanged', () => {
    expect(shouldCollapseReview('Wonderful goats.')).toBe(false)
    expect(collapseReviewText('Wonderful goats.')).toBe('Wonderful goats.')
  })

  it('collapses long reviews near 400 characters without mutating the source', () => {
    const text = `${'Goats are delightful. '.repeat(30)}The end.`
    expect(text.length).toBeGreaterThan(REVIEW_COLLAPSE_CHARS)
    expect(shouldCollapseReview(text)).toBe(true)

    const collapsed = collapseReviewText(text)
    expect(collapsed.endsWith('…')).toBe(true)
    expect(collapsed.length).toBeLessThan(text.length)
    expect(text.endsWith('The end.')).toBe(true)
  })
})

describe('review carousel paging', () => {
  it('uses 1 / 2 / 3 columns at mobile, tablet, and desktop widths', () => {
    expect(reviewCarouselColumns(390)).toBe(1)
    expect(reviewCarouselColumns(768)).toBe(2)
    expect(reviewCarouselColumns(1024)).toBe(3)
  })

  it('supports an arbitrary review count including the future 30-review set', () => {
    expect(maxCarouselIndex(5, 3)).toBe(2)
    expect(maxCarouselIndex(2, 3)).toBe(0)
    expect(maxCarouselIndex(30, 3)).toBe(27)
    expect(canMoveCarousel(5, 3)).toBe(true)
    expect(canMoveCarousel(3, 3)).toBe(false)
    expect(clampCarouselIndex(40, 30, 3)).toBe(27)
    expect(clampCarouselIndex(-1, 30, 3)).toBe(0)
  })
})
