import { createFileRoute } from '@tanstack/react-router'

import { getCanonicalOrigin } from '@/lib/seo/canonical'
import { buildRobotsTxt } from '@/lib/seo/robots'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const origin = getCanonicalOrigin()
        const body = buildRobotsTxt(origin)

        return new Response(body, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
