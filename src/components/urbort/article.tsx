import { useState } from 'react'

import { BookExperienceBand } from '@/components/about/sections'
import { Corkboard, UrbortPolaroid } from '@/components/urbort/board'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { PortableTextRenderer } from '@/components/portable-text/portable-text-renderer'
import { ButtonLink } from '@/components/ui/button'
import { URBORT_PATH } from '@/lib/urbort/model'
import type { UrbortArticlePage } from '@/lib/urbort/resolve'

function Slideshow({ images }: { images: UrbortArticlePage['gallery'] }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const go = (next: number) => setIndex((next + count) % count)
  const buttonClass =
    'flex size-12 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] transition-transform hover:-translate-y-0.5'

  return (
    <div className="mt-14">
      <div className="photo-frame relative overflow-hidden border-4 border-headline">
        <div
          className="flex transition-transform duration-500 motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="aspect-[16/10] w-full shrink-0 object-cover"
            />
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" className={buttonClass} onClick={() => go(index - 1)} aria-label="Previous photo">
          <ChevronLeftIcon />
        </button>
        <span className="font-display text-lg font-bold text-headline">
          {index + 1} / {count}
        </span>
        <button type="button" className={buttonClass} onClick={() => go(index + 1)} aria-label="Next photo">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

export function UrbortArticle({ article }: { article: UrbortArticlePage }) {
  return (
    <>
      <Corkboard>
        <div className="flex justify-center">
          <ButtonLink href={URBORT_PATH} variant="outline">
            Back to the board
          </ButtonLink>
        </div>
        <div className="mx-auto mt-14 max-w-sm">
          <UrbortPolaroid
            card={{
              slug: article.slug,
              title: article.title,
              excerpt: article.excerpt ?? '',
              imageSrc: article.imageSrc,
              imageAlt: article.imageAlt,
              rotate: article.rotate,
              published: true,
            }}
          />
        </div>
      </Corkboard>
      <article className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-black uppercase leading-[0.85] text-headline">
            {article.title}
          </h1>
          {article.author || article.publishedLabel ? (
            <p className="mt-6 text-lg font-semibold text-headline">
              {[article.author, article.publishedLabel].filter(Boolean).join(' · ')}
            </p>
          ) : null}
          {article.tags.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-2 border-headline bg-farm-beige px-3 py-1 font-display text-sm font-bold uppercase text-headline"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 text-lg leading-relaxed">
            <PortableTextRenderer value={article.body} />
          </div>
          {article.links.length > 0 ? (
            <ul className="mt-8 space-y-2">
              {article.links.map((link) => (
                <li key={link.href}>
                  <a className="underline hover:text-primary-accent" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {article.gallery.length > 0 ? <Slideshow images={article.gallery} /> : null}
        </div>
      </article>
      <BookExperienceBand cta={article.cta} />
    </>
  )
}
