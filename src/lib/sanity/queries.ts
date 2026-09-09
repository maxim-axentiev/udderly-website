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
  heroImage ${altImage},
  animalSpecies[]->{ title }
}`

export const experienceSitemapSlugsQuery = `*[_type == "experience" && active != false && defined(slug.current)].slug.current`
