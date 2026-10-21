import { createFileRoute, redirect } from '@tanstack/react-router'

import { glampingAliasRedirect } from '@/lib/visit/model'

export const Route = createFileRoute('/experiences_/farm-glamping')({
  beforeLoad: () => {
    throw redirect(glampingAliasRedirect())
  },
})
