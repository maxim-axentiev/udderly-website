import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageHero } from '@/content/homepage'

export function HeroSection() {
  const { image } = homepageHero

  return (
    <section className="relative overflow-hidden bg-farm-beige">
      <div
        className="farm-dots absolute -left-10 top-12 h-28 w-28 rotate-12 opacity-20"
        aria-hidden="true"
      />
      <Container
        width="brand"
        className="grid min-h-[760px] items-center gap-10 py-14 lg:grid-cols-[0.88fr_1.12fr] lg:py-20"
      >
        <div className="relative z-10 lg:pb-14">
          <h1 className="max-w-3xl font-display text-[clamp(4.6rem,10vw,9.5rem)] font-black uppercase leading-[0.75] text-headline">
            {homepageHero.headlineBefore}{' '}
            <span className="relative inline-block text-primary-accent after:absolute after:-bottom-2 after:left-1 after:h-2 after:w-full after:-rotate-1 after:bg-secondary-accent">
              {homepageHero.headlineAccent}
            </span>{' '}
            {homepageHero.headlineAfter}
          </h1>
          <p className="mt-10 max-w-xl text-lg font-medium leading-relaxed md:text-xl">
            {homepageHero.copy}
          </p>
          <div className="mt-8">
            <ButtonLink href={homepageHero.cta.href} size="lg">
              {homepageHero.cta.label} <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[690px] pb-12 lg:pb-0">
          <div
            className="absolute -right-10 top-10 h-[80%] w-[85%] rotate-3 rounded-[48%_52%_42%_58%/45%_40%_60%_55%] bg-secondary-accent"
            aria-hidden="true"
          />
          <div className="absolute -left-2 bottom-2 z-20 -rotate-6 bg-primary-accent px-5 py-3 font-accent text-lg italic text-primary-foreground shadow-[5px_5px_0_var(--color-headline)] md:text-2xl">
            {homepageHero.sticker}
          </div>
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            fetchPriority="high"
            decoding="async"
            className="relative z-10 ml-auto aspect-[4/5] w-[88%] rotate-2 rounded-[45%_45%_10%_10%/25%_25%_8%_8%] border-[5px] border-background object-cover object-center shadow-[12px_14px_0_var(--color-headline)]"
          />
          <div className="gentle-float absolute -right-1 -top-5 z-20 flex size-28 items-center justify-center rounded-full border-2 border-headline bg-background p-3 text-center font-display text-lg font-black uppercase leading-none text-headline shadow-[4px_4px_0_var(--color-primary-accent)] md:size-36 md:text-2xl">
            Ooh,
            <br />
            amazing
          </div>
        </div>
      </Container>
    </section>
  )
}
