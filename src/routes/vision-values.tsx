import { createFileRoute } from '@tanstack/react-router'

import { aboutImages } from '@/components/about/image-set'
import { VisionValues } from '@/components/about/vision-values-page'
import { loadVisionValues } from '@/lib/about/load'
import { resolveVisionValues } from '@/lib/about/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/vision-values')({
  loader: () => loadVisionValues(),
  head: ({ loaderData }) => createPageHead(resolveVisionValues(loaderData ?? null, aboutImages).seo),
  component: VisionValuesRoute,
})

function VisionValuesRoute() {
  const page = Route.useLoaderData()
  return <VisionValues page={resolveVisionValues(page, aboutImages)} />
}
