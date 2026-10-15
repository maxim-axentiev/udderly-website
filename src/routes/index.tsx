import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/components/home/home-page'
import { homepageSeo } from '@/content/homepage'
import { getGooglePlaceReviewsFn } from '@/lib/google-places/server'
import { getHomepageContentFn, getHomepageFaqsFn } from '@/lib/sanity/server'
import { getCanonicalOrigin } from '@/lib/seo/canonical'
import { createWebSiteJsonLd } from '@/lib/seo/json-ld'
import { createPageHead } from '@/lib/seo/page-head'
import { SITE_NAME } from '@/lib/site'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [googleReviews, faqs, homepage] = await Promise.all([
      getGooglePlaceReviewsFn(),
      getHomepageFaqsFn(),
      getHomepageContentFn(),
    ])
    return { googleReviews, faqs, homepage }
  },
  head: ({ loaderData }) => {
    const origin = getCanonicalOrigin()
    const seo = loaderData?.homepage.seo ?? homepageSeo

    return createPageHead({
      title: seo.title,
      description: seo.description,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
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
  const { googleReviews, faqs, homepage } = Route.useLoaderData()
  return <HomePage reviewsFeed={googleReviews} faqs={faqs} content={homepage} />
}
