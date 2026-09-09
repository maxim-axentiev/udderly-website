import { cn } from '@/lib/cn'
import {
  cmsImageDimensions,
  cmsImageLqip,
  cmsImageSrcSet,
  cmsImageUrl,
  isSanityImage,
} from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'

type CmsImageProps = {
  image: SanityImage | undefined
  alt?: string
  className?: string
  sizes?: string
  widths?: number[]
  priority?: boolean
}

const defaultWidths = [480, 800, 1200, 1600]

export function CmsImage({
  image,
  alt,
  className,
  sizes = '(min-width: 1024px) 960px, 100vw',
  widths = defaultWidths,
  priority = false,
}: CmsImageProps) {
  if (!isSanityImage(image)) {
    return null
  }

  const src = cmsImageUrl(image, widths[1] ?? 800)
  const srcSet = cmsImageSrcSet(image, widths)
  const dimensions = cmsImageDimensions(image)
  const lqip = cmsImageLqip(image)

  if (!src) {
    return null
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? image.alt ?? ''}
      width={dimensions.width}
      height={dimensions.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={cn('h-full w-full object-cover', className)}
      style={lqip ? { backgroundImage: `url(${lqip})`, backgroundSize: 'cover' } : undefined}
    />
  )
}
