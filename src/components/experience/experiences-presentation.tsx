import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import {
  EXPERIENCES_HERO,
  FEAST_ON,
  type ExperienceListingCard,
} from '@/lib/experiences/approved-listing'

export function ExperiencesPresentation({
  heroSrc,
  feastSrc,
  cards,
}: {
  heroSrc: string
  feastSrc: string
  cards: readonly ExperienceListingCard[]
}) {
  return (
    <>
      <section className="relative isolate flex min-h-[72vh] items-center justify-center overflow-hidden">
        <img
          src={heroSrc}
          alt={EXPERIENCES_HERO.imageAlt}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(3.2rem,9vw,8rem)] font-black uppercase leading-[0.8] text-background">
            {EXPERIENCES_HERO.headingLead}
            <br />
            <span className="text-secondary-accent">{EXPERIENCES_HERO.headingAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {EXPERIENCES_HERO.supporting}
          </p>
        </Container>
      </section>

      <section className="bg-background py-16 md:py-24" aria-labelledby="experience-names-heading">
        <Container width="brand">
          <h2 id="experience-names-heading" className="sr-only">
            Farm experiences
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.key}>
                <article className="flex h-full flex-col border-2 border-headline bg-background p-6 shadow-[7px_7px_0_var(--color-headline)]">
                  <h3 className="font-display text-3xl font-black uppercase leading-none text-headline">
                    {card.name}
                  </h3>
                  {card.description ? (
                    <p className="mt-4 leading-relaxed">{card.description}</p>
                  ) : null}
                  {card.priceDisplay || card.duration ? (
                    <p className="mt-4 text-sm font-semibold">
                      {[card.priceDisplay, card.duration].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {card.href || card.bookingUrl ? (
                    <div className="mt-6 flex flex-col gap-3">
                      {card.href ? (
                        <ButtonLink href={card.href} variant="outline">
                          Learn more
                        </ButtonLink>
                      ) : null}
                      {card.bookingUrl ? (
                        <ButtonLink href={card.bookingUrl} external>
                          Book
                        </ButtonLink>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="feast-on" className="bg-farm-beige py-20 md:py-28">
        <Container
          width="brand"
          className="grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_0.85fr]"
        >
          <div className="order-2 lg:order-1">
            <p className="font-accent text-xl italic text-primary-accent">{FEAST_ON.kicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
              {FEAST_ON.headingLead}
              <br />
              {FEAST_ON.headingAccent}
            </h2>
            {FEAST_ON.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          <a
            href={FEAST_ON.href}
            target="_blank"
            rel="noreferrer"
            className="order-1 mx-auto block w-full max-w-sm lg:order-2"
          >
            <img
              src={feastSrc}
              alt={FEAST_ON.imageAlt}
              width={800}
              height={800}
              loading="lazy"
              className="h-auto w-full"
            />
          </a>
        </Container>
      </section>
    </>
  )
}
