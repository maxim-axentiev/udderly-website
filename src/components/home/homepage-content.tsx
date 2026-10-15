import type { ReactNode } from 'react'

import type { HomepageContent, HomepageImage } from '@/lib/homepage/model'

import { HomepageContentContext } from './homepage-content-context'

export function HomepageContentProvider({
  content,
  children,
}: {
  content: HomepageContent
  children: ReactNode
}) {
  return (
    <HomepageContentContext.Provider value={content}>{children}</HomepageContentContext.Provider>
  )
}

export function HomeImage({
  image,
  className,
  alt,
  loading,
  fetchPriority,
}: {
  image: HomepageImage
  className?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}) {
  return (
    <img
      src={image.src}
      {...(image.srcSet ? { srcSet: image.srcSet, sizes: image.sizes } : {})}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  )
}
