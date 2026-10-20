import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import type { TourismPage } from '@/lib/corporate/model'

import { CheckIcon } from './icons'
import {
  AudienceIcon,
  CopyBlock,
  CorporateEnquiryForm,
  CorporateHero,
  CorporateLocation,
  CredentialIcon,
  DisplayHeading,
} from './sections'

export function TourismProgram({ page }: { page: TourismPage }) {
  const consult = (
    <ButtonLink href={page.pathCtaHref} size="lg">
      {page.pathCtaLabel} <ArrowRightIcon />
    </ButtonLink>
  )

  return (
    <>
      <CorporateHero lead={page.hero.lead} accent={page.hero.accent} intro={page.hero.intro} image={page.hero.image} />
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1300px] items-center gap-12 lg:grid-cols-2">
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
        </Container>
      </section>

      <section className="overflow-hidden bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <h2 className="max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {page.pathHeading}
          </h2>
          <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_1.3fr]">
            <figure className="relative m-0">
              <div className="absolute -inset-3 -rotate-2 bg-primary-accent" aria-hidden="true" />
              <img
                src={page.portrait.src}
                alt={page.portrait.alt}
                width={1080}
                height={1200}
                loading="lazy"
                className="relative aspect-[4/5] w-full border-2 border-headline object-cover"
              />
            </figure>
            <div>
              <div className="grid gap-6 sm:grid-cols-2">
                {page.path.map((step, index) => (
                  <article
                    key={step.title}
                    className="border-2 border-headline bg-background p-6 shadow-[8px_8px_0_var(--color-headline)] transition-transform hover:-translate-y-1 hover:rotate-1"
                  >
                    <span className="font-display text-4xl font-black text-primary-accent">0{index + 1}</span>
                    <h3 className="mt-2 font-display text-xl font-black uppercase leading-tight text-headline">{step.title}</h3>
                    <p className="mt-3 text-base leading-relaxed">{step.body}</p>
                  </article>
                ))}
              </div>
              <div className="mt-10">{consult}</div>
            </div>
          </div>
        </Container>
      </section>

      {page.credentials.length ? (
        <section aria-label="Credentials" className="bg-background py-16 md:py-20">
          <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-6 gap-y-10 px-5 sm:grid-cols-3 md:px-8 lg:grid-cols-5">
            {page.credentials.map((item, index) => (
              <li key={item.label} className="text-center">
                <span
                  className={`mx-auto flex size-20 items-center justify-center rounded-full border-2 border-headline bg-farm-beige text-primary-accent shadow-[4px_4px_0_var(--color-headline)] ${index % 2 ? 'rotate-3' : '-rotate-3'}`}
                >
                  <CredentialIcon name={item.icon} className="size-9" />
                </span>
                <p className="mt-4 font-display text-base font-black uppercase leading-tight text-headline">{item.label}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {page.servicesHeading}
          </h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {page.services.map((service) => (
              <article
                key={service.name}
                className={`flex flex-col border-2 border-headline p-7 ${service.featured ? 'bg-primary-accent text-primary-foreground shadow-[12px_12px_0_var(--color-secondary-accent)] lg:-translate-y-4' : 'bg-background shadow-[10px_10px_0_var(--color-headline)]'}`}
              >
                <h3 className={`font-display text-3xl font-black uppercase leading-none ${service.featured ? '' : 'text-headline'}`}>
                  {service.name}
                </h3>
                <p className="mt-4 inline-block self-start -rotate-2 border-2 border-headline bg-secondary-accent px-3 py-1 font-display text-lg font-black text-headline">
                  {service.price}
                </p>
                <ul className="mt-6 space-y-4">
                  {service.items.map((item) => (
                    <li key={item.title} className="flex gap-3 text-sm leading-relaxed">
                      <CheckIcon className={`mt-0.5 size-5 shrink-0 ${service.featured ? '' : 'text-primary-accent'}`} />
                      <span>
                        <strong>{item.title}:</strong> {item.body}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="mt-14 text-center">{consult}</div>
        </Container>
      </section>

      <section className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px] text-center">
          <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
            {page.audienceHeading}
          </h2>
          <ul className="mt-12 flex flex-wrap justify-center gap-4">
            {page.audiences.map((audience) => (
              <li
                key={audience.label}
                className="flex items-center gap-3 border-2 border-headline bg-background px-5 py-3 font-display text-lg font-black uppercase text-headline shadow-[4px_4px_0_var(--color-headline)]"
              >
                <AudienceIcon name={audience.icon} />
                {audience.label}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-10 max-w-2xl text-lg font-semibold">{page.audienceNote}</p>
          <div className="mt-8">{consult}</div>
        </Container>
      </section>

      <section id="contact" className="scroll-mt-20 bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1000px]">
          <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {page.enquiry.heading}
          </h2>
          {page.enquiry.body ? <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">{page.enquiry.body}</p> : null}
          <CorporateEnquiryForm enquiry={page.enquiry} />
        </Container>
      </section>
      <CorporateLocation />
    </>
  )
}
