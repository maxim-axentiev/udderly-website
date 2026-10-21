import { createFileRoute, notFound } from '@tanstack/react-router'

import { UrbortArticle } from '@/components/urbort/article'
import { urbortImages } from '@/components/urbort/images'
import { getUrbortArticleFn, getUrbortBlogPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'
import { resolveUrbortArticle } from '@/lib/urbort/resolve'

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const Route = createFileRoute('/urbort-blog/$slug')({
  loader: async ({ params }) => {
    if (!SLUG.test(params.slug)) {
      throw notFound({ headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } })
    }
    const [page, article] = await Promise.all([
      getUrbortBlogPageFn(),
      getUrbortArticleFn({ data: params.slug }),
    ])
    const resolved = resolveUrbortArticle(article, page, urbortImages)
    if (!resolved || resolved.slug !== params.slug) {
      throw notFound({ headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } })
    }
    return { article: resolved }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.article) return createPageHead({ title: 'Page not available', noindex: true })
    return createPageHead(loaderData.article.seo)
  },
  component: UrbortArticleRoute,
})

function UrbortArticleRoute() {
  const data = Route.useLoaderData()
  return <UrbortArticle article={data.article} />
}
