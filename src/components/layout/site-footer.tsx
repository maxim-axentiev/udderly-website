import { InstagramIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { chromeLinkProps, type SiteChrome } from '@/lib/site-chrome'

const socialButtonClass =
  'flex size-12 items-center justify-center rounded-full border-2 border-headline no-underline transition-transform'

export function SiteFooter({ chrome }: { chrome: SiteChrome }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t-2 border-headline bg-farm-beige">
      <Container width="brand" className="py-14">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1.5fr_0.5fr]">
          <div>
            <p className="max-w-sm font-display text-5xl font-black uppercase leading-[0.8] text-headline">
              Udderly
              <br />
              <span className="text-primary-accent">Ridiculous</span>
              <br />
              Farm Life
            </p>
            <p className="mt-5 max-w-xs font-accent text-lg italic text-headline">
              {chrome.tagline}
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-4 self-start"
            aria-label="Footer"
          >
            {chrome.footerNav.map((item) => (
              <a
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="font-display text-xl font-bold uppercase text-headline no-underline hover:text-primary-accent hover:underline"
                {...chromeLinkProps(item)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex items-start gap-3">
              <a
                href={chrome.social.instagram}
                aria-label="Instagram"
                className={`${socialButtonClass} bg-secondary-accent text-headline hover:-rotate-6`}
                {...(chrome.social.instagram.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={chrome.social.tiktok}
                aria-label="TikTok"
                className={`${socialButtonClass} bg-background font-display text-lg font-black text-headline hover:rotate-6`}
                {...(chrome.social.tiktok.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                TT
              </a>
              {chrome.social.facebook ? (
                <a
                  href={chrome.social.facebook}
                  aria-label="Facebook"
                  className={`${socialButtonClass} bg-background font-display text-lg font-black text-headline hover:-rotate-6`}
                  target="_blank"
                  rel="noreferrer"
                >
                  FB
                </a>
              ) : null}
              {chrome.social.youtube ? (
                <a
                  href={chrome.social.youtube}
                  aria-label="YouTube"
                  className={`${socialButtonClass} bg-background font-display text-lg font-black text-headline hover:rotate-6`}
                  target="_blank"
                  rel="noreferrer"
                >
                  YT
                </a>
              ) : null}
            </div>
            {chrome.email ? (
              <a href={`mailto:${chrome.email}`} className="text-sm font-semibold no-underline hover:underline">
                {chrome.email}
              </a>
            ) : null}
            {chrome.phone ? (
              <a href={`tel:${chrome.phone}`} className="text-sm font-semibold no-underline hover:underline">
                {chrome.phone}
              </a>
            ) : null}
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t-2 border-headline pt-5 text-sm font-semibold">
          <p>{chrome.locationLine}</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              © {year} {chrome.siteName}
            </span>
            {chrome.legalNav.map((item) => (
              <a
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="hover:underline"
                {...chromeLinkProps(item)}
              >
                {item.label}
              </a>
            ))}
          </p>
        </div>
      </Container>
    </footer>
  )
}
