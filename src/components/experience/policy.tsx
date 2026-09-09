import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import { hasPortableText } from '@/lib/portable-text'
import type { PolicyContent } from '@/lib/sanity/types'

export function ExperiencePolicy({
  policy,
  headingId,
  fallbackHeading,
}: {
  policy: PolicyContent
  headingId: string
  fallbackHeading: string
}) {
  if (!policy || policy.active === false || !hasPortableText(policy.content)) {
    return null
  }

  const heading = policy.heading?.trim() || fallbackHeading

  return (
    <section className="py-12 md:py-16" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-semibold md:text-3xl">
        {heading}
      </h2>
      <div className="mt-4 max-w-narrow text-muted">
        <PortableTextRenderer value={policy.content} />
      </div>
    </section>
  )
}
