import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export function OptionalEmbed({
  title,
  src,
  actionLabel,
  description,
  className,
  allow,
  allowFullScreen = false,
  referrerPolicy,
  autoLoad = false,
  posterSrc,
}: {
  title: string
  src: string
  actionLabel: string
  description: string
  className?: string
  allow?: string
  allowFullScreen?: boolean
  autoLoad?: boolean
  posterSrc?: string
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'strict-origin' | 'strict-origin-when-cross-origin'
}) {
  const [loaded, setLoaded] = useState(false)

  if (!autoLoad && !loaded && posterSrc) {
    return (
      <button type="button" className={cn('relative block overflow-hidden bg-headline', className)} aria-label={`Play ${title}`} onClick={() => setLoaded(true)}>
        <img src={posterSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/15">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary-accent text-3xl text-primary-foreground shadow-lg">▶</span>
        </span>
      </button>
    )
  }

  if (!autoLoad && !loaded) {
    return (
      <div className={cn('flex flex-col items-start justify-center gap-4 bg-farm-beige p-6', className)}>
        <p className="max-w-md text-sm font-semibold leading-relaxed text-headline">{description}</p>
        <Button type="button" variant="secondary" onClick={() => setLoaded(true)}>
          {actionLabel}
        </Button>
      </div>
    )
  }

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      className={className}
      allow={allow}
      allowFullScreen={allowFullScreen}
      referrerPolicy={referrerPolicy}
    />
  )
}
