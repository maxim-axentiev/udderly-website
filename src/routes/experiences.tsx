import { createFileRoute } from '@tanstack/react-router'

import { ExperienceCard } from '@/components/experience/experience-card'
import { Container } from '@/components/layout/container'
import { Heading } from '@/components/ui/heading'
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
    <Container className="py-12 md:py-16">
      <Heading as="h1">{listing.heading}</Heading>
      <p className="mt-3 max-w-narrow text-muted">{listing.intro}</p>

      {listing.cards.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listing.cards.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-border bg-surface p-6 text-muted">
          {listing.emptyHeading ? (
            <>
              <span className="block font-medium">{listing.emptyHeading}</span>
              <span className="mt-2 block">{listing.emptyMessage}</span>
            </>
          ) : (
            listing.emptyMessage
          )}
        </p>
      )}
    </Container>
  )
}
