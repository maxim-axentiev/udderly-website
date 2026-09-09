import type { AnchorHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

export function TextLink({ href, className, children, ...props }: TextLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
