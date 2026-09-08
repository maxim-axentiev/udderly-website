import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
        variant === 'primary' &&
          'bg-primary text-primary-foreground',
        variant === 'secondary' &&
          'bg-secondary text-secondary-foreground',
        className,
      )}
      {...props}
    />
  )
}
