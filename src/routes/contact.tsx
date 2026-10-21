import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '@/components/contact/contact-page'
import { resolveContactPage } from '@/lib/contact/resolve'
import { getContactPageFn, getContactSettingsFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/contact')({
  loader: async () => {
    const [page, settings] = await Promise.all([getContactPageFn(), getContactSettingsFn()])
    return { page, settings }
  },
  head: ({ loaderData }) =>
    createPageHead(resolveContactPage(loaderData?.page ?? null, loaderData?.settings ?? null).seo),
  component: ContactRoute,
})

function ContactRoute() {
  const data = Route.useLoaderData()
  return <ContactPage page={resolveContactPage(data.page, data.settings)} />
}
