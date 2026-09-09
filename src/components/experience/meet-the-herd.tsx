import { Card } from '@/components/ui/card'
import { CmsImage } from '@/components/ui/cms-image'
import { Heading } from '@/components/ui/heading'
import type { AnimalCardData } from '@/lib/sanity/types'

export function AnimalCard({ animal }: { animal: AnimalCardData }) {
  return (
    <Card>
      <div className="aspect-4/5 bg-border">
        <CmsImage
          image={animal.profileImage}
          alt={animal.profileImage?.alt ?? animal.name}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <div className="p-4">
        <p className="text-xs tracking-wide text-muted uppercase">
          {animal.speciesTitle ?? 'Farm friend'}
        </p>
        <h3 className="mt-1 text-xl font-semibold">{animal.name}</h3>
        {animal.shortIntro ? (
          <p className="mt-2 text-sm text-muted">{animal.shortIntro}</p>
        ) : null}
        {animal.funFact ? (
          <p className="mt-3 text-sm">
            <span className="font-medium">Fun fact: </span>
            {animal.funFact}
          </p>
        ) : null}
      </div>
    </Card>
  )
}

export function MeetTheHerd({ animals }: { animals: AnimalCardData[] | null | undefined }) {
  const visible = (animals ?? []).filter((animal) => animal?._id && animal.name)

  if (!visible.length) {
    return null
  }

  return (
    <section className="py-12 md:py-16" aria-labelledby="meet-the-herd-heading">
      <Heading id="meet-the-herd-heading">Meet the Herd</Heading>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((animal) => (
          <AnimalCard key={animal._id} animal={animal} />
        ))}
      </div>
    </section>
  )
}
