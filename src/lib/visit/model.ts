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
    'After your experience, take home a souvenir. Whether it’s a conversation starter or a treat for your belly. We’ve stocked items from over 100 local producers, and you know it’s good because we’re ridiculously picky about what we offer! It’s a win-win-win: you support local businesses, support us, and take something special home with you. We love a triple win!',
  localHeading: 'Why shopping local is a big deal to us',
  localParagraphs: [
    'Every shelf in our store tells the story of a neighbour. When you grab a jar, a bar, or a bag of something delicious here, you’re not lining the pockets of a far-away boardroom — you’re helping an Ontario farmer keep farming, a maker keep making, and a small town keep its spark.',
    'We taste it, we test it, we interrogate the label, and only the good stuff makes it in. That’s the deal: if it’s in our store, somebody’s grandmother would approve.',
  ],
  statValue: '140+',
  statLabel: 'Local producers supported',
  statNote: 'And ridiculously proud of every single one.',
  iceHeading: 'And yes… we make our own ice cream',
  iceCopy:
    'Our award-winning goat milk ice cream is made right here with fresh Ontario goat milk, in flavours you won’t find anywhere else. Lactose friendly, ridiculously creamy, and scoopable straight from the store freezer.',
  iceCta: 'Learn more about our ice cream',
  closeHeading: 'Come shop, snack and say hi.',
  closeCopy: 'Wander the store, meet the herd, and grab a scoop before you go.',
  seoTitle: 'Farm Market Store | Udderly Ridiculous Farm Life',
  seoDescription:
    'The Farm Market Store at Udderly Ridiculous Farm Life — local goods from over 140 producers, our goat milk ice cream, and farm treats to take home.',
}

export const iceCreamFallback = {
  heroLead: 'Udderly Ridiculous',
  heroAccent: 'Goat Milk Ice Cream',
  introHeading: 'Scooped straight from the farm',
  introParagraphs: [
    'Are you like 65% of lactose intolerant folks? No problem. Our award-winning goat milk ice cream is the perfect treat for a smooth car ride home…no awkward pit stops or windows-down moments.',
    'Packed with more nutrients than regular ice cream and featuring rich, unique flavours like Vanilla Bean Lavender and Wine & Dark Chocolate, it’s all made with real, locally sourced ingredients.',
  ],
  whyHeading: 'Why goat milk',
  whyAccent: 'ice cream?',
  why: [
    "Goat milk contains less lactose than cow’s milk and is filled with vitamins, enzymes, and protein. Goat milk is also less allergenic. It doesn’t contain the complex proteins that stimulate allergic reactions to cow’s milk (goat milk contains A2 casein), so it doesn’t suppress the immune system. It’s easier to digest than cow’s milk. Statistics show that goat milk will digest in a baby’s stomach in twenty minutes, whereas pasteurized cow’s milk takes eight hours. The difference is in the structure of the milk. It contains twice the healthful medium chain fatty acids, such as capric and caprylic acids, which are highly anti-microbial. So why wouldn't you choose Goat's Milk Ice Cream?!",
    "Compared to cow's milk, goat milk contains more of the following nutrients (1) : Potassium, Calcium, Magnesium, Vitamin B6, Vitamin C, Iron. Goat milk is high in protein. Per 100g serving, goat milk has more protein than cow's milk (2). Goat milk has low lactose levels - goat's milk naturally contains lesser lactose levels than cow’s milk (3).",
  ],
  flavourHeading: 'Pick your',
  flavourAccent: 'flavour.',
  flavourIntro: 'Four ridiculous reasons to skip the grocery-store freezer aisle.',
  giftKicker: 'Gift A Goat',
  giftHeading: 'Eating ice-cream gives back',
  giftCopy:
    'We want to be a part of creating opportunities to help rural communities not just survive but to flourish. We created the Gift a Goat™ program with the support of World Vision Canada with this idea in mind. 10¢ from each purchase of our 473ml ice cream goes to our Gift a Goat™ program - purchasing goats for needy families through World Vision. We are excited to support agriculture at home and around the world.',
  giftCount: '118',
  giftCountLabel: 'Goats gifted',
  videoHeading: 'Udderly Ridiculous Goat Milk Ice Cream on the News',
  videoNote: 'A news clip will appear here once a video is added.',
  closeHeading: 'Book an experience and enjoy a scoop on the farm.',
  closeCopy: 'Meet the animals, wander the farm, then treat yourself to a scoop (or two) straight from our freezer.',
  seoTitle: 'Goat Milk Ice Cream | Udderly Ridiculous Farm Life',
  seoDescription:
    'Udderly Ridiculous Goat Milk Ice Cream — award-winning, lactose friendly flavours made with fresh Ontario goat milk.',
}

export const giftCardFallback = {
  heroLead: 'Gift',
  heroAccent: 'Card',
  intro: 'Give a day on the farm. Goats, alpacas, mini cows, ice cream — whatever they pick, it beats socks.',
  offerHeadingLead: 'Give a day',
  offerHeadingAccent: 'of ridiculous.',
  thingsHeading: 'A few things to know.',
  things: [
    'Choose any denomination for your gift certificate.',
    'Gift certificates are delivered via email and include a unique code for checkout.',
    'Redeemable in part or whole; can be used multiple times if there’s a remaining balance.',
    'No expiration date – gift certificates never expire.',
  ],
  rainbowKicker: 'Proudly Rainbow Registered',
  rainbowHeading: 'Everyone is welcome here.',
  rainbowCopy:
    'Udderly Ridiculous Farm Life is a Rainbow Registered business, which means we are committed to providing a welcoming, safe and inclusive environment for 2SLGBTQI+ visitors, families, employees and community members. Everybody gets the same warm welcome here, and the animals genuinely do not care who you are — they just want the brush.',
  rainbowHref: 'https://www.rainbowregistered.com/',
  feastKicker: 'Certified Local by FeastON',
  feastHeading: 'We eat and serve local.',
  feastCopy:
    'FeastON officially verifies that a significant portion of our ingredients and products are sourced right here in Ontario. We only support local, Ontario-made products, and so far we have had the privilege of supporting more than 140 local producers through everything we serve, sell and celebrate on the farm.',
  feastHref: 'https://feaston.com/',
  seoTitle: 'Gift Card | Udderly Ridiculous Farm Life',
  seoDescription: 'Give a day on the farm. Goats, alpacas, mini cows, ice cream — whatever they pick, it beats socks.',
}

export const glampingFallback = {
  heroLead: 'Farm',
  heroAccent: 'Glamping',
  intro:
    'Sleep over on our Ontario family farm in a luxury RV with a king bed, full kitchen, campfire and very curious neighbours with hooves.',
  offerHeadingLead: 'Sleep where',
  offerHeadingAccent: 'the goats are.',
  offerParagraphs: [
    'One luxury RV, parked exactly where the farm gets quiet and the sky gets loud. King bed, full kitchen, campfire out front, and a front-row seat to the sunsets.',
    'Book the farm experiences you want during the day, then keep the farm to yourself all evening.',
  ],
  mailHeading: 'Good mail incoming',
  mailCopy:
    'After booking your trip, we will send you an email with a 10% off coupon to book experiences for your stay.',
  details: [
    { label: 'Season', value: 'May to October' },
    { label: 'Age', value: 'All ages' },
    { label: 'Sleeps', value: 'Up to 4 guests' },
    { label: 'Stays', value: '1 night minimum' },
  ],
  amenitiesHeading: "Everything's included.",
  amenities: [
    'Private bedroom with a king-sized bed',
    'Private ensuite bathroom',
    'Living room with a pull-out queen sofa bed',
    'Full kitchen with appliances',
    'Dining area',
    '2-piece bathroom',
    'TVs with DVDs',
    'Fireplace',
    'Outdoor awning area',
    'Campfire',
    'Air conditioning',
  ],
  addOnsHeading: 'Make it even better.',
  addOnsNote: 'These add-ons are from the website design. They are not a live checkout.',
  addOns: [
    { name: 'Campfire Kit', price: 'CA$10.60', items: ['Bag of Firewood & Firestarter'] },
    {
      name: 'Continental Ontario Breakfast Kit for 2',
      price: 'CA$42.40',
      note: 'RV already includes supply of coffee and tea.',
      items: ['Milk', 'Yogurt', 'Fresh made baked goods', '1/2 dozen farm fresh eggs', 'Seasonal Fruit'],
    },
    {
      name: 'Ontario made Charcuterie Kit for 2',
      price: 'CA$63.60',
      note: 'Charcuterie board not included. All items are packaged for guests to enjoy a build your own charcuterie.',
      items: ['Fresh baked baguette', '3 Ontario Cheeses', 'Water buffalo summer sausage', 'Red pepper Jelly', 'Nuts', 'Kettle Chips', 'Sparkling non alcoholic Apple Cider'],
    },
  ],
  infoHeading: 'Before you park yourself here.',
  info: [
    'No pets of any kind are allowed on the property as it creates stress for our animals and we have an off leash farm dog.',
    'No smoking, vaping or cannabis within the RV.',
    'We ask that you respect the serenity of the property, our neighbors and the well being of our animals - although we do not ban alcohol use, we ask that it is kept at your RV site and no glass or drinks are taken near animal pastures and cannot be consumed in any animal experiences. Drunken disorderly conduct that puts our animals or staff at risk will not be tolerated and will require your immediate removal without a refund.',
    'Absolutely no entrance into our animal enclosures without one of our staff and please respect biosecure areas and do not trespass on neighboring farms.',
    'Some experiences we offer have an age limit due to the nature of the experience and the animals we are working with. Please carefully review this before booking an experience.',
    'Although we work hard to minimize pests, this is a working farm, which means you may encounter flies, mosquitos and bees/wasps at certain times of the year.',
    'Experiences and store are closed Mondays and Tuesdays – if something is required from the store arrangements can be made, we do not however run any experiences on those days to provide staff and animals a rest.',
  ],
  cancellationNote:
    'This cancellation wording is the website design. It is not a published legal policy and booking is not open.',
  cancellation: [
    { when: '7+ days', text: 'Cancellations made 7 days or more before your stay receive a full refund.' },
    { when: '3–6 days', text: 'Cancellations made 3–6 days before your stay receive a 50% refund or credit.' },
    { when: 'Within 3 days', text: 'Cancellations within 3 days of your stay receive no refund or credit.' },
  ],
  cheeseKicker: 'A proud stop on the trail',
  cheeseHeading: 'Follow the cheese trail.',
  cheeseCopy:
    'The Oxford County Cheese Trail is a self-guided tour featuring 30+ stops dedicated to cheese, dairy, and local flavours. As a proud stop on the trail, we invite you to explore the region around a farm stay.',
  cheeseHref: 'https://oxfordcountycheesetrail.ca/',
  seoTitle: 'Farm Glamping — Udderly Ridiculous Farm Life',
  seoDescription:
    'Sleep over on our Ontario family farm in a luxury RV with a king bed, full kitchen, campfire and very curious neighbours with hooves.',
}
