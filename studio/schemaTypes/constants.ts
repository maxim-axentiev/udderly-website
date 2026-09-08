export const experienceCategories = [
  {title: 'Farm tour', value: 'farmTour'},
  {title: 'Overnight stay', value: 'overnight'},
  {title: 'Workshop', value: 'workshop'},
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

export const animalStatuses = [
  {title: 'Active — currently part of farm life', value: 'active'},
  {title: 'Retired — still featured, no longer in experiences', value: 'retired'},
  {title: 'In memory — remembered with care', value: 'inMemory'},
] as const

export const listingStatuses = [
  {title: 'Available', value: 'available'},
  {title: 'Coming soon', value: 'comingSoon'},
  {title: 'Pending', value: 'pending'},
  {title: 'Sold', value: 'sold'},
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
  {title: 'Accessibility', value: 'accessibility'},
  {title: 'General', value: 'general'},
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
  {type: 'animal'},
  {type: 'animalListing'},
  {type: 'post'},
]
