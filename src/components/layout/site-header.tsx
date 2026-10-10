import { Link } from '@tanstack/react-router'

import { ArrowRightIcon, MenuIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import {
  chromeLinkProps,
  type ChromeNavItem,
  type SiteChrome,
} from '@/lib/site-chrome'

const navLinkClass =
  'font-display text-base font-bold uppercase text-headline no-underline decoration-secondary-accent decoration-[3px] underline-offset-8 hover:underline'

const mobileNavLinkClass =
  'block border-b border-border py-3 font-display text-xl font-bold uppercase text-headline no-underline'

function DesktopNavItem({ item }: { item: ChromeNavItem }) {
  const link = (
    <a href={item.href} className={navLinkClass} {...chromeLinkProps(item)}>
      {item.label}
    </a>
  )

  if (!item.children?.length) {
    return link
  }

  return (
    <div className="group relative">
      {link}
      <ul className="invisible absolute left-0 top-full z-40 min-w-52 border-2 border-headline bg-background p-3 group-hover:visible group-focus-within:visible">
        {item.children.map((child) => (
          <li key={`${child.href}-${child.label}`}>
            <a
              href={child.href}
              className="block py-2 font-display text-sm font-bold uppercase text-headline no-underline hover:text-primary-accent"
              {...chromeLinkProps(child)}
            >
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SiteHeader({ chrome }: { chrome: SiteChrome }) {
  return (
    <header className="relative z-50 border-b-2 border-headline bg-background">
      <Container
        width="brand"
        className="flex min-h-24 items-center justify-between gap-6"
      >
        <Link
          to="/"
          className="group flex max-w-52 -rotate-1 flex-col font-display font-black uppercase leading-[0.78] text-headline no-underline md:max-w-60"
          aria-label={`${chrome.siteName} home`}
        >
          <span className="text-[1.7rem] md:text-[2rem]">Udderly Ridiculous</span>
          <span className="mt-1 flex items-center gap-2 text-sm tracking-[0.16em] text-primary-accent">
            <span className="h-1.5 w-7 bg-secondary-accent" aria-hidden="true" /> Farm
            Life
          </span>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Primary">
          {chrome.primaryNav.map((item) => (
            <DesktopNavItem key={`${item.href}-${item.label}`} item={item} />
          ))}
        </nav>

        <ButtonLink
          href={chrome.bookCta.href}
          className="hidden lg:inline-flex"
          openInNewTab={chrome.bookCta.openInNewTab}
        >
          {chrome.bookCta.label} <ArrowRightIcon size={18} />
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
              {chrome.primaryNav.map((item) => (
                <div key={`${item.href}-${item.label}`}>
                  <a
                    href={item.href}
                    className={mobileNavLinkClass}
                    {...chromeLinkProps(item)}
                  >
                    {item.label}
                  </a>
                  {item.children?.length ? (
                    <div className="pb-2 pl-3">
                      {item.children.map((child) => (
                        <a
                          key={`${child.href}-${child.label}`}
                          href={child.href}
                          className="block py-2 font-display text-base font-bold uppercase text-headline no-underline"
                          {...chromeLinkProps(child)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <ButtonLink
                href={chrome.bookCta.href}
                className="mt-5"
                openInNewTab={chrome.bookCta.openInNewTab}
              >
                {chrome.bookCta.label}
              </ButtonLink>
            </nav>
          </div>
        </details>
      </Container>
    </header>
  )
}
