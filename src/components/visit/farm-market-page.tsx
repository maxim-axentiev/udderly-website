import farmStore from '@/assets/home/homepage-store.webp'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import experiences from '@/assets/home/homepage-experiences.webp'
import urbort2 from '@/assets/home/urbort-2.webp'
import urbort3 from '@/assets/home/urbort-3.webp'
import { BookExperienceBand } from '@/components/about/sections'
import { ArrowRightIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/button'
import { ICE_CREAM_PATH } from '@/lib/visit/model'
import { resolveFarmMarket } from '@/lib/visit/resolve'

const gallery = [
  { src: farmStore, alt: 'Looking through the doorway into the Farm Market Store' },
  { src: urbort2, alt: 'Visitors browsing the store after their experience' },
  { src: urbort3, alt: 'A closer look at the local goods in the store' },
  { src: experiences, alt: 'Guests at the farm after visiting the store' },
]

export function FarmMarketPage({ page }: { page: Parameters<typeof resolveFarmMarket>[0] }) {
  const content = resolveFarmMarket(page)
  const photos = content.gallery ?? gallery
  const hero = content.heroImage ?? { src: farmStore, alt: 'Looking through the doorway into the Farm Market Store with wooden barrels and local products' }
  return (
    <>
      <section className="bg-farm-beige py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
          <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-black uppercase leading-[0.82] text-headline">
            {content.heroLead} <span className="text-secondary-accent">{content.heroAccent}</span>
          </h1>
        </div>
      </section>
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <div className="mx-auto grid max-w-[1300px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">{content.introHeading}</h2>
            <p className="mt-6 text-base leading-relaxed md:text-lg">{content.intro}</p>
          </div>
          <img src={hero.src} alt={hero.alt} className="aspect-[4/3] w-full rotate-2 border-2 border-headline object-cover shadow-[12px_12px_0_var(--color-headline)]" />
        </div>
      </section>
      <section className="bg-farm-blue py-20 md:py-28">
        <div className="mx-auto grid max-w-[1300px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">{content.localHeading}</h2>
            {content.localParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-4 text-base leading-relaxed md:text-lg">{paragraph}</p>
            ))}
          </div>
          {content.showStat ? (
            <div className="border-2 border-headline bg-background p-8 text-center shadow-[10px_10px_0_var(--color-headline)] md:p-12">
              <p className="font-display text-[clamp(4.5rem,10vw,8.5rem)] font-black leading-[0.8] text-primary-accent tabular-nums">{content.statValue}</p>
              <p className="mt-3 font-display text-2xl font-black uppercase leading-tight text-headline">{content.statLabel}</p>
              <p className="mt-2 font-accent text-lg italic text-headline">{content.statNote}</p>
            </div>
          ) : null}
        </div>
      </section>
      {content.showGallery ? (
      <section aria-label="Photos from the Farm Market Store" className="border-y-2 border-headline bg-farm-beige py-16 md:py-20">
        <ul className="mx-auto grid max-w-[1300px] gap-8 px-5 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {photos.map((photo, index) => (
            <li key={photo.alt} className={`overflow-hidden border-2 border-headline shadow-[8px_8px_0_var(--color-headline)] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}>
              <img src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full object-cover" />
            </li>
          ))}
        </ul>
      </section>
      ) : null}
      {content.showIceCream ? (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-[1300px] items-center gap-14 px-5 md:px-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">{content.iceHeading}</h2>
              <p className="mt-6 text-base leading-relaxed md:text-lg">{content.iceCopy}</p>
              <ButtonLink href={ICE_CREAM_PATH} size="lg" className="mt-8">
                {content.iceCta} <ArrowRightIcon />
              </ButtonLink>
            </div>
            <img src={iceCream} alt="Tubs of goat milk ice cream lined up on the counter" className="aspect-[4/3] w-full border-2 border-headline object-cover" />
          </div>
        </section>
      ) : null}
      <BookExperienceBand cta={{ heading: content.closeHeading, body: content.closeCopy, label: 'Book an Experience with Us', href: '/experiences' }} />
    </>
  )
}
