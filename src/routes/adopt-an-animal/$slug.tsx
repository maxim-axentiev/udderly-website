import { createFileRoute, notFound } from '@tanstack/react-router'

import { AnimalAdoptionPage } from '@/components/adopt/animal-adoption-page'
import hero from '@/assets/experiences/experiences-hero.webp'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import { adoptionDetailHead } from '@/lib/adopt/content'
import { findAdoptionAnimal } from '@/lib/adopt/resolve'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/adopt-an-animal/$slug')({
  loader: ({ params }) => {
    const animal = findAdoptionAnimal(params.slug)
    if (!animal) {
      throw notFound({
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
      })
    }
    return { animal }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.animal) return {}
    const head = adoptionDetailHead(loaderData.animal.name, loaderData.animal.tagline)
    return createPageHead({
      title: head.title,
      description: head.description,
      ogTitle: head.ogTitle,
      path: `/adopt-an-animal/${loaderData.animal.slug}`,
    })
  },
  component: AdoptionAnimalRoute,
})

function AdoptionAnimalRoute() {
  const { animal } = Route.useLoaderData()
  return (
    <AnimalAdoptionPage
      animal={animal}
      images={{
        hero,
        gallery: [goatIcon2, goatIcon1, goatIcon3],
        support: goatIcon3,
      }}
    />
  )
}
