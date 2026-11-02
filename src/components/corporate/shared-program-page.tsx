import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { SharedProgramPage } from '@/lib/corporate/model'

import { CheckList, CopyBlock, CorporateAwardsStrip, CorporateCloseSections, CorporateHero, DisplayHeading } from './sections'
import { ClockIcon } from './icons'

export function SharedCorporateProgram({ page }: { page: SharedProgramPage }) {
  const showIntro = Boolean(page.introduction.paragraphs.length || page.introduction.richText || page.introduction.image.src)
  const showOutcomes = page.outcomes.items.length > 0
  const showDuration = Boolean(page.outcomes.durationBody)
  const showEnhancements = Boolean(page.outcomes.enhancementsBody || page.outcomes.enhancementsRich)
  const showTakeaway = showOutcomes || showDuration || showEnhancements

  return (
    <>
      <CorporateHero lead={page.hero.lead} accent={page.hero.accent} intro={page.hero.intro} image={page.hero.image} />
      <CorporateAwardsStrip awards={page.awards} />
      {showIntro ? (
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <div className={`grid items-center gap-12 ${page.introduction.image.src ? 'lg:grid-cols-2' : ''}`}>
            {page.introduction.image.src ? (
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
            ) : null}
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
      ) : null}
      {showTakeaway ? (
      <section className="overflow-hidden bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.outcomes.heading}
          </h2>
          <div className={`mt-14 grid gap-10 ${showOutcomes && (showDuration || showEnhancements) ? 'lg:grid-cols-2' : ''}`}>
            {showOutcomes ? (
            <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
              <h3 className="font-display text-2xl font-black uppercase leading-tight text-headline">Learning outcomes</h3>
              <CheckList items={page.outcomes.items} />
            </article>
            ) : null}
            {showDuration || showEnhancements ? (
            <div className="space-y-10">
              {showDuration ? (
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <span className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-farm-beige text-primary-accent shadow-[4px_4px_0_var(--color-headline)]">
                  <ClockIcon />
                </span>
                <h3 className="mt-5 font-display text-2xl font-black uppercase leading-tight text-headline">
                  {page.outcomes.durationTitle}
                </h3>
                <p className="mt-3 text-base leading-relaxed">{page.outcomes.durationBody}</p>
              </article>
              ) : null}
              {showEnhancements ? (
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <h3 className="font-display text-2xl font-black uppercase leading-tight text-headline">
                  {page.outcomes.enhancementsTitle}
                </h3>
                <CopyBlock paragraphs={page.outcomes.enhancementsBody ? [page.outcomes.enhancementsBody] : []} richText={page.outcomes.enhancementsRich} />
              </article>
              ) : null}
            </div>
            ) : null}
          </div>
        </Container>
      </section>
      ) : null}
      <CorporateCloseSections close={page.close} />
    </>
  )
}
