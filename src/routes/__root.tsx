import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  isNotFound,
} from '@tanstack/react-router'

import { NotFoundPage } from '@/components/layout/not-found-page'
import { SiteLayout } from '@/components/layout/site-layout'
import { createPageHead } from '@/lib/seo/page-head'
import { SITE_NAME } from '@/lib/site'
import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  head: ({ matches }) => {
    const missing = matches.some(
      (match) =>
        match.status === 'notFound' ||
        (match.error !== undefined && isNotFound(match.error)),
    )

    const notFoundHead = missing
      ? createPageHead({
          title: `Page not available | ${SITE_NAME}`,
          noindex: true,
        })
      : { meta: [], links: [], scripts: [] }

    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        ...notFoundHead.meta,
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        ...notFoundHead.links,
      ],
      scripts: notFoundHead.scripts,
    }
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function RootComponent() {
  return (
    <RootDocument>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
