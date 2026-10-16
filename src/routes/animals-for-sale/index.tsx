import { createFileRoute } from '@tanstack/react-router'

import { AnimalsForSalePage } from '@/components/sale/animals-for-sale-page'
import hero from '@/assets/experiences/experiences-hero.webp'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import salePhoto from '@/assets/home/homepage-animals-for-sale.webp'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import highlandCta from '@/assets/herd/highland-cta.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import { buildSaleLists, resolveSalePageCopy } from '@/lib/sale/resolve'
import type { PublishedListing } from '@/lib/sale/resolve'
import { getAnimalsForSalePageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/animals-for-sale/')({
  loader: async () => {
    const data = (await getAnimalsForSalePageFn()) as {
      page: Record<string, unknown> | null
      listings: PublishedListing[]
    }
    const lists = buildSaleLists(data.listings)
    return {
      copy: resolveSalePageCopy(data.page),
      available: lists.available,
      sold: lists.sold,
    }
  },
  head: ({ loaderData }) =>
    createPageHead({
      title: loaderData?.copy.seoTitle ?? 'Animals for Sale',
      description: loaderData?.copy.seoDescription,
      path: '/animals-for-sale',
    }),
  component: AnimalsForSaleRoute,
})

function AnimalsForSaleRoute() {
  const data = Route.useLoaderData()
  return (
    <AnimalsForSalePage
      copy={data.copy}
      available={data.available}
      sold={data.sold}
      images={{
        hero,
        sale: salePhoto,
        'highland-hero': highlandHero,
        'highland-cta': highlandCta,
        'goat-icon-1': goatIcon1,
        'goat-icon-2': goatIcon2,
        'goat-icon-3': goatIcon3,
        'alpaca-walk': alpacaWalk,
      }}
    />
  )
}
