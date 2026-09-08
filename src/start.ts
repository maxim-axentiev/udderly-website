import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from '@tanstack/react-start'

import { migrationResponseForPath } from '@/lib/seo/redirects'

const wordpressMigrationMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    const migrationResponse = migrationResponseForPath(url.pathname)

    if (migrationResponse) {
      return migrationResponse
    }

    return next()
  },
)

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [
      createCsrfMiddleware({
        filter: (ctx) => ctx.handlerType === 'serverFn',
      }),
      wordpressMigrationMiddleware,
    ],
  }
})
