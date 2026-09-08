import { createFileRoute } from '@tanstack/react-router'

import { getCanonicalOrigin } from '@/lib/seo/canonical'
import { buildSitemapXml, getSitemapEntries } from '@/lib/seo/sitemap'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const origin = getCanonicalOrigin()

        if (!origin) {
          return new Response('Not Found', {
            status: 404,
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-store',
            },
          })
        }

        const entries = await getSitemapEntries()
        const xml = buildSitemapXml(origin, entries)

        return new Response(xml, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
