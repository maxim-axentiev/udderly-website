import { Container } from '@/components/layout/container'
import { footerLegalNav, primaryNav } from '@/lib/navigation'
import { SITE_NAME } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div>
          <p className="font-semibold">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-muted">
            Address and contact details will come from Site Settings.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs tracking-wide text-muted uppercase">Explore</p>
          <ul className="mt-3 space-y-2">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm no-underline hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs tracking-wide text-muted uppercase">Visit later</p>
          <p className="mt-3 text-sm text-muted">
            Social links will come from Site Settings.
          </p>
          <ul className="mt-4 space-y-2">
            {footerLegalNav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm no-underline hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="border-t border-border py-4">
        <p className="text-sm text-muted">
          © {year} {SITE_NAME}
        </p>
      </Container>
    </footer>
  )
}
