import {
  homepageExperienceCards,
  homepageNewsletter,
  homepageUrbort,
} from '@/content/homepage'
import { cmsImageSrcSet, cmsImageUrl, isSanityImage } from '@/lib/sanity/image'
import type { SanityImage } from '@/lib/sanity/types'
import { getHomepageVideoEmbedUrl } from '@/lib/youtube'

import { localHomepageContent, type HomepageContent, type HomepageImage, type HomepageLink } from './model'

/**
 * Fallback policy: the public site uses the published Homepage document only
 * when every required field is present and valid. A missing document, a failed
 * request, or any invalid field returns the complete local fixture. CMS values
 * are never combined with fixture copy. drafts.homepage is not queried.
 * newsletterConfirmation is optional. When it is empty, the CMS page does not
 * invent a signup message. The fixture path keeps its existing placeholder.
 */
export type CmsHomepageDocument = {
  _id?: string | null
  headlineBefore?: string | null
  headlineAccent?: string | null
  headlineAfter?: string | null
  heroCopy?: string | null
  heroCta?: { label?: string | null; href?: string | null } | null
  heroImage?: SanityImage
  heroSticker?: string | null
  heroBadge?: string | null
  awardsTitle?: string | null
  awardsCopy?: string | null
  awardBadges?: Array<{ _key?: string | null; year?: string | null; image?: SanityImage } | null> | null
  experiencesHeadingFirst?: string | null
  experiencesHeadingSecond?: string | null
  experiencesIntro?: string | null
  experienceCards?: Array<{
    _key?: string | null
    fact?: string | null
    title?: string | null
    copy?: string | null
    image?: SanityImage
    cta?: { label?: string | null; href?: string | null } | null
  } | null> | null
  ownersKicker?: string | null
  ownersTitle?: string | null
  ownersParagraphs?: Array<string | null> | null
  ownersFastForward?: string | null
  ownersMilestones?: Array<string | null> | null
  ownersCta?: { label?: string | null; href?: string | null } | null
  ownersFamilyImage?: SanityImage
  ownersFamilyCaption?: string | null
  ownersFunImage?: SanityImage
  ownersFunCaption?: string | null
  mediaKicker?: string | null
  mediaTitle?: string | null
  mediaVideos?: Array<{
    _key?: string | null
    outlet?: string | null
    url?: string | null
    logo?: SanityImage
  } | null> | null
  mediaCta?: { label?: string | null; href?: string | null } | null
  welfareKicker?: string | null
  welfareTitle?: string | null
  welfareHintDesktop?: string | null
  welfareHintMobile?: string | null
  welfarePoints?: Array<{
    _key?: string | null
    name?: string | null
    copy?: string | null
    image?: SanityImage
  } | null> | null
  welfareCta?: { label?: string | null; href?: string | null } | null
  marketBadge?: string | null
  marketTitle?: string | null
  marketCopy?: string | null
  marketCta?: { label?: string | null; href?: string | null } | null
  marketImage?: SanityImage
  iceCreamBadge?: string | null
  iceCreamTitle?: string | null
  iceCreamParagraphs?: Array<string | null> | null
  iceCreamCta?: { label?: string | null; href?: string | null } | null
  iceCreamImage?: SanityImage
  giftGoatKicker?: string | null
  giftGoatTitle?: string | null
  giftGoatCopy?: string | null
  giftGoatCount?: number | null
  giftGoatCountLabel?: string | null
  giftGoatImage?: SanityImage
  reviewsTitle?: string | null
  reviewsAttribution?: string | null
  reviewsOrderNote?: string | null
  reviewsUnavailable?: string | null
  reviewsReadMoreLabel?: string | null
  reviewsReadFullLabel?: string | null
  reviewsShowLessLabel?: string | null
  reviewsCta?: { label?: string | null; href?: string | null } | null
  newsletterTitle?: string | null
  newsletterCopy?: string | null
  newsletterFirstNameLabel?: string | null
  newsletterFirstNamePlaceholder?: string | null
  newsletterEmailLabel?: string | null
  newsletterEmailPlaceholder?: string | null
  newsletterDateOfBirthLabel?: string | null
  newsletterSubmitLabel?: string | null
  newsletterConfirmation?: string | null
  newsletterMobileFirst?: SanityImage
  newsletterMobileSecond?: SanityImage
  newsletterMobileThird?: SanityImage
  newsletterMobileFourth?: SanityImage
  newsletterDesktopLeftUpper?: SanityImage
  newsletterDesktopLeftLower?: SanityImage
  newsletterDesktopRightUpper?: SanityImage
  newsletterDesktopRightLower?: SanityImage
  urbortTitle?: string | null
  urbortCopy?: string | null
  urbortCardLabel?: string | null
  urbortArticles?: Array<{
    _key?: string | null
    title?: string | null
    href?: string | null
    image?: SanityImage
  } | null> | null
  urbortCta?: { label?: string | null; href?: string | null } | null
  faqHeading?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
} | null

class InvalidHomepage extends Error {}

function requiredText(value: unknown, max: number): string {
  if (typeof value !== 'string' || value.trim() === '' || value.length > max) {
    throw new InvalidHomepage('required text')
  }
  return value
}

function optionalText(value: unknown, max: number): string {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string' || value.length > max) throw new InvalidHomepage('optional text')
  return value
}

function href(value: unknown): string {
  if (typeof value !== 'string' || /\s/.test(value)) throw new InvalidHomepage('href')
  if (value.startsWith('/') && !value.startsWith('//')) return value
  try {
    const url = new URL(value)
    if (url.protocol === 'http:' || url.protocol === 'https:') return value
  } catch {
    throw new InvalidHomepage('href')
  }
  throw new InvalidHomepage('href')
}

function link(value: { label?: string | null; href?: string | null } | null | undefined): HomepageLink {
  return { label: requiredText(value?.label, 80), href: href(value?.href) }
}

function textList(value: unknown, min: number, maxItems: number, maxLength: number): string[] {
  if (!Array.isArray(value) || value.length < min || value.length > maxItems) {
    throw new InvalidHomepage('list')
  }
  return value.map((item) => requiredText(item, maxLength))
}

function image(value: SanityImage | null | undefined, sizes: string, altRequired: boolean): HomepageImage {
  if (!isSanityImage(value) || !value.asset || !('metadata' in value.asset)) {
    throw new InvalidHomepage('image')
  }
  const width = value.asset.metadata?.dimensions?.width
  const height = value.asset.metadata?.dimensions?.height
  if (!width || !height) throw new InvalidHomepage('image dimensions')
  const src = cmsImageUrl(value, width)
  const widths = [480, 800, 1200, 1600].filter((item) => item < width)
  if (!widths.includes(width)) widths.push(width)
  const srcSet = cmsImageSrcSet(value, widths)
  if (!src || !srcSet) throw new InvalidHomepage('image url')
  const alt = typeof value.alt === 'string' ? value.alt : ''
  if (altRequired && alt.trim() === '') throw new InvalidHomepage('alt')
  if (alt.length > 160) throw new InvalidHomepage('alt length')
  return { src, alt, width, height, srcSet, sizes }
}

function badgeLines(value: unknown): string[] {
  const text = requiredText(value, 40)
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length === 0) throw new InvalidHomepage('badge')
  return lines
}

export function resolveHomepageContent(document: CmsHomepageDocument): HomepageContent | null {
  if (!document || document._id !== 'homepage') return null

  try {
    const experienceLayouts = homepageExperienceCards.map((card) => card.className)
    const urbortRotations = homepageUrbort.articles.map((article) => article.rotate)
    const mobileRotations = homepageNewsletter.mobileAnimals.map((animal) => animal.rotate)
    const leftPositions = homepageNewsletter.leftAnimals.map((animal) => animal.position)
    const rightPositions = homepageNewsletter.rightAnimals.map((animal) => animal.position)

    const awardBadges = document.awardBadges ?? []
    if (awardBadges.length < 1 || awardBadges.length > 8) throw new InvalidHomepage('awards')
    const experienceCards = document.experienceCards ?? []
    if (experienceCards.length < 1 || experienceCards.length > 4) throw new InvalidHomepage('cards')
    const mediaVideos = document.mediaVideos ?? []
    if (mediaVideos.length < 1 || mediaVideos.length > 8) throw new InvalidHomepage('media')
    const welfarePoints = document.welfarePoints ?? []
    if (welfarePoints.length < 1 || welfarePoints.length > 8) throw new InvalidHomepage('welfare')
    const urbortArticles = document.urbortArticles ?? []
    if (urbortArticles.length < 1 || urbortArticles.length > 3) throw new InvalidHomepage('urbort')
    if (!Number.isInteger(document.giftGoatCount) || document.giftGoatCount! < 0 || document.giftGoatCount! > 100000) {
      throw new InvalidHomepage('count')
    }

    const confirmation = optionalText(document.newsletterConfirmation, 200).trim()

    return {
      source: 'cms',
      seo: {
        title: requiredText(document.seoTitle, 70),
        description: requiredText(document.seoDescription, 180),
        ogTitle: requiredText(document.ogTitle, 70),
        ogDescription: requiredText(document.ogDescription, 200),
      },
      hero: {
        headlineBefore: requiredText(document.headlineBefore, 40),
        headlineAccent: requiredText(document.headlineAccent, 40),
        headlineAfter: requiredText(document.headlineAfter, 40),
        copy: requiredText(document.heroCopy, 500),
        cta: link(document.heroCta),
        image: image(document.heroImage, '(min-width: 1024px) 40rem, 88vw', true),
        sticker: requiredText(document.heroSticker, 40),
        badgeLines: badgeLines(document.heroBadge),
      },
      awards: {
        title: requiredText(document.awardsTitle, 80),
        copy: requiredText(document.awardsCopy, 120),
        badges: awardBadges.map((badge, index) => {
          if (!badge) throw new InvalidHomepage('award')
          return {
            id: badge._key || `award-${index + 1}`,
            year: requiredText(badge.year, 8),
            image: image(badge.image, '7rem', true),
          }
        }),
      },
      experiences: {
        headingFirst: requiredText(document.experiencesHeadingFirst, 40),
        headingSecond: requiredText(document.experiencesHeadingSecond, 40),
        intro: requiredText(document.experiencesIntro, 240),
        cards: experienceCards.map((card, index) => {
          if (!card) throw new InvalidHomepage('card')
          return {
            id: card._key || `experience-${index + 1}`,
            fact: requiredText(card.fact, 24),
            title: requiredText(card.title, 80),
            copy: requiredText(card.copy, 500),
            image: image(card.image, '(min-width: 1024px) 18rem, 90vw', true),
            cta: link(card.cta),
            className: experienceLayouts[index] ?? '',
          }
        }),
      },
      owners: {
        kicker: requiredText(document.ownersKicker, 40),
        title: requiredText(document.ownersTitle, 80),
        paragraphs: textList(document.ownersParagraphs, 1, 8, 2000),
        fastForward: requiredText(document.ownersFastForward, 80),
        milestones: textList(document.ownersMilestones, 1, 12, 80),
        cta: link(document.ownersCta),
        family: {
          ...image(document.ownersFamilyImage, '(min-width: 1024px) 36rem, 100vw', true),
          caption: requiredText(document.ownersFamilyCaption, 40),
        },
        fun: {
          ...image(document.ownersFunImage, '(min-width: 1024px) 24rem, 80vw', true),
          caption: requiredText(document.ownersFunCaption, 80),
        },
      },
      media: {
        kicker: requiredText(document.mediaKicker, 40),
        title: requiredText(document.mediaTitle, 80),
        cta: link(document.mediaCta),
        videos: mediaVideos.map((video, index) => {
          if (!video) throw new InvalidHomepage('video')
          const url = requiredText(video.url, 2000)
          const embedUrl = getHomepageVideoEmbedUrl(url)
          if (!embedUrl) throw new InvalidHomepage('video url')
          return {
            id: video._key || `media-${index + 1}`,
            outlet: requiredText(video.outlet, 40),
            url,
            embedUrl,
            logo: image(video.logo, '8rem', false),
          }
        }),
      },
      welfare: {
        kicker: requiredText(document.welfareKicker, 40),
        title: requiredText(document.welfareTitle, 120),
        hintDesktop: requiredText(document.welfareHintDesktop, 60),
        hintMobile: requiredText(document.welfareHintMobile, 60),
        cta: link(document.welfareCta),
        points: welfarePoints.map((point, index) => {
          if (!point) throw new InvalidHomepage('welfare point')
          return {
            id: point._key || `welfare-${index + 1}`,
            name: requiredText(point.name, 40),
            copy: requiredText(point.copy, 800),
            image: image(point.image, '(min-width: 768px) 20vw, 45vw', true),
          }
        }),
      },
      store: {
        badge: requiredText(document.marketBadge, 40),
        title: requiredText(document.marketTitle, 80),
        copy: requiredText(document.marketCopy, 1200),
        cta: link(document.marketCta),
        image: image(document.marketImage, '(min-width: 1024px) 36rem, 100vw', true),
      },
      iceCream: {
        badge: requiredText(document.iceCreamBadge, 40),
        title: requiredText(document.iceCreamTitle, 80),
        paragraphs: textList(document.iceCreamParagraphs, 1, 8, 2000),
        cta: link(document.iceCreamCta),
        image: image(document.iceCreamImage, '(min-width: 1024px) 36rem, 100vw', true),
      },
      giftGoat: {
        kicker: requiredText(document.giftGoatKicker, 40),
        title: requiredText(document.giftGoatTitle, 80),
        copy: requiredText(document.giftGoatCopy, 800),
        count: document.giftGoatCount!,
        countLabel: requiredText(document.giftGoatCountLabel, 40),
        image: image(document.giftGoatImage, '11rem', true),
      },
      reviews: {
        title: requiredText(document.reviewsTitle, 120),
        attribution: requiredText(document.reviewsAttribution, 80),
        orderNote: requiredText(document.reviewsOrderNote, 80),
        unavailable: requiredText(document.reviewsUnavailable, 300),
        readMoreLabel: requiredText(document.reviewsReadMoreLabel, 40),
        readFullLabel: requiredText(document.reviewsReadFullLabel, 40),
        showLessLabel: requiredText(document.reviewsShowLessLabel, 40),
        cta: link(document.reviewsCta),
      },
      newsletter: {
        title: requiredText(document.newsletterTitle, 80),
        copy: requiredText(document.newsletterCopy, 500),
        firstNameLabel: requiredText(document.newsletterFirstNameLabel, 40),
        firstNamePlaceholder: optionalText(document.newsletterFirstNamePlaceholder, 40),
        emailLabel: requiredText(document.newsletterEmailLabel, 40),
        emailPlaceholder: optionalText(document.newsletterEmailPlaceholder, 80),
        dateOfBirthLabel: requiredText(document.newsletterDateOfBirthLabel, 40),
        submitLabel: requiredText(document.newsletterSubmitLabel, 40),
        confirmation: confirmation || null,
        mobileAnimals: [
          document.newsletterMobileFirst,
          document.newsletterMobileSecond,
          document.newsletterMobileThird,
          document.newsletterMobileFourth,
        ].map((animal, index) => ({
          ...image(animal, '8rem', true),
          rotate: mobileRotations[index] ?? '',
        })),
        leftAnimals: [document.newsletterDesktopLeftUpper, document.newsletterDesktopLeftLower].map(
          (animal, index) => ({
            ...image(animal, '16rem', true),
            position: leftPositions[index] ?? '',
          }),
        ),
        rightAnimals: [document.newsletterDesktopRightUpper, document.newsletterDesktopRightLower].map(
          (animal, index) => ({
            ...image(animal, '16rem', true),
            position: rightPositions[index] ?? '',
          }),
        ),
      },
      urbort: {
        title: requiredText(document.urbortTitle, 40),
        copy: requiredText(document.urbortCopy, 800),
        cardLabel: requiredText(document.urbortCardLabel, 40),
        cta: link(document.urbortCta),
        articles: urbortArticles.map((article, index) => {
          if (!article) throw new InvalidHomepage('article')
          return {
            id: article._key || `urbort-${index + 1}`,
            title: requiredText(article.title, 80),
            href: href(article.href),
            rotate: urbortRotations[index] ?? '',
            image: image(article.image, '(min-width: 768px) 30vw, 100vw', true),
          }
        }),
      },
      faqHeading: requiredText(document.faqHeading, 120),
    }
  } catch (error) {
    if (error instanceof InvalidHomepage) return null
    throw error
  }
}

export function homepageContentOrFixture(document: CmsHomepageDocument): HomepageContent {
  return resolveHomepageContent(document) ?? localHomepageContent()
}
