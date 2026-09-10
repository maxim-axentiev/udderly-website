import { homepageFaqs } from '@/content/homepage'

export function FaqSection() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className="font-display text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.82] text-headline">
          You have questions. We might have answers.
        </h2>
        <div className="mt-10 border-t-2 border-headline">
          {homepageFaqs.map((faq) => (
            <details key={faq.q} className="group border-b-2 border-headline py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-display text-xl font-bold uppercase leading-tight text-headline [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span
                  className="mt-1 shrink-0 text-primary-accent transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed">{faq.a}</p>
              {'list' in faq && faq.list ? (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  {faq.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {'a2' in faq && faq.a2 ? (
                <p className="mt-5 leading-relaxed">{faq.a2}</p>
              ) : null}
              {'list2' in faq && faq.list2 ? (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
                  {faq.list2.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
