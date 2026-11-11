
import mobileFirst from '@/assets/home/newsletter-first-mobile.webp'
import mobileFourth from '@/assets/home/newsletter-fourth-mobile.webp'
import leftLower from '@/assets/home/newsletter-left-lower-desktop.webp'
import leftUpper from '@/assets/home/newsletter-left-upper-desktop.webp'
import rightLower from '@/assets/home/newsletter-right-lower-desktop.webp'
import rightUpper from '@/assets/home/newsletter-right-upper-desktop.webp'
import mobileSecond from '@/assets/home/newsletter-second-mobile.webp'
import mobileThird from '@/assets/home/newsletter-third-mobile.webp'
import { MailchimpSignup } from '@/components/newsletter/mailchimp-signup'
import type { NewsletterPageContent } from '@/lib/newsletter/resolve'

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

export function NewsletterPage({ page, sectionId, headingLevel = 'h1', signupId = 'newsletter-page' }: { page: Pick<NewsletterPageContent, 'title' | 'copy'> & Partial<Pick<NewsletterPageContent, 'firstNameLabel' | 'emailLabel' | 'dateOfBirthLabel' | 'submitLabel'>>; sectionId?: string; headingLevel?: 'h1' | 'h2'; signupId?: string }) {
  const Heading = headingLevel
  return (
    <section id={sectionId} className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="relative pt-36 lg:pt-0">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-0 grid h-36 grid-cols-4 items-end lg:hidden"
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
                className={`h-36 w-full object-contain object-bottom ${animal.rotate}`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 -left-36 z-0 hidden w-72 lg:block" aria-hidden="true">
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
          <div className="pointer-events-none absolute inset-y-0 -right-36 z-0 hidden w-72 lg:block" aria-hidden="true">
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
            <Heading className="font-display text-[clamp(2.6rem,6vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
              {page.title}
            </Heading>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed">{page.copy}</p>
            <MailchimpSignup id={signupId} firstNameLabel={page.firstNameLabel} emailLabel={page.emailLabel} dateOfBirthLabel={page.dateOfBirthLabel} submitLabel={page.submitLabel}/>
          </div>
        </div>
      </div>
    </section>
  )
}
