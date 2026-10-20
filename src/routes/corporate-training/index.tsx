import { createFileRoute } from '@tanstack/react-router'

import { corporateImages } from '@/components/corporate/image-set'
import { CorporateLanding } from '@/components/corporate/landing-page'
import { loadCorporateLanding } from '@/lib/corporate/load'
import { resolveCorporateLanding } from '@/lib/corporate/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/corporate-training/')({
  loader: () => loadCorporateLanding(),
  head: ({ loaderData }) =>
    createPageHead(
      resolveCorporateLanding(
        loaderData?.page ?? null,
        loaderData?.programs ?? [],
        loaderData?.foundation ?? null,
        corporateImages,
      ).seo,
    ),
  component: CorporateTrainingRoute,
})

function CorporateTrainingRoute() {
  const data = Route.useLoaderData()
  const page = resolveCorporateLanding(data.page, data.programs, data.foundation, corporateImages)
  return <CorporateLanding page={page} />
}
