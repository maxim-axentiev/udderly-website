import { OptionalEmbed } from '@/components/consent/optional-embed'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import {
  towerOfGoatsFacts,
  towerOfGoatsLocation,
  towerOfGoatsPaceHeading,
  towerOfGoatsStories,
  towerOfGoatsStoriesHeading,
  TOWER_OF_GOATS_SUBTITLE,
  TOWER_OF_GOATS_TITLE,
} from '@/lib/experiences/tower-of-goats'

export function TowerOfGoatsPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden bg-headline">
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {TOWER_OF_GOATS_TITLE.split(' ')[0]}{' '}
            <span className="text-secondary-accent">{TOWER_OF_GOATS_TITLE.split(' ')[1]}</span>
          </h1>
          <p className="mt-5 font-display text-[clamp(1.3rem,3.5vw,2.4rem)] font-black uppercase leading-tight text-background">
            {TOWER_OF_GOATS_SUBTITLE}
          </p>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
            {towerOfGoatsPaceHeading}
          </h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {towerOfGoatsFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-display text-sm font-black uppercase text-headline">{fact.label}</dt>
                <dd className="mt-1 font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="overflow-hidden bg-farm-blue py-20 md:py-28" aria-labelledby="tower-stories-heading">
        <Container width="brand" className="max-w-[1100px]">
          <h2
            id="tower-stories-heading"
            className="text-center font-display text-[clamp(2.8rem,7.5vw,6rem)] font-black uppercase leading-[0.78] text-headline"
          >
            {towerOfGoatsStoriesHeading}
          </h2>
          <ul className="mt-14 flex snap-x gap-6 overflow-x-auto">
            {towerOfGoatsStories.map((story, index) => (
              <li key={story.title} className="w-full shrink-0 snap-start">
                <article className="h-full border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-headline)] md:p-12">
                  <p className="inline-block bg-secondary-accent px-3 py-1 font-display text-sm font-black uppercase text-headline">
                    {index + 1} of {towerOfGoatsStories.length}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(1.7rem,4vw,2.8rem)] font-black uppercase leading-[0.9] text-headline">
                    {story.title}
                  </h3>
                  <div className="mt-5 space-y-4">
                    {story.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-relaxed md:text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-farm-beige py-20 md:py-28" aria-labelledby="tower-location-heading">
        <Container width="brand">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h2
              id="tower-location-heading"
              className="max-w-3xl font-display text-[clamp(2.4rem,6.5vw,6rem)] font-black uppercase leading-[0.8] text-headline"
            >
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
                Get directions
              </ButtonLink>
            </div>
            <div className="overflow-hidden border-2 border-headline bg-background p-2 shadow-[10px_10px_0_var(--color-secondary-accent)]">
              <OptionalEmbed
                title={towerOfGoatsLocation.mapTitle}
                src={towerOfGoatsLocation.mapSrc}
                autoLoad actionLabel="Load map"
                description="This map is hosted by Google. It stays off until you load it. The address is listed beside this box."
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0 md:h-[520px]"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
