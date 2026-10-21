import type { CSSProperties, ReactNode } from 'react'

import { BookExperienceBand } from '@/components/about/sections'
import { ButtonLink } from '@/components/ui/button'
import type { UrbortBoard, UrbortCard } from '@/lib/urbort/resolve'

const corkStyle: CSSProperties = {
  backgroundColor: '#b98a4e',
  backgroundImage:
    'radial-gradient(rgba(90,55,20,0.35) 1px, transparent 1.6px), radial-gradient(rgba(255,240,210,0.25) 1px, transparent 1.6px)',
  backgroundSize: '9px 9px, 13px 13px',
  backgroundPosition: '0 0, 5px 7px',
}

export function Corkboard({ children }: { children: ReactNode }) {
  return (
    <section
      className="relative overflow-hidden border-y-[14px] border-headline py-16 md:py-24"
      style={corkStyle}
    >
      <div className="mx-auto max-w-[1300px] px-5 md:px-8">{children}</div>
    </section>
  )
}

function Pin() {
  return (
    <span
      className="absolute -top-4 left-1/2 z-10 size-7 -translate-x-1/2 rounded-full border-2 border-headline bg-primary-accent shadow-[2px_2px_0_rgba(0,0,0,0.35)]"
      aria-hidden="true"
    />
  )
}

function Polaroid({ card, linked }: { card: UrbortCard; linked: boolean }) {
  return (
    <div className={`relative ${card.rotate}`}>
      <Pin />
      <div className="origin-top bg-background p-3 pb-6 shadow-[8px_10px_0_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out hover:rotate-[5deg] motion-reduce:transition-none">
        {card.imageSrc ? (
          <img
            src={card.imageSrc}
            alt={card.imageAlt}
            width={1024}
            height={1024}
            loading="lazy"
            className="aspect-square w-full border-2 border-headline object-cover"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center border-2 border-headline bg-farm-beige px-4 text-center font-display text-xl font-bold uppercase text-headline">
            Photo not available yet
          </div>
        )}
        <h3 className="mt-4 px-2 font-display text-2xl font-black uppercase leading-none text-headline">
          {card.title}
        </h3>
        {linked ? (
          <>
            {card.excerpt ? <p className="mt-3 px-2 leading-relaxed">{card.excerpt}</p> : null}
            <div className="mt-4 px-2">
              <ButtonLink href={card.href ?? '/urbort-blog'}>Read more</ButtonLink>
            </div>
          </>
        ) : (
          <p className="mt-3 px-2 leading-relaxed">{card.excerpt}</p>
        )}
      </div>
    </div>
  )
}

export function UrbortBoardPage({ board }: { board: UrbortBoard }) {
  return (
    <>
      <Corkboard>
        <div className="mx-auto max-w-3xl -rotate-1 border-4 border-headline bg-background p-7 text-center shadow-[10px_10px_0_rgba(0,0,0,0.35)] md:p-10">
          <h1 className="font-display text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.85] text-headline">
            {board.titleLead} <span className="text-primary-accent">{board.titleAccent}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed">{board.intro}</p>
        </div>
        {board.cards.length > 0 ? (
          <ul className="mt-20 grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
            {board.cards.map((card) => (
              <li key={card.slug}>
                <Polaroid card={card} linked={card.published} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto mt-16 max-w-xl text-center text-lg font-semibold text-headline">
            Published stories will be pinned here.
          </p>
        )}
      </Corkboard>
      <BookExperienceBand cta={board.cta} />
    </>
  )
}

export function UrbortPolaroid({ card }: { card: UrbortCard }) {
  return <Polaroid card={card} linked={false} />
}
