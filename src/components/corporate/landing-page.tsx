import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { CorporateLandingPage } from '@/lib/corporate/model'

import {
  CorporateAwardsStrip,
  CorporateCloseSections,
  CorporateHero,
  DisplayHeading,
  PhotoCarousel,
} from './sections'

export function CorporateLanding({ page }: { page: CorporateLandingPage }) {
  return (
    <>
      <CorporateHero
        lead={page.hero.lead}
        accent={page.hero.accent}
        intro={page.hero.intro}
        image={page.hero.image}
        titleClassName="font-display text-[clamp(2.4rem,6.5vw,5.6rem)] font-black uppercase leading-[0.85] text-background"
      />
      <CorporateAwardsStrip awards={page.awards} />
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
            <PhotoCarousel images={page.introduction.gallery} label="Corporate training photos" />
            <div>
              <DisplayHeading
                lead={page.introduction.lead}
                accent={page.introduction.accent}
                accentClassName="text-stroke"
                className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-black uppercase leading-[0.85] text-headline"
              />
              {page.introduction.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed first:mt-6 md:text-lg">
                  {paragraph}
                </p>
              ))}
              <p className="mt-8 inline-block -rotate-1 border-2 border-headline bg-secondary-accent px-4 py-2 font-display text-lg font-black uppercase text-headline shadow-[5px_5px_0_var(--color-headline)]">
                {page.introduction.badge}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="training-programs" className="scroll-mt-20 overflow-hidden bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.programsHeading}
          </h2>
          {page.featured ? (
            <article className="relative mt-14 grid items-center gap-8 border-4 border-headline bg-primary-accent p-4 shadow-[16px_16px_0_var(--color-headline)] lg:grid-cols-2 lg:gap-12 lg:p-6">
              <img
                src={page.featured.image.src}
                alt={page.featured.image.alt}
                width={1280}
                height={860}
                loading="lazy"
                className="aspect-[16/10] w-full border-2 border-headline object-cover"
              />
              <div className="text-primary-foreground lg:pr-6">
                <span className="inline-block -rotate-2 border-2 border-headline bg-secondary-accent px-3 py-1 font-display text-sm font-black uppercase text-headline">
                  {page.featured.eyebrow}
                </span>
                <h3 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] font-black uppercase leading-[0.85]">
                  {page.featured.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed md:text-lg">{page.featured.body}</p>
                <ButtonLink href={page.featured.href} size="lg" variant="outline" className="mt-7">
                  {page.featured.ctaLabel} <ArrowRightIcon />
                </ButtonLink>
              </div>
            </article>
          ) : null}
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {page.cards.map((card) => (
              <article
                key={card.href}
                className="group relative flex flex-col border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)] transition-transform duration-200 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={card.image.src}
                    alt={card.image.alt}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3 pb-4">
                  <h3 className="font-display text-2xl font-black uppercase leading-none text-headline">{card.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed">{card.body}</p>
                  <ButtonLink href={card.href} variant="outline" className="mt-5 w-full">
                    {card.ctaLabel}
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>
          {page.tourism ? (
            <article className="relative mt-14 grid items-center gap-8 border-4 border-dashed border-primary-accent bg-background p-4 shadow-[14px_14px_0_var(--color-secondary-accent)] lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-6">
              <img
                src={page.tourism.image.src}
                alt={page.tourism.image.alt}
                width={1280}
                height={860}
                loading="lazy"
                className="aspect-[16/10] w-full border-2 border-headline object-cover"
              />
              <div>
                <span className="inline-block rotate-1 border-2 border-headline bg-primary-accent px-3 py-1 font-display text-sm font-black uppercase text-primary-foreground">
                  {page.tourism.eyebrow}
                </span>
                <h3 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-black uppercase leading-[0.85] text-headline">
                  {page.tourism.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed md:text-lg">{page.tourism.body}</p>
                <ButtonLink href={page.tourism.href} size="lg" className="mt-7">
                  {page.tourism.ctaLabel} <ArrowRightIcon />
                </ButtonLink>
              </div>
            </article>
          ) : null}
        </Container>
      </section>
      <CorporateCloseSections close={page.close} />
    </>
  )
}
