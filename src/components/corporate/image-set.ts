import experiencesHero from '@/assets/experiences/experiences-hero.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import homepageExperiences from '@/assets/experiences/homepage-experiences.webp'
import tripadvisor2023 from '@/assets/experiences/tripadvisor-2023.png'
import tripadvisor2024 from '@/assets/experiences/tripadvisor-2024.png'
import tripadvisor2025 from '@/assets/experiences/tripadvisor-2025.png'
import tripadvisor2026 from '@/assets/experiences/tripadvisor-2026.png'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import highlandCta from '@/assets/herd/highland-cta.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import owners from '@/assets/home/homepage-meet-the-owners-normal-photo.webp'
import farmStore from '@/assets/home/homepage-store.webp'
import training from '@/assets/home/homepage-training.webp'

import type { CorporateImages } from '@/lib/corporate/images'

export const corporateImages: CorporateImages = {
  hero: experiencesHero,
  training,
  experiences: homepageExperiences,
  goatCuddles,
  alpacaWalk,
  highlandHero,
  highlandCta,
  donkeyPicnic,
  owners,
  farmStore,
  iceCream,
  awards: [
    { year: '2023', src: tripadvisor2023 },
    { year: '2024', src: tripadvisor2024 },
    { year: '2025', src: tripadvisor2025 },
    { year: '2026', src: tripadvisor2026 },
  ],
}
