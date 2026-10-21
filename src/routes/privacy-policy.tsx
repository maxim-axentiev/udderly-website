import { createFileRoute } from '@tanstack/react-router'

import { LegalPolicyPage } from '@/components/legal/policy-page'
import { resolveLegalPage } from '@/lib/legal/resolve'
import { getLegalPolicyFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/privacy-policy')({
  loader: () => getLegalPolicyFn({ data: 'privacy-policy' }),
  head: ({ loaderData }) => createPageHead(resolveLegalPage('privacy-policy', loaderData ?? null).seo),
  component: PrivacyRoute,
})

function PrivacyRoute() {
  const policy = Route.useLoaderData()
  return <LegalPolicyPage page={resolveLegalPage('privacy-policy', policy)} />
}
