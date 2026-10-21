import { useState } from 'react'

import iceCream from '@/assets/home/homepage-ice-cream.webp'
import giftAGoat from '@/assets/home/homepage-gift-a-goat.webp'
import { BookExperienceBand } from '@/components/about/sections'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { resolveIceCream } from '@/lib/visit/resolve'

const flavours = [
  { name: 'Lemon Cream', story: 'A creamy and tart blend inspired by Italian gelato, made with fresh Ontario goat milk, cream, curd, and real lemon juice.', ingredients: "Goat's milk, goat's cream, cane sugar, lemon juice, goat's milk cheese curd, goat whey protein concentrate, locust bean gum, guar gum, sea salt. Contains: Milk." },
  { name: 'Peachy Mango Tango', story: 'A light, refreshing ice cream blended with real peach and mango purees on a sweet Ontario goat-milk base.', ingredients: "Goat's milk, goat's cream, cane sugar, mango puree, peach puree, goat's milk cheese curd, goat whey protein concentrate, locust bean gum, guar gum, sea salt. Contains: Milk." },
  { name: 'Vanilla Bean Lavender', story: 'An award-winning vanilla with the beans left in, finished with English lavender from Apple Hill Lavender farm.', ingredients: "Goat's milk, goat's cream, cane sugar, goat's milk cheese curd, goat whey protein concentrate, locust bean gum, guar gum, vanilla extract, vanilla seeds, sea salt, lavender oil. Contains: Milk." },
  { name: 'Wine & Dark Chocolate', story: 'Dutch cocoa and 74% bittersweet chocolate infused with Legends Estate Ontario VQA Merlot, on a sweet goat-milk cream base.', ingredients: "Goat's milk, goat's cream, cane sugar, red wine, cocoa powder, bittersweet chocolate, goat's milk cheese curd, goat whey protein concentrate, locust bean gum, guar gum, sea salt. Contains: Milk, soya, sulphites." },
]

export function IceCreamPage({ page }: { page: Parameters<typeof resolveIceCream>[0] }) {
  const content = resolveIceCream(page)
  const slides = content.flavours ?? flavours
  const [index, setIndex] = useState(0)
  const flavour = slides[index] ?? slides[0]
  const go = (next: number) => setIndex((next + slides.length) % slides.length)

  return (
    <>
      <section className="bg-farm-beige py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">
          <h1 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.82] text-headline">
            {content.heroLead} <span className="text-secondary-accent">{content.heroAccent}</span>
          </h1>
        </div>
      </section>
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto grid max-w-[1300px] items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">{content.introHeading}</h2>
            {content.introParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 20)} className="mt-4 text-base leading-relaxed md:text-lg">{paragraph}</p>
            ))}
          </div>
          <img src={iceCream} alt="Tubs of Udderly Ridiculous goat milk ice cream stacked in the store" className="aspect-[4/3] w-full -rotate-2 border-2 border-headline object-cover shadow-[12px_12px_0_var(--color-secondary-accent)]" />
        </div>
      </section>
      <section className="border-y-2 border-headline bg-background py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <h2 className="text-center font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
            {content.whyHeading} <span className="text-stroke">{content.whyAccent}</span>
          </h2>
          <ul className="mt-10 space-y-8">
            {content.why.map((point) => (
              <li key={point.slice(0, 24)} className="flex items-start gap-4 leading-relaxed">
                <span className="mt-1.5 size-3 shrink-0 rotate-45 bg-primary-accent" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {content.showFlavours && flavour ? (
      <section className="bg-farm-beige py-20 md:py-28" aria-roledescription="carousel" aria-label="Ice cream flavours">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] font-black uppercase leading-[0.8] text-headline">
            {content.flavourHeading} <span className="text-primary-accent">{content.flavourAccent}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-lg font-semibold">{content.flavourIntro}</p>
          <article className="relative mt-12 border-2 border-headline bg-background p-5 shadow-[10px_10px_0_var(--color-headline)] md:p-8">
            <h3 className="font-display text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-[0.85] text-headline">{flavour.name}</h3>
            <p className="mt-5 leading-relaxed">{flavour.story}</p>
            <p className="mt-5 border-l-4 border-primary-accent pl-4 text-sm leading-relaxed">
              <span className="font-display text-base font-black uppercase text-headline">Ingredients: </span>
              {flavour.ingredients}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button type="button" className="flex size-12 items-center justify-center rounded-full border-2 border-headline" onClick={() => go(index - 1)} aria-label="Previous flavour">
                <ChevronLeftIcon />
              </button>
              <button type="button" className="flex size-12 items-center justify-center rounded-full border-2 border-headline" onClick={() => go(index + 1)} aria-label="Next flavour">
                <ChevronRightIcon />
              </button>
              <span className="font-display text-lg font-black uppercase text-headline">{index + 1} / {slides.length}</span>
            </div>
          </article>
        </div>
      </section>
      ) : null}
      {content.showGift ? (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 border-2 border-headline bg-farm-beige p-7 shadow-[10px_10px_0_var(--color-headline)] md:grid-cols-[auto_1fr_auto] md:p-12">
            <img src={giftAGoat} alt="Gift A Goat program logo" className="mx-auto size-36 rounded-full border-2 border-headline object-contain md:size-44" />
            <div>
              <span className="font-accent text-xl italic text-primary-accent">{content.giftKicker}</span>
              <h2 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3.6rem)] font-black uppercase leading-[0.86] text-headline">{content.giftHeading}</h2>
              <p className="mt-4 max-w-2xl leading-relaxed">{content.giftCopy}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-6xl font-black text-headline">{content.giftCount}</p>
              <p className="mt-2 font-display text-lg font-black uppercase text-headline">{content.giftCountLabel}</p>
            </div>
          </div>
        </section>
      ) : null}
      {content.showVideo ? (
        <section className="border-y-2 border-headline bg-farm-blue py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-black uppercase leading-[0.84] text-headline">{content.videoHeading}</h2>
            <div className="mt-12 flex aspect-video items-center justify-center border-2 border-headline bg-background p-8 shadow-[10px_10px_0_var(--color-headline)]">
              {content.poster ? <img src={content.poster.src} alt={content.poster.alt} className="mb-4 max-h-40 object-contain" /> : null}
              {content.videoUrl ? (
                <a className="font-display text-2xl font-black uppercase underline" href={content.videoUrl}>Watch the clip</a>
              ) : (
                <p className="font-semibold">{content.videoNote}</p>
              )}
            </div>
          </div>
        </section>
      ) : null}
      <BookExperienceBand cta={{ heading: content.closeHeading, body: content.closeCopy, label: 'Book an Experience with Us', href: '/experiences' }} />
    </>
  )
}
