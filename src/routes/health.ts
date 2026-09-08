import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          { status: 'ok' },
          {
            status: 200,
            headers: {
              'Cache-Control': 'no-store',
            },
          },
        )
      },
    },
  },
})
