import { createFileRoute } from '@tanstack/react-router'

import { TowerOfGoatsPage } from '@/components/experience/tower-of-goats-page'
import experiencesHero from '@/assets/experiences/experiences-hero.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import goatIcon1 from '@/assets/experiences/goat-icon-1.jpg'
import goatIcon3 from '@/assets/experiences/goat-icon-3.jpg'
import homepageExperiences from '@/assets/experiences/homepage-experiences.webp'
import tripadvisor2023 from '@/assets/experiences/tripadvisor-2023.png'
import tripadvisor2024 from '@/assets/experiences/tripadvisor-2024.png'
import tripadvisor2025 from '@/assets/experiences/tripadvisor-2025.png'
import tripadvisor2026 from '@/assets/experiences/tripadvisor-2026.png'
import { towerOfGoatsHead } from '@/lib/experiences/tower-of-goats'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/tower-of-goats-discovery-trail')({
  head: () => createPageHead(towerOfGoatsHead),
  component: TowerOfGoatsRoute,
})

function TowerOfGoatsRoute() {
  return (
    <TowerOfGoatsPage
      images={{
        hero: experiencesHero,
        gallery: {
          'goat-cuddles': goatCuddles,
          'homepage-experiences': homepageExperiences,
          'goat-icon-1': goatIcon1,
          'goat-icon-3': goatIcon3,
        },
        awards: [
          { year: '2023', src: tripadvisor2023 },
          { year: '2024', src: tripadvisor2024 },
          { year: '2025', src: tripadvisor2025 },
          { year: '2026', src: tripadvisor2026 },
        ],
      }}
    />
  )
}
