import { ArrowRightIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui/button'
import type { OurStoryPage, StoryChapter } from '@/lib/about/model'

import { AboutHero, FilledHeart } from './sections'

const tones = {
  default: 'bg-background',
  beige: 'bg-farm-beige',
  blue: 'bg-farm-blue',
} as const

function StoryImage({ chapter }: { chapter: StoryChapter }) {
  return (
    <div className={`relative ${chapter.imageOnLeft ? '-rotate-2' : 'rotate-2'}`}>
      <div className="overflow-hidden border-2 border-headline shadow-[12px_12px_0_var(--color-headline)]">
        <img
          src={chapter.image.src}
          alt={chapter.image.alt}
          width={1000}
          height={750}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <span
        aria-hidden="true"
        className="farm-dots absolute -bottom-5 h-16 w-28 opacity-60"
        style={chapter.imageOnLeft ? { right: -18 } : { left: -18 }}
      />
    </div>
  )
}

function StoryBlock({ chapter }: { chapter: StoryChapter }) {
  return (
    <section id={chapter.id} className={`scroll-mt-20 overflow-hidden ${tones[chapter.tone]} py-20 md:py-28`}>
      <div className="mx-auto max-w-[1300px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className={chapter.imageOnLeft ? 'order-2' : undefined}>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-black uppercase leading-[0.85] text-headline">
              {chapter.title}
            </h2>
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-6 text-base leading-relaxed md:text-lg">
                {paragraph}
              </p>
            ))}
            {chapter.signOff ? (
              <>
                <p className="mt-8 flex items-center gap-2 font-accent text-2xl italic text-headline">
                  {chapter.signOff.name} <FilledHeart />
                </p>
                <ButtonLink href={chapter.signOff.ctaHref} size="lg" className="mt-6">
                  {chapter.signOff.ctaLabel} <ArrowRightIcon />
                </ButtonLink>
              </>
            ) : null}
          </div>
          <div className={chapter.imageOnLeft ? 'order-1' : undefined}>
            <StoryImage chapter={chapter} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function OurStory({ page }: { page: OurStoryPage }) {
  return (
    <>
      <AboutHero
        lead={page.hero.lead}
        accent={page.hero.accent}
        intro={page.hero.intro}
        image={page.hero.image}
        titleClassName="font-display text-[clamp(2.6rem,8vw,7rem)] font-black uppercase leading-[0.82] text-background"
      />
      {page.chapters.map((chapter) => (
        <StoryBlock key={chapter.id} chapter={chapter} />
      ))}
    </>
  )
}
