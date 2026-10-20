import { createFileRoute } from '@tanstack/react-router'

import { ExperiencesPresentation } from '@/components/experience/experiences-presentation'
import feastOnLogo from '@/assets/experiences/feast-on-logo.webp'
import experiencesHero from '@/assets/experiences/experiences-hero.webp'
import goatCuddles from '@/assets/experiences/goat-cuddles.jpg'
import homepageExperiences from '@/assets/experiences/homepage-experiences.webp'
import alpacaWalk from '@/assets/herd/alpaca-walk.jpg'
import donkeyPicnic from '@/assets/herd/donkey-picnic.jpg'
import highlandCta from '@/assets/herd/highland-cta.jpg'
import highlandHero from '@/assets/herd/highland-hero.jpg'
import animalsForSale from '@/assets/home/homepage-animals-for-sale.webp'
import glamping from '@/assets/home/homepage-glamping.webp'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import training from '@/assets/home/homepage-training.webp'
import { experiencesHubOrFallback, experiencesHubSeoInput } from '@/lib/experiences/hub'
import { resolveExperiencesHubPage } from '@/lib/experiences/hub-page'
import { filterExperienceCards } from '@/lib/experiences/filters'
import { getGooglePlaceReviewsFn } from '@/lib/google-places/server'
import { getExperienceHubFn, getExperiencesHubDocumentFn } from '@/lib/sanity/server'
import type { ExperienceCardData } from '@/lib/sanity/types'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/experiences')({
  loader: async () => {
    const [experiences, document, reviewsFeed] = await Promise.all([
      getExperienceHubFn(),
      getExperiencesHubDocumentFn(),
      getGooglePlaceReviewsFn(),
    ])
    const published = filterExperienceCards(experiences as ExperienceCardData[])
    return {
      hub: experiencesHubOrFallback(document),
      page: resolveExperiencesHubPage(document, published),
      reviewsFeed,
    }
  },
  head: ({ loaderData }) => createPageHead(experiencesHubSeoInput(loaderData?.hub ?? experiencesHubOrFallback(null))),
  component: ExperiencesHubPage,
})

function ExperiencesHubPage() {
  const { page, reviewsFeed } = Route.useLoaderData()
  return (
    <ExperiencesPresentation
      page={page}
      reviewsFeed={reviewsFeed}
      images={{
        hero: experiencesHero,
        goats: homepageExperiences,
        glamping,
        training,
        calves: animalsForSale,
        'ice-cream': iceCream,
        'goat-cuddles': goatCuddles,
        'highland-hero': highlandHero,
        'highland-cta': highlandCta,
        'alpaca-walk': alpacaWalk,
        'donkey-picnic': donkeyPicnic,
        feast: feastOnLogo,
      }}
    />
  )
}
