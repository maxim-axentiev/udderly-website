import { createFileRoute, notFound } from '@tanstack/react-router'

import { ExperienceTemplate } from '@/components/experience/experience-template'
import { isReservedExperienceSlug } from '@/lib/experiences/paths'
import { getExperienceBySlugFn } from '@/lib/sanity/server'
import type { ExperiencePageData } from '@/lib/sanity/types'
import { createExperienceHead } from '@/lib/seo/experience-head'

function splatSlug(splat: string | undefined): string | undefined {
  if (!splat) {
    return undefined
  }

  const slug = splat.replace(/^\/+|\/+$/g, '')
  if (!slug || slug.includes('/')) {
    return undefined
  }

  return slug
}

export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const slug = splatSlug(params._splat)

    if (!slug || isReservedExperienceSlug(slug)) {
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
