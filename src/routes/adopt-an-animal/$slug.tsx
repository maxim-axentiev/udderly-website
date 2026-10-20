import { createFileRoute, notFound } from '@tanstack/react-router'

import { AnimalAdoptionPage } from '@/components/adopt/animal-adoption-page'
import hero from '@/assets/experiences/experiences-hero.webp'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import { adoptionDetailHead } from '@/lib/adopt/content'
import { findAdoptionAnimal, resolveAdoptionDetail, resolveAdoptionPageCopy } from '@/lib/adopt/resolve'
import type { PublishedAdoption } from '@/lib/adopt/resolve'
import { getAdoptionPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/adopt-an-animal/$slug')({
  loader: async ({ params }) => {
    const data = (await getAdoptionPageFn()) as {
      page: Record<string, unknown> | null
      offerings: PublishedAdoption[]
    }
    const animal = findAdoptionAnimal(
      params.slug,
      data.offerings ?? [],
      data.page?.manageCollection === true,
    )
    if (!animal) {
      throw notFound({
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
      })
    }
    const detail = resolveAdoptionDetail(animal, data.offerings ?? [])
    return {
      animal,
      copy: resolveAdoptionPageCopy(data.page),
      detail,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.animal) return {}
    const head = adoptionDetailHead(loaderData.animal.name, loaderData.detail.tagline)
    return createPageHead({
      title: loaderData.detail.seoTitle ?? head.title,
      description: loaderData.detail.seoDescription ?? head.description,
      ogTitle: head.ogTitle,
      path: `/adopt-an-animal/${loaderData.animal.slug}`,
    })
  },
  component: AdoptionAnimalRoute,
})

function AdoptionAnimalRoute() {
  const { animal, copy, detail } = Route.useLoaderData()
  return (
    <AnimalAdoptionPage
      animal={animal}
      copy={copy}
      detail={detail}
      images={{
        hero,
        gallery: [goatIcon2, goatIcon1, goatIcon3],
        support: goatIcon3,
      }}
    />
  )
}
