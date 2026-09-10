import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/cn'

const buttonVariants = {
  primary:
    'btn-cta bg-cta text-cta-foreground shadow-[4px_4px_0_var(--color-headline)] hover:-translate-y-0.5 hover:text-cta-hover hover:shadow-[6px_6px_0_var(--color-headline)] active:text-cta-hover visited:text-cta-foreground focus-visible:text-cta-foreground',
  secondary:
    'border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] hover:bg-secondary-accent',
  outline:
    'border-2 border-headline bg-background text-headline shadow-[3px_3px_0_var(--color-headline)] hover:bg-secondary-accent',
} as const

const buttonSizes = {
  sm: 'min-h-12 px-6 text-base',
  md: 'min-h-12 px-6 text-base',
  lg: 'min-h-14 px-8 text-lg',
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
    'inline-flex items-center justify-center gap-2 rounded-full font-display font-extrabold tracking-wide uppercase no-underline transition-[color,transform,box-shadow] duration-200',
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
