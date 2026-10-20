import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { SALE_PREP } from '@/lib/sale/content'
import type { SaleCard } from '@/lib/sale/resolve'
import type { SalePageCopy } from '@/lib/sale/resolve'
import { WaitlistSection } from './waitlist-form'

export type SaleImages = Record<
  | 'highland-hero'
  | 'highland-cta'
  | 'goat-icon-1'
  | 'goat-icon-2'
  | 'goat-icon-3'
  | 'alpaca-walk'
  | 'hero'
  | 'sale',
  string
>

export function AnimalsForSalePage({
  copy,
  available,
  sold,
  images,
}: {
  copy: SalePageCopy
  available: readonly SaleCard[]
  sold: readonly SaleCard[]
  images: SaleImages
}) {
  const prep = copy.prep.map((item, index) => ({
    ...item,
    image:
      item.image?.src ??
      images[(item.imageKey ?? SALE_PREP[index]?.imageKey ?? 'highland-hero') as keyof SaleImages],
    alt: item.image?.alt ?? item.title,
  }))

  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
        <img
          src={copy.heroImage?.src ?? images.hero}
          alt={copy.heroImage?.alt ?? 'Animals in the pasture at Udderly Ridiculous Farm Life'}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <Container width="brand" className="max-w-4xl py-24 text-center md:py-32">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {copy.heroLead} <span className="text-secondary-accent">{copy.heroAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background md:text-xl">
            {copy.heroSupport}
          </p>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="grid max-w-[1300px] items-center gap-12 lg:grid-cols-2">
          <img
            src={copy.introImage?.src ?? images.sale}
            alt={copy.introImage?.alt ?? 'A young animal raised on the farm'}
            width={1280}
            height={960}
            loading="lazy"
            className="relative aspect-[4/3] w-full border-2 border-headline object-cover"
          />
          <div>
            <h2 className="font-display text-[clamp(2.2rem,5.2vw,4.4rem)] font-black uppercase leading-[0.85] text-headline">
              {copy.introLead} <span className="text-stroke">{copy.introAccent}</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed md:text-lg">{copy.intro}</p>
            <ButtonLink href={copy.introButtonHref} size="lg" className="mt-8">
              {copy.introButton}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id="available" className="scroll-mt-20 bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="text-center font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline">
            {copy.availableHeading}
          </h2>
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((animal, index) => (
              <SaleCardView key={animal.slug} animal={animal} index={index} images={images} learnMoreLabel={copy.learnMoreLabel} />
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container width="brand" className="max-w-[1500px]">
          <h2 className="text-center font-display text-[clamp(2.8rem,7.5vw,6.6rem)] font-black uppercase leading-[0.78] text-headline">
            {copy.soldLead} <span className="text-stroke">{copy.soldAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg">{copy.soldIntro}</p>
          <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sold.map((animal, index) => (
              <SaleCardView key={animal.slug} animal={animal} index={index} images={images} learnMoreLabel={copy.learnMoreLabel} />
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-farm-beige py-20 md:py-28">
        <Container width="brand" className="max-w-[1400px]">
          <h2 className="max-w-4xl font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
            {copy.prepHeading}
          </h2>
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {prep.map((item) => (
              <li key={item.title} className="border-2 border-headline bg-background p-3 shadow-[8px_8px_0_var(--color-headline)]">
                <img src={item.image} alt={item.alt} width={1024} height={768} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="p-3 pb-4">
                  <h3 className="font-display text-2xl font-black uppercase leading-none text-headline">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed">{item.copy}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <ButtonLink href={copy.introButtonHref} size="lg">
              {copy.introButton}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <WaitlistSection title={copy.waitlistTitle} copy={copy.waitlistCopy} />
    </>
  )
}

function SaleCardView({
  animal,
  index,
  images,
  learnMoreLabel,
}: {
  animal: SaleCard
  index: number
  images: SaleImages
  learnMoreLabel: string
}) {
  return (
    <li>
      <article
        className={`flex h-full flex-col border-2 border-headline bg-background p-3 shadow-[10px_10px_0_var(--color-headline)] ${index % 2 ? 'rotate-1' : '-rotate-1'}`}
      >
        <div className="relative overflow-hidden border-2 border-headline">
          <img
            src={animal.images[0]?.src ?? images[animal.imageKey]}
            alt={animal.images[0]?.alt ?? animal.name}
            width={1024}
            height={1024}
            loading="lazy"
            className={`aspect-square w-full object-cover ${animal.sold ? 'grayscale' : ''}`}
          />
          {animal.sold ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center" aria-hidden="true">
              <span className="-rotate-12 border-4 border-headline bg-secondary-accent px-8 py-2 font-display text-4xl font-black uppercase text-headline">
                Sold
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 items-center justify-between gap-4 p-4">
          <h3 className="font-display text-3xl font-black uppercase leading-none text-headline">
            {animal.name}
            {animal.sold ? <span className="sr-only"> (sold)</span> : null}
          </h3>
          <ButtonLink href={animal.href}>{learnMoreLabel}</ButtonLink>
        </div>
      </article>
    </li>
  )
}
