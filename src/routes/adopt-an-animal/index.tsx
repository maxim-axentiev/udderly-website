import { createFileRoute } from '@tanstack/react-router'

import { AdoptPage } from '@/components/adopt/adopt-page'
import hero from '@/assets/experiences/experiences-hero.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import goatIcon2 from '@/assets/herd/goat-icon-2.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import award2023 from '@/assets/experiences/tripadvisor-2023.png'
import award2024 from '@/assets/experiences/tripadvisor-2024.png'
import award2025 from '@/assets/experiences/tripadvisor-2025.png'
import award2026 from '@/assets/experiences/tripadvisor-2026.png'
import { buildAdoptionCards, resolveAdoptionPageCopy } from '@/lib/adopt/resolve'
import type { PublishedAdoption } from '@/lib/adopt/resolve'
import { getAdoptionPageFn } from '@/lib/sanity/server'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/adopt-an-animal/')({
  loader: async () => {
    const data = (await getAdoptionPageFn()) as {
      page: Record<string, unknown> | null
      offerings: PublishedAdoption[]
    }
    return {
      copy: resolveAdoptionPageCopy(data.page),
      cards: buildAdoptionCards(data.offerings),
    }
  },
  head: ({ loaderData }) =>
    createPageHead({
      title: loaderData?.copy.seoTitle ?? 'Adopt an Animal',
      description: loaderData?.copy.seoDescription,
      path: '/adopt-an-animal',
    }),
  component: AdoptRoute,
})

function AdoptRoute() {
  const { copy, cards } = Route.useLoaderData()
  return (
    <AdoptPage
      copy={copy}
      cards={cards}
      images={{
        hero,
        sponsor: goatIcon2,
        support: goatIcon3,
        awards: [
          { year: '2023', src: award2023 },
          { year: '2024', src: award2024 },
          { year: '2025', src: award2025 },
          { year: '2026', src: award2026 },
        ],
        cards: {
          'goat-icon-1': goatIcon1,
          'goat-icon-2': goatIcon2,
          'goat-icon-3': goatIcon3,
          'highland-hero': highlandHero,
          'alpaca-walk': alpacaWalk,
          'donkey-picnic': donkeyPicnic,
          'goat-cuddles': goatCuddles,
        },
      }}
    />
  )
}
