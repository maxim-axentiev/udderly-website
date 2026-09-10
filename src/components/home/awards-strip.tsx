import { Container } from '@/components/layout/container'
import { homepageAwards } from '@/content/homepage'

export function AwardsStrip() {
  return (
    <section aria-label="TripAdvisor awards" className="border-y-2 border-headline bg-background py-6">
      <Container
        width="brand"
        className="flex flex-col items-center gap-5 md:flex-row md:justify-between"
      >
        <div className="text-center md:max-w-[24rem] md:text-left">
          <p className="font-display text-lg font-black uppercase leading-tight text-headline">
            {homepageAwards.title}
          </p>
          <p className="mt-1 text-sm font-semibold">{homepageAwards.copy}</p>
        </div>

        <ul className="grid w-full max-w-72 grid-cols-2 place-items-center gap-5 md:flex md:w-auto md:max-w-none md:gap-7">
          {homepageAwards.badges.map((award, index) => (
            <li
              key={award.year}
              className={`rounded-full transition-transform duration-500 motion-safe:hover:scale-110 motion-safe:hover:rotate-6 ${
                index % 2 === 0 ? '-rotate-3' : 'rotate-3'
              }`}
            >
              <img
                src={award.src}
                alt={award.alt}
                width={320}
                height={320}
                loading="lazy"
                decoding="async"
                className="size-28 rounded-full border-2 border-headline object-cover shadow-[3px_3px_0_var(--color-headline)] md:size-24"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
