import { describe, expect, it } from 'vitest'

import {
  fetchGooglePlaceReviews,
  resetGooglePlacesCache,
} from './fetch'
import {
  formatGoogleRating,
  formatGoogleReviewCount,
  getGooglePlacesCredentials,
  GOOGLE_PLACES_FIELD_MASK,
  mapGooglePlaceReviews,
  normalizePlaceId,
} from './map'

describe('Google Places credentials', () => {
  it('requires both a server-only API key and a place ID', () => {
    expect(getGooglePlacesCredentials({})).toBeUndefined()
    expect(
      getGooglePlacesCredentials({ GOOGLE_PLACES_API_KEY: 'key' }),
    ).toBeUndefined()
    expect(getGooglePlacesCredentials({ GOOGLE_PLACE_ID: 'ChIJ' })).toBeUndefined()
    expect(
      getGooglePlacesCredentials({
        GOOGLE_PLACES_API_KEY: ' key ',
        GOOGLE_PLACE_ID: ' ChIJ123 ',
      }),
    ).toEqual({ apiKey: 'key', placeId: 'ChIJ123' })
  })

  it('does not include the API key in the field mask', () => {
    expect(GOOGLE_PLACES_FIELD_MASK).toContain('reviews.authorAttribution.displayName')
    expect(GOOGLE_PLACES_FIELD_MASK).toContain('reviews.name')
    expect(GOOGLE_PLACES_FIELD_MASK).not.toContain('GOOGLE')
  })
})

describe('mapGooglePlaceReviews', () => {
  it('maps Place Details (New) review fields and drops empty text', () => {
    const mapped = mapGooglePlaceReviews({
      rating: 4.9,
      userRatingCount: 1284,
      googleMapsUri: 'https://maps.google.com/?cid=1',
      reviews: [
        {
          name: 'places/ChIJ123/reviews/abc',
          rating: 5,
          text: { text: 'The goats were delightful.' },
          relativePublishTimeDescription: '2 weeks ago',
          publishTime: '2026-08-27T12:00:00Z',
          authorAttribution: {
            displayName: 'Marissa T.',
            uri: 'https://maps.google.com/maps/contrib/1',
            photoUri: 'https://lh3.googleusercontent.com/a/photo',
          },
          googleMapsUri: 'https://maps.google.com/?cid=review-1',
        },
        {
          rating: 4,
          text: { text: '   ' },
          authorAttribution: { displayName: 'Blank' },
        },
      ],
    })

    expect(mapped).toMatchObject({
      available: true,
      rating: 4.9,
      userRatingCount: 1284,
      reviews: [
        {
          id: 'places/ChIJ123/reviews/abc',
          rating: 5,
          text: 'The goats were delightful.',
          createTime: '2026-08-27T12:00:00Z',
          updateTime: null,
          authorName: 'Marissa T.',
          authorUrl: 'https://maps.google.com/maps/contrib/1',
          authorPhoto: 'https://lh3.googleusercontent.com/a/photo',
          googleMapsUrl: 'https://maps.google.com/?cid=review-1',
        },
      ],
    })
  })

  it('formats rating and review counts for the existing summary chip', () => {
    expect(formatGoogleRating(4.9)).toBe('4.9')
    expect(formatGoogleRating(5)).toBe('5')
    expect(formatGoogleReviewCount(1284)).toBe('1,284 Google reviews')
  })

  it('strips a places/ prefix from a Place ID', () => {
    expect(normalizePlaceId('places/ChIJ123')).toBe('ChIJ123')
  })
})

describe('fetchGooglePlaceReviews', () => {
  it('returns an unavailable result without calling Google when env is missing', async () => {
    let called = false
    const result = await fetchGooglePlaceReviews({}, async () => {
      called = true
      return new Response('nope')
    })

    expect(called).toBe(false)
    expect(result).toEqual({ available: false })
  })

  it('does not crash when Google returns an error status', async () => {
    resetGooglePlacesCache()
    const result = await fetchGooglePlaceReviews(
      {
        GOOGLE_PLACES_API_KEY: 'key',
        GOOGLE_PLACE_ID: 'ChIJ123',
      },
      async () => new Response('nope', { status: 429 }),
    )

    expect(result).toEqual({ available: false })
  })

  it('maps a successful Place Details payload', async () => {
    resetGooglePlacesCache()
    const result = await fetchGooglePlaceReviews(
      {
        GOOGLE_PLACES_API_KEY: 'key',
        GOOGLE_PLACE_ID: 'ChIJ123',
      },
      async () =>
        Response.json({
          rating: 5,
          userRatingCount: 40,
          googleMapsUri: 'https://maps.google.com/?cid=1',
          reviews: [
            {
              rating: 5,
              text: { text: 'Wonderful.' },
              relativePublishTimeDescription: 'a month ago',
              authorAttribution: { displayName: 'Dev P.' },
            },
          ],
        }),
    )

    expect(result.available).toBe(true)
    if (result.available) {
      expect(result.reviews).toHaveLength(1)
      expect(result.reviews[0]?.authorName).toBe('Dev P.')
    }
  })
})
