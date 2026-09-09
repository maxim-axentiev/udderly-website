import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/cn'

const buttonVariants = {
  primary:
    'bg-primary text-primary-foreground hover:brightness-110',
  secondary:
    'bg-secondary text-secondary-foreground hover:brightness-105',
  outline:
    'border border-border bg-surface text-foreground hover:bg-background',
} as const

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
} as const

export type ButtonVariant = keyof typeof buttonVariants
export type ButtonSize = keyof typeof buttonSizes

function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium no-underline transition',
    buttonVariants[variant],
    buttonSizes[size],
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  )
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  href: string
  external?: boolean
}

export function ButtonLink({
  className,
  variant = 'primary',
  size = 'md',
  href,
  external,
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonClassName({ variant, size, className })

  if (!external && href === '/') {
    return (
      <Link to="/" className={classes}>
        {children}
      </Link>
    )
  }

  if (!external && href === '/experiences') {
    return (
      <Link to="/experiences" className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={classes}
      rel={external || href.startsWith('http') ? 'noreferrer' : undefined}
      {...(href.startsWith('http') ? { target: '_blank' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}
