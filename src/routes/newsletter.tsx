import { createFileRoute } from '@tanstack/react-router'

import { NewsletterPage } from '@/components/newsletter/newsletter-page'
import { resolveNewsletterPage } from '@/lib/newsletter/resolve'
import { getNewsletterPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/newsletter')({
  loader: () => getNewsletterPageFn(),
  head: ({ loaderData }) => createPageHead(resolveNewsletterPage(loaderData ?? null).seo),
  component: NewsletterRoute,
})

function NewsletterRoute() {
  const page = Route.useLoaderData()
  return <NewsletterPage page={resolveNewsletterPage(page)} />
}
