import { createFileRoute } from '@tanstack/react-router'

import { aboutImages } from '@/components/about/image-set'
import { OurStory } from '@/components/about/our-story-page'
import { loadOurStory } from '@/lib/about/load'
import { resolveOurStory } from '@/lib/about/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/our-story')({
  loader: () => loadOurStory(),
  head: ({ loaderData }) => createPageHead(resolveOurStory(loaderData ?? null, aboutImages).seo),
  component: OurStoryRoute,
})

function OurStoryRoute() {
  const page = Route.useLoaderData()
  return <OurStory page={resolveOurStory(page, aboutImages)} />
}
