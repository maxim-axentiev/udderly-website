import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import type { FaqPage } from '@/lib/about/model'

import { AboutHero, BookExperienceBand } from './sections'

export function FarmFaq({ page }: { page: FaqPage }) {
  return (
    <>
      <AboutHero lead={page.hero.lead} accent={page.hero.accent} image={page.hero.image} />
      {page.groups.map((group, index) => (
        <section key={group.id} className={`${index % 2 === 0 ? 'bg-background' : 'bg-farm-beige'} py-16 md:py-24`}>
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-black uppercase leading-[0.85] text-headline">
              {group.title}
            </h2>
            <div className="mt-10 border-t-2 border-headline">
              {group.items.map((faq) => (
                <details key={faq.id} className="group border-b-2 border-headline py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-display text-xl font-bold uppercase leading-tight text-headline [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <span className="mt-1 shrink-0 text-primary-accent transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 leading-relaxed">
                    <PortableTextRenderer value={faq.answer} />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ))}
      {page.cta ? <BookExperienceBand cta={page.cta} /> : null}
    </>
  )
}
