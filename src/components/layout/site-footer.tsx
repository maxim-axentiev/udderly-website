import { Link } from '@tanstack/react-router'

import { ArrowRightIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/button'
import { FOOTER_EMAIL_FALLBACK } from '@/lib/navigation'
import { chromeLinkProps, type SiteChrome } from '@/lib/site-chrome'

const linkClass =
  'rounded-sm text-sm leading-relaxed text-footer-foreground/85 no-underline transition-colors hover:text-farm-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-farm-blue'

export function SiteFooter({ chrome }: { chrome: SiteChrome }) {
  const year = new Date().getFullYear()
  const email = chrome.email || FOOTER_EMAIL_FALLBACK
  const columns = chrome.footerColumns.length
    ? chrome.footerColumns
    : [{ title: 'Explore', links: chrome.footerNav }]

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-8">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              aria-label={`${chrome.siteName} home`}
              className="block max-w-72 rounded-sm font-display text-4xl font-black uppercase leading-[0.8] text-footer-foreground no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-farm-blue"
            >
              Udderly Ridiculous Farm Life
            </Link>
            <p className="mt-6 max-w-72 font-display text-3xl font-bold uppercase leading-tight">{chrome.tagline}</p>
            <ButtonLink href={chrome.bookCta.href} className="mt-5" openInNewTab={chrome.bookCta.openInNewTab}>
              {chrome.bookCta.label} <ArrowRightIcon />
            </ButtonLink>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-xl font-bold uppercase text-farm-blue">{column.title}</h2>
              <nav aria-label={`${column.title} footer navigation`} className="mt-4">
                <ul className="space-y-3">
                  {column.links.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a href={item.href} className={linkClass} {...chromeLinkProps(item)}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              {column.title === 'Stay Connected' ? (
                <div className="mt-6 space-y-2 text-sm leading-relaxed">
                  <p>{chrome.locationLine}</p>
                  <a href={`mailto:${email}`} className={`${linkClass} block break-words`}>
                    {email}
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-footer-foreground/20 pt-5 lg:flex-row lg:items-center">
          <p className="text-xs text-footer-foreground/75">© {year} Udderly Ridiculous Farm. All rights reserved.</p>
          <nav aria-label="Legal policies">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {chrome.legalNav.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a href={item.href} className={linkClass} {...chromeLinkProps(item)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
