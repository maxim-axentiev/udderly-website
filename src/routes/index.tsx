import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
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
    <Container className="py-16 md:py-24">
      <Heading as="h1">{SITE_NAME}</Heading>
      <p className="mt-4 max-w-narrow text-lg text-muted">{SITE_TAGLINE}</p>
      <div className="mt-8">
        <ButtonLink href="/experiences">See experiences</ButtonLink>
      </div>
    </Container>
  )
}
