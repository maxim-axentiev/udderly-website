import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/layout/container'
import { getCanonicalOrigin } from '@/lib/seo/canonical'
import { createWebSiteJsonLd } from '@/lib/seo/json-ld'
import { createPageHead } from '@/lib/seo/page-head'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'

export const Route = createFileRoute('/')({
  head: () => {
    const origin = getCanonicalOrigin()

    return createPageHead({
      title: SITE_NAME,
      description: SITE_TAGLINE,
      path: '/',
      jsonLd: createWebSiteJsonLd({
        name: SITE_NAME,
        ...(origin ? { url: origin } : {}),
      }),
    })
  },
  component: HomePage,
})

function HomePage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-medium">{SITE_NAME}</h1>
      <p className="mt-4 text-muted">{SITE_TAGLINE}</p>
    </Container>
  )
}
