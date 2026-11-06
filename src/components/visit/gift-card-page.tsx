import { useEffect, useRef, useState } from 'react'

import feastOn from '@/assets/experiences/feast-on-logo.webp'
import { GIFT_CARD_UNAVAILABLE } from '@/lib/visit/model'
import { resolveGiftCard } from '@/lib/visit/resolve'

export function GiftCardPage({ page }: { page: Parameters<typeof resolveGiftCard>[0] }) {
  const content = resolveGiftCard(page)
  const photos = content.gallery ?? []
  const [open, setOpen] = useState<number | null>(null)
  const current = open === null ? null : photos[open]
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (open === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(null)
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus()
    }
  }, [open])

  function openPhoto(index: number, opener: HTMLButtonElement) {
    openerRef.current = opener
    setOpen(index)
  }

  return (
    <>
      <section className="relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden bg-headline">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {content.heroLead} <span className="text-secondary-accent">{content.heroAccent}</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-background">{content.intro}</p>
        </div>
      </section>
      <section className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
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
      {content.showGallery && photos.length ? (
      <section className="bg-background pb-20" aria-label="Gift card photos">
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-5 px-5 md:grid-cols-4 md:px-8">
          {photos.map((image, index) => (
            <li key={image.alt}>
              <button type="button" onClick={(event) => openPhoto(index, event.currentTarget)} aria-label={`Open photo: ${image.alt}`} className="block w-full overflow-hidden border-2 border-headline shadow-[8px_8px_0_var(--color-headline)]">
                <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
        {current ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-headline/85 p-5" role="dialog" aria-modal="true" aria-label={current.alt} onClick={(event) => { if (event.target === event.currentTarget) setOpen(null) }}>
            <img src={current.src} alt={current.alt} className="max-h-[85vh] max-w-full border-4 border-background object-contain" />
            <button ref={closeRef} type="button" className="absolute right-5 top-5 size-12 rounded-full border-2 border-headline bg-background" aria-label="Close photo" onClick={() => setOpen(null)}>Close</button>
          </div>
        ) : null}
      </section>
      ) : null}
      {content.showThings && content.things.length ? (
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
      {content.showRainbow && content.rainbowCopy ? (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-3xl px-5">
            <p className="font-accent text-xl italic text-primary-accent">{content.rainbowKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">{content.rainbowHeading}</h2>
            <p className="mt-6 leading-relaxed">{content.rainbowCopy}</p>
            <a className="mt-6 inline-block underline" href={content.rainbowHref}>Rainbow Registered</a>
          </div>
        </section>
      ) : null}
      {content.showFeast && content.feastCopy && content.feastHref ? (
        <section className="bg-farm-beige py-20">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 md:grid-cols-2">
            <div>
              <p className="font-accent text-xl italic text-primary-accent">{content.feastKicker}</p>
              <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">{content.feastHeading}</h2>
              <p className="mt-6 leading-relaxed">{content.feastCopy}</p>
            </div>
            <a href={content.feastHref} className="block min-w-0"><img src={feastOn} alt="FeastON Certified Local logo" className="mx-auto h-auto w-full max-w-sm" /></a>
          </div>
        </section>
      ) : null}
    </>
  )
}
