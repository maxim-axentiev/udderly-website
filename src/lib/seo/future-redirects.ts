/**
 * Recorded for a later launch. These rules are not registered in `redirects`.
 * WordPress source URLs for adoption and animals for sale were not verified in
 * this repository, so none are listed here.
 */
export const FUTURE_INTERNAL_REDIRECTS = [
  {
    from: '/adopt',
    to: '/adopt-an-animal',
    note: 'Previous navigation path on this website. Not a verified WordPress URL.',
  },
] as const
