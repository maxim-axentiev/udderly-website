/** Public corporate program paths. The route, not a CMS template field, chooses the layout. */
export const CORPORATE_PROGRAM_SLUGS = [
  'team-building-experiences',
  'experiential-tourism-development',
  'disc-assessment',
  'the-power-of-conversation',
  'alpaca-emotional-intelligence',
  'beyond-engagement',
  'innovation-on-the-farm',
] as const

export type CorporateProgramSlug = (typeof CORPORATE_PROGRAM_SLUGS)[number]

export function isCorporateProgramSlug(slug: string): slug is CorporateProgramSlug {
  return (CORPORATE_PROGRAM_SLUGS as readonly string[]).includes(slug)
}

export function corporateProgramPath(slug: CorporateProgramSlug): string {
  return `/corporate-training/${slug}`
}
