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
}: {
  title: string
  src: string
  actionLabel: string
  description: string
  className?: string
  allow?: string
  allowFullScreen?: boolean
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'strict-origin' | 'strict-origin-when-cross-origin'
}) {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
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
