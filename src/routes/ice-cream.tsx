import { createFileRoute } from '@tanstack/react-router'

import { IceCreamPage } from '@/components/visit/ice-cream-page'
import { getIceCreamPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveIceCream } from '@/lib/visit/resolve'

export const Route = createFileRoute('/ice-cream')({
  loader: () => getIceCreamPageFn(),
  head: ({ loaderData }) => createPageHead(resolveIceCream(loaderData ?? null).seo),
  component: IceCreamRoute,
})

function IceCreamRoute() {
  const page = Route.useLoaderData()
  return <IceCreamPage page={page} />
}
