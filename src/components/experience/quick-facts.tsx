import {
  experienceSeasonLabel,
  experienceSessionLabel,
} from '@/lib/experiences/labels'
import type { ExperiencePageData } from '@/lib/sanity/types'

type Fact = {
  label: string
  value: string
}

function experienceQuickFacts(experience: ExperiencePageData): Fact[] {
  const facts: Fact[] = []

  if (experience.priceDisplay) {
    facts.push({ label: 'Price', value: experience.priceDisplay })
  }
  if (experience.duration) {
    facts.push({ label: 'Duration', value: experience.duration })
  }
  if (experience.ageGuidance) {
    facts.push({ label: 'Age', value: experience.ageGuidance })
  }
  if (experience.groupSize) {
    facts.push({ label: 'Group size', value: experience.groupSize })
  }

  const season = experienceSeasonLabel(experience.season)
  if (season) {
    facts.push({ label: 'Season', value: season })
  }

  const session = experienceSessionLabel(experience.sessionType)
  if (session) {
    facts.push({ label: 'Format', value: session })
  }

  return facts
}

export function ExperienceQuickFacts({ experience }: { experience: ExperiencePageData }) {
  const facts = experienceQuickFacts(experience)

  if (!facts.length) {
    return null
  }

  return (
    <dl className="grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt className="text-xs tracking-wide text-muted uppercase">{fact.label}</dt>
          <dd className="mt-1 font-medium">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
