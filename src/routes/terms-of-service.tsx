import { createFileRoute } from '@tanstack/react-router'

import { LegalPolicyPage } from '@/components/legal/policy-page'
import { resolveLegalPage } from '@/lib/legal/resolve'
import { getLegalPolicyFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/terms-of-service')({
  loader: () => getLegalPolicyFn({ data: 'terms-of-service' }),
  head: ({ loaderData }) => createPageHead(resolveLegalPage('terms-of-service', loaderData ?? null).seo),
  component: TermsRoute,
})

function TermsRoute() {
  const policy = Route.useLoaderData()
  return <LegalPolicyPage page={resolveLegalPage('terms-of-service', policy)} />
}
