import { createFileRoute } from '@tanstack/react-router'

import { LegalPolicyPage } from '@/components/legal/policy-page'
import { resolveLegalPage } from '@/lib/legal/resolve'
import { getLegalPolicyFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/cookies-policy')({
  loader: () => getLegalPolicyFn({ data: 'cookies-policy' }),
  head: ({ loaderData }) => createPageHead(resolveLegalPage('cookies-policy', loaderData ?? null).seo),
  component: CookiesRoute,
})

function CookiesRoute() {
  const policy = Route.useLoaderData()
  return <LegalPolicyPage page={resolveLegalPage('cookies-policy', policy)} />
}