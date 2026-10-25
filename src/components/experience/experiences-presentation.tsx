import { useState } from 'react'

import { ReviewStars } from '@/components/home/review-stars'
import { ReviewsCarousel } from '@/components/home/reviews-carousel'
import { Container } from '@/components/layout/container'
import { Button, ButtonLink } from '@/components/ui/button'
import type { HubFeature, HubImageKey, HubPicture, ExperiencesHubPageModel } from '@/lib/experiences/hub-page'
import { formatGoogleRating, formatGoogleReviewCount } from '@/lib/google-places/map'
import type { ReviewsFeed } from '@/lib/reviews/model'

const MAPS_DIRECTIONS =
  'https://www.google.com/maps/dir/?api=1&destination=906200+Township+Rd+12%2C+Blandford-Blenheim%2C+ON+N0J+1B0'
const MAPS_EMBED =
  'https://www.google.com/maps?q=906200+Township+Rd+12,+Blandford-Blenheim,+ON+N0J+1B0&z=13&output=embed'

function pictureSrc(
  picture: HubPicture | undefined,
  imageKey: HubImageKey | undefined,
  images: Partial<Record<HubImageKey, string>>,
): string | undefined {
  return picture?.src ?? (imageKey ? images[imageKey] : undefined)
}

function ExperienceFacts({ season, age }: { season?: string; age?: string }) {
  if (!season && !age) return null
  return (
    <ul className="mt-4 space-y-2 border-t-2 border-dashed border-headline/30 pt-4">
      {season ? <li className="text-sm font-semibold">Season: {season}</li> : null}
      {age ? <li className="text-sm font-semibold">Ages: {age}</li> : null}
    </ul>
  )
}

function UnavailableButton({ label }: { label: string }) {
  return (
    <div>
      <Button type="button" disabled className="w-full">
        {label}
      </Button>
      <p className="mt-2 text-sm font-semibold">This page is not available yet.</p>
    </div>
  )
}

function FeatureLinks({ feature }: { feature: HubFeature }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {feature.learnMoreHref ? (
        <ButtonLink href={feature.learnMoreHref} variant="outline">
          Learn More
        </ButtonLink>
      ) : null}
      {feature.ctaLabel && feature.ctaHref ? (
        <ButtonLink href={feature.ctaHref}>{feature.ctaLabel}</ButtonLink>
      ) : feature.ctaLabel ? (
        <UnavailableButton label={feature.ctaLabel} />
      ) : null}
    </div>
  )
}

export function ExperiencesPresentation({
  page,
  images,
  reviewsFeed,
}: {
  page: ExperiencesHubPageModel
  images: Partial<Record<HubImageKey, string>>
  reviewsFeed: ReviewsFeed
}) {
  const [openSignatures, setOpenSignatures] = useState<Record<string, boolean>>({})
  const heroSrc = page.hero.image?.src ?? images.hero
  const reviews = reviewsFeed.available ? reviewsFeed.reviews : []
  const summary =
    reviewsFeed.available && reviewsFeed.rating !== null
      ? {
          rating: formatGoogleRating(reviewsFeed.rating),
          count:
            reviewsFeed.userRatingCount !== null
              ? formatGoogleReviewCount(reviewsFeed.userRatingCount)
              : 'Reviews from Google Maps',
        }
      : null

  return (
    <>
      {page.cards.some((card) => card.bookingActions?.some((action) => action.overlay) || card.bookingOverlay) ? (
        <script src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes" async />
      ) : null}
      <section className="relative isolate flex min-h-[72vh] items-center justify-center overflow-hidden">
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={page.hero.image?.alt ?? page.hero.imageAlt}
            width={1920}
            height={1080}
            fetchPriority="high"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(3.2rem,9vw,8rem)] font-black uppercase leading-[0.8] text-background">
            {page.hero.lead}
            <br />
            <span className="text-secondary-accent">{page.hero.accent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {page.hero.supporting}
          </p>
        </Container>
      </section>

      {page.categories.length ? (
        <section id="categories" className="bg-farm-beige py-16 md:py-20">
          <Container width="brand" className="max-w-[1500px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-[0.85] text-headline">
                {page.chooser.headingLead}
                <br />
                {page.chooser.headingAccent}
              </h2>
              <p className="max-w-sm border-l-4 border-primary-accent pl-5 text-lg font-semibold">
                {page.chooser.note}
              </p>
            </div>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {page.categories.map((category) => {
                const src = pictureSrc(category.image, category.imageKey, images)
                return (
                  <li key={category.title}>
                    <a href={category.href} className="group block h-full border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)]">
                      {src ? (
                        <img src={src} alt="" width={1024} height={768} loading="lazy" className="aspect-[5/4] w-full object-cover" />
                      ) : (
                        <div className="aspect-[5/4] w-full bg-farm-beige" />
                      )}
                      <span className="mt-4 block font-display text-2xl font-black uppercase leading-none text-headline">{category.title}</span>
                      {category.note ? (
                        <span className="mt-2 block pb-2 font-accent text-base italic text-primary-accent">{category.note}</span>
                      ) : null}
                    </a>
                  </li>
                )
              })}
            </ul>
          </Container>
        </section>
      ) : null}

      <section id="farm-experiences" className="scroll-mt-20 bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,7rem)] font-black uppercase leading-[0.8] text-headline">
              {page.experiencesHeading}
            </h2>
            <p className="max-w-xl text-base leading-relaxed md:text-lg">{page.experiencesIntro}</p>
          </div>
          {page.cards.length === 0 ? (
            <div className="mt-14 border-2 border-headline bg-farm-beige p-8">
              {page.emptyHeading ? <h3 className="font-display text-3xl font-black uppercase text-headline">{page.emptyHeading}</h3> : null}
              {page.emptyMessage ? <p className="mt-3 text-lg">{page.emptyMessage}</p> : null}
            </div>
          ) : (
            <ul className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {page.cards.map((experience) => {
                const src = pictureSrc(experience.image, experience.imageKey, images)
                const alt = experience.image?.alt ?? experience.imageAlt ?? experience.title
                return (
                  <li key={experience.key}>
                    <article className="flex h-full flex-col border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)]">
                      <div className="relative overflow-hidden">
                        {src ? (
                          <img src={src} alt={alt} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                        ) : (
                          <div className="aspect-[4/3] w-full bg-farm-beige" />
                        )}
                        {experience.badge === 'limited' ? (
                          <span className="absolute left-2 top-2 -rotate-3 rounded-full border-2 border-headline bg-primary-accent px-3 py-1 font-display text-xs font-black uppercase text-primary-foreground">
                            Limited Time
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-3 pb-4">
                        <h3 className="font-display text-2xl font-black uppercase leading-none text-headline">{experience.title}</h3>
                        {experience.badge === 'signature' ? (
                          <p className="mt-3">
                            <button
                              type="button"
                              className="rounded-full border-2 border-headline bg-secondary-accent px-3 py-1 font-display text-xs font-black uppercase text-headline"
                              aria-expanded={Boolean(openSignatures[experience.key])}
                              onClick={() =>
                                setOpenSignatures((open) => ({
                                  ...open,
                                  [experience.key]: !open[experience.key],
                                }))
                              }
                            >
                              Signature Experience
                            </button>
                            {openSignatures[experience.key] ? (
                              <span className="mt-2 block text-xs leading-relaxed">
                                Recognized as a Signature Experience by Ontario’s Southwest for offering an exceptional and distinctive way to experience the region.
                              </span>
                            ) : null}
                          </p>
                        ) : null}
                        {experience.description ? <p className="mt-3 text-sm leading-relaxed">{experience.description}</p> : null}
                        <ExperienceFacts season={experience.season} age={experience.age} />
                        <div className="mt-5 flex flex-col gap-3">
                          {experience.href ? (
                            <ButtonLink href={experience.href} variant="outline" className="w-full">
                              Learn More
                            </ButtonLink>
                          ) : null}
                          {(experience.bookingActions ?? []).map((action) => (
                            <ButtonLink
                              key={action.label}
                              href={action.href}
                              external={!action.overlay}
                              openInNewTab={action.overlay ? false : undefined}
                              className="w-full"
                            >
                              {action.label}
                            </ButtonLink>
                          ))}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          )}
        </Container>
      </section>

      <section id="farm-stays" className="scroll-mt-20 bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <p className="font-accent text-xl italic text-primary-accent">{page.staysIntro.kicker}</p>
          <h2 className="mt-3 font-display text-[clamp(2.8rem,7vw,6.4rem)] font-black uppercase leading-[0.8] text-headline">{page.staysIntro.heading}</h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed md:text-lg">{page.staysIntro.copy}</p>
          <div className="mt-14 space-y-14">
            {page.stays.map((stay) => {
              const src = pictureSrc(stay.image, stay.imageKey, images)
              return (
                <article key={stay.key} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  {src ? (
                    <img src={src} alt={stay.image?.alt ?? stay.title} width={1280} height={860} loading="lazy" className="aspect-[16/10] w-full border-2 border-headline object-cover" />
                  ) : (
                    <div className="aspect-[16/10] w-full border-2 border-headline bg-farm-beige" />
                  )}
                  <div className="border-2 border-headline bg-background p-7 shadow-[10px_10px_0_var(--color-headline)] md:p-10">
                    <h3 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-black uppercase leading-[0.86] text-headline">{stay.title}</h3>
                    {stay.copy ? <p className="mt-4 text-base leading-relaxed md:text-lg">{stay.copy}</p> : null}
                    <ExperienceFacts season={stay.season} age={stay.age} />
                    <FeatureLinks feature={stay} />
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="gifts" className="scroll-mt-20 bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <h2 className="font-display text-[clamp(2.8rem,7.5vw,7rem)] font-black uppercase leading-[0.78] text-headline">
            {page.giftsIntro.headingLead}
            <br />
            <span className="text-stroke">{page.giftsIntro.headingAccent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{page.giftsIntro.copy}</p>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {page.gifts.map((gift) => {
              const src = pictureSrc(gift.image, gift.imageKey, images)
              return (
                <article key={gift.key} className="border-2 border-headline bg-background p-3 shadow-[12px_12px_0_var(--color-headline)]">
                  {src ? (
                    <img src={src} alt={gift.image?.alt ?? gift.title} width={1080} height={800} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-farm-beige" />
                  )}
                  <div className="p-5">
                    {gift.kicker ? <span className="inline-block bg-secondary-accent px-3 py-1 font-display text-sm font-black uppercase text-headline">{gift.kicker}</span> : null}
                    <h3 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] text-headline">{gift.title}</h3>
                    {gift.copy ? <p className="mt-3 leading-relaxed">{gift.copy}</p> : null}
                    <FeatureLinks feature={gift} />
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="for-businesses" className="scroll-mt-20 bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <h2 className="font-display text-[clamp(2.6rem,7vw,6.4rem)] font-black uppercase leading-[0.78] text-headline">
            {page.programsIntro.headingLead}
            <br />
            <span className="text-primary-accent">{page.programsIntro.headingAccent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{page.programsIntro.copy}</p>
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {page.programs.map((program) => {
              const src = pictureSrc(program.image, program.imageKey, images)
              return (
                <article key={program.key} className="flex flex-col border-2 border-headline bg-background shadow-[10px_10px_0_var(--color-headline)]">
                  {src ? (
                    <img src={src} alt={program.image?.alt ?? program.title} width={1280} height={860} loading="lazy" className="aspect-[16/9] w-full border-b-2 border-headline object-cover" />
                  ) : (
                    <div className="aspect-[16/9] w-full border-b-2 border-headline bg-farm-beige" />
                  )}
                  <div className="flex flex-1 flex-col p-7 md:p-9">
                    <h3 className="font-display text-3xl font-black uppercase leading-none text-headline md:text-4xl">{program.title}</h3>
                    {program.copy ? <p className="mt-4 flex-1 leading-relaxed">{program.copy}</p> : null}
                    <FeatureLinks feature={program} />
                  </div>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <section id="reviews" className="bg-farm-blue py-20 md:py-28">
        <Container width="brand">
          <h2 className="font-display text-[clamp(2.6rem,7.5vw,7rem)] font-black uppercase leading-[0.8] text-headline">
            What happens on the farm never stays on the farm
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold">
            Reviews from Google Maps{reviews.length ? " Shown in Google's order of relevance." : ''}
          </p>
          {summary ? (
            <p className="mt-6 font-display text-5xl font-black text-headline">
              {summary.rating}
              <ReviewStars rating={reviewsFeed.available ? reviewsFeed.rating : null} size={18} label={`${summary.rating} out of 5 stars on Google Maps`} />
              <span className="mt-1 block text-sm">{summary.count}</span>
            </p>
          ) : (
            <p className="mt-8 max-w-xl border-2 border-headline bg-background p-5 text-sm leading-relaxed">
              Google reviews will appear here once the farm’s Google Maps listing is connected.
            </p>
          )}
          {reviews.length ? (
            <ReviewsCarousel reviews={reviews} readFullLabel="Read full review" showLessLabel="Show less" />
          ) : null}
        </Container>
      </section>

      <section id="rainbow-registered" className="bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1200px] items-center gap-12 lg:grid-cols-[0.75fr_1fr]">
          {page.rainbow.image ? (
            <a href={page.rainbow.href} target="_blank" rel="noreferrer" className="mx-auto block w-full max-w-md">
              <img src={page.rainbow.image.src} alt={page.rainbow.image.alt} width={1920} height={620} loading="lazy" className="h-auto w-full" />
            </a>
          ) : (
            <p className="font-display text-2xl font-black uppercase text-headline">{page.rainbow.imageAlt}</p>
          )}
          <div>
            <p className="font-accent text-xl italic text-primary-accent">{page.rainbow.kicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
              {page.rainbow.heading}
              {page.rainbow.headingAccent ? (
                <>
                  <br />
                  {page.rainbow.headingAccent}
                </>
              ) : null}
            </h2>
            {page.rainbow.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section id="feast-on" className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="order-2 lg:order-1">
            <p className="font-accent text-xl italic text-primary-accent">{page.feast.kicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
              {page.feast.heading}
              {page.feast.headingAccent ? (
                <>
                  <br />
                  {page.feast.headingAccent}
                </>
              ) : null}
            </h2>
            {page.feast.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={`${index === 0 ? 'mt-6' : 'mt-4'} max-w-xl text-base leading-relaxed md:text-lg`}>{paragraph}</p>
            ))}
          </div>
          {page.feast.href ? (
            <a href={page.feast.href} target="_blank" rel="noreferrer" className="order-1 mx-auto block w-full max-w-sm lg:order-2">
              <img src={page.feast.image?.src ?? images.feast} alt={page.feast.image?.alt ?? page.feast.imageAlt} width={800} height={800} loading="lazy" className="h-auto w-full" />
            </a>
          ) : null}
        </Container>
      </section>

      <section id="newsletter" className="bg-farm-beige py-20 md:py-28">
        <Container width="narrow" className="max-w-3xl">
          <div className="border-2 border-headline bg-background p-7 text-center shadow-[10px_10px_0_var(--color-secondary-accent)] md:p-12">
            <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">{page.newsletter.title}</h2>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed">{page.newsletter.copy}</p>
            <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={(event) => event.preventDefault()}>
              <label className="font-display text-sm font-bold uppercase text-headline">
                First name
                <input disabled name="firstName" className="mt-1 min-h-12 w-full rounded-full border-2 border-headline bg-background px-5" />
              </label>
              <label className="font-display text-sm font-bold uppercase text-headline">
                Email
                <input disabled type="email" name="email" className="mt-1 min-h-12 w-full rounded-full border-2 border-headline bg-background px-5" />
              </label>
              <Button type="button" disabled className="mt-2 justify-self-center">
                Sign me up
              </Button>
            </form>
            <p className="mt-4 font-accent text-lg italic text-primary-accent">{page.newsletter.unavailable}</p>
          </div>
        </Container>
      </section>

      <section id="location" className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.location.headingLead}
            {page.location.headingAccent ? (
              <>
                <br />
                <span className="text-stroke">{page.location.headingAccent}</span>
              </>
            ) : null}
          </h2>
          <p className="mt-5 max-w-md border-l-4 border-primary-accent pl-5 text-lg font-semibold">{page.location.note}</p>
          <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_2fr]">
            <div className="border-2 border-headline bg-background p-7 shadow-[10px_10px_0_var(--color-headline)]">
              <p className="font-display text-3xl font-black uppercase leading-none text-headline">Udderly Ridiculous Farm Life</p>
              <address className="mt-5 not-italic leading-relaxed">
                906200 Township Rd 12
                <br />
                Blandford-Blenheim, ON N0J 1B0
                <br />
                Canada
              </address>
              <ButtonLink href={MAPS_DIRECTIONS} external className="mt-7">
                Get directions
              </ButtonLink>
            </div>
            <iframe title="Map showing the location of Udderly Ridiculous Farm Life" src={MAPS_EMBED} loading="lazy" className="h-[420px] w-full border-2 border-headline md:h-[520px]" />
          </div>
        </Container>
      </section>
    </>
  )
}
