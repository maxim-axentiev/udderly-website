import { SITE_NAME } from '@/lib/site'

export const ADOPT_PATH = '/adopt-an-animal'

/** Previous site navigation path. Not a verified WordPress URL, and not active. */
export const ADOPT_PREVIOUS_NAV_PATH = '/adopt'

export const ADOPT_PAGE = {
  title: 'Adopt an Animal',
  heroLead: 'Adopt',
  heroAccent: 'an Animal',
  intro:
    'Take a piece of the farm home with you — symbolically, of course. Our adoption program helps cover food, shelter, enrichment, and the occasional fancy hat for the animals who make every visit ridiculous.',
  heroAlt: 'Visitors enjoying time with animals at Udderly Ridiculous Farm Life',
  awardsTagline: 'Top 10% of attractions worldwide by Tripadvisor.',
  sponsorLead: 'Sponsor a',
  sponsorAccent: 'ridiculous life.',
  sponsorParagraphs: [
    'Placeholder description. Our adoption program is a symbolic way to support the animals who call Udderly Ridiculous Farm Life home. Your contribution goes directly toward feed, bedding, veterinary care, enrichment toys, and the occasional surprise snack.',
    'Placeholder description. Whether you adopt for yourself, as a gift, or in memory of someone who really loved goats, you become part of the extended herd. You will get updates, photos, and the quiet satisfaction of knowing one very specific animal thinks you are excellent.',
  ],
  sponsorNote: 'Scroll down for available animals to adopt.',
  sponsorImageAlt: 'Biscuit the goat standing on a straw bale in the barn',
  animalsHeading: 'Meet the adoptables.',
  animalsIntro: 'Seven personalities. Zero bad hair days. Pick the one that feels like yours.',
  cardBlurb: 'Placeholder personality. This animal has strong opinions and excellent taste in snacks.',
  supportLead: 'Your adoption',
  supportAccent: 'does real good.',
  supportParagraphs: [
    'Placeholder description. Adoption contributions help us provide high-quality feed, clean bedding, routine veterinary care, enrichment activities, and safe shelter year-round. They also help us rescue and rehabilitate new animals who need a soft place to land.',
    'Placeholder description. This is not a one-time gift — it is a year-long partnership that keeps the herd happy, healthy, and appropriately ridiculous.',
  ],
  supportButton: 'See all animals available for adoption',
  supportImageAlt: 'Marshmallow the goat being held by a visitor',
} as const

export const ADOPT_HEAD = {
  title: `${ADOPT_PAGE.title} | ${SITE_NAME}`,
  description: ADOPT_PAGE.intro,
  path: ADOPT_PATH,
} as const

export type AdoptionAnimal = {
  name: string
  slug: string
  alt: string
  imageKey: 'goat-icon-1' | 'goat-icon-2' | 'goat-icon-3' | 'highland-hero' | 'alpaca-walk' | 'donkey-picnic' | 'goat-cuddles'
  tagline: string
  showGold: boolean
}

/**
 * Clara's photo is the Lovable goat portrait assigned to her card.
 * The alt text names her as a Mini Highland cow. Lovable called her a goat.
 */
export const ADOPTION_ANIMALS = [
  {
    name: 'Clara',
    slug: 'clara',
    alt: 'Clara the Mini Highland cow looking straight at the camera',
    imageKey: 'goat-icon-1',
    tagline: 'The Queen of the Pasture',
    showGold: true,
  },
  {
    name: 'Sassafras',
    slug: 'sassafras',
    alt: 'Sassafras the goat standing on a straw bale',
    imageKey: 'goat-icon-2',
    tagline: 'Chief of Mischief',
    showGold: true,
  },
  {
    name: 'Stanley',
    slug: 'stanley',
    alt: 'Stanley the goat being held by a visitor',
    imageKey: 'goat-icon-3',
    tagline: 'Professional Snack Inspector',
    showGold: true,
  },
  {
    name: 'Bronnie',
    slug: 'bronnie',
    alt: 'Bronnie the mini Highland cow with a dramatic fringe',
    imageKey: 'highland-hero',
    tagline: 'Loudest Voice in the Barn',
    showGold: true,
  },
  {
    name: 'Michael',
    slug: 'michael',
    alt: 'Michael the alpaca walking along the farm path',
    imageKey: 'alpaca-walk',
    tagline: 'Yes, That Is His Real Name',
    showGold: true,
  },
  {
    name: 'Greg',
    slug: 'greg',
    alt: 'Greg the miniature donkey beside a picnic',
    imageKey: 'donkey-picnic',
    tagline: 'Naps First, Questions Later',
    showGold: true,
  },
  {
    name: 'Chicken',
    slug: 'chicken',
    alt: 'Chicken the farm chicken keeping an eye on things',
    imageKey: 'goat-cuddles',
    tagline: 'Small Bird, Enormous Opinions',
    showGold: false,
  },
] as const satisfies readonly AdoptionAnimal[]

export function adoptionPath(slug: string): string {
  return `${ADOPT_PATH}/${slug}`
}

export const SILVER_PRICE = '$35'
export const GOLD_PRICE = '$75'

export function silverItems(name: string): string[] {
  return [
    'Digital certificate of adoption',
    `A digital info package about ${name} (photo, traits, and species details)`,
    `Two updates per year on ${name}`,
  ]
}

export function goldItems(name: string): string[] {
  return [...silverItems(name), `A 15m Zoom call with ${name}`]
}

export function importantInfo(name: string): string[] {
  return [
    'Adoptions are symbolic and do not transfer ownership of the animal.',
    `All adoption contributions are non-refundable and go directly toward ${name}'s care.`,
    'Digital packages and updates are sent to the email provided at checkout.',
    'Zoom calls are scheduled during regular farm hours and may include a few surprise guests.',
    'Gift adoptions can include a personalized message sent to the recipient.',
  ]
}

export function adoptionDetailHead(name: string, tagline: string) {
  const description = `Symbolically adopt ${name}, ${tagline.toLowerCase()}, and support ${name}'s care at Udderly Ridiculous Farm Life.`
  return {
    title: `Adopt ${name} | ${SITE_NAME}`,
    description,
    ogTitle: `Adopt ${name} — ${tagline}`,
    path: adoptionPath(name.toLowerCase()),
  }
}
