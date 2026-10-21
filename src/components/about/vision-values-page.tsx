import type { VisionValuesPage } from '@/lib/about/model'

import { AboutHero, BookExperienceBand, FramedPhoto } from './sections'

const galleryRotation = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1']

export function VisionValues({ page }: { page: VisionValuesPage }) {
  return (
    <>
      <AboutHero lead={page.hero.lead} accent={page.hero.accent} image={page.hero.image} />
      {page.vision ? (
        <section className="overflow-hidden bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-[1300px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
                {page.vision.heading}
              </h2>
              {page.vision.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-6 text-base leading-relaxed md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
            <FramedPhoto
              image={page.vision.image}
              rotated={false}
              dots={<span aria-hidden="true" className="farm-dots absolute -bottom-5 -right-4 h-16 w-28 opacity-60" />}
            />
          </div>
        </section>
      ) : null}
      {page.gallery?.length ? (
        <section aria-label="Photos from the farm" className="border-y-2 border-headline bg-farm-beige py-16 md:py-20">
          <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-8 px-5 md:gap-10 md:px-8">
            {page.gallery.map((photo, index) => (
              <div
                key={`${photo.src}-${index}`}
                className={`w-56 overflow-hidden border-2 border-headline shadow-[8px_8px_0_var(--color-headline)] transition-transform duration-300 hover:-translate-y-1 md:w-64 ${galleryRotation[index % galleryRotation.length]}`}
              >
                <img src={photo.src} alt={photo.alt} width={640} height={480} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {page.values ? (
        <section className="overflow-hidden bg-background py-20 md:py-28">
          <div className="mx-auto grid max-w-[1300px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.05fr]">
            <FramedPhoto
              image={page.values.image}
              rotated
              shadow="shadow-[12px_12px_0_var(--color-secondary-accent)]"
              dots={<span aria-hidden="true" className="farm-dots absolute -bottom-5 -left-4 h-16 w-28 opacity-60" />}
            />
            <div>
              <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
                {page.values.heading}
              </h2>
              <ul className="mt-8 space-y-6">
                {page.values.items.map((value) => (
                  <li key={value.title} className="flex items-start gap-4">
                    <span className="mt-1.5 size-3 shrink-0 rotate-45 bg-secondary-accent" aria-hidden="true" />
                    <div>
                      <p className="font-display text-2xl font-black uppercase leading-tight text-headline">{value.title}</p>
                      <p className="mt-1 leading-relaxed">{value.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
      {page.cta ? <BookExperienceBand cta={page.cta} /> : null}
    </>
  )
}
