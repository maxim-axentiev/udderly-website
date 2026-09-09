import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section' | 'header' | 'footer' | 'nav'
  width?: 'content' | 'narrow' | 'wide'
}

const widthClass = {
  content: 'max-w-content',
  narrow: 'max-w-narrow',
  wide: 'max-w-wide',
} as const

export function Container({
  children,
  className,
  as: Component = 'div',
  width = 'content',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6',
        widthClass[width],
        className,
      )}
    >
      {children}
    </Component>
  )
}
