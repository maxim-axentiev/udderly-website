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

export const experienceBySlugQuery = `*[_type == "experience" && slug.current in $slugs && active != false] | order(select(slug.current == $slug => 0, 1))[0]{
  _id,
  title,
  titleAccent,
  "slug": slug.current,
  shortDescription,
  heroIntro,
  introductionHeading,
  body,
  badge,
  heroImage ${altImage},
  gallery[] ${altImage},
  category,
  animalSpecies[]->{ title, "slug": slug.current },
  season,
  seasonLabel,
  duration,
  priceDisplay,
  priceOptions[]{ label, price },
  groupSize,
  sessionType,
  ageGuidance,
  practicalHeading,
  practicalTips,
  visitorInfo,
  accessibilityInfo,
  bookingUrl,
  bookingVerified,
  bookingProvider,
  fareharborItemId,
  fareharborFlowId,
  bookingCtaLabel,
  animalsHeading,
  animalsIntro,
  faqsHeading,
  instructor {
    heading,
    body,
    image ${altImage},
    gallery[] ${altImage}
  },
  feastOn { enabled, kicker, heading, body, href },
  signatureExperience {
    enabled,
    kicker,
    heading,
    body,
    href,
    image ${altImage}
  },
  reviewsHeading,
  reviewsApproved,
  welfareHeading,
  welfareNote,
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
  bookingVerified,
  bookingProvider,
  fareharborItemId,
  fareharborFlowId,
  heroImage ${altImage},
  animalSpecies[]->{ title }
}`

export const experienceSitemapSlugsQuery = `*[_type == "experience" && active != false && defined(slug.current)].slug.current`

export const experienceFoundationQuery = `*[_id == "siteSettings"][0]{
  experienceAwardsEnabled,
  experienceAwardsTitle,
  experienceAwardsTagline,
  experienceAwardImages[] ${altImage},
  experienceWelfareHeading,
  experienceWelfareBody,
  experienceWelfareImage ${altImage}
}`

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
  ogDescription,
  heroLead,
  heroAccent,
  heroSupporting,
  heroImage ${altImage},
  categoryIntro{headingLead, headingAccent, copy},
  categories[]{title, note, href, image ${altImage}, sortOrder},
  farmExperiencesIntro{heading, copy},
  experienceCards[]{title, slug, description, season, age, badge, image ${altImage}, learnMoreHref, bookingUrl, sortOrder},
  staysIntro{kicker, heading, copy},
  stays[]{kicker, title, copy, season, age, image ${altImage}, learnMoreHref, ctaLabel, ctaHref, limited, sortOrder},
  giftsIntro{headingLead, headingAccent, copy},
  gifts[]{kicker, title, copy, season, age, image ${altImage}, learnMoreHref, ctaLabel, ctaHref, limited, sortOrder},
  programsIntro{headingLead, headingAccent, copy},
  programs[]{kicker, title, copy, image ${altImage}, learnMoreHref, ctaLabel, ctaHref, sortOrder},
  rainbow{kicker, heading, body, href, image ${altImage}},
  feastOn{kicker, heading, body, href, image ${altImage}},
  newsletterTitle,
  newsletterCopy,
  locationHeading,
  locationNote
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

const corporateImageText = `{
  eyebrow,
  title,
  body,
  href,
  ctaLabel,
  enabled,
  image ${altImage}
}`

const corporatePerson = `{
  enabled,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  image ${altImage}
}`

const corporateBanner = `{
  enabled,
  headingLead,
  headingAccent,
  body,
  image ${altImage}
}`

const corporateFacility = `{
  enabled,
  headingLead,
  headingAccent,
  items[]{ icon, title, body },
  gallery[] ${altImage}
}`

const corporateQuotes = `"testimonials": testimonials[]->{
  _id,
  quote,
  guestName
}[defined(_id)]`

export const corporateTrainingPageQuery = `*[_id == "corporateTrainingPage"][0]{
  _id,
  heroLead,
  heroAccent,
  heroIntro,
  heroImage ${altImage},
  introLead,
  introAccent,
  introParagraphs,
  introGallery[] ${altImage},
  introBadge,
  programsHeading,
  featuredProgram ${corporateImageText},
  programCards[] ${corporateImageText},
  tourismProgram ${corporateImageText},
  showAwards,
  reviewsApproved,
  reviewsHeading,
  reviewsCtaLabel,
  reviewsCtaHref,
  ${corporateQuotes},
  facilitator ${corporatePerson},
  environment ${corporateBanner},
  facility ${corporateFacility},
  enquiryHeading,
  enquiryIntro,
  seo { title, description }
}`

export const corporateProgramCardsQuery = `*[_type == "corporateProgram" && active != false && defined(slug.current)]{
  title,
  "slug": slug.current,
  shortDescription,
  heroImage ${altImage},
  active
}`

export const corporateProgramBySlugQuery = `*[_type == "corporateProgram" && slug.current == $slug && active != false][0]{
  _id,
  title,
  heroLead,
  titleAccent,
  "slug": slug.current,
  shortDescription,
  heroIntro,
  heroImage ${altImage},
  introHeading,
  introHeadingAccent,
  programDescription,
  introImage ${altImage},
  learningOutcomes,
  outcomesHeading,
  duration,
  durationDetail,
  enhancements,
  enhancementsNote,
  reviewsApproved,
  reviewsHeading,
  ${corporateQuotes},
  contactHeading,
  contactIntro,
  enquiryShowPhone,
  enquiryPrograms,
  introCtaLabel,
  showAwards,
  activities[] ${corporateImageText},
  mixHeading,
  mixBody,
  mixCtaLabel,
  herdHeading,
  herdHeadingAccent,
  pathHeading,
  pathSteps[]{ title, body },
  consultationLabel,
  credentials[]{ icon, label },
  servicesHeading,
  services[]{
    name,
    price,
    featured,
    items[]{ title, body }
  },
  audiences[]{ icon, label },
  audienceHeading,
  audienceNote,
  offeringsHeading,
  offerings[]{
    title,
    body,
    image ${altImage},
    outcomes,
    ctaLabel
  },
  practicalHeading,
  practicalItems[]{ icon, label, lines },
  facilitator ${corporatePerson},
  environment ${corporateBanner},
  facility ${corporateFacility},
  seo { title, description },
  active
}`

const aboutSeo = `seo { title, description, noIndex, image ${altImage} }`

const aboutFaq = `{
  _id,
  question,
  answer,
  category,
  sortOrder,
  active
}`

export const ourStoryPageQuery = `*[_id == "ourStoryPage"][0]{
  heroLead,
  heroAccent,
  heroIntro,
  heroImage ${altImage},
  chapters[]{
    sectionId,
    title,
    paragraphs,
    image ${altImage},
    imageOnLeft,
    tone,
    showSignOff,
    signOffName,
    ctaLabel,
    ctaHref,
    enabled
  },
  ${aboutSeo}
}`

export const visionValuesPageQuery = `*[_id == "visionValuesPage"][0]{
  heroLead,
  heroAccent,
  heroImage ${altImage},
  showVision,
  visionHeading,
  visionParagraphs,
  visionImage ${altImage},
  showGallery,
  gallery[] ${altImage},
  showValues,
  valuesHeading,
  valuesImage ${altImage},
  values[]{ title, description },
  showCta,
  ctaHeading,
  ctaBody,
  ctaLabel,
  ctaHref,
  ${aboutSeo}
}`

export const teamPageQuery = `*[_id == "teamPage"][0]{
  heroLead,
  heroAccent,
  heroIntro,
  heroImage ${altImage},
  factLabel,
  showCta,
  ctaHeading,
  ctaBody,
  ctaLabel,
  ctaHref,
  ${aboutSeo}
}`

export const teamMembersQuery = `*[_type == "teamMember" && active != false] | order(sortOrder asc, name asc) {
  _id,
  name,
  role,
  ridiculousFact,
  bio,
  photo ${altImage},
  sortOrder,
  active
}`

export const publishedFaqsQuery = `*[_type == "faq" && active != false] | order(sortOrder asc, question asc) ${aboutFaq}`

export const faqPageQuery = `*[_id == "faqPage"][0]{
  heroLead,
  heroAccent,
  heroImage ${altImage},
  sections[]{
    title,
    categories,
    enabled,
    "questions": questions[]->${aboutFaq}[defined(_id) && active != false]
  },
  showCta,
  ctaHeading,
  ctaBody,
  ctaLabel,
  ctaHref,
  ${aboutSeo}
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

const urbortCard = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  heroImage ${altImage},
  publishedAt,
  author,
  body,
  tags,
  active,
  seo { title, description, noIndex, image ${altImage} }
}`

export const urbortBlogPageQuery = `*[_id == "urbortBlogPage"][0]{
  titleLead,
  titleAccent,
  intro,
  showPlaceholderCards,
  ctaHeading,
  ctaBody,
  ctaLabel,
  ctaHref,
  ${aboutSeo}
}`

export const urbortArticlesQuery = `*[_type == "urbortArticle" && active != false && defined(slug.current)] | order(publishedAt desc)${urbortCard}`

export const urbortArticleBySlugQuery = `*[_type == "urbortArticle" && slug.current == $slug && active != false][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  heroImage ${altImage},
  publishedAt,
  author,
  body,
  gallery[] ${altImage},
  tags,
  externalLinks[]{
    label,
    linkType,
    href,
    internalLink->{_type, "slug": slug.current}
  },
  active,
  seo { title, description, noIndex, image ${altImage} }
}`

export const urbortSitemapSlugsQuery = `*[_type == "urbortArticle" && active != false && defined(slug.current) && count(body) > 0].slug.current`

export const contactPageQuery = `*[_id == "contactPage"][0]{
  heroLead,
  heroAccent,
  businessName,
  intro,
  formHeading,
  nameLabel,
  emailLabel,
  messageLabel,
  submitLabel,
  unavailableMessage,
  ${aboutSeo}
}`

export const contactSettingsQuery = `*[_id == "siteSettings"][0]{
  email,
  phone,
  hoursNote,
  address { line1, line2, city, region, postalCode, country },
  weeklyHours[]{ day, closed, openTime, closeTime }
}`

export const newsletterPageQuery = `*[_id == "newsletterPage"][0]{
  title,
  copy,
  firstNameLabel,
  emailLabel,
  dateOfBirthLabel,
  submitLabel,
  unavailableMessage,
  ${aboutSeo}
}`

export const legalPolicyQuery = `*[_type == "policy" && publicSlug == $slug && policyType != "cancellation" && active != false][0]{
  _id,
  heading,
  policyType,
  publicSlug,
  revisionLabel,
  content,
  active,
  seo { title, description, noIndex, image ${altImage} }
}`
