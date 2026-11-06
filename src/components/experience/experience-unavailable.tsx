import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'

/** Shown only when the route loader fails, never for unpublished experiences. */
export function ExperienceUnavailable() {
  return (
    <section aria-labelledby="experience-unavailable-title" className="bg-background py-20 md:py-28">
      <Container width="brand" className="max-w-3xl text-center">
        <h1 id="experience-unavailable-title" className="font-display text-4xl font-black uppercase leading-tight text-headline md:text-5xl">
          This experience is temporarily unavailable
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed">
          We could not load the experience details right now. Please try again shortly or browse our other farm experiences.
        </p>
        <ButtonLink href="/experiences" className="mt-8">Browse farm experiences</ButtonLink>
      </Container>
    </section>
  )
}
