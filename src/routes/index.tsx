import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/components/home/home-page'
import { homepageSeo } from '@/content/homepage'
import { getGooglePlaceReviewsFn } from '@/lib/google-places/server'
import { getHomepageFaqsFn } from '@/lib/sanity/server'
import { getCanonicalOrigin } from '@/lib/seo/canonical'
import { createWebSiteJsonLd } from '@/lib/seo/json-ld'
import { createPageHead } from '@/lib/seo/page-head'
import { SITE_NAME } from '@/lib/site'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [googleReviews, faqs] = await Promise.all([
      getGooglePlaceReviewsFn(),
      getHomepageFaqsFn(),
    ])
    return { googleReviews, faqs }
  },
  head: () => {
    const origin = getCanonicalOrigin()

    return createPageHead({
      title: homepageSeo.title,
      description: homepageSeo.description,
      ogTitle: homepageSeo.ogTitle,
      ogDescription: homepageSeo.ogDescription,
      path: '/',
      jsonLd: createWebSiteJsonLd({
        name: SITE_NAME,
        ...(origin ? { url: origin } : {}),
      }),
    })
  },
  component: HomeRoute,
})

function HomeRoute() {
  const { googleReviews, faqs } = Route.useLoaderData()
  return <HomePage reviewsFeed={googleReviews} faqs={faqs} />
}
