import { createFileRoute } from '@tanstack/react-router'

import { FarmMarketPage } from '@/components/visit/farm-market-page'
import { getFarmMarketPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveFarmMarket } from '@/lib/visit/resolve'

export const Route = createFileRoute('/farm-market-store')({
  loader: () => getFarmMarketPageFn(),
  head: ({ loaderData }) => createPageHead(resolveFarmMarket(loaderData ?? null).seo),
  component: FarmMarketRoute,
})

function FarmMarketRoute() {
  const page = Route.useLoaderData()
  return <FarmMarketPage page={page} />
}
