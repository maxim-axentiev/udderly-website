import { createFileRoute } from '@tanstack/react-router'

import { GiftCardPage } from '@/components/visit/gift-card-page'
import { getGiftCardPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveGiftCard } from '@/lib/visit/resolve'

export const Route = createFileRoute('/gift-card')({
  loader: () => getGiftCardPageFn(),
  head: ({ loaderData }) => createPageHead(resolveGiftCard(loaderData ?? null).seo),
  component: GiftCardRoute,
})

function GiftCardRoute() {
  const page = Route.useLoaderData()
  return <GiftCardPage page={page} />
}
