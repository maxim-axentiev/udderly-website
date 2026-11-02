import { SITE_NAME } from '@/lib/site'

import { TOWER_OF_GOATS_PATH } from './approved-listing'

export const TOWER_OF_GOATS_TITLE = 'General Admission'
export const TOWER_OF_GOATS_SUBTITLE = 'Tower of Goats Discovery Trail'

export const towerOfGoatsHead = {
  title: `${TOWER_OF_GOATS_TITLE}: ${TOWER_OF_GOATS_SUBTITLE} | ${SITE_NAME}`,
  description: 'We’re not a petting zoo, and we never wanted to be one.',
  path: TOWER_OF_GOATS_PATH,
} as const

export const towerOfGoatsPaceHeading = 'The whole farm, at goat pace.'

export const towerOfGoatsFacts = [
  { label: 'Duration', value: 'Explore at your own pace' },
  { label: 'Age', value: 'All ages' },
] as const

export const towerOfGoatsStoriesHeading = 'One tower. A hundred stories.'

export const towerOfGoatsStories = [
  {
    title: 'This Playground Was Built for the Kids. The Four-Legged Ones.',
    paragraphs: [
      'We’re not a petting zoo, and we never wanted to be one.',
      'Instead of building another playground for human kids, we built one for ours. It is part play structure, part larger-than-life art piece, and very much a place for goats to be goats.',
      'Our approach to animal interaction is a little different. Rather than placing animals in small spaces where they’re constantly fed, touched and approached, we give them choice. They decide whether they want to come say hello, hang out nearby or completely ignore you.',
      'It might feel different from what you expect at a farm attraction. That’s kind of the point.',
    ],
  },
  {
    title: 'More Than a Goat Tower',
    paragraphs: [
      'The Tower was created to become one of the defining structures of the farm, connecting where this land has been, what it is today and what we hope it can become.',
    ],
  },
] as const

export const towerOfGoatsLocation = {
  headingLead: 'Come find us.',
  headingAccent: 'We’re out here somewhere.',
  note: 'Roughly 30 minutes from Kitchener-Waterloo, past the part where your GPS gets confident.',
  name: 'Udderly Ridiculous Farm Life',
  lines: ['906200 Township Rd 12', 'Blandford-Blenheim, ON N0J 1B0', 'Canada'],
  directionsHref:
    'https://www.google.com/maps/dir/?api=1&destination=906200+Township+Rd+12%2C+Blandford-Blenheim%2C+ON+N0J+1B0',
  mapSrc:
    'https://www.google.com/maps?q=906200+Township+Rd+12,+Blandford-Blenheim,+ON+N0J+1B0&z=13&output=embed',
  mapTitle: 'Map showing the location of Udderly Ridiculous Farm Life',
} as const
