
import { homepageNewsletter } from '@/content/homepage'
import { Container } from '@/components/layout/container'
import { MailchimpSignup } from '@/components/newsletter/mailchimp-signup'
import { useHomepageContent } from './homepage-content-context'
import { HomeImage } from './homepage-content'

export function NewsletterSection() {
  const newsletter = useHomepageContent().newsletter

  return (
    <section id="newsletter" className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <Container width="narrow" className="max-w-3xl px-5 md:px-8">
        <div className="relative pt-20 md:pt-0">
          <div
            className="pointer-events-none absolute inset-x-[-0.5rem] top-0 z-0 grid h-32 grid-cols-4 items-end md:hidden"
            aria-hidden="true"
          >
            {homepageNewsletter.mobileAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={{ ...animal, width: 768, height: 768 }}
                loading="lazy"
                className={`h-32 w-full object-contain object-bottom ${animal.rotate}`}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 -left-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {homepageNewsletter.leftAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={{ ...animal, width: 768, height: 768 }}
                loading="lazy"
                className={`absolute right-0 h-64 w-64 object-contain object-right ${animal.position}`}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 -right-36 z-0 hidden w-72 md:block"
            aria-hidden="true"
          >
            {homepageNewsletter.rightAnimals.map((animal) => (
              <HomeImage
                key={animal.src}
                image={{ ...animal, width: 768, height: 768 }}
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

            <MailchimpSignup id="homepage-newsletter" firstNameLabel={newsletter.firstNameLabel} emailLabel={newsletter.emailLabel} submitLabel={newsletter.submitLabel} firstNamePlaceholder={newsletter.firstNamePlaceholder} emailPlaceholder={newsletter.emailPlaceholder}/>
          </div>
        </div>
      </Container>
    </section>
  )
}
