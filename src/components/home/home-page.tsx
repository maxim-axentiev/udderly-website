import { AwardsStrip } from '@/components/home/awards-strip'
import { ExperiencesTeaser } from '@/components/home/experiences-teaser'
import { FaqSection } from '@/components/home/faq-section'
import { HeroSection } from '@/components/home/hero-section'
import { MediaSection } from '@/components/home/media-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { OwnersSection } from '@/components/home/owners-section'
import { ReviewsSection } from '@/components/home/reviews-section'
import { StoreSection } from '@/components/home/store-section'
import { UrbortSection } from '@/components/home/urbort-section'
import { WelfareSection } from '@/components/home/welfare-section'
import type { ReviewsFeed } from '@/lib/reviews/model'

export function HomePage({
  reviewsFeed,
}: {
  reviewsFeed: ReviewsFeed
}) {
  return (
    <div className="home-page bg-background text-body-copy">
      <HeroSection />
      <AwardsStrip />
      <ExperiencesTeaser />
      <OwnersSection />
      <MediaSection />
      <WelfareSection />
      <StoreSection />
      <ReviewsSection reviewsFeed={reviewsFeed} />
      <NewsletterSection />
      <UrbortSection />
      <FaqSection />
    </div>
  )
}
