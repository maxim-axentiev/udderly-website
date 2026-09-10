export const REVIEW_COLLAPSE_CHARS = 400

export function shouldCollapseReview(text: string): boolean {
  return text.length > REVIEW_COLLAPSE_CHARS
}

export function collapseReviewText(text: string): string {
  if (!shouldCollapseReview(text)) {
    return text
  }

  const cut = text.slice(0, REVIEW_COLLAPSE_CHARS)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = (lastSpace > 280 ? cut.slice(0, lastSpace) : cut).trimEnd()
  return `${trimmed}…`
}

export function formatReviewTime(iso: string | null): string | null {
  if (!iso) {
    return null
  }

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
