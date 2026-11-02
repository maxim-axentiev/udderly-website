export const FARM_MARKET_PATH = '/farm-market-store'
export const ICE_CREAM_PATH = '/ice-cream'
export const GIFT_CARD_PATH = '/gift-card'
export const FARM_GLAMPING_PATH = '/farm-glamping'
export const FARM_GLAMPING_ALIAS = '/experiences/farm-glamping'

export function glampingAliasRedirect() {
  return { href: FARM_GLAMPING_PATH }
}

export const GIFT_CARD_UNAVAILABLE = 'Gift card purchase is not available yet.'
export const GLAMPING_UNAVAILABLE = 'Farm glamping booking is not available yet.'

export const farmMarketFallback = {
  heroLead: 'Farm Market',
  heroAccent: 'Store',
  introHeading: 'Bring a piece of the farm home with you',
  intro:
    'After your experience, take home a souvenir. Whether it’s a conversation starter or a treat for your belly. You know it’s good because we’re ridiculously picky about what we offer! It’s a win-win-win: you support local businesses, support us, and take something special home with you. We love a triple win!',
  localHeading: 'Why shopping local is a big deal to us',
  localParagraphs: [
    'Every shelf in our store tells the story of a neighbour. When you grab a jar, a bar, or a bag of something delicious here, you’re not lining the pockets of a far-away boardroom — you’re helping an Ontario farmer keep farming, a maker keep making, and a small town keep its spark.',
    'We taste it, we test it, we interrogate the label, and only the good stuff makes it in. That’s the deal: if it’s in our store, somebody’s grandmother would approve.',
  ],
  statValue: '',
  statLabel: 'Local producers supported',
  statNote: 'And ridiculously proud of every single one.',
  iceHeading: 'And yes… we make our own ice cream',
  iceCopy:
    'Our award-winning goat milk ice cream is made right here with fresh Ontario goat milk. Ridiculously creamy, and scoopable straight from the store freezer.',
  iceCta: 'Learn more about our ice cream',
  closeHeading: 'Come shop, snack and say hi.',
  closeCopy: 'Wander the store, meet the herd, and grab a scoop before you go.',
  seoTitle: 'Farm Market Store | Udderly Ridiculous Farm Life',
  seoDescription:
    'The Farm Market Store at Udderly Ridiculous Farm Life — local goods, our goat milk ice cream, and farm treats to take home.',
}

export const iceCreamFallback = {
  heroLead: 'Udderly Ridiculous',
  heroAccent: 'Goat Milk Ice Cream',
  introHeading: 'Scooped straight from the farm',
  introParagraphs: [
    'Our award-winning goat milk ice cream is made right here with fresh Ontario goat milk.',
  ],
  whyHeading: 'Why goat milk',
  whyAccent: 'ice cream?',
  why: [] as string[],
  flavourHeading: 'Pick your',
  flavourAccent: 'flavour.',
  flavourIntro: 'Ridiculous reasons to skip the grocery-store freezer aisle.',
  giftKicker: '',
  giftHeading: '',
  giftCopy: '',
  giftCount: '',
  giftCountLabel: '',
  videoHeading: 'Udderly Ridiculous Goat Milk Ice Cream on the News',
  videoNote: 'A news clip will appear here once a video is added.',
  closeHeading: 'Book an experience and enjoy a scoop on the farm.',
  closeCopy: 'Meet the animals, wander the farm, then treat yourself to a scoop (or two) straight from our freezer.',
  seoTitle: 'Goat Milk Ice Cream | Udderly Ridiculous Farm Life',
  seoDescription:
    'Udderly Ridiculous Goat Milk Ice Cream — award-winning, made with fresh Ontario goat milk.',
}

export const giftCardFallback = {
  heroLead: 'Gift',
  heroAccent: 'Card',
  intro: 'Give a day on the farm. Goats, alpacas, mini cows, ice cream — whatever they pick, it beats socks.',
  offerHeadingLead: 'Give a day',
  offerHeadingAccent: 'of ridiculous.',
  thingsHeading: 'A few things to know.',
  things: [] as string[],
  rainbowKicker: 'Proudly Rainbow Registered',
  rainbowHeading: 'Everyone is welcome here.',
  rainbowCopy:
    'Udderly Ridiculous Farm Life is a Rainbow Registered business, which means we are committed to providing a welcoming, safe and inclusive environment for 2SLGBTQI+ visitors, families, employees and community members. Everybody gets the same warm welcome here, and the animals genuinely do not care who you are — they just want the brush.',
  rainbowHref: 'https://www.rainbowregistered.com/',
  feastKicker: 'Certified Local by FeastON',
  feastHeading: 'We eat and serve local.',
  feastCopy:
    'FeastON officially verifies that a significant portion of our ingredients and products are sourced right here in Ontario.',
  feastHref: 'https://feaston.com/',
  seoTitle: 'Gift Card | Udderly Ridiculous Farm Life',
  seoDescription: 'Give a day on the farm. Goats, alpacas, mini cows, ice cream — whatever they pick, it beats socks.',
}

export const glampingFallback = {
  heroLead: 'Farm',
  heroAccent: 'Glamping',
  intro: 'Sleep over on our Ontario family farm, with very curious neighbours with hooves.',
  offerHeadingLead: 'Sleep where',
  offerHeadingAccent: 'the goats are.',
  offerParagraphs: [] as string[],
  mailHeading: '',
  mailCopy: '',
  details: [] as Array<{ label: string; value: string }>,
  amenitiesHeading: "Everything's included.",
  amenities: [] as string[],
  addOnsHeading: 'Make it even better.',
  addOnsNote: '',
  addOns: [] as Array<{ name: string; price: string; note?: string; items: string[] }>,
  infoHeading: 'Before you park yourself here.',
  info: [] as string[],
  cancellationNote: '',
  cancellation: [] as Array<{ when: string; text: string }>,
  cheeseKicker: 'A proud stop on the trail',
  cheeseHeading: 'Follow the cheese trail.',
  cheeseCopy:
    'The Oxford County Cheese Trail is a self-guided tour featuring 30+ stops dedicated to cheese, dairy, and local flavours. As a proud stop on the trail, we invite you to explore the region around a farm stay.',
  cheeseHref: 'https://oxfordcountycheesetrail.ca/',
  seoTitle: 'Farm Glamping — Udderly Ridiculous Farm Life',
  seoDescription: 'Sleep over on our Ontario family farm, with very curious neighbours with hooves.',
}
