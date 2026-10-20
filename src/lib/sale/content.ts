import { SITE_NAME } from '@/lib/site'

export const SALE_PATH = '/animals-for-sale'

export const SALE_PAGE = {
  title: 'Animals for Sale',
  description:
    "Mini Highland cows, miniature goats and alpacas raised with care on our Ontario farm — see who's available, who's found a home, and join the waitlist.",
  heroLead: 'Animals',
  heroAccent: 'for Sale',
  heroSupport: "Raised with love, socialized from day one, and ready to become someone's favourite.",
  heroAlt: 'Animals in the pasture at Udderly Ridiculous Farm Life',
  introLead: 'Happy homes,',
  introAccent: 'not just sales',
  intro:
    "Placeholder description. Every animal we raise is handled gently, socialized daily and cared for like family. We're picky about where they go because they deserve homes with companions, space, and people who'll love them as much as we do. No petting farms, no travelling zoos — just good, forever homes.",
  introImageAlt: 'A young animal raised on the farm',
  introButton: 'Join the Waitlist',
  introButtonHref: '#waitlist',
  learnMoreLabel: 'Learn More',
  contactButtonLabel: 'Send Message',
  buyButtonLabel: 'Contact Us to Buy',
  contactHeading: 'Ask about {name}',
  availableHeading: 'Available now.',
  soldLead: 'Animals',
  soldAccent: 'sold',
  soldIntro: 'Already living their best lives in new homes.',
  prepHeading: 'Preparing for your new herd member',
  waitlistTitle: 'Join the waitlist',
  waitlistCopy:
    "Be the first to know when new calves, kids or crias are ready for homes. Pick the animals you're interested in and we'll let you know.",
  detailWaitlistTitle: "Don't see what you're looking for? Join the waitlist!",
  detailWaitlistCopy:
    "Tell us which animals you're interested in and we'll let you know as soon as new ones are ready for homes.",
} as const

export const SALE_HEAD = {
  title: `${SALE_PAGE.title} | ${SITE_NAME}`,
  description: SALE_PAGE.description,
  path: SALE_PATH,
} as const

export const SALE_PREP = [
  {
    title: 'Mini Highland Cows',
    imageKey: 'highland-hero',
    copy: "Placeholder copy. Plan for a companion cow, sturdy fencing, good pasture or hay, and a three-sided shelter. They're fluffy, not fragile — but they do need friends.",
  },
  {
    title: 'Miniature Goats',
    imageKey: 'goat-icon-2',
    copy: 'Placeholder copy. Goats come in pairs, escape like professionals, and need secure fencing plus a dry, draft-free shelter. Bring snacks. Lots of snacks.',
  },
  {
    title: 'Alpacas',
    imageKey: 'alpaca-walk',
    copy: 'Placeholder copy. Alpacas need a herd of three or more, regular vet care, hoof trimming and their own grazing space away from other livestock.',
  },
] as const

export type SaleSpecies = 'cow' | 'goat' | 'alpaca'

export type SaleAnimal = {
  name: string
  slug: string
  species: SaleSpecies
  sold: boolean
  imageKey: 'highland-hero' | 'highland-cta' | 'goat-icon-1' | 'goat-icon-2' | 'goat-icon-3' | 'alpaca-walk'
}

export const SPECIES_LABEL: Record<SaleSpecies, string> = {
  cow: 'Mini Highland Cow',
  goat: 'Miniature Goats',
  alpaca: 'Alpacas',
}

export const FOR_SALE: readonly SaleAnimal[] = [
  { name: 'Macintosh', slug: 'macintosh', species: 'cow', sold: false, imageKey: 'highland-hero' },
  { name: 'June', slug: 'june', species: 'cow', sold: false, imageKey: 'highland-cta' },
  { name: 'Joe', slug: 'joe', species: 'cow', sold: false, imageKey: 'highland-hero' },
  { name: 'Clover & Ash', slug: 'clover-and-ash', species: 'goat', sold: false, imageKey: 'goat-icon-1' },
  { name: 'Chuck & Charlize', slug: 'chuck-and-charlize', species: 'goat', sold: false, imageKey: 'goat-icon-2' },
]

export const SOLD: readonly SaleAnimal[] = [
  { name: 'Mr. T', slug: 'mr-t', species: 'cow', sold: true, imageKey: 'highland-hero' },
  { name: 'Westley', slug: 'westley', species: 'cow', sold: true, imageKey: 'highland-cta' },
  { name: 'Ginger Snap', slug: 'ginger-snap', species: 'cow', sold: true, imageKey: 'highland-hero' },
  { name: 'Robbie Burns', slug: 'robbie-burns', species: 'cow', sold: true, imageKey: 'highland-cta' },
  { name: 'Maisie', slug: 'maisie', species: 'cow', sold: true, imageKey: 'highland-hero' },
  { name: 'Winston', slug: 'winston', species: 'cow', sold: true, imageKey: 'highland-cta' },
  { name: 'Oreo', slug: 'oreo', species: 'cow', sold: true, imageKey: 'highland-hero' },
  {
    name: 'Copperpot, Puff & Elton John',
    slug: 'copperpot-puff-elton-john',
    species: 'alpaca',
    sold: true,
    imageKey: 'alpaca-walk',
  },
  { name: 'Sugar & Spice', slug: 'sugar-and-spice', species: 'goat', sold: true, imageKey: 'goat-icon-3' },
  { name: 'Kevin & Karen', slug: 'kevin-and-karen', species: 'goat', sold: true, imageKey: 'goat-icon-1' },
  { name: 'Marco & Polo', slug: 'marco-and-polo', species: 'goat', sold: true, imageKey: 'goat-icon-2' },
  { name: 'Pekoe, Rooibos & Matcha', slug: 'pekoe-rooibos-matcha', species: 'goat', sold: true, imageKey: 'goat-icon-3' },
]

export const ALL_SALE_ANIMALS = [...FOR_SALE, ...SOLD]

export const COW_FACTS = [
  ['Birthdate', 'Placeholder'],
  ['Height at birth', 'Placeholder'],
  ['Weight at birth', 'Placeholder'],
  ['Chondro Status', 'Placeholder'],
  ['Mix', 'Placeholder'],
  ['Sex', 'Placeholder'],
] as const

export const PRICE_PLACEHOLDER = '$X,XXX'

export const GOAT_POLICY = [
  'Must be adopted in pairs unless you’re already housing goats.',
  'We do not sell single goats to homes without existing companions.',
  'Our goats are unregistered.',
  'Our goats are well-socialized from birth and are typically ready for new homes 12 weeks after birth, unless rehomed alongside their mother.',
  'Goats require secure fencing (they’re escape artists) and proper shelter from both rain and cold.',
] as const

export const ALPACA_POLICY = [
  'You must have a minimum of 3 alpacas.',
  'Deeply social and need herd dynamics to thrive.',
  'Plan for yearly vaccinations, hoof trimming, and parasite/worm checks. These are essential. Ensure you have access to a vet familiar with livestock care. If planning to breed, be prepared with a birthing kit and know how to care for newborns, especially in cases where the mother does not nurse. Do not house alpacas with goats, sheep, or cattle. They can contract parasites through shared grazing areas. Males and females should live apart.',
] as const

export const COW_PLACEMENT =
  'We’re passionate about where our animals go. That’s why we do not sell our calves to petting farms or travelling zoos. These environments often over-handle animals and compromise their well-being. Instead, we seek homes where animals are cared for with respect and companionship. Mini highland cows are herd animals and should never be kept alone. Please plan for at least one other cow companion.'

export function saleGroupDescription(name: string): string {
  return `Placeholder description. Write about all of ${name} here — personalities, ages, sexes, quirks and who sticks closest to whom. They're sold together so they always have a friend.`
}

export function salePath(slug: string): string {
  return `${SALE_PATH}/${slug}`
}

export const WAITLIST_OPTIONS = ['Highland Cattle', 'Miniature Goats', 'Alpacas'] as const

export const WAITLIST_DEMO_MESSAGE = "You're on the list! (Demo form — nothing was sent yet.)"
export const CONTACT_DEMO_MESSAGE = 'Thanks! This is a demo form — nothing was sent yet.'
