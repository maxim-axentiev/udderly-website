import type { FormEvent } from 'react'

import mobileFirst from '@/assets/home/newsletter-first-mobile.webp'
import mobileFourth from '@/assets/home/newsletter-fourth-mobile.webp'
import leftLower from '@/assets/home/newsletter-left-lower-desktop.webp'
import leftUpper from '@/assets/home/newsletter-left-upper-desktop.webp'
import rightLower from '@/assets/home/newsletter-right-lower-desktop.webp'
import rightUpper from '@/assets/home/newsletter-right-upper-desktop.webp'
import mobileSecond from '@/assets/home/newsletter-second-mobile.webp'
import mobileThird from '@/assets/home/newsletter-third-mobile.webp'
import { Button } from '@/components/ui/button'
import type { NewsletterPageContent } from '@/lib/newsletter/resolve'

const fieldClass =
  'min-h-12 w-full rounded-full border-2 border-headline bg-background px-5 text-base text-headline placeholder:text-body-copy/60 disabled:cursor-not-allowed disabled:opacity-70'

const mobileAnimals = [
  { src: mobileFirst, alt: 'Alpaca peeking over the newsletter form', rotate: '-rotate-3' },
  { src: mobileSecond, alt: 'Mini donkey peeking over the newsletter form', rotate: 'rotate-2' },
  { src: mobileThird, alt: 'Goat peeking over the newsletter form', rotate: '-rotate-2' },
  { src: mobileFourth, alt: 'Mini Highland cow peeking over the newsletter form', rotate: 'rotate-3' },
]

const leftAnimals = [
  { src: leftUpper, alt: 'Alpaca peeking from behind the newsletter form', position: 'top-[8%]' },
  { src: leftLower, alt: 'Mini donkey peeking from behind the newsletter form', position: 'bottom-[5%]' },
]

const rightAnimals = [
  { src: rightUpper, alt: 'Goat peeking from behind the newsletter form', position: 'top-[8%]' },
  { src: rightLower, alt: 'Mini Highland cow peeking from behind the newsletter form', position: 'bottom-[5%]' },
]

export function NewsletterPage({ page }: { page: NewsletterPageContent }) {
  const submit = (event: FormEvent) => {
    event.preventDefault()
  }

  return (
    <section className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="relative pt-20 md:pt-0">
          <div
            className="pointer-events-none absolute inset-x-[-0.5rem] top-0 z-0 grid h-32 grid-cols-4 items-end md:hidden"
            aria-hidden="true"
          >
            {mobileAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                className={`h-32 w-full object-contain object-bottom ${animal.rotate}`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 -left-36 z-0 hidden w-72 md:block" aria-hidden="true">
            {leftAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                className={`absolute right-0 h-64 w-64 object-contain object-right ${animal.position}`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 -right-36 z-0 hidden w-72 md:block" aria-hidden="true">
            {rightAnimals.map((animal) => (
              <img
                key={animal.alt}
                src={animal.src}
                alt=""
                width={768}
                height={768}
                loading="lazy"
                className={`absolute left-0 h-64 w-64 object-contain object-left ${animal.position}`}
              />
            ))}
          </div>
          <div className="relative z-10 border-2 border-headline bg-background p-7 text-center shadow-[10px_10px_0_var(--color-secondary-accent)] md:p-12">
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
              {page.title}
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed">{page.copy}</p>
            <form
              className="mx-auto mt-8 grid max-w-md gap-3 text-left"
              onSubmit={submit}
              aria-describedby="newsletter-unavailable"
            >
              <fieldset disabled className="grid gap-3 border-0 p-0">
                <div>
                  <label htmlFor="newsletter-page-first-name" className="mb-1 block font-display text-sm font-bold uppercase text-headline">
                    {page.firstNameLabel}
                  </label>
                  <input id="newsletter-page-first-name" name="firstName" type="text" autoComplete="given-name" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="newsletter-page-email" className="mb-1 block font-display text-sm font-bold uppercase text-headline">
                    {page.emailLabel}
                  </label>
                  <input id="newsletter-page-email" name="email" type="email" autoComplete="email" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="newsletter-page-dob" className="mb-1 block font-display text-sm font-bold uppercase text-headline">
                    {page.dateOfBirthLabel}
                  </label>
                  <input id="newsletter-page-dob" name="dateOfBirth" type="date" className={fieldClass} />
                </div>
                <Button type="button" className="mt-2 justify-self-center" disabled>
                  {page.submitLabel}
                </Button>
              </fieldset>
            </form>
            <p id="newsletter-unavailable" className="mt-4 font-semibold text-headline" role="status">
              {page.unavailable}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
