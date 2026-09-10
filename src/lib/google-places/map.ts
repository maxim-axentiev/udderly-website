import type { NormalizedReview, ReviewsFeed } from '@/lib/reviews/model'

export type { ReviewsFeed }

export const GOOGLE_PLACES_FIELD_MASK = [
  'displayName',
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews.name',
  'reviews.rating',
  'reviews.text',
  'reviews.relativePublishTimeDescription',
  'reviews.publishTime',
  'reviews.authorAttribution.displayName',
  'reviews.authorAttribution.uri',
  'reviews.authorAttribution.photoUri',
  'reviews.googleMapsUri',
].join(',')

export const GOOGLE_PLACES_CACHE_TTL_MS = 15 * 60 * 1000

type LocalizedText = {
  text?: string
}

type AuthorAttribution = {
  displayName?: string
  uri?: string
  photoUri?: string
}

type PlacesReview = {
  name?: string
  rating?: number
  text?: LocalizedText
  relativePublishTimeDescription?: string
  publishTime?: string
  authorAttribution?: AuthorAttribution
  googleMapsUri?: string
}

type PlacesDetailsResponse = {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: PlacesReview[]
  error?: { message?: string; status?: string }
}

export function getGooglePlacesCredentials(
  env: Record<string, string | undefined>,
): { apiKey: string; placeId: string } | undefined {
  const apiKey = env.GOOGLE_PLACES_API_KEY?.trim()
  const placeId = env.GOOGLE_PLACE_ID?.trim()

  if (!apiKey || !placeId) {
    return undefined
  }

  return { apiKey, placeId }
}

export function normalizePlaceId(placeId: string): string {
  return placeId.replace(/^places\//, '')
}

export function mapGooglePlaceReviews(
  payload: PlacesDetailsResponse,
): ReviewsFeed {
  const reviews = (payload.reviews ?? [])
    .map((review, index) => {
      const text = review.text?.text?.trim() ?? ''
      const authorName =
        review.authorAttribution?.displayName?.trim() ?? 'Google user'
      const createTime = review.publishTime?.trim() || null

      return {
        id: review.name?.trim() || `places-review-${index}-${authorName}`,
        authorName,
        authorPhoto: review.authorAttribution?.photoUri?.trim() || null,
        authorUrl: review.authorAttribution?.uri?.trim() || null,
        rating: typeof review.rating === 'number' ? review.rating : null,
        text,
        createTime,
        updateTime: null,
        googleMapsUrl: review.googleMapsUri?.trim() || null,
      } satisfies NormalizedReview
    })
    .filter((review) => review.text.length > 0)

  return {
    available: true,
    rating: typeof payload.rating === 'number' ? payload.rating : null,
    userRatingCount:
      typeof payload.userRatingCount === 'number' ? payload.userRatingCount : null,
    googleMapsUrl: payload.googleMapsUri?.trim() || null,
    reviews,
  }
}

export function formatGoogleRating(rating: number): string {
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1)
}

export function formatGoogleReviewCount(count: number): string {
  return `${count.toLocaleString('en-CA')} Google reviews`
}
