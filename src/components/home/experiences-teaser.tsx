import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { homepageExperienceCards } from '@/content/homepage'

export function ExperiencesTeaser() {
  return (
    <section id="experiences" className="overflow-hidden bg-farm-blue py-20 md:py-28">
      <Container width="brand">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <h2 className="font-display text-[clamp(2.8rem,8vw,8rem)] font-black uppercase leading-[0.78] text-headline">
            Pick your
            <br />
            <span className="text-stroke">ridiculousness.</span>
          </h2>
          <p className="max-w-sm border-l-4 border-primary-accent pl-5 text-lg font-semibold">
            Four ways to get ridiculous, mischievous, and happy...ous.
          </p>
        </div>

        <div className="mt-16 grid gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 lg:pb-14">
          {homepageExperienceCards.map((experience, index) => (
            <article
              key={experience.title}
              className={`group relative flex flex-col border-2 border-headline bg-background p-3 shadow-[7px_7px_0_var(--color-headline)] transition-transform duration-200 hover:-translate-y-2 ${experience.className}`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={experience.image.src}
                  alt={experience.image.alt}
                  width={experience.image.width}
                  height={experience.image.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute right-2 top-2 rounded-full border-2 border-headline px-3 py-1 font-display text-xs font-black uppercase text-headline ${
                    index % 2 === 0
                      ? 'bg-secondary-accent'
                      : 'bg-primary-accent text-primary-foreground'
                  }`}
                >
                  {experience.fact}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-3 pb-4">
                <h3 className="font-display text-3xl font-black uppercase leading-none text-headline">
                  {experience.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed">{experience.copy}</p>
                <a
                  href={experience.cta.href}
                  className="mt-5 inline-flex items-start gap-2 font-display text-base font-extrabold uppercase leading-tight text-primary-accent no-underline hover:underline"
                >
                  {experience.cta.label}{' '}
                  <ArrowRightIcon size={17} className="mt-1 shrink-0" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
