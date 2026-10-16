import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import {
  GOLD_PRICE,
  SILVER_PRICE,
  goldItems,
  importantInfo,
  silverItems,
  type AdoptionAnimal,
} from '@/lib/adopt/content'

export function AnimalAdoptionPage({
  animal,
  images,
  newsletter,
}: {
  animal: AdoptionAnimal
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
            {animal.tagline}
          </p>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1400px] items-start gap-14 lg:grid-cols-[1.05fr_1fr]">
          <ul className="grid grid-cols-2 gap-3">
            {galleryAlts.map((alt, index) => (
              <li key={alt} className="overflow-hidden border-2 border-headline">
                <img
                  src={images.gallery[index] ?? images.gallery[0]}
                  alt={alt}
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
              Meet
              <br />
              <span className="text-stroke">{animal.name}.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed md:text-lg">
              Placeholder description. {animal.name} is a full personality in animal form — opinions, eyebrows, and a
              personal vendetta against any gate that dares stay closed. {animal.name} investigates every pocket like it
              might contain a snack and has never met a human worth ignoring.
            </p>
            <p className="mt-4 text-base leading-relaxed md:text-lg">
              Placeholder description. By adopting {animal.name}, you are not just sponsoring an animal — you are joining
              the extended herd. You will get updates on the latest schemes, photos of the best side (it is all of
              them), and the quiet pride of being noticed.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1200px]">
          <h2 className="text-center font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline">
            Pick your
            <br />
            <span className="text-primary-accent">package.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed">
            {animal.showGold
              ? `Two ways to support ${animal.name}. Both come with bragging rights.`
              : `One simple way to support ${animal.name}. Bragging rights included.`}
          </p>
          <div className={`mt-14 grid gap-8 ${animal.showGold ? 'lg:grid-cols-2' : 'mx-auto max-w-xl'}`}>
            <PackageCard
              animalName={animal.name}
              name="Silver"
              kicker="Silver Pail"
              tagline="The classic farm supporter."
              price={SILVER_PRICE}
              items={silverItems(animal.name)}
              tone="bg-farm-silver"
            />
            {animal.showGold ? (
              <PackageCard
                animalName={animal.name}
                name="Gold"
                kicker="Gold Hay Bale"
                tagline="The royal treatment."
                price={GOLD_PRICE}
                items={goldItems(animal.name)}
                tone="bg-farm-gold"
              />
            ) : null}
          </div>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-3xl">
          <h2 className="text-center font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.8] text-headline">
            The fine
            <br />
            print.
          </h2>
          <ul className="mt-12 -rotate-1 space-y-5 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-secondary-accent)] md:p-10">
            {importantInfo(animal.name).map((item) => (
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
              Your adoption
              <br />
              keeps {animal.name} thriving.
            </h2>
            <div className="mt-8 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-headline)] md:p-9">
              <p className="text-base leading-relaxed md:text-lg">
                Placeholder description. Every adoption directly funds high-quality feed, clean bedding, routine
                veterinary care, enrichment toys, and the occasional celebratory snack. It also helps us rescue and
                rehabilitate new animals who need a safe place to land.
              </p>
              <p className="mt-4 text-base leading-relaxed md:text-lg">
                Placeholder description. This is not a one-time gift — it is a year-long partnership that keeps{' '}
                {animal.name} happy, healthy, and appropriately ridiculous.
              </p>
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
  name,
  kicker,
  tagline,
  price,
  items,
  tone,
}: {
  animalName: string
  name: string
  kicker: string
  tagline: string
  price: string
  items: readonly string[]
  tone: string
}) {
  return (
    <article className={`relative flex flex-col border-2 border-headline p-1 shadow-[12px_12px_0_var(--color-headline)] ${tone}`}>
      <p className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full border-2 border-headline bg-background px-4 py-1 font-display text-sm font-black uppercase text-headline">
        {kicker}
      </p>
      <div className="flex flex-1 flex-col p-6 pt-8 md:p-8 md:pt-10">
        <div className="text-center">
          <h3 className="font-display text-5xl font-black uppercase text-headline md:text-6xl">{name}</h3>
          <p className="mt-2 font-accent text-lg italic">{tagline}</p>
          <p className="mt-4 font-display text-6xl font-black text-headline md:text-7xl">{price}</p>
        </div>
        <ul className="mt-8 flex-1 space-y-4">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
              <span aria-hidden="true" className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-headline bg-background text-sm">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Button type="button" aria-disabled="true" size="lg" className="mt-8 w-full">
          Adopt {animalName} — {name}
        </Button>
      </div>
    </article>
  )
}
