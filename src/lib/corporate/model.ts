import { CONTACT_PATH } from '@/lib/contact/model'
import type { PortableTextContent } from '@/lib/sanity/types'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type { CorporateImages } from './images'
import { corporateProgramPath, type CorporateProgramSlug } from './slugs'

export const CORPORATE_ENQUIRY_UNAVAILABLE = 'Corporate enquiries are not available yet.'

export type CorporatePicture = {
  src: string
  alt: string
}

export type FacilityIcon = 'capacity' | 'av' | 'catering' | 'parking' | 'outdoors'
export type CredentialIcon =
  | 'award'
  | 'star'
  | 'people'
  | 'reviews'
  | 'sparkle'
  | 'heart'
  | 'views'
  | 'media'
  | 'business'
  | 'experience'
export type AudienceIcon =
  | 'farm'
  | 'stay'
  | 'restaurant'
  | 'artisan'
  | 'museum'
  | 'beverage'
  | 'specialist'
export type PracticalIcon = 'duration' | 'addons' | 'custom'

export type CorporateAwards = {
  show: boolean
  title: string
  tagline: string
  images: CorporatePicture[]
}

export type CorporateReview = {
  name: string
  quote: string
}

export type CorporateReviews = {
  heading: string
  items: CorporateReview[]
  ctaLabel?: string
  ctaHref?: string
}

export type CorporateEnquiry = {
  heading: string
  body: string
  showPhone: boolean
  programOptions: string[]
  unavailable: string
}

export type CorporateClose = {
  reviews: CorporateReviews | null
  facilitator: {
    eyebrow: string
    title: string
    body: string
    image: CorporatePicture
    ctaLabel: string
    ctaHref: string
  } | null
  environment: {
    lead: string
    accent: string
    body: string
    image: CorporatePicture
    label: string
  } | null
  facility: {
    lead: string
    accent: string
    items: Array<{ icon: FacilityIcon; title: string; body: string }>
    gallery: CorporatePicture[]
  } | null
  enquiry: CorporateEnquiry
}

export type CorporateCard = {
  title: string
  body: string
  image: CorporatePicture
  href: string
  ctaLabel: string
}

export type CorporateLandingPage = {
  hero: { lead: string; accent: string; intro: string; image: CorporatePicture }
  awards: CorporateAwards
  introduction: {
    lead: string
    accent: string
    paragraphs: string[]
    gallery: CorporatePicture[]
    badge: string
  }
  programsHeading: string
  featured: (CorporateCard & { eyebrow: string }) | null
  cards: CorporateCard[]
  tourism: (CorporateCard & { eyebrow: string }) | null
  close: CorporateClose
  seo: PageSeoInput
}

export type SharedProgramPage = {
  hero: { lead: string; accent: string; intro: string; image: CorporatePicture }
  awards: CorporateAwards
  introduction: {
    lead: string
    accent: string
    paragraphs: string[]
    richText?: PortableTextContent
    image: CorporatePicture
    ctaLabel: string
    ctaHref: string
  }
  outcomes: {
    heading: string
    items: string[]
    durationTitle: string
    durationBody: string
    enhancementsTitle: string
    enhancementsRich?: PortableTextContent
    enhancementsBody: string
  }
  close: CorporateClose
  seo: PageSeoInput
}

export type TeamBuildingPage = {
  hero: { lead: string; accent: string; intro: string; image: CorporatePicture }
  awards: CorporateAwards
  headingLead: string
  headingAccent: string
  activities: CorporateCard[]
  mix: { title: string; body: string; ctaLabel: string; ctaHref: string }
  close: CorporateClose
  seo: PageSeoInput
}

export type TourismService = {
  name: string
  price: string
  featured: boolean
  items: Array<{ title: string; body: string }>
}

export type TourismPage = {
  hero: { lead: string; accent: string; intro: string; image: CorporatePicture }
  introduction: {
    lead: string
    accent: string
    paragraphs: string[]
    richText?: PortableTextContent
    image: CorporatePicture
    ctaLabel: string
    ctaHref: string
  }
  portrait: CorporatePicture
  pathHeading: string
  path: Array<{ title: string; body: string }>
  pathCtaLabel: string
  pathCtaHref: string
  credentials: Array<{ icon: CredentialIcon; label: string }>
  servicesHeading: string
  services: TourismService[]
  servicesCtaLabel: string
  servicesCtaHref: string
  audienceHeading: string
  audiences: Array<{ icon: AudienceIcon; label: string }>
  audienceNote: string
  audienceCtaLabel: string
  audienceCtaHref: string
  enquiry: CorporateEnquiry
  seo: PageSeoInput
}

export type DiscPage = {
  hero: { lead: string; accent: string; intro: string; image: CorporatePicture }
  awards: CorporateAwards
  introduction: {
    lead: string
    accent: string
    paragraphs: string[]
    richText?: PortableTextContent
    image: CorporatePicture
    ctaLabel: string
    ctaHref: string
  }
  offeringsHeading: string
  offerings: Array<{
    title: string
    body: string
    image: CorporatePicture
    outcomes: string[]
    ctaLabel: string
    ctaHref: string
  }>
  practicalHeading: string
  practical: Array<{ icon: PracticalIcon; label: string; lines: string[] }>
  close: CorporateClose
  seo: PageSeoInput
}

const FACILITIES: CorporateClose['facility'] = {
  lead: "What's in the",
  accent: 'facility',
  items: [],
  gallery: [],
}

export function corporateFacility(_images: CorporateImages): NonNullable<CorporateClose['facility']> {
  void _images
  return {
    lead: FACILITIES?.lead ?? "What's in the",
    accent: FACILITIES?.accent ?? 'facility',
    items: [],
    gallery: [],
  }
}

export function corporateFacilitator(_images: CorporateImages) {
  void _images
  return {
    eyebrow: 'Meet your facilitator',
    title: '',
    body: '',
    image: { src: '', alt: '' },
    ctaLabel: 'Contact',
    ctaHref: CONTACT_PATH,
  }
}

export function corporateEnvironment(_images: CorporateImages) {
  void _images
  return {
    lead: 'A learning space with',
    accent: 'hooves outside',
    body: '',
    image: { src: '', alt: '' },
    label: 'The farm learning environment',
  }
}

export function corporateEnquiry(
  heading: string,
  body: string,
  showPhone = true,
  programOptions: string[] = [],
): CorporateEnquiry {
  return {
    heading,
    body,
    showPhone,
    programOptions,
    unavailable: CORPORATE_ENQUIRY_UNAVAILABLE,
  }
}

export function sharedProgramFallback(
  slug: Extract<
    CorporateProgramSlug,
    | 'the-power-of-conversation'
    | 'alpaca-emotional-intelligence'
    | 'beyond-engagement'
    | 'innovation-on-the-farm'
  >,
  images: CorporateImages,
): Omit<SharedProgramPage, 'awards' | 'close'> & {
  reviewsHeading: string
  contactHeading: string
  contactBody: string
} {
  const programs = {
    'the-power-of-conversation': {
      lead: 'The Power of',
      accent: 'Conversation',
      name: 'The Power of Conversation',
      description:
        'The Power of Conversation — a corporate training program on a working Ontario farm that teaches teams to manage tension, give feedback, and have the conversations that matter.',
    },
    'alpaca-emotional-intelligence': {
      lead: 'Alpaca Emotional',
      accent: 'Intelligence',
      name: 'Alpaca Emotional Intelligence',
      description:
        'Alpaca Emotional Intelligence — a farm-based corporate training program building self-awareness, empathy and emotional intelligence with real alpacas.',
    },
    'beyond-engagement': {
      lead: 'Beyond',
      accent: 'Engagement',
      name: 'Beyond Engagement',
      description:
        'Beyond Engagement — a corporate training program on a working Ontario farm that moves teams past survey scores to culture habits that last.',
    },
    'innovation-on-the-farm': {
      lead: 'Innovation on',
      accent: 'the Farm',
      name: 'Innovation on the Farm',
      description:
        'Innovation on the Farm — a corporate training program for creative problem solving with real constraints, real animals and a working Ontario farm.',
    },
  } as const
  const program = programs[slug]
  return {
    hero: {
      lead: program.lead,
      accent: program.accent,
      intro: '',
      image: {
        src: images.hero,
        alt: 'A team taking part in a farm-based corporate session',
      },
    },
    introduction: {
      lead: 'Conversations that',
      accent: 'actually land',
      paragraphs: [],
      image: { src: '', alt: '' },
      ctaLabel: 'Contact',
      ctaHref: CONTACT_PATH,
    },
    outcomes: {
      heading: 'What your team will take away',
      items: [],
      durationTitle: 'Duration',
      durationBody: '',
      enhancementsTitle: 'Enhancements',
      enhancementsBody: '',
    },
    reviewsHeading: 'Teams that learned to talk — and listen — on the farm',
    contactHeading: "Let's talk training",
    contactBody: '',
    seo: {
      title: `${program.name} | Corporate Training | Udderly Ridiculous`,
      description: program.description,
      path: corporateProgramPath(slug),
    },
  }
}

export function landingFallback(images: CorporateImages): Omit<CorporateLandingPage, 'awards'> {
  return {
    hero: {
      lead: 'Corporate Training & Team Building with Real Animals on a',
      accent: 'Real Farm',
      intro:
        'Designed to ignite learning, connection, and growth in boots... not boardrooms.',
      image: {
        src: images.hero,
        alt: 'A team taking part in a farm-based corporate training session',
      },
    },
    introduction: {
      lead: 'Step into an environment that',
      accent: 'engages and inspires',
      paragraphs: [
        'Forget stale boardrooms and awkward icebreakers. At Udderly Ridiculous Farm Life, we deliver Corporate Training & Team Building experiences that actually stick.',
        'Our programs are immersive, interactive, and completely unforgettable—because they happen on a working farm, with real animals as part of the learning environment. Alpacas. Goats. Mini Highland cows. Miniature donkeys. Even chickens. Each session taps into the grounding energy and emotional intelligence these animals naturally bring, creating space for real connection, deeper reflection, and team growth.',
        'We don’t believe in cookie-cutter workshops or the latest “flavour of the month.” Whether you’re building on existing training or starting fresh, every session is tailored to your team’s goals, culture, and context. The result? More meaningful engagement, more memorable takeaways, and a team that leaves energized, aligned, and maybe a little muddy.',
      ],
      gallery: [
        { src: images.training, alt: 'Corporate team enjoying a farm lunch experience with alpacas' },
        { src: images.alpacaWalk, alt: 'Participants walking alpacas along the farm lane' },
        { src: images.experiences, alt: 'Colleagues laughing with goats in the pasture' },
        { src: images.highlandHero, alt: 'Team meeting a mini Highland cow during a break' },
      ],
      badge: 'See all of our training programs below',
    },
    programsHeading: 'Our training programs',
    featured: {
      eyebrow: 'Not training — pure team building',
      title: 'Team Building Experiences',
      body: '',
      image: {
        src: images.experiences,
        alt: 'A team laughing together during a farm team building session',
      },
      href: corporateProgramPath('team-building-experiences'),
      ctaLabel: 'Learn More',
    },
    cards: [
      {
        title: 'DiSC Assessment',
        body: '',
        image: { src: images.training, alt: 'Corporate team enjoying a farm lunch experience with alpacas' },
        href: corporateProgramPath('disc-assessment'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'The Power of Conversation',
        body: '',
        image: { src: images.goatCuddles, alt: 'Two colleagues talking while a goat looks on' },
        href: corporateProgramPath('the-power-of-conversation'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Alpaca Emotional Intelligence',
        body: '',
        image: { src: images.alpacaWalk, alt: 'Alpaca standing calmly beside a workshop participant' },
        href: corporateProgramPath('alpaca-emotional-intelligence'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Beyond Engagement',
        body: '',
        image: { src: images.highlandHero, alt: 'Team working through an exercise outdoors on the farm' },
        href: corporateProgramPath('beyond-engagement'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Innovation on the Farm',
        body: '',
        image: { src: images.donkeyPicnic, alt: 'Group solving a challenge beside the miniature donkeys' },
        href: corporateProgramPath('innovation-on-the-farm'),
        ctaLabel: 'Learn More',
      },
    ],
    tourism: {
      eyebrow: 'For tourism businesses only',
      title: 'Experiential Tourism Development',
      body: '',
      image: {
        src: images.highlandCta,
        alt: 'Farm owners walking a tourism operator through the property',
      },
      href: corporateProgramPath('experiential-tourism-development'),
      ctaLabel: 'Learn More',
    },
    close: {
      reviews: null,
      facilitator: corporateFacilitator(images),
      environment: corporateEnvironment(images),
      facility: corporateFacility(images),
      enquiry: corporateEnquiry("Let's talk about your team", ''),
    },
    seo: {
      title: 'Corporate Training & Team Building on a Farm | Udderly Ridiculous',
      description:
        'Corporate training and team building on a working Ontario farm, with alpacas, goats, mini Highland cows and donkeys.',
      path: '/corporate-training',
    },
  }
}

export const LANDING_REVIEWS_HEADING =
  'Teams that came for a novelty offsite and left with a plan'

export function teamBuildingFallback(images: CorporateImages): Omit<TeamBuildingPage, 'awards' | 'close'> & {
  reviewsHeading: string
  contactHeading: string
  contactBody: string
} {
  return {
    hero: {
      lead: 'Team Building',
      accent: 'Experiences',
      intro:
        'No flip charts, no trust falls — just your team, our animals, and a whole lot of shared ridiculousness.',
      image: { src: images.hero, alt: 'A team taking part in a farm-based corporate session' },
    },
    headingLead: 'Pick your',
    headingAccent: 'herd',
    activities: [
      {
        title: 'Goat Yoga',
        body: '',
        image: { src: '', alt: '' },
        href: CONTACT_PATH,
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Alpaca Walks',
        body: '',
        image: { src: images.alpacaWalk, alt: 'Team enjoying Alpaca Walks on the farm' },
        href: CONTACT_PATH,
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Mini Highland Cow Experience',
        body: '',
        image: { src: images.highlandHero, alt: 'Team enjoying Mini Highland Cow Experience on the farm' },
        href: CONTACT_PATH,
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Goat Cuddles',
        body: '',
        image: { src: images.experiences, alt: 'Team enjoying Goat Cuddles on the farm' },
        href: CONTACT_PATH,
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Miniature Donkey Visits',
        body: '',
        image: { src: images.donkeyPicnic, alt: 'Team enjoying Miniature Donkey Visits on the farm' },
        href: CONTACT_PATH,
        ctaLabel: 'Contact Us',
      },
    ],
    mix: {
      title: 'Mix & match',
      body: "Can't pick just one? You can combine team building experiences into one ridiculous day. Contact us and we'll help you build the perfect mix for your team.",
      ctaLabel: 'Contact Us',
      ctaHref: CONTACT_PATH,
    },
    reviewsHeading: 'Teams that bonded on the farm',
    contactHeading: "Let's plan your team day",
    contactBody: '',
    seo: {
      title: 'Team Building Experiences | Corporate Training | Udderly Ridiculous',
      description:
        'Team building experiences with goats, alpacas, mini Highland cows and donkeys on a working Ontario farm. Mix and match to build your perfect team day.',
      path: corporateProgramPath('team-building-experiences'),
    },
  }
}

export function tourismFallback(images: CorporateImages): TourismPage {
  return {
    hero: {
      lead: 'Experiential Tourism',
      accent: 'Coaching & Development',
      intro:
        'Turn what makes your business special into experiences guests will book, photograph and rave about.',
      image: { src: images.hero, alt: 'A team taking part in a farm-based corporate session' },
    },
    introduction: {
      lead: 'Your business,',
      accent: 'unforgettable',
      paragraphs: [],
      image: { src: '', alt: '' },
      ctaLabel: 'Contact Me',
      ctaHref: CONTACT_PATH,
    },
    portrait: { src: '', alt: '' },
    pathHeading: 'Meet Cheryl & her path',
    path: [],
    pathCtaLabel: 'Contact',
    pathCtaHref: CONTACT_PATH,
    credentials: [],
    servicesHeading: 'Services',
    services: [],
    servicesCtaLabel: 'Contact',
    servicesCtaHref: CONTACT_PATH,
    audienceHeading: 'Who I help',
    audiences: [
      { icon: 'farm', label: 'Farms' },
      { icon: 'stay', label: 'Accommodations' },
      { icon: 'restaurant', label: 'Restaurants' },
      { icon: 'artisan', label: 'Artisans' },
      { icon: 'museum', label: 'Museum' },
      { icon: 'beverage', label: 'Brewery/Winery' },
      { icon: 'specialist', label: 'An individual with a specialization' },
    ],
    audienceNote: 'Is your business not on this list? I could still help!',
    audienceCtaLabel: 'Contact',
    audienceCtaHref: CONTACT_PATH,
    enquiry: corporateEnquiry('Book your free consultation', '', false),
    seo: {
      title: 'Experiential Tourism Coaching & Development | Corporate Training | Udderly Ridiculous',
      description:
        'Experiential tourism coaching and development from Cheryl of Udderly Ridiculous Farm Life — helping farms, accommodations, restaurants, artisans and more build bookable experiences.',
      path: corporateProgramPath('experiential-tourism-development'),
    },
  }
}

export function discFallback(images: CorporateImages): Omit<DiscPage, 'awards' | 'close'> & {
  reviewsHeading: string
  contactHeading: string
  contactBody: string
} {
  return {
    hero: {
      lead: 'DiSC',
      accent: 'Assessment',
      intro:
        'Understand how your team communicates, decides and collides — then put it into practice on a real working farm.',
      image: {
        src: images.hero,
        alt: 'A team taking part in a farm-based corporate training session',
      },
    },
    introduction: {
      lead: 'Personality profiles,',
      accent: 'barn included',
      paragraphs: [],
      image: { src: '', alt: '' },
      ctaLabel: 'Contact',
      ctaHref: CONTACT_PATH,
    },
    offeringsHeading: 'Two ways to DiSC',
    offerings: [
      {
        title: 'Everything DiSC Workplace',
        body: 'The Everything DiSC Workplace assessment dives into the personality and behaviour drivers of you and your coworkers, enhancing communication and collaboration. By exploring your unique DiSC style, you’ll learn to adapt to workplace dynamics for better results.',
        image: { src: '', alt: '' },
        outcomes: [
          'Discover your DiSC style, priorities, and behavioural drivers.',
          'Identify your motivators and stressors in workplace interactions.',
          'Learn strategies to work more effectively with colleagues.',
          'Build stronger relationships by adapting to others’ styles.',
        ],
        ctaLabel: 'Ask about Everything DiSC Workplace',
        ctaHref: CONTACT_PATH,
      },
      {
        title: 'Everything DiSC Work of Leaders',
        body: 'The Everything DiSC Work of Leaders assessment helps leaders understand their natural style and how it impacts their effectiveness. It focuses on three key areas: crafting a vision, creating alignment, and championing execution, all essential for leading successful teams.',
        image: { src: '', alt: '' },
        outcomes: [
          'Learn how your DiSC style influences your leadership approach.',
          'Discover your leadership priorities and strengths.',
          'Adapt your natural style to be more effective in leading teams.',
          'Master the three core responsibilities of leadership: vision, alignment, and execution.',
        ],
        ctaLabel: 'Ask about Everything DiSC Work of Leaders',
        ctaHref: CONTACT_PATH,
      },
    ],
    practicalHeading: 'The practical bits',
    practical: [],
    reviewsHeading: LANDING_REVIEWS_HEADING,
    contactHeading: "Let's talk DiSC",
    contactBody: '',
    seo: {
      title: 'DiSC Assessment Training on a Farm | Udderly Ridiculous',
      description: 'Everything DiSC assessments on a working Ontario farm — Workplace and Work of Leaders programs.',
      path: corporateProgramPath('disc-assessment'),
    },
  }
}

export const DISC_PROGRAM_OPTIONS = [
  'Everything DiSC Workplace',
  'Everything DiSC Work of Leaders',
  'Not sure yet — help us choose',
]
