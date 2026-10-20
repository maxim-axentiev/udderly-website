import { useState } from 'react'

import { Button, ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { towerOfGoatsLocation } from '@/lib/experiences/tower-of-goats'
import {
  ALPACA_POLICY,
  CONTACT_DEMO_MESSAGE,
  COW_FACTS,
  COW_PLACEMENT,
  GOAT_POLICY,
  PRICE_PLACEHOLDER,
  SPECIES_LABEL,
  saleGroupDescription,
} from '@/lib/sale/content'
import type { SaleCard, SalePageCopy } from '@/lib/sale/resolve'
import { WaitlistSection } from './waitlist-form'

const inputClass =
  'border-2 border-headline bg-farm-beige px-4 py-3 text-base outline-none focus-visible:ring-4 focus-visible:ring-ring'
const labelClass = 'font-display text-sm font-black uppercase tracking-wide text-headline'

export function SaleAnimalPage({
  animal,
  images,
  copy,
}: {
  animal: SaleCard
  images: { portrait: string; dam: string; sire: string; chart: string }
  copy: SalePageCopy
}) {
  const isCow = animal.species === 'cow'
  const isPair = animal.species === 'goat' || animal.species === 'alpaca'
  const label = animal.speciesTitle || (animal.species === 'other' ? '' : SPECIES_LABEL[animal.species])
  const portrait = animal.images[0]?.src ?? images.portrait
  const portraitAlt = animal.images[0]?.alt ?? (label ? `${animal.name}, ${label}` : animal.name)
  const placementIntro = animal.placementIntro || (isCow ? COW_PLACEMENT : '')
  const placementItems =
    animal.placementItems ??
    (animal.species === 'goat' ? [...GOAT_POLICY] : animal.species === 'alpaca' ? [...ALPACA_POLICY] : undefined)
  const groupCopy =
    animal.groupDescription || (isPair ? saleGroupDescription(animal.name) : undefined)
  const personality =
    animal.personality ||
    (animal.species === 'other'
      ? undefined
      : `Placeholder description. ${animal.name} ${isCow ? 'is' : 'are'} gentle, curious and well socialized from day one. Raised on our farm with plenty of attention, snacks and herd time, ${isCow ? 'this calf is' : "they're"} ready to bring a little ridiculousness to the right home.`)
  const facts = COW_FACTS.map(([name, fallback]) => {
    if (name === 'Birthdate' && animal.birthDate) return [name, animal.birthDate] as const
    if (name === 'Height at birth' && animal.birthHeight) return [name, animal.birthHeight] as const
    if (name === 'Weight at birth' && animal.birthWeight) return [name, animal.birthWeight] as const
    if (name === 'Chondro Status' && animal.genetics) return [name, animal.genetics] as const
    if (name === 'Sex' && animal.sex) return [name, animal.sex] as const
    return [name, fallback] as const
  })
  const price = animal.priceDisplay || PRICE_PLACEHOLDER

  return (
    <>
      <section className="farm-dots relative overflow-hidden border-b-2 border-headline bg-farm-beige py-24 md:py-32">
        <Container width="brand" className="max-w-5xl text-center">
          <p className="inline-block rotate-2 border-2 border-headline bg-background px-4 py-1 font-display text-sm font-black uppercase tracking-widest text-primary-accent">
            {isPair ? 'Hi, our names are' : 'Hi, my name is'}
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,10vw,8.5rem)] font-black uppercase leading-[0.8] text-headline">
            {animal.name}
          </h1>
          {label ? (
          <p className="mt-7 inline-block -rotate-2 bg-primary-accent px-5 py-2 font-accent text-2xl italic text-primary-foreground md:text-3xl">
            {animal.speciesTitle
              ? isCow
                ? `…and I'm a ${animal.speciesTitle}`
                : `…and we're ${animal.speciesTitle}`
              : isCow
                ? "…and I'm a Mini Highland Cow"
                : animal.species === 'goat'
                  ? "…and we're Miniature Goats"
                  : "…and we're Alpacas"}
          </p>
          ) : null}
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1300px] items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-black uppercase leading-[0.85] text-headline">
              {animal.sold ? 'Happily rehomed' : <>Looking for <span className="text-stroke">a forever home</span></>}
            </h2>
            {personality ? <p className="mt-6 text-base leading-relaxed md:text-lg">{personality}</p> : null}
            {animal.sold ? null : (
              <ButtonLink href="#contact" size="lg" className="mt-8">
                {copy.buyButtonLabel}
              </ButtonLink>
            )}
          </div>
          {portrait ? (
          <img
            src={portrait}
            alt={portraitAlt}
            width={1280}
            height={960}
            loading="lazy"
            className="aspect-[4/3] w-full border-2 border-headline object-cover"
          />
          ) : (
            <div className="aspect-[4/3] w-full border-2 border-headline bg-farm-beige" />
          )}
        </Container>
      </section>

      <section className="bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <article className="grid gap-8 border-2 border-headline bg-background p-5 shadow-[14px_14px_0_var(--color-headline)] md:p-8 lg:grid-cols-[1fr_1.3fr]">
            {portrait ? (
              <img src={portrait} alt={portraitAlt} width={1024} height={1024} loading="lazy" className="aspect-square w-full border-2 border-headline object-cover" />
            ) : (
              <div className="aspect-square w-full border-2 border-headline bg-farm-beige" />
            )}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-black uppercase leading-[0.85] text-headline">
                  {isCow ? `All about ${animal.name}` : isPair ? `Meet the ${animal.species === 'goat' ? 'goats' : 'alpacas'}` : `Meet ${animal.name}`}
                </h2>
                <div className="inline-flex -rotate-3 flex-col items-center border-4 border-headline bg-secondary-accent px-6 py-3">
                  <span className="font-display text-xs font-black uppercase tracking-widest">{animal.sold ? 'Status' : 'Price'}</span>
                  <span className="font-display text-4xl font-black uppercase leading-none">{animal.sold ? 'Sold' : price}</span>
                  {animal.sold ? (
                    <span className="mt-2 text-center font-display text-base font-black uppercase">
                      Sold for {price} <span className="block text-xs">Placeholder amount</span>
                    </span>
                  ) : null}
                </div>
              </div>
              {isCow ? (
                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  {facts.map(([fact, value]) => (
                    <div key={fact} className="border-2 border-headline bg-farm-beige p-4">
                      <dt className="font-display text-xs font-black uppercase tracking-widest text-primary-accent">{fact}</dt>
                      <dd className="mt-1 font-display text-xl font-black uppercase text-headline">{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : groupCopy ? (
                <p className="mt-6 text-base leading-relaxed md:text-lg">{groupCopy}</p>
              ) : null}
            </div>
          </article>
        </Container>
      </section>

      {isCow ? (
        <section className="bg-background py-20 md:py-28">
          <Container width="brand" className="max-w-[1300px]">
            <h2 className="text-center font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
              Meet the parents
            </h2>
            <div className="mt-14 grid gap-10 md:grid-cols-2">
              {[
                ['Dam', images.dam],
                ['Sire', images.sire],
              ].map(([role, src], index) => (
                <figure key={role} className={`m-0 border-2 border-headline bg-background p-3 shadow-[10px_10px_0_var(--color-headline)] ${index ? 'rotate-1' : '-rotate-1'}`}>
                  <img src={src} alt={`${animal.name}'s ${role.toLowerCase()}`} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="p-4">
                    <p className="font-display text-4xl font-black uppercase text-primary-accent">{role}</p>
                    <p className="mt-2 font-display text-xl font-black uppercase text-headline">
                      Name: {role === 'Dam' ? animal.parentDamName || 'Placeholder' : animal.parentSireName || 'Placeholder'}
                    </p>
                    <p className="text-base">
                      Height: {role === 'Dam' ? animal.parentDamHeight || 'Placeholder' : animal.parentSireHeight || 'Placeholder'}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1300px]">
          <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {isCow ? 'Important information' : 'Our policy'}
          </h2>
          {isCow ? (
            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <h3 className="font-display text-2xl font-black uppercase text-headline">Placement policy</h3>
                <p className="mt-4 text-base leading-relaxed">{placementIntro}</p>
              </article>
              <article className="border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
                <h3 className="font-display text-2xl font-black uppercase text-headline">Size chart</h3>
                <img
                  src={animal.sizeChart?.src ?? images.chart}
                  alt={
                    animal.sizeChart?.alt ??
                    'Size chart comparing standard cattle, mid-size miniature cattle, miniature cattle and micro miniature cattle heights'
                  }
                  className="mt-4 w-full border-2 border-headline object-contain"
                  loading="lazy"
                />
              </article>
            </div>
          ) : placementItems?.length ? (
            <ul className="mt-12 space-y-4 border-2 border-headline bg-background p-6 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
              {placementItems.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-relaxed md:text-lg">
                  <span aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>

      {animal.sold ? null : (
        <ContactForm
          heading={copy.contactHeading.replaceAll('{name}', animal.name)}
          buttonLabel={copy.contactButtonLabel}
        />
      )}
      <WaitlistSection title={copy.detailWaitlistTitle} copy={copy.detailWaitlistCopy} />
      <LocationBlock />
    </>
  )
}

function ContactForm({
  heading,
  buttonLabel,
}: {
  heading: string
  buttonLabel: string
}) {
  const [sent, setSent] = useState(false)
  return (
    <section id="contact" className="scroll-mt-20 bg-farm-beige py-20 md:py-28">
      <Container width="brand" className="max-w-[1000px]">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
          {heading}
        </h2>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
          className="mt-10 border-2 border-headline bg-background p-6 shadow-[12px_12px_0_var(--color-headline)] md:p-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Name *</span>
              <input required name="name" maxLength={100} autoComplete="name" className={inputClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className={labelClass}>Email *</span>
              <input required type="email" name="email" maxLength={255} autoComplete="email" className={inputClass} />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className={labelClass}>Message *</span>
              <textarea required name="message" rows={6} maxLength={2000} className={inputClass} />
            </label>
          </div>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button type="submit" size="lg">
              {buttonLabel}
            </Button>
            <p aria-live="polite" className="font-accent text-lg italic text-primary-accent">
              {sent ? CONTACT_DEMO_MESSAGE : ''}
            </p>
          </div>
        </form>
      </Container>
    </section>
  )
}

function LocationBlock() {
  return (
    <section className="bg-farm-beige py-20 md:py-28">
      <Container width="brand">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,6rem)] font-black uppercase leading-[0.8] text-headline">
          {towerOfGoatsLocation.headingLead}
          <br />
          <span className="text-stroke">{towerOfGoatsLocation.headingAccent}</span>
        </h2>
        <div className="mt-12 grid gap-7 lg:grid-cols-[1fr_2fr]">
          <div className="border-2 border-headline bg-background p-7">
            <p className="font-display text-3xl font-black uppercase text-headline">{towerOfGoatsLocation.name}</p>
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
          <iframe
            title={towerOfGoatsLocation.mapTitle}
            src={towerOfGoatsLocation.mapSrc}
            loading="lazy"
            className="h-[420px] w-full border-2 border-headline"
          />
        </div>
      </Container>
    </section>
  )
}
