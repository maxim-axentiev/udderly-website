import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import type { FaqItem } from '@/lib/sanity/types'

export function ExperienceFaqs({ faqs }: { faqs: FaqItem[] | null | undefined }) {
  const visible = (faqs ?? []).filter((faq) => faq.question)

  if (!visible.length) {
    return null
  }

  return (
    <section className="py-12 md:py-16" aria-labelledby="experience-faqs-heading">
      <h2 id="experience-faqs-heading" className="text-2xl font-semibold md:text-3xl">
        FAQs
      </h2>
      <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-surface">
        {visible.map((faq) => (
          <details key={faq._id} className="group p-4">
            <summary className="cursor-pointer list-none font-medium marker:content-none">
              <span className="flex items-start justify-between gap-4">
                {faq.question}
                <span aria-hidden="true" className="text-muted group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden text-muted group-open:inline">
                  −
                </span>
              </span>
            </summary>
            <div className="pt-3 text-muted">
              <PortableTextRenderer value={faq.answer} />
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
