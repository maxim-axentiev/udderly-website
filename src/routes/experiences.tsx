import { createFileRoute } from '@tanstack/react-router'

import { ExperienceCard } from '@/components/experience/experience-card'
import { Container } from '@/components/layout/container'
import { Heading } from '@/components/ui/heading'
import { filterExperienceCards } from '@/lib/experiences/filters'
import { getExperienceHubFn } from '@/lib/sanity/server'
import type { ExperienceCardData } from '@/lib/sanity/types'
import { createPageHead } from '@/lib/seo/page-head'
import { SITE_NAME } from '@/lib/site'

export const Route = createFileRoute('/experiences')({
  loader: async () => {
    const experiences = (await getExperienceHubFn()) as ExperienceCardData[]
    return { experiences: filterExperienceCards(experiences) }
  },
  head: () =>
    createPageHead({
      title: `Experiences | ${SITE_NAME}`,
      description:
        'Farm experiences at Udderly Ridiculous Farm Life — animals, time outdoors, and a little personality.',
      path: '/experiences',
    }),
  component: ExperiencesHubPage,
})

function ExperiencesHubPage() {
  const { experiences } = Route.useLoaderData()

  return (
    <Container className="py-12 md:py-16">
      <Heading as="h1">Experiences</Heading>
      <p className="mt-3 max-w-narrow text-muted">
        Choose a visit. Filters for animal, season, age, and private or shared
        sessions can be added here later.
      </p>

      {experiences.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-lg border border-border bg-surface p-6 text-muted">
          No published experiences yet. Add an Experience in Sanity, set it to
          show on the website, and it will appear here.
        </p>
      )}
    </Container>
  )
}
