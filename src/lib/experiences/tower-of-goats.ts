import { SITE_NAME } from '@/lib/site'

import { TOWER_OF_GOATS_PATH } from './approved-listing'

export const TOWER_OF_GOATS_TITLE = 'General Admission'
export const TOWER_OF_GOATS_SUBTITLE = 'Tower of Goats Discovery Trail'

export const towerOfGoatsHead = {
  title: `${TOWER_OF_GOATS_TITLE}: ${TOWER_OF_GOATS_SUBTITLE} | ${SITE_NAME}`,
  description: 'We’re not a petting zoo, and we never wanted to be one.',
  path: TOWER_OF_GOATS_PATH,
} as const

export const towerOfGoatsHeroAlt = 'Visitors exploring the Tower of Goats Discovery Trail'

export const towerOfGoatsGallery = [
  { key: 'goat-cuddles', alt: 'Guest cuddling a mini goat inside the cozy barn' },
  { key: 'homepage-experiences', alt: 'Goats crowding around a laughing visitor in the pasture' },
  { key: 'goat-icon-1', alt: 'Curious brown and white goat looking straight at the camera' },
  { key: 'goat-icon-3', alt: 'Fluffy goat kid being held in a visitor’s arms at golden hour' },
] as const

export const towerOfGoatsPaceHeading = 'The whole farm, at goat pace.'

export const towerOfGoatsFacts = [
  { label: 'Duration', value: 'Explore at your own pace' },
  { label: 'Age', value: 'All ages' },
] as const

export const towerOfGoatsAwardsTagline = 'Top 10% of attractions worldwide by Tripadvisor.'

export const towerOfGoatsStoriesHeading = 'One tower. A hundred stories.'

export const towerOfGoatsStories = [
  {
    title: 'This Playground Was Built for the Kids. The Four-Legged Ones.',
    paragraphs: [
      'We’re not a petting zoo, and we never wanted to be one.',
      'Instead of building another playground for human kids, we built one for ours. The result is Canada’s only Goat Tower and the world’s only Art Deco Goat Tower, part play structure, part larger-than-life art piece, and very much a place for goats to be goats.',
      'Our approach to animal interaction is a little different. Rather than placing animals in small spaces where they’re constantly fed, touched and approached, we give them choice. They decide whether they want to come say hello, hang out nearby or completely ignore you.',
      'It might feel different from what you expect at a farm attraction. That’s kind of the point.',
    ],
  },
  {
    title: 'More Than a Goat Tower',
    paragraphs: [
      'The Tower was created to become one of the defining structures of the farm, connecting where this land has been, what it is today and what we hope it can become.',
      'And because a giant Art Deco tower covered in goats apparently wasn’t enough, we turned the entire structure into a canvas.',
      'Ontario artist Sacha Taylor created the Tower’s artwork to tell the story of this farm through the people, animals, crops and land that have shaped it.',
      'Look closely and you’ll find some familiar Udderly faces, including Hugo, Twitch, Rhett, Snickers and Lickey Split, alongside depictions of the crops grown here and throughout our region.',
      'It’s farming, storytelling, history and art wrapped around one very unusual goat playground.',
    ],
  },
  {
    title: 'A Story Rooted in the Land',
    paragraphs: [
      'We wanted the Tower to recognize a story that began long before our farm did.',
      'At its base, you’ll find a turtle representing our farm’s place on Turtle Island, incorporated into the artwork as a lasting acknowledgement of the Indigenous peoples who were the original stewards of this land.',
      'Nearby, we planted a Three Sisters Garden, creating an opportunity to explore Indigenous agricultural practices and talk about the relationship between farming methods of the past and those used today.',
      'Rather than keeping that acknowledgement tucked away on a webpage, we wanted it to become part of the farm itself, something visitors can see, discover and continue learning from for years to come.',
    ],
  },
  {
    title: 'The People Who Made This Place Home',
    paragraphs: [
      'Among the Tower’s artwork, you’ll also find Alvin, Marg and their dog Peanut.',
      'Their portrait is there to honour the years of work, care and love they poured into this farm before it became the place you’re visiting today.',
      'The Tower may look toward the future, but it was important to us that it never forgot the people who helped build its foundation.',
    ],
  },
  {
    title: 'Think You Can Find Them All?',
    paragraphs: [
      'The Tower has a few secrets.',
      'Hidden throughout the artwork are 20 bees, waiting to be discovered. You’ll also find them incorporated into the Discovery Trail map, turning your visit into a bit of a scavenger hunt as you explore the farm.',
      'Some are easy.',
      'Some are sneaky.',
      'And some may have you staring at a goat tower considerably longer than you expected.',
      'Keep your eyes open as you follow the trail, meet the animals and uncover the stories hidden throughout the farm.',
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
