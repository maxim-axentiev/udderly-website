export const LEGAL_SLUGS = ['privacy-policy', 'terms-of-service', 'cookies-policy'] as const

export type LegalSlug = (typeof LEGAL_SLUGS)[number]

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug)
}

export const legalSeo: Record<LegalSlug, { title: string; description: string }> = {
  'privacy-policy': {
    title: 'Privacy Policy — Udderly Ridiculous Farm Life',
    description:
      'How Udderly Ridiculous Farm collects, uses, shares and protects your personal information.',
  },
  'terms-of-service': {
    title: 'Terms of Service — Udderly Ridiculous Farm Life',
    description:
      'Terms for using the Udderly Ridiculous Farm Life website and booking farm experiences.',
  },
  'cookies-policy': {
    title: 'Cookies Policy — Udderly Ridiculous Farm Life',
    description:
      'How Udderly Ridiculous Farm uses cookies and similar technologies on this website.',
  },
}
