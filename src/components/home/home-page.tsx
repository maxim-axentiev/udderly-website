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
import type { HomepageContent } from '@/lib/homepage/model'
import type { HomepageFaqItem } from '@/lib/homepage-faqs'
import type { ReviewsFeed } from '@/lib/reviews/model'

import { HomepageContentProvider } from './homepage-content'

export function HomePage({
  reviewsFeed,
  faqs,
  content,
}: {
  reviewsFeed: ReviewsFeed
  faqs: HomepageFaqItem[]
  content: HomepageContent
}) {
  return (
    <HomepageContentProvider content={content}>
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
        <FaqSection faqs={faqs} />
      </div>
    </HomepageContentProvider>
  )
}
