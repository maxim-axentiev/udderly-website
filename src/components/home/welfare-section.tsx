import { useState } from 'react'

import { HandIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageWelfare } from '@/content/homepage'

export function WelfareSection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="welfare" className="relative overflow-hidden bg-farm-beige py-20 md:py-28">
      <Container width="brand">
        <div className="max-w-4xl">
          <p className="font-accent text-xl italic text-primary-accent">
            {homepageWelfare.kicker}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,7vw,6.6rem)] font-black uppercase leading-[0.82] text-headline">
            {homepageWelfare.title}
          </h2>
          <p className="mt-6 inline-flex items-center gap-3 border-2 border-headline bg-secondary-accent px-4 py-2 font-display text-base font-extrabold uppercase text-headline shadow-[3px_3px_0_var(--color-headline)]">
            <HandIcon size={18} />
            <span className="hidden md:inline">{homepageWelfare.hintDesktop}</span>
            <span className="md:hidden">{homepageWelfare.hintMobile}</span>
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {homepageWelfare.points.map((point, i) => {
            const open = active === i
            return (
              <li key={point.name}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : i)}
                  className="group relative block w-full overflow-hidden border-2 border-headline bg-background text-left shadow-[6px_6px_0_var(--color-headline)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <img
                    src={point.image.src}
                    alt={point.image.alt}
                    width={point.image.width}
                    height={point.image.height}
                    loading="lazy"
                    decoding="async"
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block border-t-2 border-headline px-3 py-2 font-display text-lg font-black uppercase leading-tight text-headline">
                    {point.name}
                  </span>
                  <span
                    className={`absolute inset-0 flex items-center overflow-auto bg-primary-accent p-4 text-xs leading-relaxed text-primary-foreground transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm ${
                      open ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {point.copy}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-14 flex justify-center">
          <ButtonLink href={homepageWelfare.cta.href} size="lg">
            {homepageWelfare.cta.label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
