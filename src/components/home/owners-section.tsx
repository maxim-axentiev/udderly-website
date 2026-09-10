import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageOwners } from '@/content/homepage'

export function OwnersSection() {
  const { family, fun } = homepageOwners

  return (
    <section id="meet-the-herd" className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <div
        className="absolute right-0 top-0 h-28 w-28 bg-secondary-accent [clip-path:polygon(100%_0,100%_100%,0_0)]"
        aria-hidden="true"
      />
      <Container
        width="brand"
        className="grid max-w-[1360px] items-start gap-14 lg:grid-cols-[1fr_1.05fr]"
      >
        <div className="relative lg:sticky lg:top-8">
          <div className="photo-frame relative">
            <img
              src={family.src}
              alt={family.alt}
              width={family.width}
              height={family.height}
              loading="lazy"
              decoding="async"
              className="w-full border-2 border-headline object-cover"
            />
            <span className="absolute -bottom-5 -left-3 z-10 -rotate-2 border-2 border-headline bg-primary-accent px-4 py-2 font-display text-lg font-black uppercase text-primary-foreground">
              {family.caption}
            </span>
          </div>
          <div className="relative mt-16 rotate-2 border-2 border-headline bg-background p-3 shadow-[9px_9px_0_var(--color-secondary-accent)]">
            <img
              src={fun.src}
              alt={fun.alt}
              width={fun.width}
              height={fun.height}
              loading="lazy"
              decoding="async"
              className="w-full object-cover"
            />
            <p className="mt-3 px-1 pb-1 text-center font-accent text-lg italic text-headline">
              {fun.caption}
            </p>
          </div>
        </div>

        <div>
          <p className="font-accent text-xl italic text-primary-accent">
            {homepageOwners.kicker}
          </p>
          <h2 className="mt-3 font-display text-[clamp(3rem,6.5vw,5.6rem)] font-black uppercase leading-[0.84] text-headline">
            {homepageOwners.title}
          </h2>
          <div className="mt-7 space-y-5 text-base leading-relaxed md:text-lg">
            {homepageOwners.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <p className="mt-8 font-accent text-2xl italic text-headline">
            {homepageOwners.fastForward}
          </p>
          <ul className="mt-5 grid gap-3">
            {homepageOwners.milestones.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-border pb-3 font-display text-xl font-bold uppercase leading-tight text-headline"
              >
                <span
                  className="mt-1.5 size-3 shrink-0 rotate-45 bg-secondary-accent"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <ButtonLink href={homepageOwners.cta.href} size="lg" className="mt-9">
            {homepageOwners.cta.label} <ArrowRightIcon />
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
