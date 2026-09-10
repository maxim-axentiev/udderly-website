import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageMedia } from '@/content/homepage'

import { MediaCarousel } from './media-carousel'

export function MediaSection() {
  return (
    <section id="media" className="overflow-hidden bg-farm-blue py-20 md:py-28">
      <Container width="brand">
        <div className="max-w-4xl">
          <p className="font-accent text-xl italic text-primary-accent">
            {homepageMedia.kicker}
          </p>
          <h2 className="mt-3 font-display text-[clamp(3.4rem,7.5vw,7rem)] font-black uppercase leading-[0.8] text-headline">
            {homepageMedia.title}
          </h2>
        </div>

        <MediaCarousel />

        <div className="mt-14 flex justify-center">
          <ButtonLink href={homepageMedia.cta.href} size="lg">
            {homepageMedia.cta.label} <ArrowRightIcon />
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
