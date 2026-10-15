import {
  homepageAwards,
  homepageExperienceCards,
  homepageHero,
  homepageMedia,
  homepageNewsletter,
  homepageOwners,
  homepageReviews,
  homepageSeo,
  homepageStore,
  homepageUrbort,
  homepageWelfare,
} from '@/content/homepage'
import { getYoutubeEmbedUrl } from '@/lib/youtube'

export type HomepageImage = {
  src: string
  alt: string
  width: number
  height: number
  srcSet?: string
  sizes?: string
}

export type HomepageLink = {
  label: string
  href: string
}

export type HomepageContent = {
  source: 'fixture' | 'cms'
  seo: {
    title: string
    description: string
    ogTitle: string
    ogDescription: string
  }
  hero: {
    headlineBefore: string
    headlineAccent: string
    headlineAfter: string
    copy: string
    cta: HomepageLink
    image: HomepageImage
    sticker: string
    badgeLines: string[]
  }
  awards: {
    title: string
    copy: string
    badges: Array<{ id: string; year: string; image: HomepageImage }>
  }
  experiences: {
    headingFirst: string
    headingSecond: string
    intro: string
    cards: Array<{
      id: string
      fact: string
      title: string
      copy: string
      image: HomepageImage
      cta: HomepageLink
      className: string
    }>
  }
  owners: {
    kicker: string
    title: string
    paragraphs: string[]
    fastForward: string
    milestones: string[]
    cta: HomepageLink
    family: HomepageImage & { caption: string }
    fun: HomepageImage & { caption: string }
  }
  media: {
    kicker: string
    title: string
    cta: HomepageLink
    videos: Array<{
      id: string
      outlet: string
      url: string
      embedUrl: string
      logo: HomepageImage
    }>
  }
  welfare: {
    kicker: string
    title: string
    hintDesktop: string
    hintMobile: string
    cta: HomepageLink
    points: Array<{ id: string; name: string; copy: string; image: HomepageImage }>
  }
  store: {
    badge: string
    title: string
    copy: string
    cta: HomepageLink
    image: HomepageImage
  }
  iceCream: {
    badge: string
    title: string
    paragraphs: string[]
    cta: HomepageLink
    image: HomepageImage
  }
  giftGoat: {
    kicker: string
    title: string
    copy: string
    count: number
    countLabel: string
    image: HomepageImage
  }
  reviews: {
    title: string
    attribution: string
    orderNote: string
    unavailable: string
    readMoreLabel: string
    readFullLabel: string
    showLessLabel: string
    cta: HomepageLink
  }
  newsletter: {
    title: string
    copy: string
    firstNameLabel: string
    firstNamePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    dateOfBirthLabel: string
    submitLabel: string
    confirmation: string | null
    mobileAnimals: Array<HomepageImage & { rotate: string }>
    leftAnimals: Array<HomepageImage & { position: string }>
    rightAnimals: Array<HomepageImage & { position: string }>
  }
  urbort: {
    title: string
    copy: string
    cardLabel: string
    cta: HomepageLink
    articles: Array<{
      id: string
      title: string
      href: string
      rotate: string
      image: HomepageImage
    }>
  }
  faqHeading: string
}

export const homepageSectionOrder = [
  'hero',
  'awards',
  'experiences',
  'owners',
  'media',
  'welfare',
  'store',
  'reviews',
  'newsletter',
  'urbort',
  'faq',
] as const

function localImage(
  src: string,
  alt: string,
  width: number,
  height: number,
): HomepageImage {
  return { src, alt, width, height }
}

export function localHomepageContent(): HomepageContent {
  return {
    source: 'fixture',
    seo: {
      title: homepageSeo.title,
      description: homepageSeo.description,
      ogTitle: homepageSeo.ogTitle,
      ogDescription: homepageSeo.ogDescription,
    },
    hero: {
      headlineBefore: homepageHero.headlineBefore,
      headlineAccent: homepageHero.headlineAccent,
      headlineAfter: homepageHero.headlineAfter,
      copy: homepageHero.copy,
      cta: homepageHero.cta,
      image: localImage(
        homepageHero.image.src,
        homepageHero.image.alt,
        homepageHero.image.width,
        homepageHero.image.height,
      ),
      sticker: homepageHero.sticker,
      badgeLines: homepageHero.badge.split('\n'),
    },
    awards: {
      title: homepageAwards.title,
      copy: homepageAwards.copy,
      badges: homepageAwards.badges.map((badge) => ({
        id: badge.year,
        year: badge.year,
        image: localImage(badge.src, badge.alt, 320, 320),
      })),
    },
    experiences: {
      headingFirst: 'Pick your',
      headingSecond: 'ridiculousness.',
      intro: 'Four ways to get ridiculous, mischievous, and happy...ous.',
      cards: homepageExperienceCards.map((card) => ({
        id: card.title,
        fact: card.fact,
        title: card.title,
        copy: card.copy,
        image: localImage(card.image.src, card.image.alt, card.image.width, card.image.height),
        cta: card.cta,
        className: card.className,
      })),
    },
    owners: {
      kicker: homepageOwners.kicker,
      title: homepageOwners.title,
      paragraphs: [...homepageOwners.paragraphs],
      fastForward: homepageOwners.fastForward,
      milestones: [...homepageOwners.milestones],
      cta: homepageOwners.cta,
      family: {
        ...localImage(
          homepageOwners.family.src,
          homepageOwners.family.alt,
          homepageOwners.family.width,
          homepageOwners.family.height,
        ),
        caption: homepageOwners.family.caption,
      },
      fun: {
        ...localImage(
          homepageOwners.fun.src,
          homepageOwners.fun.alt,
          homepageOwners.fun.width,
          homepageOwners.fun.height,
        ),
        caption: homepageOwners.fun.caption,
      },
    },
    media: {
      kicker: homepageMedia.kicker,
      title: homepageMedia.title,
      cta: homepageMedia.cta,
      videos: homepageMedia.videos.map((video) => ({
        id: video.outlet,
        outlet: video.outlet,
        url: video.url,
        embedUrl: getYoutubeEmbedUrl(video.url),
        logo: localImage(video.logo, '', 480, 480),
      })),
    },
    welfare: {
      kicker: homepageWelfare.kicker,
      title: homepageWelfare.title,
      hintDesktop: homepageWelfare.hintDesktop,
      hintMobile: homepageWelfare.hintMobile,
      cta: homepageWelfare.cta,
      points: homepageWelfare.points.map((point) => ({
        id: point.name,
        name: point.name,
        copy: point.copy,
        image: localImage(
          point.image.src,
          point.image.alt,
          point.image.width,
          point.image.height,
        ),
      })),
    },
    store: {
      badge: homepageStore.store.badge,
      title: homepageStore.store.title,
      copy: homepageStore.store.copy,
      cta: homepageStore.store.cta,
      image: localImage(
        homepageStore.store.image.src,
        homepageStore.store.image.alt,
        homepageStore.store.image.width,
        homepageStore.store.image.height,
      ),
    },
    iceCream: {
      badge: homepageStore.iceCream.badge,
      title: homepageStore.iceCream.title,
      paragraphs: [...homepageStore.iceCream.paragraphs],
      cta: homepageStore.iceCream.cta,
      image: localImage(
        homepageStore.iceCream.image.src,
        homepageStore.iceCream.image.alt,
        homepageStore.iceCream.image.width,
        homepageStore.iceCream.image.height,
      ),
    },
    giftGoat: {
      kicker: homepageStore.giftGoat.kicker,
      title: homepageStore.giftGoat.title,
      copy: homepageStore.giftGoat.copy,
      count: homepageStore.giftGoat.target,
      countLabel: homepageStore.giftGoat.countLabel,
      image: localImage(
        homepageStore.giftGoat.image.src,
        homepageStore.giftGoat.image.alt,
        homepageStore.giftGoat.image.width,
        homepageStore.giftGoat.image.height,
      ),
    },
    reviews: {
      title: homepageReviews.title,
      attribution: homepageReviews.googleAttribution,
      orderNote: homepageReviews.googleOrderNote,
      unavailable: homepageReviews.unavailableCopy,
      readMoreLabel: homepageReviews.readMoreLabel,
      readFullLabel: 'Read full review',
      showLessLabel: 'Show less',
      cta: homepageReviews.cta,
    },
    newsletter: {
      title: homepageNewsletter.title,
      copy: homepageNewsletter.copy,
      firstNameLabel: 'First name (required)',
      firstNamePlaceholder: 'Cheryl',
      emailLabel: 'Email (required)',
      emailPlaceholder: 'you@example.com',
      dateOfBirthLabel: 'Date of birth (required)',
      submitLabel: 'Sign me up',
      confirmation: homepageNewsletter.confirmation,
      mobileAnimals: homepageNewsletter.mobileAnimals.map((animal) => ({
        ...localImage(animal.src, '', 768, 768),
        rotate: animal.rotate,
      })),
      leftAnimals: homepageNewsletter.leftAnimals.map((animal) => ({
        ...localImage(animal.src, '', 768, 768),
        position: animal.position,
      })),
      rightAnimals: homepageNewsletter.rightAnimals.map((animal) => ({
        ...localImage(animal.src, '', 768, 768),
        position: animal.position,
      })),
    },
    urbort: {
      title: homepageUrbort.title,
      copy: homepageUrbort.copy,
      cardLabel: 'Read the article',
      cta: homepageUrbort.cta,
      articles: homepageUrbort.articles.map((article) => ({
        id: article.title,
        title: article.title,
        href: article.href,
        rotate: article.rotate,
        image: localImage(
          article.image.src,
          article.image.alt,
          article.image.width,
          article.image.height,
        ),
      })),
    },
    faqHeading: 'You have questions. We might have answers.',
  }
}
