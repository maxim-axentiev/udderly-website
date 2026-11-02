import type { FormEvent } from 'react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { NEWSLETTER_UNAVAILABLE } from '@/lib/newsletter/model'
import { useHomepageContent } from './homepage-content-context'
import { HomeImage } from './homepage-content'

const fieldClass =
  'min-h-12 w-full rounded-full border-2 border-headline bg-background px-5 text-base text-headline placeholder:text-body-copy/60'

export function NewsletterSection() {
  const newsletter = useHomepageContent().newsletter

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section id="newsletter" className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <Container width="narrow" className="max-w-3xl px-5 md:px-8">
        <div className="relative pt-20 md:pt-0">
          <div
            className="pointer-events-none absolute inset-x-[-0.5rem] top-0 z-0 grid h-32 grid-cols-4 items-end md:hidden"
            aria-hidden="true"
          >
            {newsletter.mobileAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={animal}
                loading="lazy"
                className={`h-32 w-full object-contain object-bottom ${animal.rotate}`}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 -left-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {newsletter.leftAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={animal}
                loading="lazy"
                className={`absolute right-0 h-64 w-64 object-contain object-right ${animal.position}`}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 -right-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {newsletter.rightAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={animal}
                loading="lazy"
                className={`absolute left-0 h-64 w-64 object-contain object-left ${animal.position}`}
              />
            ))}
          </div>

          <div className="relative z-10 border-2 border-headline bg-background p-7 text-center shadow-[10px_10px_0_var(--color-secondary-accent)] md:p-12">
            <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
              {newsletter.title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed">
              {newsletter.copy}
            </p>

            <form
              className="mx-auto mt-8 grid max-w-md gap-3 text-left"
              onSubmit={onSubmit}
              aria-describedby="newsletter-unavailable"
            >
              <fieldset disabled className="grid gap-3 border-0 p-0">
                <div>
                  <label
                    htmlFor="newsletter-first-name"
                    className="mb-1 block font-display text-sm font-bold uppercase text-headline"
                  >
                    {newsletter.firstNameLabel}
                  </label>
                  <input
                    id="newsletter-first-name"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder={newsletter.firstNamePlaceholder}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newsletter-email"
                    className="mb-1 block font-display text-sm font-bold uppercase text-headline"
                  >
                    {newsletter.emailLabel}
                  </label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={newsletter.emailPlaceholder}
                    className={fieldClass}
                  />
                </div>
                <Button type="button" className="mt-2 justify-self-center" disabled>
                  {newsletter.submitLabel}
                </Button>
              </fieldset>
            </form>
            <p id="newsletter-unavailable" className="mt-4 font-semibold text-headline" role="status">
              {NEWSLETTER_UNAVAILABLE}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
