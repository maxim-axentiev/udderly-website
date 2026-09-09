import {
  createImageUrlBuilder,
  type SanityImageObject,
  type SanityImageSource,
} from '@sanity/image-url'

import { sanityConfig } from './config'
import type { SanityImage } from './types'

const builder = createImageUrlBuilder({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
})

function toImageSource(image: NonNullable<SanityImage>): SanityImageSource | undefined {
  const asset = image.asset
  if (!asset) {
    return undefined
  }

  const ref =
    '_ref' in asset && asset._ref
      ? asset._ref
      : '_id' in asset
        ? asset._id
        : undefined

  if (!ref) {
    return undefined
  }

  return {
    asset: { _ref: ref },
    crop: image.crop as SanityImageObject['crop'],
    hotspot: image.hotspot as SanityImageObject['hotspot'],
  }
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}

export function isSanityImage(image: SanityImage | undefined): image is NonNullable<SanityImage> {
  if (!image?.asset) {
    return false
  }

  return Boolean(
    '_id' in image.asset ? image.asset._id : '_ref' in image.asset && image.asset._ref,
  )
}

function imageSource(image: SanityImage | undefined): SanityImageSource | undefined {
  if (!isSanityImage(image)) {
    return undefined
  }

  return toImageSource(image)
}

export function cmsImageUrl(
  image: SanityImage | undefined,
  width: number,
): string | undefined {
  const source = imageSource(image)
  if (!source) {
    return undefined
  }

  try {
    return urlFor(source).width(width).url()
  } catch {
    return undefined
  }
}

export function cmsImageSrcSet(
  image: SanityImage | undefined,
  widths: number[],
): string | undefined {
  const source = imageSource(image)
  if (!source) {
    return undefined
  }

  try {
    return widths
      .map((width) => `${urlFor(source).width(width).url()} ${width}w`)
      .join(', ')
  } catch {
    return undefined
  }
}

export function cmsImageDimensions(image: SanityImage | undefined): {
  width?: number
  height?: number
} {
  if (!image?.asset || !('metadata' in image.asset)) {
    return {}
  }

  return {
    width: image.asset.metadata?.dimensions?.width,
    height: image.asset.metadata?.dimensions?.height,
  }
}

export function cmsImageLqip(image: SanityImage | undefined): string | undefined {
  if (!image?.asset || !('metadata' in image.asset)) {
    return undefined
  }

  return image.asset.metadata?.lqip
}
