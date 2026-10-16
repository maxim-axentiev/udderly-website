import { createFileRoute } from '@tanstack/react-router'

import { ExperiencesPresentation } from '@/components/experience/experiences-presentation'
import experiencesHero from '@/assets/experiences/experiences-hero.webp'
import feastOnLogo from '@/assets/experiences/feast-on-logo.webp'
import { buildApprovedExperienceListing } from '@/lib/experiences/approved-listing'
import {
  experiencesHubFallback,
  experiencesHubSeoInput,
  experiencesHubView,
} from '@/lib/experiences/hub'
import { filterExperienceCards } from '@/lib/experiences/filters'
import { getExperienceHubFn, getExperiencesHubContentFn } from '@/lib/sanity/server'
import type { ExperienceCardData } from '@/lib/sanity/types'
import { createPageHead } from '@/lib/seo/page-head'

export const Route = createFileRoute('/experiences')({
  loader: async () => {
    const [experiences, hub] = await Promise.all([
      getExperienceHubFn(),
      getExperiencesHubContentFn(),
    ])

    return {
      hub,
      listing: experiencesHubView(hub, filterExperienceCards(experiences as ExperienceCardData[])),
    }
  },
  head: ({ loaderData }) =>
    createPageHead(experiencesHubSeoInput(loaderData?.hub ?? experiencesHubFallback)),
  component: ExperiencesHubPage,
})

function ExperiencesHubPage() {
  const { listing } = Route.useLoaderData()

  return (
    <ExperiencesPresentation
      heroSrc={experiencesHero}
      feastSrc={feastOnLogo}
      cards={buildApprovedExperienceListing(listing.cards)}
    />
  )
}
