import { useState, type ReactNode } from 'react'

import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { Button, ButtonLink } from '@/components/ui/button'
import type {
  CorporateAwards,
  CorporateClose,
  CorporateEnquiry,
  CorporatePicture,
  CredentialIcon,
  AudienceIcon,
  FacilityIcon,
  PracticalIcon,
} from '@/lib/corporate/model'
import { towerOfGoatsLocation } from '@/lib/experiences/tower-of-goats'
import type { PortableTextContent } from '@/lib/sanity/types'

import {
  AwardIcon,
  BriefcaseIcon,
  BuildingIcon,
  CarIcon,
  CheckIcon,
  ClockIcon,
  CoffeeIcon,
  EyeIcon,
  GlobeIcon,
  HeartIcon,
  HotelIcon,
  LandmarkIcon,
  MegaphoneIcon,
  MonitorIcon,
  PaletteIcon,
  PuzzleIcon,
  SlidersIcon,
  SparklesIcon,
  StarGlyphIcon,
  ThumbsUpIcon,
  TractorIcon,
  TreesIcon,
  UsersIcon,
  UtensilsIcon,
  WineIcon,
} from './icons'

const headingClass =
  'font-display font-black uppercase leading-[0.85] text-headline'

export function DisplayHeading({
  lead,
  accent,
  accentClassName = 'text-secondary-accent',
  className,
  as: Tag = 'h2',
}: {
  lead: string
  accent?: string
  accentClassName?: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <Tag className={className ?? headingClass}>
      {lead}
      {accent ? (
        <>
          {' '}
          <span className={accentClassName}>{accent}</span>
        </>
      ) : null}
    </Tag>
  )
}

export function CorporateHero({
  lead,
  accent,
  intro,
  image,
  titleClassName = 'font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.85] text-background',
}: {
  lead: string
  accent?: string
  intro?: string
  image: CorporatePicture
  titleClassName?: string
}) {
  return (
    <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
      <img
        src={image.src}
        alt={image.alt}
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
      <Container width="brand" className="max-w-5xl py-24 text-center md:py-32">
        <DisplayHeading as="h1" lead={lead} accent={accent} className={titleClassName} />
        {intro ? (
          <p className="mx-auto mt-7 max-w-3xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {intro}
          </p>
        ) : null}
      </Container>
    </section>
  )
}

export function CorporateAwardsStrip({ awards }: { awards: CorporateAwards }) {
  if (!awards.show || !awards.images.length) return null
  return (
    <section aria-label="TripAdvisor awards" className="border-y-2 border-headline bg-farm-beige py-6">
      <Container width="brand" className="flex max-w-[1500px] flex-col items-center gap-5 md:flex-row md:justify-between">
        <div className="text-center md:max-w-[24rem] md:text-left">
          <p className="font-display text-lg font-black uppercase leading-tight text-headline">{awards.title}</p>
          <p className="mt-1 text-sm font-medium">{awards.tagline}</p>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {awards.images.map((image) => (
            <li key={image.src}>
              <img src={image.src} alt={image.alt} className="h-16 w-auto" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function PhotoCarousel({ images, label }: { images: CorporatePicture[]; label: string }) {
  const [index, setIndex] = useState(0)
  const total = images.length
  if (!total) return null
  const current = images[index] ?? images[0]!
  const go = (next: number) => setIndex((next + total) % total)

  return (
    <div className="relative">
      <div className="absolute -inset-3 -rotate-2 bg-secondary-accent" aria-hidden="true" />
      <div
        className="relative overflow-hidden border-2 border-headline bg-background"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
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
              key={`${image.src}-${imageIndex}`}
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

const inputClass =
  'border-2 border-headline bg-farm-beige px-4 py-3 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70'
const labelClass = 'font-display text-sm font-black uppercase tracking-wide text-headline'

export function CorporateEnquiryForm({ enquiry }: { enquiry: CorporateEnquiry }) {
  return (
    <form
      className="mt-10 border-2 border-headline bg-background p-6 shadow-[12px_12px_0_var(--color-headline)] md:p-10"
      onSubmit={(event) => event.preventDefault()}
      aria-describedby="corporate-enquiry-status"
    >
      <fieldset disabled className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Name</span>
          <input type="text" name="name" autoComplete="name" className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Email</span>
          <input type="email" name="email" autoComplete="email" className={inputClass} />
        </label>
        {enquiry.showPhone ? (
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Phone Number</span>
            <input type="tel" name="phone" autoComplete="tel" className={inputClass} />
          </label>
        ) : null}
        {enquiry.programOptions.length ? (
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Program Selection</span>
            <select name="program" defaultValue="" className={inputClass}>
              <option value="">Select a DiSC program</option>
              {enquiry.programOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className={labelClass}>Message</span>
          <textarea name="message" rows={6} className={inputClass} />
        </label>
      </fieldset>
      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button type="button" disabled size="lg">
          Send Message <ArrowRightIcon />
        </Button>
        <p id="corporate-enquiry-status" className="font-accent text-lg italic text-primary-accent">
          {enquiry.unavailable}
        </p>
      </div>
    </form>
  )
}

export function CopyBlock({
  paragraphs,
  richText,
}: {
  paragraphs: string[]
  richText?: PortableTextContent
}) {
  if (richText) {
    return (
      <div className="mt-6 text-base leading-relaxed md:text-lg">
        <PortableTextRenderer value={richText} />
      </div>
    )
  }
  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-base leading-relaxed first:mt-6 md:text-lg">
          {paragraph}
        </p>
      ))}
    </>
  )
}

const facilityIcons: Record<FacilityIcon, (props: { className?: string }) => ReactNode> = {
  capacity: UsersIcon,
  av: MonitorIcon,
  catering: CoffeeIcon,
  parking: CarIcon,
  outdoors: TreesIcon,
}

const practicalIcons: Record<PracticalIcon, (props: { className?: string }) => ReactNode> = {
  duration: ClockIcon,
  addons: PuzzleIcon,
  custom: SlidersIcon,
}

const credentialIcons: Record<CredentialIcon, (props: { className?: string }) => ReactNode> = {
  award: AwardIcon,
  star: StarGlyphIcon,
  people: UsersIcon,
  reviews: ThumbsUpIcon,
  sparkle: SparklesIcon,
  heart: HeartIcon,
  views: EyeIcon,
  media: MegaphoneIcon,
  business: BriefcaseIcon,
  experience: LandmarkIcon,
}

const audienceIcons: Record<AudienceIcon, (props: { className?: string }) => ReactNode> = {
  farm: TractorIcon,
  stay: HotelIcon,
  restaurant: UtensilsIcon,
  artisan: PaletteIcon,
  museum: BuildingIcon,
  beverage: WineIcon,
  specialist: GlobeIcon,
}

export function FacilityIcon({ name }: { name: FacilityIcon }) {
  const Glyph = facilityIcons[name]
  return <Glyph />
}

export function PracticalIcon({ name }: { name: PracticalIcon }) {
  const Glyph = practicalIcons[name]
  return <Glyph />
}

export function CredentialIcon({ name, className }: { name: CredentialIcon; className?: string }) {
  const Glyph = credentialIcons[name]
  return <Glyph className={className} />
}

export function AudienceIcon({ name }: { name: AudienceIcon }) {
  const Glyph = audienceIcons[name]
  return <Glyph />
}

export function CorporateCloseSections({ close }: { close: CorporateClose }) {
  return (
    <>
      {close.reviews ? (
        <section id="reviews" className="overflow-hidden bg-farm-blue py-20 md:py-28">
          <Container width="brand" className="max-w-[1500px]">
            <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">
              {close.reviews.heading}
            </h2>
            <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {close.reviews.items.map((review) => (
                <li key={`${review.name}-${review.quote.slice(0, 24)}`} className="flex h-full flex-col border-2 border-headline bg-background p-6 shadow-[7px_7px_0_var(--color-headline)]">
                  <p className="flex-1 text-base leading-relaxed">{review.quote}</p>
                  <p className="mt-6 border-t-2 border-headline pt-3 font-display text-xl font-black uppercase text-headline">
                    {review.name}
                  </p>
                </li>
              ))}
            </ul>
            {close.reviews.ctaLabel && close.reviews.ctaHref ? (
              <div className="mt-10 flex justify-center">
                <ButtonLink href={close.reviews.ctaHref} variant="outline">
                  {close.reviews.ctaLabel}
                </ButtonLink>
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {close.facilitator ? (
        <section className="overflow-hidden bg-background py-20 md:py-28">
          <Container width="brand" className="max-w-[1300px]">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <figure className="relative m-0">
                <div className="absolute -inset-3 -rotate-2 bg-secondary-accent" aria-hidden="true" />
                <img
                  src={close.facilitator.image.src}
                  alt={close.facilitator.image.alt}
                  width={1080}
                  height={1200}
                  loading="lazy"
                  className="relative aspect-[4/5] w-full border-2 border-headline object-cover"
                />
              </figure>
              <div>
                <p className="font-accent text-xl italic text-primary-accent">{close.facilitator.eyebrow}</p>
                <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
                  {close.facilitator.title}
                </h2>
                <p className="mt-6 text-base leading-relaxed md:text-lg">{close.facilitator.body}</p>
                <ButtonLink href={close.facilitator.ctaHref} size="lg" className="mt-8">
                  {close.facilitator.ctaLabel} <ArrowRightIcon />
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {close.environment ? (
        <section aria-label={close.environment.label} className="relative min-h-[80vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-fixed bg-center"
            style={{ backgroundImage: `url(${close.environment.image.src})` }}
            aria-hidden="true"
          />
          <img src={close.environment.image.src} alt={close.environment.image.alt} width={1920} height={1080} loading="lazy" className="sr-only" />
          <div className="absolute inset-0 bg-headline/50" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-[80vh] max-w-4xl items-center px-5 py-24 text-center md:px-8">
            <div>
              <DisplayHeading
                lead={close.environment.lead}
                accent={close.environment.accent}
                className="font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-black uppercase leading-[0.82] text-background"
              />
              <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
                {close.environment.body}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {close.facility ? (
        <section className="overflow-hidden bg-farm-beige py-20 md:py-28">
          <Container width="brand" className="max-w-[1400px]">
            <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.05fr]">
              <div>
                <DisplayHeading
                  lead={close.facility.lead}
                  accent={close.facility.accent}
                  accentClassName="text-stroke"
                  className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-black uppercase leading-[0.85] text-headline"
                />
                <ul className="mt-10 space-y-7">
                  {close.facility.items.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-headline bg-background text-primary-accent shadow-[4px_4px_0_var(--color-headline)]">
                        <FacilityIcon name={item.icon} />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-black uppercase leading-tight text-headline">{item.title}</h3>
                        <p className="mt-2 text-base leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <PhotoCarousel images={close.facility.gallery} label="Training facility photos" />
            </div>
          </Container>
        </section>
      ) : null}

      <section id="contact" className="scroll-mt-20 overflow-hidden bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1000px]">
          <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {close.enquiry.heading}
          </h2>
          {close.enquiry.body ? (
            <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">{close.enquiry.body}</p>
          ) : null}
          <CorporateEnquiryForm enquiry={close.enquiry} />
        </Container>
      </section>
      <CorporateLocation />
    </>
  )
}

export function CorporateLocation() {
  return (
    <section id="location" className="bg-farm-beige py-20 md:py-28">
      <Container width="brand" className="max-w-[1500px]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {towerOfGoatsLocation.headingLead}
            <br />
            <span className="text-stroke">{towerOfGoatsLocation.headingAccent}</span>
          </h2>
          <p className="max-w-md border-l-4 border-primary-accent pl-5 text-lg font-semibold">
            {towerOfGoatsLocation.note}
          </p>
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_2fr]">
          <div className="border-2 border-headline bg-background p-7 shadow-[10px_10px_0_var(--color-headline)]">
            <p className="font-display text-3xl font-black uppercase leading-none text-headline">
              {towerOfGoatsLocation.name}
            </p>
            <address className="mt-5 not-italic leading-relaxed">
              {towerOfGoatsLocation.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <ButtonLink href={towerOfGoatsLocation.directionsHref} external className="mt-7">
              Get directions <ArrowRightIcon />
            </ButtonLink>
          </div>
          <iframe
            title={towerOfGoatsLocation.mapTitle}
            src={towerOfGoatsLocation.mapSrc}
            loading="lazy"
            className="h-[420px] w-full border-2 border-headline md:h-[520px]"
          />
        </div>
      </Container>
    </section>
  )
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed">
          <CheckIcon className="mt-1 size-5 shrink-0 text-primary-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
