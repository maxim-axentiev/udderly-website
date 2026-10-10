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
import { getSiteChromeFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { mergeSiteChrome, type SiteChrome } from '@/lib/site-chrome'
import { SITE_NAME } from '@/lib/site'
import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  loader: async () => {
    try {
      const chrome = (await getSiteChromeFn()) as SiteChrome
      return { chrome }
    } catch {
      return { chrome: mergeSiteChrome(null) }
    }
  },
  head: ({ matches, loaderData }) => {
    const missing = matches.some(
      (match) =>
        match.status === 'notFound' ||
        (match.error !== undefined && isNotFound(match.error)),
    )
    const siteName = loaderData?.chrome?.siteName ?? SITE_NAME

    const notFoundHead = missing
      ? createPageHead({
          title: `Page not available | ${siteName}`,
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
  const data = Route.useLoaderData()
  const chrome = data?.chrome ?? mergeSiteChrome(null)

  return (
    <RootDocument>
      <SiteLayout chrome={chrome}>
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
