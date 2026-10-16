import { createFileRoute, notFound } from '@tanstack/react-router'

import { SaleAnimalPage } from '@/components/sale/sale-animal-page'
import highlandCta from '@/assets/herd/highland-cta.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import chart from '@/assets/herd/sizing-chart-cows.webp'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import { SITE_NAME } from '@/lib/site'
import { SPECIES_LABEL } from '@/lib/sale/content'
import { findSaleAnimal } from '@/lib/sale/resolve'
import type { PublishedListing } from '@/lib/sale/resolve'
import { getAnimalsForSalePageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

const portraits = {
  'highland-hero': highlandHero,
  'highland-cta': highlandCta,
  'goat-icon-1': goatIcon1,
  'goat-icon-2': goatIcon2,
  'goat-icon-3': goatIcon3,
  'alpaca-walk': alpacaWalk,
} as const

export const Route = createFileRoute('/animals-for-sale/$slug')({
  loader: async ({ params }) => {
    const data = (await getAnimalsForSalePageFn()) as { listings: PublishedListing[] }
    const animal = findSaleAnimal(params.slug, data.listings ?? [])
    if (!animal) {
      throw notFound({
        headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
      })
    }
    return { animal }
  },
  head: ({ loaderData }) => {
    const animal = loaderData?.animal
    if (!animal) return {}
    const label = SPECIES_LABEL[animal.species]
    return createPageHead({
      title: `${animal.name} — ${label} | ${SITE_NAME}`,
      description: `Meet ${animal.name}, ${animal.species === 'cow' ? 'a mini Highland cow' : label.toLowerCase()} raised on our Ontario farm${animal.sold ? ' (now sold)' : ' and looking for a new home'}.`,
      path: `/animals-for-sale/${animal.slug}`,
    })
  },
  component: SaleAnimalRoute,
})

function SaleAnimalRoute() {
  const { animal } = Route.useLoaderData()
  return (
    <SaleAnimalPage
      animal={animal}
      images={{
        portrait: portraits[animal.imageKey],
        dam: highlandHero,
        sire: highlandCta,
        chart,
      }}
    />
  )
}
