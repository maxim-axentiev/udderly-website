import { createFileRoute } from '@tanstack/react-router'

import { aboutImages } from '@/components/about/image-set'
import { FarmFaq } from '@/components/about/faq-page'
import { loadFaqPage } from '@/lib/about/load'
import { resolveFaqPage } from '@/lib/about/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/faq')({
  loader: () => loadFaqPage(),
  head: ({ loaderData }) =>
    createPageHead(
      resolveFaqPage(loaderData?.page ?? null, loaderData?.faqs ?? [], aboutImages).seo,
    ),
  component: FaqRoute,
})

function FaqRoute() {
  const data = Route.useLoaderData()
  return <FarmFaq page={resolveFaqPage(data.page, data.faqs, aboutImages)} />
}
