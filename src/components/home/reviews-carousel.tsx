import {
  useId,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type TouchEvent,
} from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import {
  collapseReviewText,
  formatReviewTime,
  shouldCollapseReview,
} from '@/lib/reviews/collapse'
import {
  canMoveCarousel,
  clampCarouselIndex,
  maxCarouselIndex,
  reviewCarouselColumns,
} from '@/lib/reviews/carousel'
import type { NormalizedReview } from '@/lib/reviews/model'

import { ReviewStars } from './review-stars'

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function viewportColumns() {
  return reviewCarouselColumns(window.innerWidth)
}

function ReviewCard({ review }: { review: NormalizedReview }) {
  const [expanded, setExpanded] = useState(false)
  const long = shouldCollapseReview(review.text)
  const visibleText = expanded || !long ? review.text : collapseReviewText(review.text)
  const published = formatReviewTime(review.createTime)

  const author = (
    <span className="font-display text-xl font-black uppercase text-headline">
      {review.authorName}
    </span>
  )

  return (
    <article className="flex h-full min-h-[22rem] flex-col border-2 border-headline bg-background p-5 shadow-[7px_7px_0_var(--color-headline)]">
      <ReviewStars
        rating={review.rating}
        label={
          review.rating
            ? `${review.rating} out of 5 stars`
            : 'Google review rating'
        }
      />
      <div className="mt-4 flex-1">
        <p className="text-sm leading-relaxed">{visibleText}</p>
        {long ? (
          <button
            type="button"
            className="mt-3 font-display text-sm font-extrabold uppercase text-primary-accent hover:underline"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded ? 'Show less' : 'Read full review'}
          </button>
        ) : null}
      </div>
      <div className="mt-5 flex items-center gap-3 border-t-2 border-headline pt-3">
        {review.authorPhoto ? (
          <img
            src={review.authorPhoto}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="size-10 border-2 border-headline object-cover"
          />
        ) : null}
        <div className="min-w-0">
          {review.authorUrl ? (
            <a
              href={review.authorUrl}
              rel="noreferrer"
              target="_blank"
              className="no-underline hover:underline"
            >
              {author}
            </a>
          ) : (
            author
          )}
          {published ? (
            <p className="text-xs font-bold text-body-copy">{published}</p>
          ) : null}
          {review.googleMapsUrl ? (
            <a
              href={review.googleMapsUrl}
              rel="noreferrer"
              target="_blank"
              className="text-xs font-bold uppercase text-primary-accent hover:underline"
            >
              View on Google Maps
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function ReviewsCarousel({ reviews }: { reviews: NormalizedReview[] }) {
  const labelId = useId()
  const columns = useSyncExternalStore(
    subscribeToViewport,
    viewportColumns,
    () => 1,
  )
  const [index, setIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const movable = canMoveCarousel(reviews.length, columns)
  const current = clampCarouselIndex(index, reviews.length, columns)
  const lastIndex = maxCarouselIndex(reviews.length, columns)

  const go = (next: number) => {
    setIndex(clampCarouselIndex(next, reviews.length, columns))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!movable) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(current - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(current + 1)
    }
    if (event.key === 'Home') {
      event.preventDefault()
      go(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      go(lastIndex)
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStart(event.touches[0]?.clientX ?? null)
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart
    const end = event.changedTouches[0]?.clientX ?? null
    setTouchStart(null)
    if (start === null || end === null || !movable) return
    if (Math.abs(end - start) > 50) go(end < start ? current + 1 : current - 1)
  }

  return (
    <div className="mt-14">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        tabIndex={movable ? 0 : undefined}
        onKeyDown={onKeyDown}
        className="relative outline-none focus-visible:ring-4 focus-visible:ring-ring"
      >
        <p id={labelId} className="sr-only">
          Google Maps reviews
        </p>

        <div
          className="reviews-viewport overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="reviews-track motion-safe:transition-transform motion-safe:duration-300"
            style={{
              transform: `translateX(calc(-1 * ${current} * ((100% + 1.5rem) / var(--review-cols))))`,
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="min-w-0">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous reviews"
            disabled={!movable || current === 0}
            onClick={() => go(current - 1)}
            className="flex size-12 rotate-[-4deg] items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-secondary-accent)] transition-transform hover:rotate-[-8deg] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:rotate-[-4deg]"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next reviews"
            disabled={!movable || current >= lastIndex}
            onClick={() => go(current + 1)}
            className="flex size-12 rotate-[4deg] items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-primary-accent)] transition-transform hover:rotate-[8deg] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:rotate-[4deg]"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
