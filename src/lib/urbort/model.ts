export const URBORT_PATH = '/urbort-blog'

export const urbortBoardFallback = {
  titleLead: 'URBORT:',
  titleAccent: 'Udderly Ridiculous Board of Ridiculous Things',
  intro:
    "URBORT! Sounds gross, but it's something amazing - our collection of ridiculous things we've done!",
  seoTitle: 'URBORT — Udderly Ridiculous Board of Ridiculous Things',
  seoDescription:
    "Our collection of ridiculous things we've done at Udderly Ridiculous Farm Life.",
  ctaHeading: 'Come do something ridiculous with us',
  ctaLabel: 'Book an Experience with Us',
  ctaHref: '/experiences',
} as const

export type UrbortImageKey =
  | 'urbort-1'
  | 'urbort-2'
  | 'urbort-3'
  | 'goat-cuddles'
  | 'donkey-picnic'
  | 'alpaca-walk'

export type UrbortPlaceholder = {
  slug: string
  title: string
  excerpt: string
  imageKey: UrbortImageKey
  rotate: string
}

export const urbortPlaceholders: readonly UrbortPlaceholder[] = [
  {
    slug: 'worlds-first-cow-wedding',
    title: "World's First Cow Wedding",
    excerpt: 'Placeholder copy. A veil, a flower crown and one very patient Highland cow.',
    imageKey: 'urbort-1',
    rotate: '-rotate-2',
  },
  {
    slug: 'biggest-littlest-collab',
    title: 'Biggest, Littlest Collab',
    excerpt: 'Placeholder copy. The biggest and littlest animals on the farm teamed up.',
    imageKey: 'urbort-2',
    rotate: 'rotate-1',
  },
  {
    slug: 'viral-alpaca-moment',
    title: 'Viral Alpaca Moment',
    excerpt: 'Placeholder copy. How two alpacas accidentally broke the internet.',
    imageKey: 'urbort-3',
    rotate: 'rotate-2',
  },
  {
    slug: 'goat-cuddle-record',
    title: 'The Great Goat Cuddle Record',
    excerpt: 'Placeholder copy. How many goats can fit on one lap? We found out.',
    imageKey: 'goat-cuddles',
    rotate: 'rotate-1',
  },
  {
    slug: 'donkey-picnic-chaos',
    title: 'Donkey Picnic Chaos',
    excerpt: 'Placeholder copy. The day the donkeys ate the picnic before the guests did.',
    imageKey: 'donkey-picnic',
    rotate: '-rotate-1',
  },
  {
    slug: 'alpaca-parade',
    title: 'The Alpaca Parade',
    excerpt: 'Placeholder copy. Leashes, bows and a very confused mail carrier.',
    imageKey: 'alpaca-walk',
    rotate: 'rotate-2',
  },
]

export const urbortRotations = ['-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'] as const
