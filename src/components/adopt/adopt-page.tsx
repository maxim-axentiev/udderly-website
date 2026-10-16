import type { ReactNode } from 'react'

import { Button, ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { ADOPT_PAGE } from '@/lib/adopt/content'
import type { AdoptionCard } from '@/lib/adopt/resolve'
import type { AdoptionPageCopy } from '@/lib/adopt/resolve'

export type AdoptImages = {
  hero: string
  sponsor: string
  support: string
  cards: Record<AdoptionCard['imageKey'], string>
  awards: readonly { year: string; src: string }[]
}

export function AdoptPage({
  copy,
  cards,
  images,
  newsletter,
}: {
  copy: AdoptionPageCopy
  cards: readonly AdoptionCard[]
  images: AdoptImages
  newsletter?: ReactNode
}) {
  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
        <img
          src={images.hero}
          alt={ADOPT_PAGE.heroAlt}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {ADOPT_PAGE.heroLead} <span className="text-secondary-accent">{ADOPT_PAGE.heroAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {copy.intro}
          </p>
        </Container>
      </section>

      <section aria-label="TripAdvisor awards" className="border-y-2 border-headline bg-farm-beige py-6">
        <Container width="brand" className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <div className="text-center md:max-w-[24rem] md:text-left">
            <p className="font-display text-lg font-black uppercase leading-tight text-headline">
              TripAdvisor Travellers&apos; Choice
            </p>
            <p className="mt-1 text-sm font-semibold">{copy.awardsTagline}</p>
          </div>
          <ul className="grid w-full max-w-72 grid-cols-2 place-items-center gap-5 md:flex md:w-auto md:max-w-none md:gap-7">
            {images.awards.map((award) => (
              <li key={award.year}>
                <img
                  src={award.src}
                  alt={`TripAdvisor Travellers' Choice Award ${award.year}`}
                  width={1080}
                  height={1080}
                  loading="lazy"
                  className="size-28 rounded-full border-2 border-headline object-cover md:size-24"
                />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1400px] items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
          <img
            src={images.sponsor}
            alt={ADOPT_PAGE.sponsorImageAlt}
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full rotate-1 border-2 border-headline object-cover shadow-[12px_12px_0_var(--color-secondary-accent)]"
          />
          <div>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
              {ADOPT_PAGE.sponsorLead}
              <br />
              <span className="text-stroke">{ADOPT_PAGE.sponsorAccent}</span>
            </h2>
            {copy.sponsorParagraphs.map((paragraph) => (
              <p key={paragraph} className="mt-6 text-base leading-relaxed md:text-lg">
                {paragraph}
              </p>
            ))}
            <p className="mt-6 inline-block border-l-4 border-primary-accent pl-5 font-display text-lg font-black uppercase text-headline">
              {ADOPT_PAGE.sponsorNote}
            </p>
          </div>
        </Container>
      </section>

      <section id="available-animals" className="scroll-mt-20 overflow-hidden bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="text-center font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline">
            {ADOPT_PAGE.animalsHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed">{copy.animalsIntro}</p>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((animal, index) => (
              <li key={animal.slug}>
                <article
                  className={`flex h-full flex-col border-2 border-headline bg-background p-3 shadow-[10px_10px_0_var(--color-headline)] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                >
                  <img
                    src={images.cards[animal.imageKey]}
                    alt={animal.alt}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full border-2 border-headline object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-display text-4xl font-black uppercase leading-none text-headline">
                      {animal.name}
                    </h3>
                    <p className="mt-2 flex-1 font-accent text-lg italic leading-snug">{animal.blurb}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <ButtonLink href={animal.href} variant="outline">
                        Learn More
                      </ButtonLink>
                      <Button type="button" aria-disabled="true">
                        Adopt {animal.name}
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-farm-blue py-20 md:py-28">
        <div className="farm-dots absolute -left-10 top-10 h-40 w-40 opacity-20" aria-hidden="true" />
        <Container width="brand" className="grid max-w-[1300px] items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-display text-[clamp(2.8rem,8vw,6rem)] font-black uppercase leading-[0.78] text-headline">
              {ADOPT_PAGE.supportLead}
              <br />
              {ADOPT_PAGE.supportAccent}
            </h2>
            <div className="mt-8 flex flex-col border-2 border-headline bg-background p-7 text-left shadow-[12px_12px_0_var(--color-headline)] md:p-9">
              {copy.supportParagraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed first:mt-0 md:text-lg">
                  {paragraph}
                </p>
              ))}
              <ButtonLink href="#available-animals" size="lg" className="mt-8 self-start">
                {ADOPT_PAGE.supportButton}
              </ButtonLink>
            </div>
          </div>
          <img
            src={images.support}
            alt={ADOPT_PAGE.supportImageAlt}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-[4/5] w-full -rotate-1 border-2 border-headline object-cover shadow-[12px_12px_0_var(--color-background)]"
          />
        </Container>
      </section>
      {newsletter}
    </>
  )
}
