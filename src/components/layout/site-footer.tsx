import { InstagramIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { footerLegalNav, footerNav } from '@/lib/navigation'
import { SITE_NAME } from '@/lib/site'

export function SiteFooter() {
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
              Made with questionable judgement and excellent animal care.
            </p>
          </div>
          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-4 self-start"
            aria-label="Footer"
          >
            {footerNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-xl font-bold uppercase text-headline no-underline hover:text-primary-accent hover:underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-start gap-3 md:justify-end">
            <a
              href="#instagram"
              aria-label="Instagram"
              className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-secondary-accent text-headline no-underline transition-transform hover:-rotate-6"
            >
              <InstagramIcon size={20} />
            </a>
            <a
              href="#tiktok"
              aria-label="TikTok"
              className="flex size-12 items-center justify-center rounded-full border-2 border-headline bg-background font-display text-lg font-black text-headline no-underline transition-transform hover:rotate-6"
            >
              TT
            </a>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t-2 border-headline pt-5 text-sm font-semibold">
          <p>Ontario, Canada · Farm life, but make it ridiculous.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              © {year} {SITE_NAME}
            </span>
            {footerLegalNav.map((item) => (
              <a key={item.href} href={item.href} className="hover:underline">
                {item.label}
              </a>
            ))}
          </p>
        </div>
      </Container>
    </footer>
  )
}
