import type { ReviewsFeed } from '@/lib/reviews/model'

import {
  GOOGLE_PLACES_CACHE_TTL_MS,
  GOOGLE_PLACES_FIELD_MASK,
  getGooglePlacesCredentials,
  mapGooglePlaceReviews,
  normalizePlaceId,
} from './map'

/*
 * Places API (New) is the current source and returns at most 5 reviews.
 * Keep this fetch isolated so the homepage can later switch to Google
 * Business Profile (30 recent reviews, ~24h refresh, 50 per page).
 */
const unavailable: ReviewsFeed = { available: false }

type CacheEntry = {
  expiresAt: number
  value: ReviewsFeed
}

let cache: CacheEntry | undefined

export function resetGooglePlacesCache() {
  cache = undefined
}

function envSource(): Record<string, string | undefined> {
  return typeof process !== 'undefined' ? process.env : {}
}

function logDiagnostic(message: string) {
  if (envSource().NODE_ENV !== 'development') {
    return
  }

  console.info(`[google-places] ${message}`)
}

export async function fetchGooglePlaceReviews(
  env: Record<string, string | undefined> = envSource(),
  fetchImpl: typeof fetch = fetch,
  now = Date.now(),
): Promise<ReviewsFeed> {
  const credentials = getGooglePlacesCredentials(env)

  if (!credentials) {
    logDiagnostic(
      'Skipped: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set.',
    )
    return unavailable
  }

  if (cache && cache.expiresAt > now) {
    return cache.value
  }

  const placeId = encodeURIComponent(normalizePlaceId(credentials.placeId))
  const url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=en`

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': credentials.apiKey,
        'X-Goog-FieldMask': GOOGLE_PLACES_FIELD_MASK,
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      logDiagnostic(`Unavailable (${response.status}).`)
      return unavailable
    }

    const payload = (await response.json()) as Parameters<
      typeof mapGooglePlaceReviews
    >[0]

    if (payload.error) {
      logDiagnostic('Unavailable (API error payload).')
      return unavailable
    }

    const mapped = mapGooglePlaceReviews(payload)
    cache = {
      expiresAt: now + GOOGLE_PLACES_CACHE_TTL_MS,
      value: mapped,
    }
    return mapped
  } catch {
    logDiagnostic('Unavailable (request failed).')
    return unavailable
  }
}
