import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { SharedProgramPage } from '@/lib/corporate/model'

import { CheckList, CopyBlock, CorporateAwardsStrip, CorporateCloseSections, CorporateHero, DisplayHeading } from './sections'
import { ClockIcon } from './icons'

export function SharedCorporateProgram({ page }: { page: SharedProgramPage }) {
  return (
    <>
      <CorporateHero lead={page.hero.lead} accent={page.hero.accent} intro={page.hero.intro} image={page.hero.image} />
      <CorporateAwardsStrip awards={page.awards} />
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <figure className="relative m-0">
              <div className="absolute -inset-3 rotate-2 bg-secondary-accent" aria-hidden="true" />
              <img
                src={page.introduction.image.src}
                alt={page.introduction.image.alt}
                width={1280}
                height={960}
                loading="lazy"
                className="relative aspect-[4/3] w-full border-2 border-headline object-cover"
              />
            </figure>
            <div>
              <DisplayHeading
                lead={page.introduction.lead}
                accent={page.introduction.accent}
                accentClassName="text-stroke"
                className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-black uppercase leading-[0.85] text-headline"
              />
              <CopyBlock paragraphs={page.introduction.paragraphs} richText={page.introduction.richText} />
              <ButtonLink href={page.introduction.ctaHref} size="lg" className="mt-8">
                {page.introduction.ctaLabel} <ArrowRightIcon />
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
      <section className="overflow-hidden bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.outcomes.heading}
          </h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
              <h3 className="font-display text-2xl font-black uppercase leading-tight text-headline">Learning outcomes</h3>
              <CheckList items={page.outcomes.items} />
            </article>
            <div className="space-y-10">
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-farm-beige text-primary-accent shadow-[4px_4px_0_var(--color-headline)]">
                  <ClockIcon />
                </span>
                <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight text-headline">
                  {page.outcomes.durationTitle}
                </h3>
                <p className="mt-3 text-base leading-relaxed">{page.outcomes.durationBody}</p>
              </article>
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <h3 className="font-display text-2xl font-black uppercase leading-tight text-headline">
                  {page.outcomes.enhancementsTitle}
                </h3>
                <CopyBlock paragraphs={[page.outcomes.enhancementsBody]} richText={page.outcomes.enhancementsRich} />
              </article>
            </div>
          </div>
        </Container>
      </section>
      <CorporateCloseSections close={page.close} />
    </>
  )
}
