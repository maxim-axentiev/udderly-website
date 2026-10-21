import { useState } from 'react'

import feastOn from '@/assets/experiences/feast-on-logo.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import glamping from '@/assets/home/homepage-glamping.webp'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import store from '@/assets/home/homepage-store.webp'
import experiences from '@/assets/home/homepage-experiences.webp'
import { GIFT_CARD_UNAVAILABLE } from '@/lib/visit/model'
import { resolveGiftCard } from '@/lib/visit/resolve'

const gallery = [
  { src: goatCuddles, alt: 'Guest cuddling a mini goat in the barn' },
  { src: experiences, alt: 'Goats crowding around a laughing visitor' },
  { src: alpacaWalk, alt: 'Alpacas walking with guests along the farm path' },
  { src: iceCream, alt: 'Tubs of Udderly Ridiculous goat milk ice cream' },
  { src: highlandHero, alt: 'Mini Highland cow with a very impressive fringe' },
  { src: donkeyPicnic, alt: 'Miniature donkeys beside a picnic spread' },
  { src: store, alt: 'Inside the farm market store' },
  { src: glamping, alt: 'Farm glamping stay at golden hour' },
]

export function GiftCardPage({ page }: { page: Parameters<typeof resolveGiftCard>[0] }) {
  const content = resolveGiftCard(page)
  const photos = content.gallery ?? gallery
  const [open, setOpen] = useState<number | null>(null)
  const current = open === null ? null : photos[open]

  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden">
        <img src={experiences} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" />
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {content.heroLead} <span className="text-secondary-accent">{content.heroAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background">{content.intro}</p>
        </div>
      </section>
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 md:px-8 lg:grid-cols-2">
          <img src={goatCuddles} alt="Guest cuddling a mini goat. Gift card artwork is added in Sanity when a file is available." className="w-full border-2 border-headline object-cover" />
          <div>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
              {content.offerHeadingLead}<br /><span className="text-stroke">{content.offerHeadingAccent}</span>
            </h2>
            {content.amounts.length ? (
              <ul className="mt-6 space-y-3">
                {content.amounts.map((amount) => (
                  <li key={amount.name}>
                    <p className="font-display text-xl font-black uppercase">{amount.name}</p>
                    {amount.description ? <p>{amount.description}</p> : null}
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 text-lg font-semibold" role="status">{GIFT_CARD_UNAVAILABLE}</p>
            <button type="button" disabled className="mt-8 inline-flex min-h-14 cursor-not-allowed items-center rounded-full bg-cta px-8 font-display text-lg font-extrabold uppercase text-cta-foreground opacity-70">
              Get a Gift Card
            </button>
          </div>
        </div>
      </section>
      {content.showGallery ? (
      <section className="bg-background pb-20" aria-label="Gift card photos">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-5 px-5 md:grid-cols-4 md:px-8">
          {photos.map((image, index) => (
            <li key={image.alt}>
              <button type="button" onClick={() => setOpen(index)} aria-label={`Open photo: ${image.alt}`} className="block w-full overflow-hidden border-2 border-headline shadow-[8px_8px_0_var(--color-headline)]">
                <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        {current ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-headline/85 p-5" role="dialog" aria-modal="true" aria-label={current.alt} onClick={() => setOpen(null)}>
            <img src={current.src} alt={current.alt} className="max-h-[85vh] max-w-full border-4 border-background object-contain" />
            <button type="button" className="absolute right-5 top-5 size-12 rounded-full border-2 border-headline bg-background" aria-label="Close photo" onClick={() => setOpen(null)}>Close</button>
          </div>
        ) : null}
      </section>
      ) : null}
      {content.showThings ? (
      <section className="bg-farm-beige py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.8] text-headline">{content.thingsHeading}</h2>
          <ul className="mt-12 -rotate-1 space-y-4 border-2 border-headline bg-background p-7 shadow-[12px_12px_0_var(--color-secondary-accent)]">
            {content.things.map((tip) => (
              <li key={tip} className="leading-relaxed">{tip}</li>
            ))}
          </ul>
          <p className="mt-6 font-semibold">{GIFT_CARD_UNAVAILABLE}</p>
        </div>
      </section>
      ) : null}
      {content.showRainbow ? (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-3xl px-5">
            <p className="font-accent text-xl italic text-primary-accent">{content.rainbowKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">{content.rainbowHeading}</h2>
            <p className="mt-6 leading-relaxed">{content.rainbowCopy}</p>
            <a className="mt-6 inline-block underline" href={content.rainbowHref}>Rainbow Registered</a>
          </div>
        </section>
      ) : null}
      {content.showFeast ? (
        <section className="bg-farm-beige py-20">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 md:grid-cols-2">
            <div>
              <p className="font-accent text-xl italic text-primary-accent">{content.feastKicker}</p>
              <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">{content.feastHeading}</h2>
              <p className="mt-6 leading-relaxed">{content.feastCopy}</p>
            </div>
            <a href={content.feastHref}><img src={feastOn} alt="FeastON Certified Local logo" className="mx-auto max-w-sm" /></a>
          </div>
        </section>
      ) : null}
    </>
  )
}
