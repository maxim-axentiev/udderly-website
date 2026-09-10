export function reviewCarouselColumns(width: number): number {
  if (width >= 1024) return 3
  if (width >= 768) return 2
  return 1
}

export function maxCarouselIndex(reviewCount: number, columns: number): number {
  return Math.max(0, reviewCount - columns)
}

export function clampCarouselIndex(
  index: number,
  reviewCount: number,
  columns: number,
): number {
  const max = maxCarouselIndex(reviewCount, columns)
  return Math.min(Math.max(0, index), max)
}

export function canMoveCarousel(
  reviewCount: number,
  columns: number,
): boolean {
  return reviewCount > columns
}
