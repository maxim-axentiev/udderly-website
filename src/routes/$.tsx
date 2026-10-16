import { createFileRoute, notFound } from '@tanstack/react-router'

import { ExperienceTemplate } from '@/components/experience/experience-template'
import { routableExperienceSlug } from '@/lib/routes/paths'
import { getExperienceBySlugFn } from '@/lib/sanity/server'
import type { ExperiencePageData } from '@/lib/sanity/types'
import { createExperienceHead } from '@/lib/seo/experience-head'

export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slug = routableExperienceSlug(params._splat)

    if (!slug) {
      throw notFound({
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      })
    }

    const experience = (await getExperienceBySlugFn({
      data: slug,
    })) as ExperiencePageData | null

    if (!experience) {
      throw notFound({
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      })
    }

    return { experience }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.experience) {
      return {}
    }

    return createExperienceHead(loaderData.experience)
  },
  component: ExperienceCatchAllPage,
})

function ExperienceCatchAllPage() {
  const { experience } = Route.useLoaderData()

  return <ExperienceTemplate experience={experience} />
}
