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

/**
 * Shared design copy for the four ProgramPage routes.
 * These sentences are the approved layout text. They are not separate verified
 * facts about each program. A published program can replace them on its own page.
 */
export const SHARED_PROGRAM_OUTCOMES = [
  'Manage emotions and apply strategies for handling tension-filled situations.',
  'Maximize influence by balancing directness with inquiry.',
  'Identify key issues by actively listening for what matters most in any given situation.',
  'Provide feedback in a manner that avoids creating defensiveness.',
  'Apply these skills to real-life situations for immediate impact.',
]

const SHARED_INTRO = [
  'Placeholder description. Most workplace tension isn’t caused by bad people — it’s caused by avoided conversations. This program gives your team a practical, repeatable framework for handling high-stakes dialogue with clarity, empathy and confidence.',
  'Through facilitated exercises, real-play scenarios and a few unscripted animal moments, participants practice managing emotion, listening for what matters and giving feedback that lands instead of defends. Keep scrolling to learn about the program!',
]

const SHARED_HERO_INTRO =
  'Have the conversations that matter — the hard ones, the honest ones, the ones that change everything — with a little help from the farm.'

const FACILITIES: CorporateClose['facility'] = {
  lead: "What's in the",
  accent: 'facility',
  items: [
    {
      icon: 'capacity',
      title: 'Capacity & Setup',
      body: 'Our farm market store transforms into a comfortable classroom that can accommodate up to 30 participants. We offer various seating arrangements, including pods of 4-6 people, boardroom style, u-shaped, and classroom style.',
    },
    {
      icon: 'av',
      title: 'Audio/Visual & Connectivity',
      body: 'We provide AV equipment, including a projector and screen, to support presentations and training sessions. WIFI connectivity is available, although limited due to the rural setting.',
    },
    {
      icon: 'catering',
      title: 'Catering Options',
      body: 'Enhance your session with coffee breaks and a locally-sourced lunch, featuring farm-fresh ingredients. These can be added to your training package upon request.',
    },
    {
      icon: 'parking',
      title: 'Parking & Restrooms',
      body: 'Free parking is available for all participants, ensuring easy access to the facility. There are three washrooms onsite to accommodate your team.',
    },
    {
      icon: 'outdoors',
      title: 'Breaks & Outdoor Access',
      body: 'We encourage participants to take advantage of the farm’s natural beauty during breaks. A walk around the property provides a refreshing mental reset, perfect for maintaining focus during intensive sessions. For an added mental health benefit, participants can interact with our friendly goats in the barn attached to the training room, offering a unique way to destress and recharge.',
    },
  ],
  gallery: [],
}

export function corporateFacility(images: CorporateImages): NonNullable<CorporateClose['facility']> {
  return {
    lead: FACILITIES?.lead ?? "What's in the",
    accent: FACILITIES?.accent ?? 'facility',
    items: FACILITIES?.items ?? [],
    gallery: [
      { src: images.farmStore, alt: 'The farm market store set up as a training classroom' },
      { src: images.training, alt: 'Participants seated in pods during a farm training session' },
      { src: images.iceCream, alt: 'Locally sourced treats served during a farm coffee break' },
      { src: images.goatCuddles, alt: 'Goats in the barn attached to the training room' },
    ],
  }
}

export function corporateFacilitator(images: CorporateImages) {
  return {
    eyebrow: 'Meet your facilitator',
    title: 'Cheryl, in boots',
    body: 'Placeholder description. Cheryl has spent more than twenty years facilitating corporate training across boardrooms, conference centres and hotel ballrooms — and then decided the best learning happens with straw underfoot. She builds every session around your team’s goals and culture, keeps the energy high, the reflection honest, and lets the animals handle the rest.',
    image: { src: images.owners, alt: "Cheryl, the farm's corporate training facilitator" },
    ctaLabel: 'Contact Us',
    ctaHref: '#contact',
  }
}

export function corporateEnvironment(images: CorporateImages) {
  return {
    lead: 'A learning space with',
    accent: 'hooves outside',
    body: 'Placeholder description. The farm itself is part of the curriculum: open sky, quiet lanes, and a barn full of goats waiting at the break bell.',
    image: { src: images.highlandCta, alt: 'The farm at sunset, with the pasture glowing gold' },
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

const DEFAULT_ENQUIRY_BODY =
  'Tell us a little about your group and what you want them to walk away with. We will get back to you with ideas (and probably a goat photo).'

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
      intro: SHARED_HERO_INTRO,
      image: {
        src: images.hero,
        alt: 'A team taking part in a farm-based corporate session',
      },
    },
    introduction: {
      lead: 'Conversations that',
      accent: 'actually land',
      paragraphs: SHARED_INTRO,
      image: { src: images.training, alt: 'A team learning together in the farm classroom' },
      ctaLabel: 'Contact Us',
      ctaHref: '#contact',
    },
    outcomes: {
      heading: 'What your team will take away',
      items: SHARED_PROGRAM_OUTCOMES,
      durationTitle: 'Duration',
      durationBody:
        'The program is flexible and can be offered as a half-day, full-day, or time-spaced session.',
      enhancementsTitle: 'Enhancements',
      enhancementsBody:
        'For an enriched team-building experience, consider integrating our Alpaca EQ training which dives deeper into emotional intelligence.',
    },
    reviewsHeading: 'Teams that learned to talk — and listen — on the farm',
    contactHeading: "Let's talk training",
    contactBody: DEFAULT_ENQUIRY_BODY,
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
        'Backed by 20+ years of corporate facilitation, designed to ignite learning, connection, and growth in boots... not boardrooms.',
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
        'Led by a seasoned facilitator with over 20 years of corporate training experience, our programs are immersive, interactive, and completely unforgettable—because they happen on a working farm, with real animals as part of the learning environment. Alpacas. Goats. Mini Highland cows. Miniature donkeys. Even chickens. Each session taps into the grounding energy and emotional intelligence these animals naturally bring, creating space for real connection, deeper reflection, and team growth.',
        'We don’t believe in cookie-cutter workshops or the latest “flavour of the month.” Whether you’re building on existing training or starting fresh, every session is tailored to your team’s goals, culture, and context. The result? More meaningful engagement, more memorable takeaways, and a team that leaves energized, aligned, and maybe a little muddy.',
      ],
      gallery: [
        { src: images.training, alt: 'A team gathered together for a training session on the farm' },
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
      body: 'Placeholder description. No modules, no assessments, no flip charts. Just your team, the animals, and a few hours of shared ridiculousness that does more for trust than any trust fall ever has.',
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
        body: 'Placeholder description. Understand how your team communicates, decides and collides, then put it into practice with a few very opinionated animals watching.',
        image: { src: images.training, alt: 'Facilitator leading a DiSC session in the farm classroom' },
        href: corporateProgramPath('disc-assessment'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'The Power of Conversation',
        body: 'Placeholder description. Real conversations, the hard ones included, practised in a space where nobody can hide behind a screen.',
        image: { src: images.goatCuddles, alt: 'Two colleagues talking while a goat looks on' },
        href: corporateProgramPath('the-power-of-conversation'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Alpaca Emotional Intelligence',
        body: 'Placeholder description. Alpacas read the room faster than any of us. Learn self-awareness and empathy from the professionals.',
        image: { src: images.alpacaWalk, alt: 'Alpaca standing calmly beside a workshop participant' },
        href: corporateProgramPath('alpaca-emotional-intelligence'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Beyond Engagement',
        body: 'Placeholder description. Move past survey scores to the culture habits that actually keep good people around.',
        image: { src: images.highlandHero, alt: 'Team working through an exercise outdoors on the farm' },
        href: corporateProgramPath('beyond-engagement'),
        ctaLabel: 'Learn More',
      },
      {
        title: 'Innovation on the Farm',
        body: 'Placeholder description. Creative problem solving with real constraints, real mud and absolutely no whiteboard clichés.',
        image: { src: images.donkeyPicnic, alt: 'Group solving a challenge beside the miniature donkeys' },
        href: corporateProgramPath('innovation-on-the-farm'),
        ctaLabel: 'Learn More',
      },
    ],
    tourism: {
      eyebrow: 'For tourism businesses only',
      title: 'Experiential Tourism Development',
      body: 'Placeholder description. Built specifically for tourism operators, this session helps you turn what you already have into experiences guests will book, photograph and talk about for years.',
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
      enquiry: corporateEnquiry("Let's talk about your team", DEFAULT_ENQUIRY_BODY),
    },
    seo: {
      title: 'Corporate Training & Team Building on a Farm | Udderly Ridiculous',
      description:
        'Corporate training and team building on a working Ontario farm, led by a facilitator with 20+ years of experience, with alpacas, goats, mini Highland cows and donkeys.',
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
        body: 'Placeholder description. Stretch, laugh and lose all dignity together while goats climb, nap and supervise.',
        image: { src: images.goatCuddles, alt: 'Team enjoying Goat Yoga on the farm' },
        href: '#contact',
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Alpaca Walks',
        body: 'Placeholder description. Lead an alpaca down the farm lane and discover who on your team is the natural leader.',
        image: { src: images.alpacaWalk, alt: 'Team enjoying Alpaca Walks on the farm' },
        href: '#contact',
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Mini Highland Cow Experience',
        body: 'Placeholder description. Brush, cuddle and get to know our fluffy mini Highland cows as a group.',
        image: { src: images.highlandHero, alt: 'Team enjoying Mini Highland Cow Experience on the farm' },
        href: '#contact',
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Goat Cuddles',
        body: 'Placeholder description. A barn full of goats, a team full of stress, and a guaranteed improvement in mood.',
        image: { src: images.experiences, alt: 'Team enjoying Goat Cuddles on the farm' },
        href: '#contact',
        ctaLabel: 'Contact Us',
      },
      {
        title: 'Miniature Donkey Visits',
        body: 'Placeholder description. Gentle, curious and endlessly patient, our donkeys bring the calm your team needs.',
        image: { src: images.donkeyPicnic, alt: 'Team enjoying Miniature Donkey Visits on the farm' },
        href: '#contact',
        ctaLabel: 'Contact Us',
      },
    ],
    mix: {
      title: 'Mix & match',
      body: "Can't pick just one? You can combine team building experiences into one ridiculous day. Contact us and we'll help you build the perfect mix for your team.",
      ctaLabel: 'Contact Us',
      ctaHref: '#contact',
    },
    reviewsHeading: 'Teams that bonded on the farm',
    contactHeading: "Let's plan your team day",
    contactBody: DEFAULT_ENQUIRY_BODY,
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
      paragraphs: [
        'Placeholder description. Experiential tourism coaching helps tourism businesses design, refine and price hands-on experiences that people travel for. Whether you have a spark of an idea or an offering that needs a refresh, Cheryl brings the frameworks and real-world lessons from building Udderly Ridiculous Farm Life.',
      ],
      image: {
        src: images.highlandCta,
        alt: 'The farm at sunset, a working example of experiential tourism',
      },
      ctaLabel: 'Contact Me',
      ctaHref: '#contact',
    },
    portrait: { src: images.owners, alt: 'Cheryl, experiential tourism coach' },
    pathHeading: 'Meet Cheryl & her path',
    path: [
      {
        title: 'From boardroom',
        body: 'Placeholder copy. 20+ years designing and facilitating corporate training for organizations across Canada.',
      },
      {
        title: 'To barnyard',
        body: 'Placeholder copy. Built Udderly Ridiculous from a goat milk ice cream idea into an award-winning farm destination.',
      },
      {
        title: 'Proven at home',
        body: "Placeholder copy. Hosts thousands of guests every year and earned TripAdvisor Travellers' Choice recognition.",
      },
      {
        title: 'Now for you',
        body: 'Placeholder copy. Shares the frameworks, tools and lessons learned so your business can grow its own experiences.',
      },
    ],
    pathCtaLabel: 'Book a Free Consultation',
    pathCtaHref: '#contact',
    credentials: [
      { icon: 'award', label: '14-time award winning' },
      { icon: 'star', label: "TripAdvisor Travelers' Choice" },
      { icon: 'people', label: 'Host 5,000+ people per year' },
      { icon: 'reviews', label: '1500+ 5-star reviews' },
      { icon: 'sparkle', label: '4.9/5 review rating' },
      { icon: 'heart', label: '35,000+ social media followers' },
      { icon: 'views', label: '10+ million global views' },
      { icon: 'media', label: 'International media coverage' },
      { icon: 'business', label: 'Woman in business' },
      { icon: 'experience', label: '20+ years corporate training experience' },
    ],
    servicesHeading: 'Services',
    services: [
      {
        name: 'As-Needed Coaching',
        price: '$125/hour',
        featured: false,
        items: [
          {
            title: 'Flexible On-Demand Coaching',
            body: "Access Cheryl's guidance tailored to your specific needs, whenever you need it.",
          },
          {
            title: 'Expert Support',
            body: 'Get advice on refining offerings, understanding experiential tourism trends, or overcoming challenges.',
          },
          {
            title: 'No Long-Term Commitment',
            body: 'Benefit from expert coaching without the need for a structured program or ongoing commitment.',
          },
        ],
      },
      {
        name: 'Experiential Tourism Elevation',
        price: '$2500 + HST & travel costs',
        featured: true,
        items: [
          {
            title: 'Initial Meeting',
            body: 'Cheryl will discuss your vision, values, and expectations.',
          },
          {
            title: 'Competitive Analysis',
            body: 'Includes competitive comparisons against market positioning, pricing, social credibility, and more.',
          },
          {
            title: 'Firsthand Experience',
            body: 'Cheryl will participate in your experience to gather insights and ensure alignment with your goals.',
          },
          {
            title: 'Detailed Report',
            body: 'Receive a report with actionable recommendations and a customer journey map.',
          },
          {
            title: 'Coaching Sessions',
            body: 'Includes 1-2 coaching sessions to support the implementation of improvements.',
          },
        ],
      },
      {
        name: 'Experiential Tourism Development',
        price: '$3000 + HST & travel costs',
        featured: false,
        items: [
          {
            title: 'Guided Development',
            body: 'Cheryl will lead you through the Unlocked & Inspired framework, using tools, methods, and templates to transform your concept into reality.',
          },
          {
            title: 'Target Market & Storytelling',
            body: 'Define your target market and craft compelling narratives to enhance the experience.',
          },
          {
            title: 'Infrastructure Development',
            body: 'Develop the necessary infrastructure for your experience.',
          },
          {
            title: 'Collaborations',
            body: 'Establish strategic collaborations to strengthen your offering.',
          },
          {
            title: 'Pricing Strategy',
            body: 'Set effective pricing for your experience.',
          },
          {
            title: 'Resources Included',
            body: 'Receive a workbook and costing template to refine and develop future experiences.',
          },
        ],
      },
    ],
    servicesCtaLabel: 'Book a Free Consultation',
    servicesCtaHref: '#contact',
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
    audienceNote:
      'Is your business not on this list? I could still help! Fill out the form below for a free consultation.',
    audienceCtaLabel: 'Book a Free Consultation',
    audienceCtaHref: '#contact',
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
      paragraphs: [
        'Placeholder description. Everything DiSC gives your team a shared language for how they communicate, make decisions and handle conflict. We take that language out of the boardroom and onto the farm, where the feedback is immediate and nobody can hide behind a slide deck. Keep scrolling to learn about our DiSC programs!',
      ],
      image: {
        src: images.training,
        alt: 'A facilitator leading a DiSC session with a team on the farm',
      },
      ctaLabel: 'Contact Us',
      ctaHref: '#contact',
    },
    offeringsHeading: 'Two ways to DiSC',
    offerings: [
      {
        title: 'Everything DiSC Workplace',
        body: 'The Everything DiSC Workplace assessment dives into the personality and behaviour drivers of you and your coworkers, enhancing communication and collaboration. By exploring your unique DiSC style, you’ll learn to adapt to workplace dynamics for better results.',
        image: {
          src: images.training,
          alt: 'A team working through their DiSC profiles together in the farm classroom',
        },
        outcomes: [
          'Discover your DiSC style, priorities, and behavioural drivers.',
          'Identify your motivators and stressors in workplace interactions.',
          'Learn strategies to work more effectively with colleagues.',
          'Build stronger relationships by adapting to others’ styles.',
        ],
        ctaLabel: 'Ask about Everything DiSC Workplace',
        ctaHref: '#contact',
      },
      {
        title: 'Everything DiSC Work of Leaders',
        body: 'The Everything DiSC Work of Leaders assessment helps leaders understand their natural style and how it impacts their effectiveness. It focuses on three key areas: crafting a vision, creating alignment, and championing execution, all essential for leading successful teams.',
        image: {
          src: images.highlandHero,
          alt: 'A leadership group debriefing an exercise outdoors on the farm',
        },
        outcomes: [
          'Learn how your DiSC style influences your leadership approach.',
          'Discover your leadership priorities and strengths.',
          'Adapt your natural style to be more effective in leading teams.',
          'Master the three core responsibilities of leadership: vision, alignment, and execution.',
        ],
        ctaLabel: 'Ask about Everything DiSC Work of Leaders',
        ctaHref: '#contact',
      },
    ],
    practicalHeading: 'The practical bits',
    practical: [
      { icon: 'duration', label: 'Duration', lines: ['1/2 – Full Day'] },
      {
        icon: 'addons',
        label: 'Add-ons',
        lines: ['Team building experiences', 'Power of Conversation', 'Alpaca EQ', 'Innovation in a Box'],
      },
      {
        icon: 'custom',
        label: 'Customization',
        lines: [
          'We can build on existing assessments like Myers-Briggs, True Colours, Kolbe, or McQuaig to expand previous learning and maximize your investment.',
        ],
      },
    ],
    reviewsHeading: LANDING_REVIEWS_HEADING,
    contactHeading: "Let's talk DiSC",
    contactBody:
      'Tell us a little about your team and which DiSC program you’re curious about. We will get back to you with ideas (and probably a goat photo).',
    seo: {
      title: 'DiSC Assessment Training on a Farm | Udderly Ridiculous',
      description:
        'Everything DiSC assessments on a working Ontario farm — Workplace and Work of Leaders programs, facilitated by a trainer with 20+ years of corporate experience.',
      path: corporateProgramPath('disc-assessment'),
    },
  }
}

export const DISC_PROGRAM_OPTIONS = [
  'Everything DiSC Workplace',
  'Everything DiSC Work of Leaders',
  'Not sure yet — help us choose',
]
