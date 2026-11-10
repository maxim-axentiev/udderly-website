export type NavLink = {
  label: string
  href: string
}

export type NavGroup = {
  label: string
  href?: string
  children?: NavLink[]
}

export const primaryNav: NavGroup[] = [
  {
    label: 'Experiences',
    href: '/experiences',
    children: [
      { label: 'All Experiences', href: '/experiences' },
      { label: 'Tower of Goats Discovery Trail', href: '/tower-of-goats-discovery-trail' },
      { label: 'Farm Glamping', href: '/farm-glamping' },
    ],
  },
  { label: 'Gift Cards', href: '/gift-card' },
  { label: 'Animals for Sale', href: '/animals-for-sale' },
  { label: 'Adopt an Animal', href: '/adopt-an-animal' },
  {
    label: 'Corporate Training',
    href: '/corporate-training',
    children: [
      { label: 'All Corporate Training Programs', href: '/corporate-training' },
      { label: 'Team Building Experiences', href: '/corporate-training/team-building-experiences' },
      {
        label: 'Experiential Tourism Development',
        href: '/corporate-training/experiential-tourism-development',
      },
    ],
  },
  {
    label: 'Explore',
    children: [
      { label: 'Farm Market Store', href: '/farm-market-store' },
      { label: 'Goat Milk Ice Cream', href: '/ice-cream' },
      { label: 'URBORT Blog', href: '/urbort-blog' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
  {
    label: 'About',
    children: [
      { label: 'Our Story', href: '/our-story' },
      { label: 'Vision & Values', href: '/vision-values' },
      { label: 'Meet the Team', href: '/team' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

export const footerColumns = [
  {
    title: 'Explore',
    links: [
      { label: 'All Experiences', href: '/experiences' },
      { label: 'Tower of Goats Discovery Trail', href: '/tower-of-goats-discovery-trail' },
      { label: 'Farm Glamping', href: '/farm-glamping' },
      { label: 'Farm Market Store', href: '/farm-market-store' },
      { label: 'Goat Milk Ice Cream', href: '/ice-cream' },
      { label: 'Gift Cards', href: '/gift-card' },
    ],
  },
  {
    title: 'More Udderly Ridiculous',
    links: [
      { label: 'Animals for Sale', href: '/animals-for-sale' },
      { label: 'Adopt an Animal', href: '/adopt-an-animal' },
      { label: 'Corporate Training', href: '/corporate-training' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Meet the Team', href: '/team' },
      { label: 'URBORT Blog', href: '/urbort-blog' },
    ],
  },
  {
    title: 'Stay Connected',
    links: [
      { label: 'Newsletter', href: '/newsletter' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
] as const

export const footerNav = footerColumns.flatMap((column) =>
  column.links.map((link) => ({ label: link.label, href: link.href })),
)

export const footerLegalNav = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Cookies Policy', href: '/cookies-policy' },
] as const

export const bookCta = {
  label: 'Book an Experience',
  href: '/experiences',
} as const

export const FOOTER_TAGLINE = 'Come Do Something Udderly Ridiculous'
export const FOOTER_EMAIL_FALLBACK = 'info@udderlyridiculousfarmlife.com'
export const FOOTER_LOCATION_FALLBACK = 'Bright, Ontario, Canada'
