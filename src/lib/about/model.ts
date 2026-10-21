import type { PortableTextContent } from '@/lib/sanity/types'
import type { PageSeoInput } from '@/lib/seo/page-head'

import type { AboutImages } from './images'

export type AboutPicture = { src: string; alt: string }

export type AboutTone = 'default' | 'beige' | 'blue'

export type AboutCta = {
  heading: string
  body?: string
  label: string
  href: string
}

export type StoryChapter = {
  id: string
  title: string
  paragraphs: string[]
  image: AboutPicture
  imageOnLeft: boolean
  tone: AboutTone
  signOff?: { name: string; ctaLabel: string; ctaHref: string }
}

export type OurStoryPage = {
  hero: { lead: string; accent: string; intro: string; image: AboutPicture }
  chapters: StoryChapter[]
  seo: PageSeoInput
}

export type VisionValue = { title: string; description: string }

export type VisionValuesPage = {
  hero: { lead: string; accent: string; image: AboutPicture }
  vision: { heading: string; paragraphs: string[]; image: AboutPicture } | null
  gallery: AboutPicture[] | null
  values: { heading: string; image: AboutPicture; items: VisionValue[] } | null
  cta: AboutCta | null
  seo: PageSeoInput
}

export type TeamProfile = {
  id: string
  name: string
  role?: string
  paragraphs: string[]
  bio?: PortableTextContent
  fact?: string
  image?: AboutPicture
  placeholder: boolean
}

export type TeamPage = {
  hero: { lead: string; accent: string; intro: string; image: AboutPicture }
  factLabel: string
  members: TeamProfile[]
  placeholders: boolean
  cta: AboutCta | null
  seo: PageSeoInput
}

export type FaqEntry = {
  id: string
  question: string
  answer: PortableTextContent
}

export type FaqGroup = {
  id: string
  title: string
  items: FaqEntry[]
}

export type FaqPage = {
  hero: { lead: string; accent: string; image: AboutPicture }
  groups: FaqGroup[]
  cta: AboutCta | null
  seo: PageSeoInput
}

const HERO_ALT = 'Farm animals and guests at Udderly Ridiculous Farm Life'
const BOOK_LABEL = 'Book an Experience with Us'

export const FAQ_CATEGORY_LABELS: Record<string, string> = {
  visiting: 'Visiting the farm',
  booking: 'Booking',
  animals: 'Animals',
  glamping: 'Glamping',
  adoption: 'Adoption',
  corporate: 'Corporate',
  accessibility: 'Accessibility',
  general: 'General',
}

export const DEFAULT_FAQ_GROUPS: ReadonlyArray<{
  id: string
  title: string
  categories: readonly string[]
}> = [
  {
    id: 'farm',
    title: 'Questions About Our Farm',
    categories: ['visiting', 'animals', 'accessibility', 'general'],
  },
  {
    id: 'booking',
    title: 'Questions About The Booking System',
    categories: ['booking'],
  },
  {
    id: 'experiences',
    title: 'Questions About Farm Life Experiences',
    categories: [],
  },
]

export function ourStoryFallback(images: AboutImages): OurStoryPage {
  return {
    hero: {
      lead: 'Our',
      accent: 'Story',
      intro: 'From an unexpected connection to a farm full of joy',
      image: { src: images.hero, alt: HERO_ALT },
    },
    chapters: [
      {
        id: 'how-it-all-began',
        title: 'How it all began',
        paragraphs: [
          `Like any good story, ours began as a love story… okay, it didn't really, but it became one, so that's close enough, right? Greg and I met at a pilot for a course I was teaching aimed at farmers. There was an earth-shattering hug at the end of the class, and we decided to keep in touch.`,
          `Since I wasn't a farmer (and my background only included one summer at a farm, being chased by a bull and stepping in fresh cow poop with my see-through jelly shoes—I know, I seriously just dated myself), I called on Greg from time to time for connections or advice on how best to connect with farmers.`,
        ],
        image: { src: images.owners, alt: 'Greg and Cheryl, the owners of Udderly Ridiculous Farm Life' },
        imageOnLeft: false,
        tone: 'beige',
      },
      {
        id: 'growing-together',
        title: 'Growing together',
        paragraphs: [
          `Fast forward, and our connection became a little more than just chatting… we began an "un-relationship" and eventually determined we really didn't want to be without each other, so we made plans to figure out how to integrate our lives, including my two city boys and his two farm boys… especially now that we had an Udderly Ridiculous product idea.`,
        ],
        image: { src: images.alpaca, alt: 'Guests walking alpacas together along the farm lane' },
        imageOnLeft: true,
        tone: 'default',
      },
      {
        id: 'the-ice-cream-idea',
        title: 'The ice-cream idea',
        paragraphs: [
          `Fast forward, while helping Greg with strategic planning for the farm, he mentioned wanting a farm product. We brainstormed and landed on goat milk ice cream—it was perfect, especially since my son and I couldn't digest cow dairy. After some challenges, we launched Udderly Ridiculous in March 2019. The name reflected the craziness of starting a company with no experience while working full-time. I left my corporate job to focus on the brand. We won awards, including Canada's Grand Prix of New Products, and entered retailers, but the pandemic brought challenges, from missed customer interactions to supply chain issues.`,
        ],
        image: { src: images.iceCream, alt: 'Tubs of Udderly Ridiculous goat milk ice cream' },
        imageOnLeft: false,
        tone: 'beige',
      },
      {
        id: 'alvins-legacy',
        title: "Udderly Ridiculous Farm Life - honouring Alvin's legacy",
        paragraphs: [
          'The idea for a facility began when someone asked about goat yoga, and I thought, "Who would want goats chewing on their Lululemon pants?" That sparked the conversation between Greg and me about creating a space where we could interact with people, educate them, and offer memorable experiences.',
          `We envisioned Greg's dad, Alvin, who was at the farm six days a week, welcoming visitors and sharing stories. After Alvin was diagnosed with pancreatic cancer in January 2021, we knew we had to make this dream a reality while we still had time with him. Though we lost him sooner than expected, the plan was in motion, and now it stands as a tribute to Alvin and all he gave to the land, animals, and community he loved.`,
        ],
        image: { src: images.highland, alt: 'A mini Highland cow at the farm Alvin cared for' },
        imageOnLeft: true,
        tone: 'default',
      },
      {
        id: 'where-our-journey-meets-yours',
        title: 'Where our journey meets yours',
        paragraphs: [
          `Today, our third-generation family farm has become the go-to place for people seeking memorable, hands-on experiences with our animals and a true connection to agriculture. We pour our hearts into ensuring every guest leaves with an incredible, enlightening experience. Through our farm market, we proudly support local farms and producers, and on a global scale, we've donated 115 goats to families in need, helping to make a difference far beyond our fields.`,
          `I can't wait to welcome you to the farm, where every visit is part of our Udderly Ridiculous adventure!`,
        ],
        image: { src: images.farmStore, alt: 'Guests meeting the animals at the farm' },
        imageOnLeft: false,
        tone: 'blue',
        signOff: { name: 'Cheryl', ctaLabel: 'Book an Experience', ctaHref: '/experiences' },
      },
    ],
    seo: {
      title: 'Our Story | Udderly Ridiculous Farm Life',
      description:
        `From an unexpected connection to a farm full of joy — how Udderly Ridiculous Farm Life grew from a pilot course, an ice-cream idea and Alvin's legacy into a third-generation Ontario farm experience.`,
      ogDescription: 'From an unexpected connection to a farm full of joy.',
      path: '/our-story',
    },
  }
}

export function visionValuesFallback(images: AboutImages): VisionValuesPage {
  const placeholder = 'Placeholder copy. A short line about what this value means on our farm.'
  return {
    hero: {
      lead: 'Vision &',
      accent: 'Values',
      image: { src: images.hero, alt: HERO_ALT },
    },
    vision: {
      heading: 'Our vision',
      paragraphs: [
        'Placeholder copy. Replace this with our vision statement — one or two sentences about where Udderly Ridiculous Farm Life is headed and why it matters.',
      ],
      image: { src: images.highland, alt: 'A mini Highland cow grazing in the pasture' },
    },
    gallery: [
      { src: images.goats, alt: 'Guest cuddling a baby goat in the barn' },
      { src: images.alpaca, alt: 'Guests walking an alpaca along the farm lane' },
      { src: images.donkey, alt: 'A miniature donkey at a picnic on the farm' },
      { src: images.highland, alt: 'A fluffy mini Highland cow in the pasture' },
    ],
    values: {
      heading: 'Our core values',
      image: {
        src: images.owners,
        alt: 'Cheryl and Greg with their farm greeter dog Aspen in the pasture',
      },
      items: [1, 2, 3, 4, 5].map((number) => ({
        title: `Value ${['one', 'two', 'three', 'four', 'five'][number - 1]}`,
        description: placeholder,
      })),
    },
    cta: {
      heading: 'Come see it all in person.',
      body: 'Photos are nice. Licks from a mini Highland cow are better.',
      label: BOOK_LABEL,
      href: '/experiences',
    },
    seo: {
      title: 'Vision & Values | Udderly Ridiculous Farm Life',
      description:
        'The vision and core values behind Udderly Ridiculous Farm Life — a third-generation Ontario farm where joy, animal welfare and community come first.',
      ogDescription: 'The vision and core values behind our ridiculous little farm.',
      path: '/vision-values',
    },
  }
}

const PLACEHOLDER_BIO =
  'Placeholder bio. A short, fun paragraph about this team member and what they do around the farm.'
const PLACEHOLDER_FACT = 'Placeholder — send us the real fact and we’ll drop it in.'

export function teamPlaceholders(images: AboutImages): TeamProfile[] {
  const photos = [
    { src: images.highland, alt: 'Placeholder animal photo of a mini Highland cow, not a staff portrait' },
    { src: images.goats, alt: 'Placeholder animal photo of a goat cuddle, not a staff portrait' },
    { src: images.alpaca, alt: 'Placeholder animal photo of an alpaca walk, not a staff portrait' },
    { src: images.donkey, alt: 'Placeholder animal photo of a miniature donkey, not a staff portrait' },
    { src: images.alpaca, alt: 'Placeholder animal photo of guests with an alpaca, not a staff portrait' },
    { src: images.goats, alt: 'Placeholder animal photo of baby goats, not a staff portrait' },
    { src: images.highland, alt: 'Placeholder animal photo of a Highland cow in the pasture, not a staff portrait' },
    { src: images.donkey, alt: 'Placeholder animal photo of a farm picnic donkey, not a staff portrait' },
    { src: images.alpaca, alt: 'Placeholder animal photo of an alpaca at the farm, not a staff portrait' },
  ]
  return photos.map((image, index) => ({
    id: `placeholder-${index + 1}`,
    name: `Team member ${index + 1}`,
    role: 'Placeholder role',
    paragraphs: [PLACEHOLDER_BIO],
    fact: PLACEHOLDER_FACT,
    image,
    placeholder: true,
  }))
}

export function teamPageFallback(images: AboutImages): TeamPage {
  return {
    hero: {
      lead: 'The',
      accent: 'Team',
      intro: 'We have no idea what we’re doing. We just let the animals run the show.',
      image: { src: images.hero, alt: HERO_ALT },
    },
    factLabel: 'Udderly ridiculous fact:',
    members: teamPlaceholders(images),
    placeholders: true,
    cta: {
      heading: 'The animals would love to meet you.',
      body: 'Our team will show you around. The herd will do the rest.',
      label: BOOK_LABEL,
      href: '/experiences',
    },
    seo: {
      title: 'Team | Udderly Ridiculous Farm Life',
      description:
        'Meet the team behind Udderly Ridiculous Farm Life — the humans who keep the place running while the animals run the show.',
      ogDescription: "We have no idea what we're doing. We just let the animals run the show.",
      path: '/team',
    },
  }
}

export function faqPageFallback(images: AboutImages): Omit<FaqPage, 'groups'> {
  return {
    hero: {
      lead: 'You have questions.',
      accent: 'We might have answers.',
      image: { src: images.hero, alt: HERO_ALT },
    },
    cta: {
      heading: 'Still curious? Come see for yourself',
      label: BOOK_LABEL,
      href: '/experiences',
    },
    seo: {
      title: 'FAQ — Udderly Ridiculous Farm Life',
      description: 'Answers to common questions about our farm, booking system and farm life experiences.',
      path: '/faq',
    },
  }
}
