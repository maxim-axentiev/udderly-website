import { createFileRoute } from '@tanstack/react-router'

import { aboutImages } from '@/components/about/image-set'
import { Team } from '@/components/about/team-page'
import { loadTeam } from '@/lib/about/load'
import { resolveTeam } from '@/lib/about/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/team')({
  loader: () => loadTeam(),
  head: ({ loaderData }) =>
    createPageHead(resolveTeam(loaderData?.page ?? null, loaderData?.members ?? [], aboutImages).seo),
  component: TeamRoute,
})

function TeamRoute() {
  const data = Route.useLoaderData()
  return <Team page={resolveTeam(data.page, data.members, aboutImages)} />
}
