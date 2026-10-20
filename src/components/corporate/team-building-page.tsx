import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { TeamBuildingPage } from '@/lib/corporate/model'

import { ShuffleIcon } from './icons'
import { CorporateAwardsStrip, CorporateCloseSections, CorporateHero, DisplayHeading } from './sections'

export function TeamBuildingProgram({ page }: { page: TeamBuildingPage }) {
  return (
    <>
      <CorporateHero lead={page.hero.lead} accent={page.hero.accent} intro={page.hero.intro} image={page.hero.image} />
      <CorporateAwardsStrip awards={page.awards} />
      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <DisplayHeading
            lead={page.headingLead}
            accent={page.headingAccent}
            accentClassName="text-stroke"
            className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline"
          />
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {page.activities.map((activity) => (
              <article
                key={activity.title}
                className="group flex flex-col border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)] transition-transform duration-200 hover:-translate-y-2"
              >
                <div className="overflow-hidden">
                  <img
                    src={activity.image.src}
                    alt={activity.image.alt}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3 pb-4">
                  <h3 className="font-display text-2xl font-black uppercase leading-none text-headline">{activity.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed">{activity.body}</p>
                  <ButtonLink href={activity.href} className="mt-5 w-full">
                    {activity.ctaLabel}
                  </ButtonLink>
                </div>
              </article>
            ))}
            <aside className="flex -rotate-1 flex-col justify-center border-4 border-dashed border-primary-accent bg-farm-beige p-8 text-center">
              <ShuffleIcon className="mx-auto size-12 text-primary-accent" />
              <h3 className="mt-5 font-display text-3xl font-black uppercase leading-none text-headline">{page.mix.title}</h3>
              <p className="mt-4 text-base leading-relaxed">{page.mix.body}</p>
              <ButtonLink href={page.mix.ctaHref} size="lg" className="mx-auto mt-6">
                {page.mix.ctaLabel} <ArrowRightIcon />
              </ButtonLink>
            </aside>
          </div>
        </Container>
      </section>
      <CorporateCloseSections close={page.close} />
    </>
  )
}
