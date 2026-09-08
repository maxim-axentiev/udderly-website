import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section' | 'header' | 'footer'
}

export function Container({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-content px-4 sm:px-6', className)}
    >
      {children}
    </Component>
  )
}
