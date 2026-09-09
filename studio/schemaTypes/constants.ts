export const experienceCategories = [
  {title: 'Farm experience', value: 'farmExperience'},
  {title: 'Workshop', value: 'workshop'},
  {title: 'Overnight stay', value: 'overnight'},
  {title: 'Event', value: 'event'},
  {title: 'Seasonal experience', value: 'seasonal'},
  {title: 'Other', value: 'other'},
] as const

export const experienceSeasons = [
  {title: 'Year-round', value: 'yearRound'},
  {title: 'Spring', value: 'spring'},
  {title: 'Summer', value: 'summer'},
  {title: 'Fall', value: 'fall'},
  {title: 'Winter', value: 'winter'},
] as const

export const experienceFormats = [
  {title: 'Shared with other guests', value: 'shared'},
  {title: 'Private group', value: 'private'},
  {title: 'Shared or private', value: 'either'},
] as const

export const animalStatuses = [
  {title: 'Active — currently part of farm life', value: 'active'},
  {title: 'Retired — still featured, no longer in experiences', value: 'retired'},
  {title: 'In memory — remembered with care', value: 'inMemory'},
] as const

export const listingStatuses = [
  {title: 'Available', value: 'available'},
  {title: 'Coming soon', value: 'comingSoon'},
  {title: 'Reserved', value: 'reserved'},
  {title: 'Sold', value: 'sold'},
  {title: 'Waitlist only', value: 'waitlistOnly'},
  {title: 'Consignment', value: 'consignment'},
] as const

export const listingDetailProfiles = [
  {title: 'Cattle — show lineage, genetics, and size fields', value: 'cattle'},
  {title: 'Other species — hide cattle-only fields', value: 'general'},
] as const

export const listingSexes = [
  {title: 'Female', value: 'female'},
  {title: 'Male', value: 'male'},
  {title: 'Not specified', value: 'unspecified'},
] as const

export const faqCategories = [
  {title: 'Visiting the farm', value: 'visiting'},
  {title: 'Booking', value: 'booking'},
  {title: 'Animals', value: 'animals'},
  {title: 'Glamping', value: 'glamping'},
  {title: 'Adoption', value: 'adoption'},
  {title: 'Corporate', value: 'corporate'},
  {title: 'Accessibility', value: 'accessibility'},
  {title: 'General', value: 'general'},
] as const

export const testimonialTopics = [
  {title: 'General', value: 'general'},
  {title: 'Experience', value: 'experience'},
  {title: 'Corporate', value: 'corporate'},
  {title: 'Glamping', value: 'glamping'},
  {title: 'Adoption', value: 'adoption'},
] as const

export const policyTypes = [
  {title: 'Cancellation', value: 'cancellation'},
  {title: 'Adoption terms', value: 'adoption'},
  {title: 'Animal welfare', value: 'welfare'},
  {title: 'Visiting the farm', value: 'visiting'},
  {title: 'Other', value: 'other'},
] as const

export const adoptionAvailabilities = [
  {title: 'Available', value: 'available'},
  {title: 'Waitlist', value: 'waitlist'},
  {title: 'Seasonal', value: 'seasonal'},
  {title: 'Not currently available', value: 'unavailable'},
] as const

export const weekDays = [
  {title: 'Monday', value: 'monday'},
  {title: 'Tuesday', value: 'tuesday'},
  {title: 'Wednesday', value: 'wednesday'},
  {title: 'Thursday', value: 'thursday'},
  {title: 'Friday', value: 'friday'},
  {title: 'Saturday', value: 'saturday'},
  {title: 'Sunday', value: 'sunday'},
] as const

export const easterEggTypes = [
  {title: 'Hidden image', value: 'hiddenImage'},
  {title: 'Click sound', value: 'clickSound'},
  {title: 'Keyboard phrase', value: 'keyboardPhrase'},
  {title: 'Seasonal message', value: 'seasonalMessage'},
] as const

export const internalLinkTypes = [
  {type: 'page'},
  {type: 'experience'},
  {type: 'corporateProgram'},
  {type: 'animal'},
  {type: 'adoptionOffering'},
  {type: 'animalListing'},
  {type: 'urbortArticle'},
]
