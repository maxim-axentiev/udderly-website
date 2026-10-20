import type { ReactNode } from 'react'

import { Button, ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import type { AdoptionAnimal } from '@/lib/adopt/content'
import { fillName, type AdoptionDetail, type AdoptionPageCopy, type AdoptionPackageView } from '@/lib/adopt/resolve'

export function AnimalAdoptionPage({
  animal,
  copy,
  detail,
  images,
  newsletter,
}: {
  animal: AdoptionAnimal
  copy: AdoptionPageCopy
  detail: AdoptionDetail
  images: { hero: string; gallery: readonly string[]; support: string }
  newsletter?: ReactNode
}) {
  const galleryAlts = [
    `${animal.name} standing on a straw bale like they own the barn`,
    `${animal.name} giving the camera their full attention`,
    `${animal.name} being held by a visitor during cuddle time`,
  ]

  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
        <img
          src={images.hero}
          alt="Visitors enjoying time with animals at Udderly Ridiculous Farm Life"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            Adopt <span className="text-secondary-accent">{animal.name}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {detail.tagline}
          </p>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1400px] items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
          <ul className="grid grid-cols-2 gap-3">
            {(detail.gallery.length
              ? detail.gallery.map((image) => ({ key: image.src, src: image.src, alt: image.alt }))
              : galleryAlts.map((alt, index) => ({
                  key: alt,
                  src: images.gallery[index] ?? images.gallery[0] ?? '',
                  alt,
                }))
            ).map((image) => (
              <li key={image.key} className="overflow-hidden border-2 border-headline">
                <img
                  src={image.src}
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
              {copy.meetLead}
              <br />
              <span className="text-stroke">{animal.name}.</span>
            </h2>
            {detail.story.map((paragraph) => (
              <p key={paragraph} className="mt-6 text-base leading-relaxed first:mt-6 md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1200px]">
          <h2 className="text-center font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline">
            {copy.packageLead}
            <br />
            <span className="text-primary-accent">{copy.packageAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed">
            {fillName(detail.packages.length > 1 ? copy.packageIntroGold : copy.packageIntroSingle, animal.name)}
          </p>
          <div className={`mt-14 grid gap-8 ${detail.packages.length > 1 ? 'lg:grid-cols-2' : 'mx-auto max-w-xl'}`}>
            {detail.packages.map((pkg, index) => (
              <PackageCard
                key={pkg.name}
                animalName={animal.name}
                adoptLabel={copy.adoptButtonLabel}
                pkg={pkg}
                tone={index === 0 ? 'bg-farm-silver' : 'bg-farm-gold'}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-3xl">
          <h2 className="text-center font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.8] text-headline">
            {copy.finePrintLead}
            <br />
            {copy.finePrintAccent}
          </h2>
          <ul className="mt-12 -rotate-1 space-y-5 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-secondary-accent)] md:p-10">
            {detail.terms.map((item) => (
              <li key={item} className="flex items-start gap-4 text-base leading-relaxed md:text-lg">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-headline bg-farm-beige font-display text-sm font-black"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-farm-blue py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1300px] items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="font-display text-[clamp(2.8rem,8vw,6rem)] font-black uppercase leading-[0.78] text-headline">
              {copy.detailSupportLead}
              <br />
              {fillName(copy.detailSupportAccent, animal.name)}
            </h2>
            <div className="mt-8 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-headline)] md:p-9">
              {detail.support.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed first:mt-0 md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <img
            src={images.support}
            alt={`${animal.name} being held by a visitor during cuddle time`}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-[4/5] w-full -rotate-1 border-2 border-headline object-cover"
          />
        </Container>
      </section>
      {newsletter}
    </>
  )
}

function PackageCard({
  animalName,
  adoptLabel,
  pkg,
  tone,
}: {
  animalName: string
  adoptLabel: string
  pkg: AdoptionPackageView
  tone: string
}) {
  const label = `${adoptLabel} ${animalName} — ${pkg.name}`
  return (
    <article className={`relative flex flex-col border-2 border-headline p-1 shadow-[12px_12px_0_var(--color-headline)] ${tone}`}>
      <p className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full border-2 border-headline bg-background px-4 py-1 font-display text-sm font-black uppercase text-headline">
        {pkg.kicker}
      </p>
      <div className="flex flex-1 flex-col p-6 pt-8 md:p-8 md:pt-10">
        <div className="text-center">
          <h3 className="font-display text-5xl font-black uppercase text-headline md:text-6xl">{pkg.name}</h3>
          {pkg.subtitle ? <p className="mt-2 font-accent text-lg italic">{pkg.subtitle}</p> : null}
          <p className="mt-4 font-display text-6xl font-black text-headline md:text-7xl">{pkg.price}</p>
        </div>
        <ul className="mt-8 flex-1 space-y-4">
          {pkg.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
              <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-headline bg-background text-sm">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        {pkg.checkoutUrl ? (
          <ButtonLink href={pkg.checkoutUrl} external size="lg" className="mt-8 w-full">
            {label}
          </ButtonLink>
        ) : (
          <Button type="button" aria-disabled="true" size="lg" className="mt-8 w-full">
            {label}
          </Button>
        )}
      </div>
    </article>
  )
}
