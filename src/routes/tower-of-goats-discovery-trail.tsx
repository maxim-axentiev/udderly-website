import { createFileRoute } from '@tanstack/react-router'

import { TowerOfGoatsPage } from '@/components/experience/tower-of-goats-page'
import { towerOfGoatsHead } from '@/lib/experiences/tower-of-goats'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/tower-of-goats-discovery-trail')({
  head: () => createPageHead(towerOfGoatsHead),
  component: TowerOfGoatsRoute,
})

function TowerOfGoatsRoute() {
  return <TowerOfGoatsPage />
}
