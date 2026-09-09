import { Link } from '@tanstack/react-router'

import { Card } from '@/components/ui/card'
import { CmsImage } from '@/components/ui/cms-image'
import {
  experienceCategoryLabel,
  experienceSeasonLabel,
} from '@/lib/experiences/labels'
import { isSanityImage } from '@/lib/sanity/image'
import type { ExperienceCardData } from '@/lib/sanity/types'

export function ExperienceCard({ experience }: { experience: ExperienceCardData }) {
  const species = experience.animalSpecies
    ?.map((item) => item.title)
    .filter(Boolean)
    .join(', ')
  const category = experienceCategoryLabel(experience.category)
  const season = experienceSeasonLabel(experience.season)
  const meta = [experience.priceDisplay, experience.duration].filter(Boolean).join(' · ')
  const tags = [species, category, season].filter(Boolean)

  return (
    <Card>
      <Link
        to="/$"
        params={{ _splat: experience.slug }}
        className="block no-underline"
      >
        <div className="aspect-4/3 bg-border">
          {isSanityImage(experience.heroImage) ? (
            <CmsImage
              image={experience.heroImage}
              alt={experience.heroImage.alt ?? experience.title}
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            />
          ) : null}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{experience.title}</h2>
          {experience.shortDescription ? (
            <p className="mt-2 text-sm text-muted">{experience.shortDescription}</p>
          ) : null}
          {meta ? <p className="mt-3 text-sm font-medium">{meta}</p> : null}
          {tags.length ? (
            <p className="mt-2 text-xs tracking-wide text-muted uppercase">
              {tags.join(' · ')}
            </p>
          ) : null}
        </div>
      </Link>
    </Card>
  )
}
