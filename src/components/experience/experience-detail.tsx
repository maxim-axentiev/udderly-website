import { useRef, useState, type ReactNode } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import { ButtonLink } from '@/components/ui/button'
import type { DetailPicture, ExperienceDetailModel } from '@/lib/experiences/detail'
import { towerOfGoatsLocation } from '@/lib/experiences/tower-of-goats'

const REVIEW_LIMIT = 190

function Lines({
  lead,
  accent,
  className,
  accentClassName = 'text-stroke',
}: {
  lead: string
  accent?: string
  className: string
  accentClassName?: string
}) {
  return (
    <h2 className={className}>
      {lead}
      {accent ? (
        <>
          <br />
          <span className={accentClassName}>{accent}</span>
        </>
      ) : null}
    </h2>
  )
}

function BookLink({ href, label, overlay }: { href?: string; label: string; overlay?: boolean }) {
  if (!href) return null
  return (
    <ButtonLink href={href} external={!overlay} openInNewTab={overlay ? false : undefined} size="lg" className="mt-8">
      {label}
    </ButtonLink>
  )
}

function Photo({ image, className }: { image: DetailPicture; className: string }) {
  return <img src={image.src} alt={image.alt} className={className} />
}

function CarouselButton({ label, onClick }: { label: string; onClick: () => void }) {
  const Icon = label.startsWith('Previous') ? ChevronLeftIcon : ChevronRightIcon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
    >
      <Icon />
    </button>
  )
}

function ScrollCarousel({
  label,
  itemClassName,
  children,
}: {
  label: string
  itemClassName: string
  children: ReactNode[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const first = track.firstElementChild as HTMLElement | null
    const step = first ? first.offsetWidth + 24 : track.clientWidth
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div key={index} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-3 md:justify-end">
        <CarouselButton label={`Previous — ${label}`} onClick={() => scrollByCard(-1)} />
        <CarouselButton label={`Next — ${label}`} onClick={() => scrollByCard(1)} />
      </div>
    </div>
  )
}

function Gallery({ images }: { images: DetailPicture[] }) {
  const [index, setIndex] = useState(0)
  const total = images.length
  if (!total) return null
  const current = images[index] ?? images[0]
  const go = (next: number) => setIndex((next + total) % total)

  return (
    <div className="relative">
      <div className="absolute -inset-3 -rotate-2 bg-secondary-accent" aria-hidden="true" />
      <div
        className="relative overflow-hidden border-2 border-headline bg-background"
        role="group"
        aria-roledescription="carousel"
        aria-label="Experience photo gallery"
      >
        <img src={current.src} alt={current.alt} width={1280} height={960} className="aspect-[4/3] w-full object-cover" />
        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
            >
              <ChevronRightIcon />
            </button>
          </>
        ) : null}
      </div>
      {total > 1 ? (
        <div className="relative mt-5 flex flex-wrap items-center gap-3">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Show photo ${imageIndex + 1}`}
              aria-current={imageIndex === index ? 'true' : undefined}
              className={`size-16 overflow-hidden border-2 border-headline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring ${imageIndex === index ? 'shadow-[4px_4px_0_var(--color-primary-accent)]' : 'opacity-70'}`}
            >
              <img src={image.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <span className="ml-auto font-display text-lg font-black uppercase text-headline">
            {index + 1} / {total}
          </span>
        </div>
      ) : null}
    </div>
  )
}

function ReviewCard({ review }: { review: ExperienceDetailModel['reviews'][number] }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.quote.length > REVIEW_LIMIT
  const shown = !isLong || expanded ? review.quote : `${review.quote.slice(0, REVIEW_LIMIT).trimEnd()}…`

  return (
    <article className="flex h-full flex-col border-2 border-headline bg-background p-6 shadow-[7px_7px_0_var(--color-headline)]">
      <p className="flex-1 text-base leading-relaxed">{shown}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-3 self-start font-display text-sm font-black uppercase text-primary-accent underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring"
        >
          {expanded ? 'Show less' : 'Read full review'}
        </button>
      ) : null}
      <p className="mt-6 border-t-2 border-headline pt-3 font-display text-xl font-black uppercase text-headline">{review.name}</p>
    </article>
  )
}

export function ExperienceDetail({
  page,
  awards,
}: {
  page: ExperienceDetailModel
  awards: readonly { year: string; src: string }[]
}) {
  const showIntroduction = Boolean(
    page.gallery.length || page.intro || page.description || page.details.length || page.introduction,
  )
  const showPractical = Boolean(
    page.tips.length || page.visitorInfo || page.accessibilityInfo || page.cancellation,
  )
  const awardsToShow = page.awardImages.length
    ? page.awardImages.map((image) => ({ key: image.src, src: image.src, alt: image.alt }))
    : awards.map((award) => ({
        key: award.year,
        src: award.src,
        alt: `TripAdvisor Travellers' Choice Award ${award.year}`,
      }))

  return (
    <>
      <section id="experience-hero" className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden bg-headline">
        {page.hero ? (
          <img src={page.hero.src} alt={page.hero.alt} width={1920} height={1080} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          {page.badge === 'limited' ? (
            <p className="mb-6">
              <span className="inline-block -rotate-3 rounded-full border-2 border-background bg-primary-accent px-3 py-1 font-display text-xs font-black uppercase text-primary-foreground">
                Limited Time
              </span>
            </p>
          ) : null}
          {page.badge === 'signature' ? (
            <p className="mb-6 font-accent text-xl italic text-secondary-accent">Ontario&apos;s Southwest Signature Experience</p>
          ) : null}
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {page.titleLead ? `${page.titleLead} ` : ''}
            <span className="text-secondary-accent">{page.titleAccent}</span>
          </h1>
          {page.intro ? <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">{page.intro}</p> : null}
        </Container>
      </section>

      {page.showAwards ? (
      <section aria-label="TripAdvisor awards" className="border-y-2 border-headline bg-farm-beige py-6">
        <Container width="brand" className="flex max-w-[1500px] flex-col items-center gap-5 md:flex-row md:justify-between">
          <div className="text-center md:max-w-[24rem] md:text-left">
            <p className="font-display text-lg font-black uppercase leading-tight text-headline">{page.awardsTitle}</p>
            <p className="mt-1 text-sm font-semibold">{page.awardsTagline}</p>
          </div>
          <ul className="grid w-full max-w-72 grid-cols-2 place-items-center gap-5 md:flex md:w-auto md:max-w-none md:gap-7">
            {awardsToShow.map((award, index) => (
              <li key={award.key} className={index % 2 === 0 ? '-rotate-3' : 'rotate-3'}>
                <img src={award.src} alt={award.alt} width={1080} height={1080} loading="lazy" className="size-28 rounded-full border-2 border-headline object-cover shadow-[3px_3px_0_var(--color-headline)] md:size-24" />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      ) : null}
      {page.bookingOverlay ? <script src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes" async /> : null}

      {showIntroduction ? (
        <section id="experience-introduction" className="scroll-mt-20 overflow-hidden bg-background py-20 md:py-28">
          <Container width="brand" className="max-w-[1400px]">
            <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
              {page.gallery.length ? <Gallery images={page.gallery} /> : null}
              <div>
                {page.introduction ? (
                  <Lines lead={page.introduction.lead} accent={page.introduction.accent} className="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline" />
                ) : null}
                {page.description ? (
                  <div className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">
                    <PortableTextRenderer value={page.description} />
                  </div>
                ) : null}
                <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
              </div>
            </div>
            {page.details.length ? (
              <div className="mt-16">
                <h3 className="font-display text-2xl font-black uppercase text-headline">Experience Details</h3>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {page.details.map((detail, index) => (
                    <li key={detail.label} className={`border-2 border-headline bg-background p-4 shadow-[6px_6px_0_var(--color-headline)] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
                      <span className="font-display text-sm font-black uppercase tracking-wide text-primary-accent">{detail.label}</span>
                      <span className="mt-1 block font-display text-xl font-black uppercase leading-tight text-headline">
                        {detail.lines.map((line) => <span key={line} className="block">{line}</span>)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {showPractical ? (
        <section id="important-information" className="overflow-hidden bg-farm-beige py-20 md:py-28">
          <Container width="brand" className="max-w-[1400px]">
            {page.practical ? (
              <Lines lead={page.practical.lead} accent={page.practical.accent} className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.8] text-headline" />
            ) : null}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {page.tips.length || page.visitorInfo || page.accessibilityInfo ? (
                <div className="-rotate-1 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-secondary-accent)] md:p-9">
                  <span className="inline-block -rotate-2 bg-secondary-accent px-3 py-1 font-display text-sm font-black uppercase text-headline">Things to know</span>
                  {page.tips.length ? (
                    <ul className="mt-6 space-y-4">
                      {page.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-3 text-base leading-relaxed">
                          <span aria-hidden="true" className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-headline bg-farm-beige font-display text-sm font-black text-headline">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {page.visitorInfo ? <div className="mt-6 text-base leading-relaxed"><PortableTextRenderer value={page.visitorInfo} /></div> : null}
                  {page.accessibilityInfo ? (
                    <div className="mt-6 text-base leading-relaxed">
                      <h3 className="font-display text-lg font-black uppercase text-headline">Accessibility</h3>
                      <PortableTextRenderer value={page.accessibilityInfo} />
                    </div>
                  ) : null}
                </div>
              ) : null}
              {page.cancellation ? (
                <div className="rotate-1 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-primary-accent)] md:p-9">
                  <span className="inline-block bg-primary-accent px-3 py-1 font-display text-sm font-black uppercase text-primary-foreground">Cancellation policy</span>
                  <h3 className="mt-6 font-display text-lg font-black uppercase text-headline">{page.cancellation.heading?.trim() || 'Cancellation policy'}</h3>
                  <div className="mt-4 text-base leading-relaxed">
                    <PortableTextRenderer value={page.cancellation.content} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-12 flex justify-center">
              <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
            </div>
          </Container>
        </section>
      ) : null}

      {page.faqs.length ? (
        <section id="faqs" className="bg-background py-20 md:py-28">
          <Container width="brand" className="max-w-3xl">
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] font-black uppercase leading-[0.85] text-headline">{page.faqsHeading}</h2>
            <div className="mt-8 divide-y-2 divide-headline border-2 border-headline bg-background">
              {page.faqs.map((faq) => (
                <details key={faq.id} className="group p-5">
                  <summary className="cursor-pointer list-none font-display text-xl font-black uppercase text-headline">
                    {faq.question}
                  </summary>
                  <div className="pt-3 text-base leading-relaxed">
                    <PortableTextRenderer value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {page.reviews.length ? (
        <section id="reviews" className="overflow-hidden bg-farm-blue py-20 md:py-28">
          <Container width="brand" className="max-w-[1500px]">
            <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">{page.reviewsHeading}</h2>
            <div className="mt-14">
              <ScrollCarousel label="Guest reviews" itemClassName="w-[85%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                {page.reviews.map((review) => (
                  <ReviewCard key={`${review.name}-${review.quote.slice(0, 24)}`} review={review} />
                ))}
              </ScrollCarousel>
            </div>
            <div className="mt-10 flex justify-center">
              <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
            </div>
          </Container>
        </section>
      ) : null}

      {page.animals.length ? (
        <section id="meet-the-animals" className="overflow-hidden bg-background py-20 md:py-28">
          <Container width="brand" className="max-w-[1500px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <Lines lead={page.animalsHeading.lead} accent={page.animalsHeading.accent} accentClassName="text-primary-accent" className="font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline" />
              <p className="max-w-md border-l-4 border-primary-accent pl-5 text-lg font-semibold">{page.animalsIntro}</p>
            </div>
            <div className="mt-14">
              <ScrollCarousel label="Meet the animals" itemClassName="w-[85%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                {page.animals.map((animal, index) => (
                  <article key={animal.name} className={`h-full border-2 border-headline bg-background p-3 shadow-[10px_10px_0_var(--color-headline)] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
                    {animal.image ? <Photo image={animal.image} className="aspect-square w-full border-2 border-headline object-cover" /> : null}
                    <div className="p-4">
                      <h3 className="font-display text-4xl font-black uppercase leading-none text-headline">{animal.name}</h3>
                      {animal.lines.map((line) => <p key={line} className="mt-2 font-accent text-lg italic leading-snug">{line}</p>)}
                    </div>
                  </article>
                ))}
              </ScrollCarousel>
            </div>
          </Container>
        </section>
      ) : null}

      {page.instructor ? (
        <section id="your-instructor" className="bg-farm-beige py-20 md:py-28">
          <Container width="brand" className="grid max-w-[1300px] items-center gap-14 lg:grid-cols-2">
            {page.instructor.images.length > 1 ? (
              <Gallery images={page.instructor.images} />
            ) : page.instructor.images[0] ? (
              <Photo image={page.instructor.images[0]} className="aspect-[4/5] w-full border-2 border-headline object-cover" />
            ) : null}
            <div>
              <p className="font-accent text-xl italic text-primary-accent">Your teacher for the hour</p>
              <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">{page.instructor.heading}</h2>
              {page.instructor.paragraphs.map((paragraph) => <p key={paragraph} className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">{paragraph}</p>)}
            </div>
          </Container>
        </section>
      ) : null}

      {page.welfare ? (
        <section id="welfare" className="relative overflow-hidden bg-farm-blue py-20 md:py-28">
          <Container width="brand" className="grid max-w-[1300px] items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <Lines lead={page.welfare.lead} accent={page.welfare.accent} className="font-display text-[clamp(2.8rem,8vw,6rem)] font-black uppercase leading-[0.78] text-headline lg:col-start-1 lg:row-start-1" />
            {page.welfare.image ? (
              <figure className="relative m-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
                <Photo image={page.welfare.image} className="aspect-[4/5] w-full rotate-1 border-2 border-headline object-cover shadow-[12px_12px_0_var(--color-background)]" />
              </figure>
            ) : null}
            <div className="flex flex-col border-2 border-headline bg-background p-7 text-left shadow-[12px_12px_0_var(--color-headline)] md:p-9 lg:col-start-1 lg:row-start-2">
              {page.welfare.paragraphs.map((paragraph) => <p key={paragraph} className="text-base leading-relaxed md:text-lg">{paragraph}</p>)}
              {page.welfare.policy ? (
                <div className="mt-6 text-base leading-relaxed md:text-lg">
                  <PortableTextRenderer value={page.welfare.policy.content} />
                </div>
              ) : null}
              <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
            </div>
          </Container>
        </section>
      ) : null}

      {page.signature ? (
        <section id="signature-experience" className="bg-background py-20 md:py-28">
          <Container width="brand" className="grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="font-accent text-xl italic text-primary-accent">{page.signature.kicker}</p>
              <Lines lead={page.signature.lead} accent={page.signature.accent} className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline" />
              {page.signature.paragraphs.map((paragraph) => <p key={paragraph} className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{paragraph}</p>)}
              {page.signature.href ? <ButtonLink href={page.signature.href} external className="mt-8">Ontario&apos;s Southwest</ButtonLink> : null}
              <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
            </div>
            {page.signature.image ? <Photo image={page.signature.image} className="mx-auto h-auto w-full max-w-sm" /> : null}
          </Container>
        </section>
      ) : null}

      {page.feast ? (
        <section id="feast-on" className="bg-farm-beige py-20 md:py-28">
          <Container width="brand" className="grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            <div className="order-2 lg:order-1">
              <p className="font-accent text-xl italic text-primary-accent">{page.feast.kicker}</p>
              <Lines lead={page.feast.lead} accent={page.feast.accent} className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline" />
              {page.feast.paragraphs.map((paragraph, index) => (
                <p key={paragraph} className={`${index === 0 ? 'mt-6' : 'mt-4'} max-w-xl text-base leading-relaxed md:text-lg`}>{paragraph}</p>
              ))}
              <BookLink href={page.bookingUrl} label={page.bookingLabel} overlay={page.bookingOverlay} />
            </div>
            {page.feast.image && page.feast.href ? (
              <a href={page.feast.href} target="_blank" rel="noreferrer" className="order-1 mx-auto block w-full max-w-sm lg:order-2">
                <Photo image={page.feast.image} className="h-auto w-full" />
              </a>
            ) : null}
          </Container>
        </section>
      ) : null}

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
              <button type="button" disabled className="mt-2 justify-self-center rounded-full bg-cta px-8 py-3 font-display font-extrabold uppercase">Sign me up</button>
            </form>
            <p className="mt-4 font-accent text-lg italic text-primary-accent">{page.newsletter.unavailable}</p>
          </div>
        </Container>
      </section>

      <section id="location" className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.location.headingLead}
            <br />
            <span className="text-stroke">{page.location.headingAccent}</span>
          </h2>
          <p className="mt-5 max-w-md border-l-4 border-primary-accent pl-5 text-lg font-semibold">{page.location.note}</p>
          <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_2fr]">
            <div className="border-2 border-headline bg-background p-7 shadow-[10px_10px_0_var(--color-headline)]">
              <p className="font-display text-3xl font-black uppercase leading-none text-headline">{towerOfGoatsLocation.name}</p>
              <address className="mt-5 not-italic leading-relaxed">
                {towerOfGoatsLocation.lines.map((line) => <span key={line} className="block">{line}</span>)}
              </address>
              <ButtonLink href={towerOfGoatsLocation.directionsHref} external className="mt-7">Get directions</ButtonLink>
            </div>
            <iframe title={towerOfGoatsLocation.mapTitle} src={towerOfGoatsLocation.mapSrc} loading="lazy" className="h-[420px] w-full border-2 border-headline md:h-[520px]" />
          </div>
        </Container>
      </section>
    </>
  )
}
