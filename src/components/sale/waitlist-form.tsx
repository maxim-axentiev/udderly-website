import { ButtonLink } from '@/components/ui/button'
import { CONTACT_PATH } from '@/lib/contact/model'

export function WaitlistSection({ title, copy }: { title: string; copy: string }) {
  return (
    <section id="waitlist" className="scroll-mt-20 bg-farm-blue py-20 md:py-28">
      <div className="mx-auto max-w-[1000px] px-5 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,6.5vw,5.4rem)] font-black uppercase leading-[0.82] text-headline">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg">{copy}</p>
        <ButtonLink href={CONTACT_PATH} size="lg" className="mt-10">
          Contact
        </ButtonLink>
      </div>
    </section>
  )
}
