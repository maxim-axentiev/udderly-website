import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import {
  towerOfGoatsAwardsTagline,
  towerOfGoatsFacts,
  towerOfGoatsGallery,
  towerOfGoatsHeroAlt,
  towerOfGoatsLocation,
  towerOfGoatsPaceHeading,
  towerOfGoatsStories,
  towerOfGoatsStoriesHeading,
  TOWER_OF_GOATS_SUBTITLE,
  TOWER_OF_GOATS_TITLE,
} from '@/lib/experiences/tower-of-goats'

export type TowerOfGoatsImages = {
  hero: string
  gallery: Record<(typeof towerOfGoatsGallery)[number]['key'], string>
  awards: readonly { year: string; src: string }[]
}

export function TowerOfGoatsPage({ images }: { images: TowerOfGoatsImages }) {
  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
        <img
          src={images.hero}
          alt={towerOfGoatsHeroAlt}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
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

      <section aria-label="TripAdvisor awards" className="border-y-2 border-headline bg-farm-beige py-6">
        <Container width="brand" className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
          <div className="text-center md:max-w-[24rem] md:text-left">
            <p className="font-display text-lg font-black uppercase leading-tight text-headline">
              TripAdvisor Travellers&apos; Choice
            </p>
            <p className="mt-1 text-sm font-semibold">{towerOfGoatsAwardsTagline}</p>
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

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
            <ul className="grid grid-cols-2 gap-3">
              {towerOfGoatsGallery.map((image) => (
                <li key={image.key} className="overflow-hidden border-2 border-headline">
                  <img
                    src={images.gallery[image.key]}
                    alt={image.alt}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </li>
              ))}
            </ul>
            <div>
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
            </div>
          </div>
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
              <iframe
                title={towerOfGoatsLocation.mapTitle}
                src={towerOfGoatsLocation.mapSrc}
                loading="lazy"
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
