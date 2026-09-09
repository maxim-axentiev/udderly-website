import { Link } from '@tanstack/react-router'

import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { bookCta, primaryNav } from '@/lib/navigation'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link to="/" className="text-sm font-semibold tracking-tight no-underline">
          {SITE_NAME}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {primaryNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted no-underline hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={bookCta.href} size="sm">
            {bookCta.label}
          </ButtonLink>
        </div>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-1.5 text-sm">
            Menu
          </summary>
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-border bg-surface p-3 shadow-sm">
            <nav aria-label="Mobile primary" className="flex flex-col gap-3">
              {primaryNav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-foreground no-underline"
                >
                  {item.label}
                </a>
              ))}
              <ButtonLink href={bookCta.href} size="sm">
                {bookCta.label}
              </ButtonLink>
            </nav>
          </div>
        </details>
      </Container>
    </header>
  )
}
