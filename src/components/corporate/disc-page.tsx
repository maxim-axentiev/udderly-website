import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { DiscPage } from '@/lib/corporate/model'

import { CheckIcon } from './icons'
import {
  CopyBlock,
  CorporateAwardsStrip,
  CorporateCloseSections,
  CorporateHero,
  DisplayHeading,
  PracticalIcon,
} from './sections'

export function DiscProgram({ page }: { page: DiscPage }) {
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
            {page.offeringsHeading}
          </h2>
          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {page.offerings.map((offering) => (
              <article key={offering.title} className="flex flex-col border-2 border-headline bg-background p-4 shadow-[10px_10px_0_var(--color-headline)] md:p-6">
                <img
                  src={offering.image.src}
                  alt={offering.image.alt}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="aspect-[16/10] w-full border-2 border-headline object-cover"
                />
                <h3 className="mt-6 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-black uppercase leading-[0.9] text-headline">
                  {offering.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed">{offering.body}</p>
                <p className="mt-6 font-display text-sm font-black uppercase tracking-wide text-primary-accent">Learning outcomes</p>
                <ul className="mt-3 flex-1 space-y-2">
                  {offering.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2 text-base leading-relaxed">
                      <CheckIcon className="mt-1 size-4 shrink-0 text-primary-accent" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={offering.ctaHref} size="lg" className="mt-7">
                  {offering.ctaLabel} <ArrowRightIcon />
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.8] text-headline">
            {page.practicalHeading}
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.practical.map((item, index) => (
              <li
                key={item.label}
                className={`border-2 border-headline bg-background p-4 shadow-[6px_6px_0_var(--color-headline)] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
              >
                <span className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wide text-primary-accent">
                  <PracticalIcon name={item.icon} /> {item.label}
                </span>
                {item.lines.map((line) => (
                  <span key={line} className="mt-1 block font-display text-xl font-black uppercase leading-tight text-headline">
                    {line}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CorporateCloseSections close={page.close} />
    </>
  )
}
