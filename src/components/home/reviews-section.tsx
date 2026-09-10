import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageReviews } from '@/content/homepage'
import { ReviewsCarousel } from '@/components/home/reviews-carousel'
import { ReviewStars } from '@/components/home/review-stars'
import {
  formatGoogleRating,
  formatGoogleReviewCount,
} from '@/lib/google-places/map'
import type { ReviewsFeed } from '@/lib/reviews/model'

export function ReviewsSection({ reviewsFeed }: { reviewsFeed: ReviewsFeed }) {
  const summary =
    reviewsFeed.available && reviewsFeed.rating !== null
      ? {
          rating: formatGoogleRating(reviewsFeed.rating),
          count:
            reviewsFeed.userRatingCount !== null
              ? formatGoogleReviewCount(reviewsFeed.userRatingCount)
              : homepageReviews.googleAttribution,
        }
      : null

  const reviews = reviewsFeed.available ? reviewsFeed.reviews : []
  const mapsUri = reviewsFeed.available ? reviewsFeed.googleMapsUrl : null

  return (
    <section id="reviews" className="relative overflow-hidden bg-farm-blue py-20 md:py-28">
      <Container width="brand">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-4xl">
            <h2 className="font-display text-[clamp(2.6rem,7.5vw,7rem)] font-black uppercase leading-[0.8] text-headline">
              {homepageReviews.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm font-semibold">
              {homepageReviews.googleAttribution}
              {reviews.length ? ` ${homepageReviews.googleOrderNote}` : null}
            </p>
          </div>

          <div className="flex items-center gap-4 border-2 border-headline bg-background px-5 py-4 shadow-[6px_6px_0_var(--color-headline)]">
            <span className="font-display text-5xl font-black leading-none text-headline">
              {summary?.rating ?? '—'}
            </span>
            <div>
              <ReviewStars
                rating={reviewsFeed.available ? reviewsFeed.rating : null}
                size={18}
                label={
                  summary
                    ? `${summary.rating} out of 5 stars on Google Maps`
                    : 'Google Maps reviews'
                }
              />
              <p className="mt-1 text-sm font-bold uppercase text-headline">
                {summary?.count ?? homepageReviews.googleAttribution}
              </p>
            </div>
          </div>
        </div>

        {reviews.length ? (
          <ReviewsCarousel reviews={reviews} />
        ) : (
          <p className="mt-14 max-w-xl border-2 border-headline bg-background p-5 text-sm leading-relaxed shadow-[7px_7px_0_var(--color-headline)]">
            {homepageReviews.unavailableCopy}
          </p>
        )}

        <div className="mt-14 flex flex-col items-center justify-center gap-5">
          {mapsUri ? (
            <a
              href={mapsUri}
              rel="noreferrer"
              target="_blank"
              className="font-display text-lg font-extrabold uppercase text-primary-accent hover:underline"
            >
              {homepageReviews.readMoreLabel}
            </a>
          ) : null}
          <ButtonLink href={homepageReviews.cta.href} size="lg">
            {homepageReviews.cta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
