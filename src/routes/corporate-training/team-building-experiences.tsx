import { createFileRoute } from '@tanstack/react-router'

import { corporateImages } from '@/components/corporate/image-set'
import { TeamBuildingProgram } from '@/components/corporate/team-building-page'
import { loadCorporateProgram } from '@/lib/corporate/load'
import { resolveTeamBuilding } from '@/lib/corporate/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/corporate-training/team-building-experiences')({
  loader: () => loadCorporateProgram('team-building-experiences'),
  head: ({ loaderData }) =>
    createPageHead(
      resolveTeamBuilding(loaderData?.program ?? null, loaderData?.foundation ?? null, corporateImages).seo,
    ),
  component: TeamBuildingRoute,
})

function TeamBuildingRoute() {
  const data = Route.useLoaderData()
  return (
    <TeamBuildingProgram
      page={resolveTeamBuilding(data.program, data.foundation, corporateImages)}
    />
  )
}
