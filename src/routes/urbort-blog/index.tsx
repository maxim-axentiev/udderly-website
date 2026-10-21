import { createFileRoute } from '@tanstack/react-router'

import { urbortImages } from '@/components/urbort/images'
import { UrbortBoardPage } from '@/components/urbort/board'
import { getUrbortArticlesFn, getUrbortBlogPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveUrbortBoard } from '@/lib/urbort/resolve'

export const Route = createFileRoute('/urbort-blog/')({
  loader: async () => {
    const [page, articles] = await Promise.all([getUrbortBlogPageFn(), getUrbortArticlesFn()])
    return { page, articles }
  },
  head: ({ loaderData }) =>
    createPageHead(resolveUrbortBoard(loaderData?.page ?? null, loaderData?.articles ?? [], urbortImages).seo),
  component: UrbortIndexRoute,
})

function UrbortIndexRoute() {
  const data = Route.useLoaderData()
  return <UrbortBoardPage board={resolveUrbortBoard(data.page, data.articles, urbortImages)} />
}
