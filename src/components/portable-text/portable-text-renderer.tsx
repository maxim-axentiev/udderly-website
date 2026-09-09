import { PortableText, type PortableTextComponents } from '@portabletext/react'

import { CmsImage } from '@/components/ui/cms-image'
import { TextLink } from '@/components/ui/text-link'
import { hasPortableText } from '@/lib/portable-text'
import type { PortableTextContent, SanityImage } from '@/lib/sanity/types'

type PortableTextRendererProps = {
  value: PortableTextContent
  className?: string
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-4 first:mt-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 text-2xl font-semibold first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-semibold first:mt-0">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-2 border-primary/40 pl-4 text-muted italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    portableTextLink: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : undefined
      if (!href) {
        return <>{children}</>
      }

      const openInNewTab = Boolean(value?.openInNewTab)

      return (
        <TextLink
          href={href}
          {...(openInNewTab ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {children}
        </TextLink>
      )
    },
  },
  types: {
    altImage: ({ value }) => {
      const image = value as SanityImage
      if (!image) {
        return null
      }

      return (
        <figure className="mt-6 overflow-hidden rounded-lg">
          <CmsImage
            image={image}
            alt={image.alt}
            sizes="(min-width: 768px) 720px, 100vw"
            className="max-h-[32rem] w-full object-cover"
          />
        </figure>
      )
    },
    image: ({ value }) => {
      const image = value as SanityImage
      return (
        <figure className="mt-6 overflow-hidden rounded-lg">
          <CmsImage image={image} alt={image?.alt} />
        </figure>
      )
    },
    gallery: ({ value }) => {
      const images = (value?.images ?? []) as SanityImage[]
      const visible = images.filter(Boolean)
      if (!visible.length) {
        return null
      }

      return (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((image, index) => (
            <CmsImage
              key={image?.alt ?? index}
              image={image}
              alt={image?.alt}
              className="aspect-4/3 rounded-md"
              sizes="(min-width: 768px) 360px, 100vw"
            />
          ))}
        </div>
      )
    },
    videoEmbed: ({ value }) => {
      const url = typeof value?.url === 'string' ? value.url : undefined
      if (!url) {
        return null
      }

      return (
        <p className="mt-4">
          {value?.heading ? <strong>{value.heading}: </strong> : null}
          <TextLink href={url} target="_blank" rel="noreferrer">
            {value?.caption || 'Watch video'}
          </TextLink>
        </p>
      )
    },
  },
}

export function PortableTextRenderer({ value, className }: PortableTextRendererProps) {
  if (!hasPortableText(value)) {
    return null
  }

  return (
    <div className={className}>
      <PortableText
        value={value as NonNullable<PortableTextContent>}
        components={components}
      />
    </div>
  )
}
