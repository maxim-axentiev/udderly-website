import { createFileRoute } from '@tanstack/react-router'

import { GlampingPage } from '@/components/visit/glamping-page'
import { getFarmGlampingPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveGlamping } from '@/lib/visit/resolve'

export const Route = createFileRoute('/farm-glamping')({
  loader: () => getFarmGlampingPageFn(),
  head: ({ loaderData }) => createPageHead(resolveGlamping(loaderData ?? null).seo),
  component: FarmGlampingRoute,
})

function FarmGlampingRoute() {
  const page = Route.useLoaderData()
  return <GlampingPage page={page} />
}
