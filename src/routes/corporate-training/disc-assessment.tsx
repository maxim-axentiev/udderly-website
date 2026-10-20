import { createFileRoute } from '@tanstack/react-router'

import { corporateImages } from '@/components/corporate/image-set'
import { DiscProgram } from '@/components/corporate/disc-page'
import { loadCorporateProgram } from '@/lib/corporate/load'
import { resolveDisc } from '@/lib/corporate/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/corporate-training/disc-assessment')({
  loader: () => loadCorporateProgram('disc-assessment'),
  head: ({ loaderData }) =>
    createPageHead(resolveDisc(loaderData?.program ?? null, loaderData?.foundation ?? null, corporateImages).seo),
  component: DiscRoute,
})

function DiscRoute() {
  const data = Route.useLoaderData()
  return <DiscProgram page={resolveDisc(data.program, data.foundation, corporateImages)} />
}
