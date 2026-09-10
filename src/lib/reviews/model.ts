/**
 * Normalized homepage review feed.
 *
 * The UI must consume this shape only — never Places or GBP response objects.
 *
 * Current source: Google Places API (New) Place Details.
 * Places returns a maximum of 5 Google-selected reviews, in Google's
 * relevance order. That is an API limit, not a UI limit.
 *
 * Future production source: Google Business Profile API
 * (`accounts.locations.reviews.list`) once access is approved.
 * GBP can return up to 50 reviews per page. The homepage target is the
 * 30 most recent reviews, refreshed about once every 24 hours.
 * Do not implement GBP OAuth until that access is approved.
 */
export type NormalizedReview = {
  id: string
  authorName: string
  authorPhoto: string | null
  authorUrl: string | null
  rating: number | null
  text: string
  createTime: string | null
  updateTime: string | null
  googleMapsUrl: string | null
}

export type ReviewsFeed =
  | { available: false }
  | {
      available: true
      rating: number | null
      userRatingCount: number | null
      googleMapsUrl: string | null
      reviews: NormalizedReview[]
    }

export const HOMEPAGE_REVIEW_TARGET_COUNT = 30
