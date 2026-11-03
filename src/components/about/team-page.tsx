import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import type { TeamPage } from '@/lib/about/model'

import { AboutHero, BookExperienceBand } from './sections'

export function Team({ page }: { page: TeamPage }) {
  return (
    <>
      <AboutHero
        lead={page.hero.lead}
        accent={page.hero.accent}
        intro={page.hero.intro}
        image={page.hero.image}
      />
      {page.members.length ? (
      <section className="overflow-hidden bg-background py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {page.members.map((member, index) => (
              <article
                key={member.id}
                className={`group flex flex-col border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)] transition-transform duration-200 hover:-translate-y-2 ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
              >
                <div className="flex items-center justify-center px-3 pt-4 pb-2">
                  {member.image ? (
                    <img
                      src={member.image.src}
                      alt={member.image.alt}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="aspect-square w-full max-w-[320px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-square w-full max-w-[320px] items-center justify-center rounded-full bg-farm-beige px-4 text-center font-display text-sm font-black uppercase text-headline">
                      Photo not available yet
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3 pb-4">
                  <h2 className="font-display text-3xl font-black uppercase leading-none text-headline">{member.name}</h2>
                  {member.role ? <p className="mt-3 font-display text-sm font-black uppercase tracking-wide text-primary-accent">{member.role}</p> : null}
                  {member.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)} className="mt-3 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  {member.bio ? (
                    <div className="mt-3 leading-relaxed">
                      <PortableTextRenderer value={member.bio} />
                    </div>
                  ) : null}
                  {member.fact ? (
                    <p className="mt-4 border-l-4 border-primary-accent pl-4 font-accent text-lg italic text-headline">
                      {page.factLabel} {member.fact}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      ) : null}
      {page.cta ? <BookExperienceBand cta={page.cta} /> : null}
    </>
  )
}
