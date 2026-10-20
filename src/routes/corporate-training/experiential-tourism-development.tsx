import { createFileRoute } from '@tanstack/react-router'

import { corporateImages } from '@/components/corporate/image-set'
import { TourismProgram } from '@/components/corporate/tourism-page'
import { loadCorporateProgram } from '@/lib/corporate/load'
import { resolveTourism } from '@/lib/corporate/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/corporate-training/experiential-tourism-development')({
  loader: () => loadCorporateProgram('experiential-tourism-development'),
  head: ({ loaderData }) =>
    createPageHead(
      resolveTourism(loaderData?.program ?? null, loaderData?.foundation ?? null, corporateImages).seo,
    ),
  component: TourismRoute,
})

function TourismRoute() {
  const data = Route.useLoaderData()
  return <TourismProgram page={resolveTourism(data.program, data.foundation, corporateImages)} />
}
