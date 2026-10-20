import { createFileRoute } from '@tanstack/react-router'

import { corporateImages } from '@/components/corporate/image-set'
import { SharedCorporateProgram } from '@/components/corporate/shared-program-page'
import { loadCorporateProgram } from '@/lib/corporate/load'
import { resolveSharedProgram } from '@/lib/corporate/resolve'
import { createPageHead } from '@/lib/seo/page-head'

const slug = 'the-power-of-conversation' as const

export const Route = createFileRoute('/corporate-training/the-power-of-conversation')({
  loader: () => loadCorporateProgram(slug),
  head: ({ loaderData }) =>
    createPageHead(resolveSharedProgram(slug, loaderData?.program ?? null, loaderData?.foundation ?? null, corporateImages).seo),
  component: PowerOfConversationRoute,
})

function PowerOfConversationRoute() {
  const data = Route.useLoaderData()
  return <SharedCorporateProgram page={resolveSharedProgram(slug, data.program, data.foundation, corporateImages)} />
}
