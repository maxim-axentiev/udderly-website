import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import type { SiteChrome } from '@/lib/site-chrome'

export function SiteLayout({
  children,
  chrome,
}: {
  children: ReactNode
  chrome: SiteChrome
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-body-copy">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cta focus:px-4 focus:py-2 focus:font-display focus:font-extrabold focus:text-cta-foreground focus:uppercase"
      >
        Skip to content
      </a>
      <SiteHeader chrome={chrome} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter chrome={chrome} />
    </div>
  )
}
