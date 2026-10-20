import { createFileRoute, notFound } from '@tanstack/react-router'

import { ExperienceTemplate } from '@/components/experience/experience-template'
import feastOnLogo from '@/assets/experiences/feast-on-logo.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import homepageExperiences from '@/assets/experiences/homepage-experiences.webp'
import tripadvisor2023 from '@/assets/experiences/tripadvisor-2023.png'
import tripadvisor2024 from '@/assets/experiences/tripadvisor-2024.png'
import tripadvisor2025 from '@/assets/experiences/tripadvisor-2025.png'
import tripadvisor2026 from '@/assets/experiences/tripadvisor-2026.png'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import { routableExperienceSlug } from '@/lib/routes/paths'
import { getExperienceBySlugFn, getExperienceFoundationFn } from '@/lib/sanity/server'
import type { ExperienceFoundation, ExperiencePageData } from '@/lib/sanity/types'
import { createExperienceHead } from '@/lib/seo/experience-head'

const detailImages = {
  goats: homepageExperiences,
  'goat-cuddles': goatCuddles,
  'goat-icon-1': goatIcon1,
  'goat-icon-2': goatIcon2,
  'goat-icon-3': goatIcon3,
  'alpaca-walk': alpacaWalk,
  'donkey-picnic': donkeyPicnic,
  'highland-hero': highlandHero,
  feast: feastOnLogo,
}

const detailAwards = [
  { year: '2023', src: tripadvisor2023 },
  { year: '2024', src: tripadvisor2024 },
  { year: '2025', src: tripadvisor2025 },
  { year: '2026', src: tripadvisor2026 },
]

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

    const [experience, foundation] = await Promise.all([
      getExperienceBySlugFn({ data: slug }) as Promise<ExperiencePageData | null>,
      getExperienceFoundationFn() as Promise<ExperienceFoundation>,
    ])

    if (!experience) {
      throw notFound({
        headers: {
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      })
    }

    return { experience, foundation }
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
  const { experience, foundation } = Route.useLoaderData()

  return <ExperienceTemplate experience={experience} images={detailImages} awards={detailAwards} foundation={foundation} />
}
