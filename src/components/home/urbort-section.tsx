import { ArrowRightIcon } from '@/components/icons'
import { Container } from '@/components/layout/container'
import { ButtonLink } from '@/components/ui/button'
import { homepageUrbort } from '@/content/homepage'

export function UrbortSection() {
  return (
    <section
      id="urbort"
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        backgroundColor: '#b98a4e',
        backgroundImage:
          'radial-gradient(rgba(90,55,20,0.35) 1px, transparent 1.6px), radial-gradient(rgba(255,240,210,0.25) 1px, transparent 1.6px)',
        backgroundSize: '9px 9px, 13px 13px',
        backgroundPosition: '0 0, 5px 7px',
      }}
    >
      <Container width="brand">
        <div className="mx-auto max-w-3xl -rotate-1 border-4 border-headline bg-background p-7 text-center shadow-[10px_10px_0_rgba(0,0,0,0.35)] md:p-10">
          <h2 className="font-display text-[clamp(3rem,9vw,7rem)] font-black uppercase leading-[0.8] text-headline">
            {homepageUrbort.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed md:text-lg">{homepageUrbort.copy}</p>
        </div>

        <ul className="mt-16 grid gap-10 md:grid-cols-3">
          {homepageUrbort.articles.map((article) => (
            <li
              key={article.title}
              className={`relative bg-background p-3 pb-6 shadow-[8px_10px_0_rgba(0,0,0,0.3)] ${article.rotate}`}
            >
              <span
                className="absolute -top-4 left-1/2 z-10 size-7 -translate-x-1/2 rounded-full border-2 border-headline bg-primary-accent shadow-[2px_2px_0_rgba(0,0,0,0.35)]"
                aria-hidden="true"
              />
              <img
                src={article.image.src}
                alt={article.image.alt}
                width={article.image.width}
                height={article.image.height}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full border-2 border-headline object-cover"
              />
              <h3 className="mt-4 px-2 font-display text-2xl font-black uppercase leading-none text-headline">
                {article.title}
              </h3>
              <div className="mt-4 px-2">
                <ButtonLink href={article.href}>Read the article</ButtonLink>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex justify-center">
          <ButtonLink href={homepageUrbort.cta.href} size="lg">
            {homepageUrbort.cta.label} <ArrowRightIcon />
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
