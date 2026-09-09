import { Card } from '@/components/ui/card'
import type { TestimonialItem } from '@/lib/sanity/types'

export function ExperienceTestimonials({
  testimonials,
}: {
  testimonials: TestimonialItem[] | null | undefined
}) {
  const visible = (testimonials ?? []).filter((item) => item.quote && item.guestName)

  if (!visible.length) {
    return null
  }

  return (
    <section className="py-12 md:py-16" aria-labelledby="experience-testimonials-heading">
      <h2 id="experience-testimonials-heading" className="text-2xl font-semibold md:text-3xl">
        Guest notes
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((item) => (
          <Card key={item._id} className="p-5">
            <blockquote className="text-lg leading-relaxed">“{item.quote}”</blockquote>
            <p className="mt-4 text-sm text-muted">
              {item.guestName}
              {item.source ? ` · ${item.source}` : ''}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}
