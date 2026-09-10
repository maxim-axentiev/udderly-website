import { createServerFn } from '@tanstack/react-start'

import { fetchGooglePlaceReviews } from './fetch'

export const getGooglePlaceReviewsFn = createServerFn({
  method: 'GET',
  strict: false,
}).handler(async () => fetchGooglePlaceReviews())
