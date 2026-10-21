export const SINGLETON_TYPES = [
  'siteSettings',
  'farmSounds',
  'navigation',
  'homepage',
  'experiencesHub',
  'adoptionPage',
  'animalsForSalePage',
  'corporateTrainingPage',
  'ourStoryPage',
  'visionValuesPage',
  'teamPage',
  'faqPage',
  'urbortBlogPage',
  'contactPage',
  'newsletterPage',
  'farmMarketPage',
  'iceCreamPage',
  'giftCardPage',
  'farmGlampingPage',
] as const

export type SingletonType = (typeof SINGLETON_TYPES)[number]

export const SINGLETON_IDS: Record<SingletonType, string> = {
  siteSettings: 'siteSettings',
  farmSounds: 'farmSounds',
  navigation: 'navigation',
  homepage: 'homepage',
  experiencesHub: 'experiencesHub',
  adoptionPage: 'adoptionPage',
  animalsForSalePage: 'animalsForSalePage',
  corporateTrainingPage: 'corporateTrainingPage',
  ourStoryPage: 'ourStoryPage',
  visionValuesPage: 'visionValuesPage',
  teamPage: 'teamPage',
  faqPage: 'faqPage',
  urbortBlogPage: 'urbortBlogPage',
  contactPage: 'contactPage',
  newsletterPage: 'newsletterPage',
  farmMarketPage: 'farmMarketPage',
  iceCreamPage: 'iceCreamPage',
  giftCardPage: 'giftCardPage',
  farmGlampingPage: 'farmGlampingPage',
}

export function isSingletonType(type: string): type is SingletonType {
  return (SINGLETON_TYPES as readonly string[]).includes(type)
}
