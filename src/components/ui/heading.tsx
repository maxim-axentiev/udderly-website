import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
}

const headingStyles = {
  h1: 'text-4xl font-semibold md:text-5xl',
  h2: 'text-2xl font-semibold md:text-3xl',
  h3: 'text-xl font-semibold',
} as const

export function Heading({
  as: Tag = 'h2',
  children,
  className,
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingStyles[Tag], className)} {...props}>
      {children}
    </Tag>
  )
}
