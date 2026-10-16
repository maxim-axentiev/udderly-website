export const SINGLETON_TYPES = [
  'siteSettings',
  'farmSounds',
  'navigation',
  'homepage',
  'experiencesHub',
] as const

export type SingletonType = (typeof SINGLETON_TYPES)[number]

export const SINGLETON_IDS: Record<SingletonType, string> = {
  siteSettings: 'siteSettings',
  farmSounds: 'farmSounds',
  navigation: 'navigation',
  homepage: 'homepage',
  experiencesHub: 'experiencesHub',
}

export function isSingletonType(type: string): type is SingletonType {
  return (SINGLETON_TYPES as readonly string[]).includes(type)
}
