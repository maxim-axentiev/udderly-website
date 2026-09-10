import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section' | 'header' | 'footer' | 'nav'
  width?: 'content' | 'narrow' | 'wide' | 'brand'
}

const widthClass = {
  content: 'max-w-content px-4 sm:px-6',
  narrow: 'max-w-narrow px-4 sm:px-6',
  wide: 'max-w-wide px-4 sm:px-6',
  brand: 'max-w-brand px-5 md:px-8',
} as const

export function Container({
  children,
  className,
  as: Component = 'div',
  width = 'content',
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full', widthClass[width], className)}
    >
      {children}
    </Component>
  )
}
