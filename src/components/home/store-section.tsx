import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageStore } from '@/content/homepage'

import { GiftGoatCounter } from './gift-goat-counter'

export function StoreSection() {
  const { store, iceCream, giftGoat } = homepageStore

  return (
    <section id="store" className="overflow-hidden bg-background py-20 md:py-28">
      <Container width="brand" className="space-y-20 md:space-y-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 -rotate-2 bg-secondary-accent" aria-hidden="true" />
            <img
              src={store.image.src}
              alt={store.image.alt}
              width={store.image.width}
              height={store.image.height}
              loading="lazy"
              decoding="async"
              className="relative w-full border-2 border-headline object-cover"
            />
          </div>
          <div>
            <span className="inline-block -rotate-2 bg-secondary-accent px-4 py-2 font-display text-base font-black uppercase text-headline">
              {store.badge}
            </span>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,5.2rem)] font-black uppercase leading-[0.84] text-headline">
              {store.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed">{store.copy}</p>
            <ButtonLink href={store.cta.href} size="lg" className="mt-8">
              {store.cta.label} <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative lg:order-2">
            <div className="absolute -inset-4 rotate-2 bg-primary-accent" aria-hidden="true" />
            <img
              src={iceCream.image.src}
              alt={iceCream.image.alt}
              width={iceCream.image.width}
              height={iceCream.image.height}
              loading="lazy"
              decoding="async"
              className="relative w-full border-2 border-headline object-cover"
            />
          </div>
          <div className="lg:order-1">
            <span className="inline-block rotate-1 bg-primary-accent px-4 py-2 font-display text-base font-black uppercase text-primary-foreground">
              {iceCream.badge}
            </span>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,5.2rem)] font-black uppercase leading-[0.84] text-headline">
              {iceCream.title}
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed">
              {iceCream.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <ButtonLink href={iceCream.cta.href} size="lg" className="mt-8">
              {iceCream.cta.label} <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>

        <div className="grid items-center gap-10 border-2 border-headline bg-farm-beige p-7 shadow-[10px_10px_0_var(--color-headline)] md:grid-cols-[auto_1fr_auto] md:p-12">
          <img
            src={giftGoat.image.src}
            alt={giftGoat.image.alt}
            width={giftGoat.image.width}
            height={giftGoat.image.height}
            loading="lazy"
            decoding="async"
            className="mx-auto size-36 -rotate-3 rounded-full border-2 border-headline bg-background object-contain shadow-[4px_4px_0_var(--color-headline)] transition-transform duration-500 motion-safe:hover:rotate-12 motion-safe:hover:scale-110 md:size-44"
          />
          <div>
            <span className="font-accent text-xl italic text-primary-accent">
              {giftGoat.kicker}
            </span>
            <h3 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3.6rem)] font-black uppercase leading-[0.86] text-headline">
              {giftGoat.title}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed">{giftGoat.copy}</p>
          </div>
          <div className="text-center md:text-right">
            <GiftGoatCounter target={giftGoat.target} />
            <p className="mt-2 font-display text-lg font-black uppercase text-headline">
              {giftGoat.countLabel}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
