import { useRef, useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { homepageMedia } from '@/content/homepage'
import { getYoutubeEmbedUrl } from '@/lib/youtube'

const videos = homepageMedia.videos.map((video) => ({
  ...video,
  embedUrl: getYoutubeEmbedUrl(video.url),
}))

export function MediaCarousel() {
  const [index, setIndex] = useState(0)
  const touchStart = useRef<number | null>(null)
  const current = videos[index]

  if (!current) {
    return null
  }

  const go = (next: number) => {
    setIndex((next + videos.length) % videos.length)
  }

  return (
    <div
      className="mt-14"
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current
        const end = event.changedTouches[0]?.clientX ?? null
        if (start === null || end === null) return
        if (Math.abs(end - start) > 50) go(end < start ? index + 1 : index - 1)
        touchStart.current = null
      }}
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="relative border-2 border-headline bg-background p-3 shadow-[10px_10px_0_var(--color-headline)]">
          <div className="relative aspect-video w-full overflow-hidden bg-headline">
            <iframe
              key={current.embedUrl}
              src={current.embedUrl}
              title={`${current.outlet} video`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full border-0"
            />
          </div>
          <div className="px-1 pb-1 pt-4 text-center">
            <h3 className="font-display text-2xl font-black uppercase leading-none text-headline">
              {current.outlet}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous video"
          className="absolute -left-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] transition-transform hover:-translate-y-[calc(50%+2px)] md:-left-7"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next video"
          className="absolute -right-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] transition-transform hover:-translate-y-[calc(50%+2px)] md:-right-7"
        >
          <ChevronRightIcon />
        </button>
      </div>

      <ul className="mx-auto mt-9 grid max-w-4xl grid-cols-4 place-items-center gap-3 lg:grid-cols-8">
        {videos.map((video, i) => (
          <li key={video.outlet} className="flex w-full justify-center">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${video.outlet} video`}
              aria-current={i === index}
              className={`flex w-full items-center justify-center overflow-hidden border-2 border-headline bg-background p-1.5 transition-all duration-200 ${
                i === index
                  ? 'h-16 max-w-28 scale-105 bg-secondary-accent shadow-[4px_4px_0_var(--color-headline)] sm:h-20 sm:max-w-32'
                  : 'h-14 max-w-24 opacity-70 hover:opacity-100 sm:h-16 sm:max-w-28'
              }`}
            >
              <img
                src={video.logo}
                alt=""
                width={480}
                height={480}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
