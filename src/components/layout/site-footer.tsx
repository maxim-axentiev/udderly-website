import { Link } from '@tanstack/react-router'

import { ArrowRightIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/button'
import { openConsentPreferences } from '@/lib/consent/model'
import { FOOTER_EMAIL_FALLBACK } from '@/lib/navigation'
import { chromeLinkProps, type SiteChrome } from '@/lib/site-chrome'

const linkClass =
  'rounded-sm text-sm leading-relaxed text-headline no-underline transition-colors hover:text-primary-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-accent'

const preferencesClass = `${linkClass} border-0 bg-transparent p-0 text-left`

export function SiteFooter({ chrome }: { chrome: SiteChrome }) {
  const year = new Date().getFullYear()
  const email = chrome.email || FOOTER_EMAIL_FALLBACK
  const columns = chrome.footerColumns.length
    ? chrome.footerColumns
    : [{ title: 'Explore', links: chrome.footerNav }]

  return (
    <footer className="border-t-2 border-headline bg-farm-beige text-headline">
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-8">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              to="/"
              aria-label={`${chrome.siteName} home`}
              className="block max-w-72 rounded-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary-accent"
            >
              <img src="/images/udderly-logo.png" alt="" width={1588} height={629} className="h-auto w-full" />
            </Link>
            <p className="mt-6 max-w-72 font-display text-3xl font-bold uppercase leading-tight">{chrome.tagline}</p>
            <ButtonLink href={chrome.bookCta.href} className="mt-5" openInNewTab={chrome.bookCta.openInNewTab}>
              {chrome.bookCta.label} <ArrowRightIcon />
            </ButtonLink>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-xl font-bold uppercase text-primary-accent">{column.title}</h2>
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
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-headline/20 pt-5 lg:flex-row lg:items-center">
          <p className="text-xs text-headline/75">© {year} Udderly Ridiculous Farm. All rights reserved.</p>
          <nav aria-label="Legal policies">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {chrome.legalNav.map((item) => (
                <li key={`${item.href}-${item.label}`}>
                  <a href={item.href} className={linkClass} {...chromeLinkProps(item)}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" className={preferencesClass} onClick={openConsentPreferences}>
                  Cookie preferences
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
