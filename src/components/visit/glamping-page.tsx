import { GLAMPING_UNAVAILABLE } from '@/lib/visit/model'
import { resolveGlamping } from '@/lib/visit/resolve'

function Unavailable() {
  return (
    <p className="mt-8">
      <button type="button" disabled className="inline-flex min-h-14 cursor-not-allowed items-center rounded-full bg-cta px-8 font-display text-lg font-extrabold uppercase text-cta-foreground opacity-70">
        Book Farm Glamping
      </button>
      <span className="mt-3 block font-semibold" role="status">{GLAMPING_UNAVAILABLE}</span>
    </p>
  )
}

export function GlampingPage({ page }: { page: Parameters<typeof resolveGlamping>[0] }) {
  const content = resolveGlamping(page)
  const gallery = content.gallery ?? []
  const showRules = content.showInfo || content.showCancellation
  return (
    <>
      <section className={`relative isolate flex min-h-[68vh] items-center justify-center overflow-hidden ${content.heroImage ? '' : 'bg-headline'}`}>
        {content.heroImage ? (
          <img src={content.heroImage.src} alt={content.heroImage.alt} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        ) : null}
        {content.heroImage ? <div className="absolute inset-0 -z-10 bg-headline/65" aria-hidden="true" /> : null}
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background">
            {content.heroLead} <span className="text-secondary-accent">{content.heroAccent}</span>
          </h1>
          {content.intro ? (
            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium text-background">{content.intro}</p>
          ) : null}
        </div>
      </section>
      <section id="book" className="bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase leading-[0.82] text-headline">
            {content.offerHeadingLead}<br /><span className="text-stroke">{content.offerHeadingAccent}</span>
          </h2>
          {content.offerParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 max-w-3xl text-lg leading-relaxed">{paragraph}</p>
          ))}
          {content.mailCopy ? (
            <div className="mt-6 max-w-3xl border-2 border-headline bg-secondary-accent p-5">
              <p className="font-display text-lg font-black uppercase text-headline">{content.mailHeading}</p>
              <p className="mt-2">{content.mailCopy}</p>
            </div>
          ) : null}
          <Unavailable />
          {content.details.length ? (
            <dl className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.details.map((detail) => (
                <div key={detail.label} className="border-2 border-headline bg-farm-beige p-5">
                  <dt className="font-display text-sm font-black uppercase">{detail.label}</dt>
                  <dd className="mt-2 text-lg font-semibold">{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
      {content.showAmenities ? (
      <section id="amenities" className="bg-farm-blue py-20">
        <div className={`mx-auto grid max-w-[1400px] gap-12 px-5 md:px-8 ${gallery.length ? 'lg:grid-cols-2' : ''}`}>
          {gallery.length ? (
            <ul className="grid gap-6">
              {gallery.map((image) => (
                <li key={image.src} className="overflow-hidden border-2 border-headline">
                  <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
                </li>
              ))}
            </ul>
          ) : null}
          <div className="border-2 border-headline bg-background p-7">
            <h2 className="font-display text-4xl font-black uppercase text-headline">{content.amenitiesHeading}</h2>
            <ul className="mt-6 space-y-3">
              {content.amenities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>
      ) : null}
      {!content.showAmenities && gallery.length ? (
      <section aria-label="Farm glamping photos" className="bg-background py-16">
        <ul className="mx-auto grid max-w-[1400px] gap-6 px-5 md:grid-cols-2 md:px-8">
          {gallery.map((image) => (
            <li key={image.src} className="overflow-hidden border-2 border-headline shadow-[8px_8px_0_var(--color-headline)]">
              <img src={image.src} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
            </li>
          ))}
        </ul>
      </section>
      ) : null}
      {content.showAddOns ? (
        <section id="add-ons" className="bg-background py-20">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase text-headline">{content.addOnsHeading}</h2>
            {content.addOnsNote ? <p className="mt-4 max-w-xl font-semibold">{content.addOnsNote}</p> : null}
            <div className="mt-10 grid gap-7 md:grid-cols-3">
              {content.addOns.map((addOn) => (
                <article key={addOn.name} className="border-2 border-headline p-7 shadow-[10px_10px_0_var(--color-secondary-accent)]">
                  <h3 className="font-display text-2xl font-black uppercase">{addOn.name}</h3>
                  <p className="mt-2 font-display font-black uppercase text-primary-accent">{addOn.price}</p>
                  {addOn.note ? <p className="mt-3 italic">{addOn.note}</p> : null}
                  {addOn.items.length ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5">{addOn.items.map((item) => <li key={item}>{item}</li>)}</ul>
                  ) : null}
                </article>
              ))}
            </div>
            <Unavailable />
          </div>
        </section>
      ) : null}
      {showRules ? (
      <section id="important-information" className="bg-farm-beige py-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <h2 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase text-headline">
            {content.showInfo ? content.infoHeading : 'Cancellation policy'}
          </h2>
          <div className={`mt-10 grid gap-8 ${content.showInfo && content.showCancellation ? 'lg:grid-cols-2' : ''}`}>
            {content.showInfo ? (
            <ul className="space-y-4 border-2 border-headline bg-background p-7">
              {content.info.map((tip) => <li key={tip.slice(0, 40)}>{tip}</li>)}
            </ul>
            ) : null}
            {content.showCancellation ? (
              <div className="border-2 border-headline bg-background p-7">
                <h3 className="font-display text-2xl font-black uppercase">Cancellation policy</h3>
                {content.cancellationNote ? <p className="mt-4">{content.cancellationNote}</p> : null}
                <ul className="mt-6 space-y-4">
                  {content.cancellation.map((item) => (
                    <li key={item.when}>
                      <span className="block font-display font-black uppercase">{item.when}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}
      {content.showCheese ? (
        <section id="cheese-trail" className="bg-farm-blue py-20">
          <div className="mx-auto max-w-3xl px-5">
            <p className="font-accent text-xl italic text-primary-accent">{content.cheeseKicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,6vw,5rem)] font-black uppercase text-headline">{content.cheeseHeading}</h2>
            <p className="mt-6 leading-relaxed">{content.cheeseCopy}</p>
            <a className="mt-6 inline-block font-display text-lg font-black uppercase underline" href={content.cheeseHref}>See all stops on the Cheese Trail</a>
          </div>
        </section>
      ) : null}
    </>
  )
}
