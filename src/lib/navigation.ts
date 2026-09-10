export const primaryNav = [
  { label: 'Experiences', href: '/experiences' },
  { label: 'Meet the Herd', href: '/meet-the-herd' },
  { label: 'Stay', href: '/stay' },
  { label: 'Adopt', href: '/adopt' },
  { label: 'Corporate', href: '/corporate' },
  { label: 'Our Farm', href: '/our-farm' },
] as const

export const footerNav = [
  ...primaryNav,
  { label: 'Contact', href: '/contact' },
] as const

export const footerLegalNav = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const

export const bookCta = {
  label: 'Book an Experience',
  href: '/experiences',
} as const
