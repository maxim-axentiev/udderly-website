import type { ReactNode } from 'react'

import { ArrowRightIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/button'
import type { AboutCta, AboutPicture } from '@/lib/about/model'

const headingClass = 'font-display font-black uppercase leading-[0.85] text-headline'

export function SplitHeading({
  lead,
  accent,
  className,
  as: Tag = 'h2',
}: {
  lead: string
  accent?: string
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <Tag className={className ?? headingClass}>
      {lead}
      {accent ? (
        <>
          {' '}
          <span className="text-secondary-accent">{accent}</span>
        </>
      ) : null}
    </Tag>
  )
}

export function AboutHero({
  lead,
  accent,
  intro,
  image,
  titleClassName = 'font-display text-[clamp(2.6rem,7.5vw,6.5rem)] font-black uppercase leading-[0.82] text-background',
}: {
  lead: string
  accent?: string
  intro?: string
  image: AboutPicture
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
      <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8 md:py-32">
        <SplitHeading as="h1" lead={lead} accent={accent} className={titleClassName} />
        {intro ? (
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  )
}

export function BookExperienceBand({ cta }: { cta: AboutCta }) {
  return (
    <section className="relative overflow-hidden bg-farm-blue py-20 md:py-28">
      <div className="farm-dots absolute -right-10 top-10 h-28 w-28 -rotate-12 opacity-20" aria-hidden="true" />
      <div className="farm-dots absolute -left-12 bottom-8 h-24 w-24 rotate-12 opacity-20" aria-hidden="true" />
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.82] text-headline">
          {cta.heading}
        </h2>
        {cta.body ? <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed">{cta.body}</p> : null}
        <ButtonLink href={cta.href} size="lg" className="mt-9">
          {cta.label} <ArrowRightIcon />
        </ButtonLink>
      </div>
    </section>
  )
}

export function FramedPhoto({
  image,
  rotated,
  shadow = 'shadow-[12px_12px_0_var(--color-headline)]',
  dots,
}: {
  image: AboutPicture
  rotated: boolean
  shadow?: string
  dots?: ReactNode
}) {
  return (
    <div className={`relative ${rotated ? '-rotate-2' : 'rotate-2'}`}>
      <div className={`overflow-hidden border-2 border-headline ${shadow}`}>
        <img src={image.src} alt={image.alt} width={1000} height={750} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </div>
      {dots}
    </div>
  )
}

export function FilledHeart() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="fill-primary-accent text-primary-accent">
      <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
    </svg>
  )
}
