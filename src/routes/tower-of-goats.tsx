import { createFileRoute, redirect } from '@tanstack/react-router'

import { towerOfGoatsAliasRedirect } from '@/lib/experiences/approved-listing'

export const Route = createFileRoute('/tower-of-goats')({
  beforeLoad: () => {
    throw redirect(towerOfGoatsAliasRedirect())
  },
})
