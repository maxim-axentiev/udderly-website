const altImage = `{
  alt,
  hotspot,
  crop,
  asset->{
    _id,
    _type,
    metadata {
      lqip,
      dimensions { width, height, aspectRatio }
    }
  }
}`

export const experienceBySlugQuery = `*[_type == "experience" && slug.current == $slug && active != false][0]{
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  body,
  heroImage ${altImage},
  gallery[] ${altImage},
  category,
  animalSpecies[]->{ title, "slug": slug.current },
  season,
  duration,
  priceDisplay,
  groupSize,
  sessionType,
  ageGuidance,
  visitorInfo,
  accessibilityInfo,
  bookingUrl,
  "animals": animals[]->{
    _id,
    name,
    "slug": slug.current,
    shortIntro,
    "funFact": funFacts[0],
    status,
    "speciesTitle": species->title,
    profileImage ${altImage}
  }[defined(_id)],
  "faqs": faqs[]->{
    _id,
    question,
    answer,
    category,
    sortOrder,
    active
  }[defined(_id) && active != false],
  "testimonials": testimonials[]->{
    _id,
    quote,
    guestName,
    source,
    sourceUrl,
    image ${altImage}
  }[defined(_id)],
  cancellationPolicy->{
    heading,
    internalName,
    content,
    active
  },
  welfarePolicy->{
    heading,
    internalName,
    content,
    active
  },
  seo {
    title,
    description,
    noIndex,
    image ${altImage}
  }
}`

export const experienceHubQuery = `*[_type == "experience" && active != false] | order(sortOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  priceDisplay,
  duration,
  category,
  season,
  sessionType,
  ageGuidance,
  bookingUrl,
  heroImage ${altImage},
  animalSpecies[]->{ title }
}`

export const experienceSitemapSlugsQuery = `*[_type == "experience" && active != false && defined(slug.current)].slug.current`

export const adoptionOfferingsQuery = `*[_type == "adoptionOffering"] | order(sortOrder asc, title asc){
  _id,
  title,
  "slug": slug.current,
  introduction,
  tagline,
  storyParagraphs,
  supportParagraphs,
  termsItems,
  availability,
  sortOrder,
  active,
  cardImage ${altImage},
  galleryOverride[] ${altImage},
  packages[]{
    kicker,
    name,
    subtitle,
    priceDisplay,
    includes,
    checkoutUrl
  },
  seo { title, description },
  "speciesTitle": animal->species->title
}`

export const adoptionPageQuery = `*[_id == "adoptionPage"][0]{
  _id,
  heroLead,
  heroAccent,
  heroIntro,
  heroImage ${altImage},
  awardsTitle,
  awardsTagline,
  awardImages[] ${altImage},
  sponsorLead,
  sponsorAccent,
  sponsorParagraphs,
  sponsorNote,
  sponsorImage ${altImage},
  manageCollection,
  animalsHeading,
  animalsIntro,
  learnMoreLabel,
  adoptButtonLabel,
  supportLead,
  supportAccent,
  supportParagraphs,
  supportButtonLabel,
  supportButtonHref,
  supportImage ${altImage},
  meetLead,
  packageLead,
  packageAccent,
  packageIntroGold,
  packageIntroSingle,
  finePrintLead,
  finePrintAccent,
  detailSupportLead,
  detailSupportAccent,
  seoTitle,
  seoDescription
}`

export const animalListingsQuery = `*[_type == "animalListing"] | order(sortOrder asc, title asc){
  _id,
  title,
  "slug": slug.current,
  status,
  sortOrder,
  active,
  detailsProfile,
  priceDisplay,
  personality,
  groupDescription,
  birthHeight,
  birthWeight,
  "birthDate": birthDate,
  sex,
  genetics,
  placementIntro,
  placementItems,
  parentDamName,
  parentDamHeight,
  parentSireName,
  parentSireHeight,
  images[] ${altImage},
  sizeChart ${altImage},
  seo { title, description },
  "speciesTitle": species->title
}`

export const animalsForSalePageQuery = `*[_id == "animalsForSalePage"][0]{
  _id,
  heroLead,
  heroAccent,
  heroImage ${altImage},
  heroSupport,
  introLead,
  introAccent,
  introImage ${altImage},
  intro,
  introButtonLabel,
  introButtonHref,
  manageCollection,
  availableHeading,
  soldLead,
  soldAccent,
  soldIntro,
  prepHeading,
  prepItems[]{title, copy, image ${altImage}},
  learnMoreLabel,
  waitlistTitle,
  waitlistCopy,
  detailWaitlistTitle,
  detailWaitlistCopy,
  buyButtonLabel,
  contactHeading,
  contactButtonLabel,
  seoTitle,
  seoDescription
}`

export const experiencesHubContentQuery = `*[_id == "experiencesHub"][0]{
  _id,
  heading,
  intro,
  emptyHeading,
  emptyMessage,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription
}`

const cmsLink = `{
  label,
  linkType,
  href,
  openInNewTab,
  internalLink->{_type, "slug": slug.current}
}`

export const navigationQuery = `*[_id == "navigation"][0]{
  headerItems[]{
    link ${cmsLink},
    children[]{ link ${cmsLink} }
  },
  footerItems[]{ link ${cmsLink} },
  legalItems[]{ link ${cmsLink} }
}`

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  siteName,
  email,
  phone,
  footerTagline,
  bookingCta ${cmsLink},
  address { line1, line2, city, region, postalCode, country },
  socialLinks { facebook, instagram, youtube, tiktok }
}`

export const homepageQuery = `*[_id == "homepage"][0]{
  _id,
  headlineBefore,
  headlineAccent,
  headlineAfter,
  heroCopy,
  heroCta { label, href },
  heroImage ${altImage},
  heroSticker,
  heroBadge,
  awardsTitle,
  awardsCopy,
  awardBadges[]{
    _key,
    year,
    image ${altImage}
  },
  experiencesHeadingFirst,
  experiencesHeadingSecond,
  experiencesIntro,
  experienceCards[]{
    _key,
    fact,
    title,
    copy,
    image ${altImage},
    cta { label, href }
  },
  ownersKicker,
  ownersTitle,
  ownersParagraphs,
  ownersFastForward,
  ownersMilestones,
  ownersCta { label, href },
  ownersFamilyImage ${altImage},
  ownersFamilyCaption,
  ownersFunImage ${altImage},
  ownersFunCaption,
  mediaKicker,
  mediaTitle,
  mediaVideos[]{
    _key,
    outlet,
    url,
    logo {
      alt,
      hotspot,
      crop,
      asset->{
        _id,
        metadata { dimensions { width, height } }
      }
    }
  },
  mediaCta { label, href },
  welfareKicker,
  welfareTitle,
  welfareHintDesktop,
  welfareHintMobile,
  welfarePoints[]{
    _key,
    name,
    copy,
    image ${altImage}
  },
  welfareCta { label, href },
  marketBadge,
  marketTitle,
  marketCopy,
  marketCta { label, href },
  marketImage ${altImage},
  iceCreamBadge,
  iceCreamTitle,
  iceCreamParagraphs,
  iceCreamCta { label, href },
  iceCreamImage ${altImage},
  giftGoatKicker,
  giftGoatTitle,
  giftGoatCopy,
  giftGoatCount,
  giftGoatCountLabel,
  giftGoatImage ${altImage},
  reviewsTitle,
  reviewsAttribution,
  reviewsOrderNote,
  reviewsUnavailable,
  reviewsReadMoreLabel,
  reviewsReadFullLabel,
  reviewsShowLessLabel,
  reviewsCta { label, href },
  newsletterTitle,
  newsletterCopy,
  newsletterFirstNameLabel,
  newsletterFirstNamePlaceholder,
  newsletterEmailLabel,
  newsletterEmailPlaceholder,
  newsletterDateOfBirthLabel,
  newsletterSubmitLabel,
  newsletterConfirmation,
  newsletterMobileFirst ${altImage},
  newsletterMobileSecond ${altImage},
  newsletterMobileThird ${altImage},
  newsletterMobileFourth ${altImage},
  newsletterDesktopLeftUpper ${altImage},
  newsletterDesktopLeftLower ${altImage},
  newsletterDesktopRightUpper ${altImage},
  newsletterDesktopRightLower ${altImage},
  urbortTitle,
  urbortCopy,
  urbortCardLabel,
  urbortArticles[]{
    _key,
    title,
    href,
    image ${altImage}
  },
  urbortCta { label, href },
  faqHeading,
  seoTitle,
  seoDescription,
  ogTitle,
  ogDescription
}`

export const homepageFaqsQuery = `*[_id == "siteSettings"][0]{
  homepageFaqs[]{
    _key,
    "faq": @->{
      _id,
      question,
      answer,
      active
    }
  }
}`
