import type {SanityImage, SeasonalMedia} from '@/lib/sanity/types'

type ImageFields = {slug: string; heroImage?: SanityImage; cardImage?: SanityImage; gallery?: SanityImage[] | null; seasonalMedia?: SeasonalMedia}

export function activeExperienceImages<T extends ImageFields>(experience: T): T {
  if (experience.slug !== 'alpaca-walks' && experience.slug !== 'alpaca-experience-and-fibre-nesting-ball-workshop') return experience
  const media = experience.seasonalMedia
  if (!media) return experience
  const chosen = media.activeSeason === 'winter' ? media.winter : media.summer
  const complete = Boolean(chosen?.heroImage?.asset && chosen?.cardImage?.asset && chosen?.gallery?.length && chosen.gallery.every((image) => image?.asset))
  if (!complete || !chosen) return experience
  return {...experience, heroImage: chosen.heroImage, cardImage: chosen.cardImage, gallery: chosen.gallery}
}
