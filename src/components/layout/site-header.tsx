import { Link } from '@tanstack/react-router'

import { ArrowRightIcon, MenuIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { bookCta, primaryNav } from '@/lib/navigation'

export function SiteHeader() {
  return (
    <header className="relative z-50 border-b-2 border-headline bg-background">
      <Container
        width="brand"
        className="flex min-h-24 items-center justify-between gap-6"
      >
        <Link
          to="/"
          className="group flex max-w-52 -rotate-1 flex-col font-display font-black uppercase leading-[0.78] text-headline no-underline md:max-w-60"
          aria-label="Udderly Ridiculous Farm Life home"
        >
          <span className="text-[1.7rem] md:text-[2rem]">Udderly Ridiculous</span>
          <span className="mt-1 flex items-center gap-2 text-sm tracking-[0.16em] text-primary-accent">
            <span className="h-1.5 w-7 bg-secondary-accent" aria-hidden="true" /> Farm
            Life
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-base font-bold uppercase text-headline no-underline decoration-secondary-accent decoration-[3px] underline-offset-8 hover:underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ButtonLink href={bookCta.href} className="hidden lg:inline-flex">
          {bookCta.label} <ArrowRightIcon size={18} />
        </ButtonLink>

        <details className="relative xl:hidden">
          <summary
            className="flex size-12 cursor-pointer list-none items-center justify-center rounded-full border-2 border-headline bg-farm-beige text-headline [&::-webkit-details-marker]:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon size={22} />
          </summary>
          <div className="absolute right-0 top-14 z-30 w-72 border-2 border-headline bg-background p-5 shadow-[7px_7px_0_var(--color-secondary-accent)]">
            <nav className="flex flex-col" aria-label="Mobile primary">
              {primaryNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="border-b border-border py-3 font-display text-xl font-bold uppercase text-headline no-underline"
                >
                  {item.label}
                </a>
              ))}
              <ButtonLink href={bookCta.href} className="mt-5">
                {bookCta.label}
              </ButtonLink>
            </nav>
          </div>
        </details>
      </Container>
    </header>
  )
}
