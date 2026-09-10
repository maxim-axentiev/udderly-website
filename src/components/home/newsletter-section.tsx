import { useState, type FormEvent } from 'react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { homepageNewsletter } from '@/content/homepage'

const fieldClass =
  'min-h-12 w-full rounded-full border-2 border-headline bg-background px-5 text-base text-headline placeholder:text-body-copy/60'

export function NewsletterSection() {
  const [signedUp, setSignedUp] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignedUp(true)
  }

  return (
    <section id="newsletter" className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <Container width="narrow" className="max-w-3xl px-5 md:px-8">
        <div className="relative pt-20 md:pt-0">
          <div
            className="pointer-events-none absolute inset-x-[-0.5rem] top-0 z-0 grid h-32 grid-cols-4 items-end md:hidden"
            aria-hidden="true"
          >
            {homepageNewsletter.mobileAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                decoding="async"
                className={`h-32 w-full object-contain object-bottom ${animal.rotate}`}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 -left-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {homepageNewsletter.leftAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                decoding="async"
                className={`absolute right-0 h-64 w-64 object-contain object-right ${animal.position}`}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 -right-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {homepageNewsletter.rightAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                decoding="async"
                className={`absolute left-0 h-64 w-64 object-contain object-left ${animal.position}`}
              />
            ))}
          </div>

          <div className="relative z-10 border-2 border-headline bg-background p-7 text-center shadow-[10px_10px_0_var(--color-secondary-accent)] md:p-12">
            <h2 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
              {homepageNewsletter.title}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed">
              {homepageNewsletter.copy}
            </p>

            <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="newsletter-first-name"
                  className="mb-1 block font-display text-sm font-bold uppercase text-headline"
                >
                  First name (required)
                </label>
                <input
                  id="newsletter-first-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Cheryl"
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="newsletter-email"
                  className="mb-1 block font-display text-sm font-bold uppercase text-headline"
                >
                  Email (required)
                </label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="newsletter-dob"
                  className="mb-1 block font-display text-sm font-bold uppercase text-headline"
                >
                  Date of birth (required)
                </label>
                <input
                  id="newsletter-dob"
                  name="dateOfBirth"
                  type="date"
                  required
                  className={fieldClass}
                />
              </div>
              <Button type="submit" className="mt-2 justify-self-center">
                Sign me up
              </Button>
            </form>
            {signedUp ? (
              <p className="mt-4 font-accent text-lg italic text-primary-accent">
                {homepageNewsletter.confirmation}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
