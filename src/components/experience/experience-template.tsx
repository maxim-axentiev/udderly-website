import { ButtonLink } from '@/components/ui/button'
import { CmsImage } from '@/components/ui/cms-image'
import { Heading } from '@/components/ui/heading'
import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import { ExperienceFaqs } from '@/components/experience/faqs'
import { MeetTheHerd } from '@/components/experience/meet-the-herd'
import { ExperiencePolicy } from '@/components/experience/policy'
import { ExperienceQuickFacts } from '@/components/experience/quick-facts'
import { ExperienceTestimonials } from '@/components/experience/testimonials'
import { Container } from '@/components/layout/container'
import { hasPortableText } from '@/lib/portable-text'
import { isSanityImage } from '@/lib/sanity/image'
import type { ExperiencePageData, SanityImage } from '@/lib/sanity/types'

function BookCta({
  bookingUrl,
  size = 'lg',
}: {
  bookingUrl: string | null
  size?: 'md' | 'lg'
}) {
  if (!bookingUrl) {
    return null
  }

  return (
    <ButtonLink href={bookingUrl} size={size} external>
      Book this experience
    </ButtonLink>
  )
}

function ExperienceGallery({ gallery }: { gallery: SanityImage[] | null }) {
  const images = (gallery ?? []).filter((image) => isSanityImage(image))

  if (!images.length) {
    return null
  }

  return (
    <section className="py-12 md:py-16" aria-labelledby="experience-gallery-heading">
      <h2 id="experience-gallery-heading" className="text-2xl font-semibold md:text-3xl">
        Gallery
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div key={image.alt ?? index} className="aspect-4/3 overflow-hidden rounded-lg">
            <CmsImage
              image={image}
              alt={image.alt}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export function ExperienceTemplate({ experience }: { experience: ExperiencePageData }) {
  const hasVisitorInfo = hasPortableText(experience.visitorInfo)
  const hasAccessibility = hasPortableText(experience.accessibilityInfo)
  const showThingsToKnow = hasVisitorInfo || hasAccessibility

  return (
    <article>
      <header className="relative min-h-[28rem] overflow-hidden bg-foreground text-primary-foreground">
        {isSanityImage(experience.heroImage) ? (
          <div className="absolute inset-0">
            <CmsImage
              image={experience.heroImage}
              alt={experience.heroImage.alt ?? experience.title}
              priority
              sizes="100vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-overlay" />
          </div>
        ) : null}
        <Container className="relative flex min-h-[28rem] flex-col justify-end py-12 md:py-16">
          <Heading as="h1">{experience.title}</Heading>
          {experience.shortDescription ? (
            <p className="mt-4 max-w-narrow text-lg text-primary-foreground/90">
              {experience.shortDescription}
            </p>
          ) : null}
          <div className="mt-6">
            <BookCta bookingUrl={experience.bookingUrl} />
          </div>
        </Container>
      </header>

      <Container>
        <div className="py-10 md:py-12">
          <ExperienceQuickFacts experience={experience} />
        </div>

        {hasPortableText(experience.body) ? (
          <section className="pb-12 md:pb-16" aria-labelledby="what-youll-do-heading">
            <h2 id="what-youll-do-heading" className="text-2xl font-semibold md:text-3xl">
              What you’ll do
            </h2>
            <div className="mt-4 max-w-narrow">
              <PortableTextRenderer value={experience.body} />
            </div>
          </section>
        ) : null}

        <ExperienceGallery gallery={experience.gallery} />
        <MeetTheHerd animals={experience.animals} />

        {showThingsToKnow ? (
          <section className="py-12 md:py-16" aria-labelledby="things-to-know-heading">
            <h2 id="things-to-know-heading" className="text-2xl font-semibold md:text-3xl">
              Things to know
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {hasVisitorInfo ? (
                <div>
                  <h3 className="text-lg font-semibold">Visitor information</h3>
                  <div className="mt-2 text-muted">
                    <PortableTextRenderer value={experience.visitorInfo} />
                  </div>
                </div>
              ) : null}
              {hasAccessibility ? (
                <div>
                  <h3 className="text-lg font-semibold">Accessibility</h3>
                  <div className="mt-2 text-muted">
                    <PortableTextRenderer value={experience.accessibilityInfo} />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        <ExperiencePolicy
          policy={experience.welfarePolicy}
          headingId="animal-care-heading"
          fallbackHeading="Animal care"
        />

        <ExperienceTestimonials testimonials={experience.testimonials} />
        <ExperienceFaqs faqs={experience.faqs} />

        <ExperiencePolicy
          policy={experience.cancellationPolicy}
          headingId="experience-policy-heading"
          fallbackHeading="Policy"
        />

        {experience.bookingUrl ? (
          <section className="py-12 md:py-16">
            <div className="rounded-lg bg-foreground px-6 py-10 text-primary-foreground md:px-10">
              <h2 className="text-2xl font-semibold md:text-3xl">Ready when you are</h2>
              <p className="mt-3 max-w-narrow text-primary-foreground/85">
                Book a time that works for you. The farm will still be slightly ridiculous
                when you arrive.
              </p>
              <div className="mt-6">
                <BookCta bookingUrl={experience.bookingUrl} />
              </div>
            </div>
          </section>
        ) : null}
      </Container>
    </article>
  )
}
