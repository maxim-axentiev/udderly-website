import experiencesHero from '@/assets/experiences/experiences-hero.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import owners from '@/assets/home/homepage-meet-the-owners-normal-photo.webp'
import farmStore from '@/assets/home/homepage-store.webp'
import type { AboutImages } from '@/lib/about/images'

export const aboutImages: AboutImages = {
  hero: experiencesHero,
  owners,
  iceCream,
  highland: highlandHero,
  farmStore,
  alpaca: alpacaWalk,
  goats: goatCuddles,
  donkey: donkeyPicnic,
}
