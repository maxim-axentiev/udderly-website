/**
 * Temporary homepage fixture content.
 * Replace this module with Sanity-backed data later without rewriting section layout.
 */
import animalsForSale from '@/assets/home/homepage-animals-for-sale.webp'
import experiencesPhoto from '@/assets/home/homepage-experiences.webp'
import giftAGoat from '@/assets/home/homepage-gift-a-goat.webp'
import glampingPhoto from '@/assets/home/homepage-glamping.webp'
import heroImage from '@/assets/home/homepage-hero.webp'
import iceCream from '@/assets/home/homepage-ice-cream.webp'
import ownersFamily from '@/assets/home/homepage-meet-the-owners-normal-photo.webp'
import storePhoto from '@/assets/home/homepage-store.webp'
import trainingImage from '@/assets/home/homepage-training.webp'
import ownersFun from '@/assets/home/meet-the-owners-funny-picture.webp'
import newsletterMobile1 from '@/assets/home/newsletter-first-mobile.webp'
import newsletterMobile4 from '@/assets/home/newsletter-fourth-mobile.webp'
import newsletterLeftLower from '@/assets/home/newsletter-left-lower-desktop.webp'
import newsletterLeftUpper from '@/assets/home/newsletter-left-upper-desktop.webp'
import newsletterRightLower from '@/assets/home/newsletter-right-lower-desktop.webp'
import newsletterRightUpper from '@/assets/home/newsletter-right-upper-desktop.webp'
import newsletterMobile2 from '@/assets/home/newsletter-second-mobile.webp'
import newsletterMobile3 from '@/assets/home/newsletter-third-mobile.webp'
import btLogo from '@/assets/home/bt-logo.webp'
import chchLogo from '@/assets/home/chch-logo.webp'
import cityNewsLogo from '@/assets/home/city-news-logo.webp'
import ctvLogo from '@/assets/home/ctv-logo.webp'
import fibeLogo from '@/assets/home/fibe-logo.webp'
import globalNewsLogo from '@/assets/home/global-news-logo.webp'
import rogersLogo from '@/assets/home/rogers-logo.webp'
import tripadvisor2023 from '@/assets/home/tripadvisor-2023.webp'
import tripadvisor2024 from '@/assets/home/tripadvisor-2024.webp'
import tripadvisor2025 from '@/assets/home/tripadvisor-2025.webp'
import tripadvisor2026 from '@/assets/home/tripadvisor-2026.webp'
import urbort1 from '@/assets/home/urbort-1.webp'
import urbort2 from '@/assets/home/urbort-2.webp'
import urbort3 from '@/assets/home/urbort-3.webp'
import welfare1 from '@/assets/home/welfare-1.webp'
import welfare2 from '@/assets/home/welfare-2.webp'
import welfare3 from '@/assets/home/welfare-3.webp'
import welfare4 from '@/assets/home/welfare-4.webp'
import welfare5 from '@/assets/home/welfare-5.webp'
import welfare6 from '@/assets/home/welfare-6.webp'
import welfare7 from '@/assets/home/welfare-7.webp'
import welfare8 from '@/assets/home/welfare-8.webp'
import yesTvLogo from '@/assets/home/yestv-logo.webp'

export type HomeImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export const homepageSeo = {
  title: 'Farm Animal Experiences | Udderly Ridiculous',
  description:
    'Meet mini Highland cows, alpacas, mini donkeys and goats through intimate, award-winning farm experiences near Kitchener-Waterloo.',
  ogTitle: 'Udderly Ridiculous Farm Life',
  ogDescription:
    "Come do something udderly ridiculous with Ontario's fluffiest farm personalities.",
} as const

export const homepageHero = {
  headlineBefore: 'Come do something',
  headlineAccent: 'udderly',
  headlineAfter: 'ridiculous.',
  copy: 'Connect with gentle mini Highland cows, quirky alpacas, curious mini donkeys, and playful goats in authentic, intimate, and responsible farm experiences.',
  cta: { label: 'Book an Experience', href: '/experiences' },
  image: {
    src: heroImage,
    alt: 'Guest smiling while petting a fluffy mini Highland cow',
    width: 1024,
    height: 1024,
  } satisfies HomeImageAsset,
  sticker: 'Make core memories.',
  badge: 'Ooh,\namazing',
}

export const homepageAwards = {
  title: "TripAdvisor Travellers' Choice",
  copy: 'TripAdvisor kinda has a thing for us.',
  badges: [
    {
      year: '2023',
      src: tripadvisor2023,
      alt: "TripAdvisor Travellers' Choice Award 2023",
    },
    {
      year: '2024',
      src: tripadvisor2024,
      alt: "TripAdvisor Travellers' Choice Award 2024",
    },
    {
      year: '2025',
      src: tripadvisor2025,
      alt: "TripAdvisor Travellers' Choice Award 2025",
    },
    {
      year: '2026',
      src: tripadvisor2026,
      alt: "TripAdvisor Travellers' Choice Award 2026",
    },
  ],
}

export const homepageExperienceCards = [
  {
    title: 'Award winning farm experiences',
    fact: 'MOST POPULAR',
    copy: 'Get licked by a mini Highland cow, downward dog pose with a mini goat, enjoy a romantic lunch picnic with alpacas, and SOOO much more!',
    cta: { label: 'See all experiences', href: '/experiences' },
    image: {
      src: experiencesPhoto,
      alt: 'Guest surrounded by playful goats during a farm experience',
      width: 1080,
      height: 1440,
    },
    className: 'lg:-rotate-2 lg:translate-y-6',
  },
  {
    title: 'Farm glamping with the animals',
    fact: 'STAY OVER',
    copy: 'Unwind in a luxury RV right on the farm, with front-row seats to stunning sunsets and animals whoâ€™ll audition for your next Instagram post.',
    cta: { label: 'Sleepover with the animals', href: '/stay' },
    image: {
      src: glampingPhoto,
      alt: 'Luxury RV glowing at night beside a campfire on the farm',
      width: 1080,
      height: 1440,
    },
    className: 'lg:rotate-1',
  },
  {
    title: 'Corporate training and team experiences',
    fact: 'FOR TEAMS',
    copy: 'Leverage 20+ years of corporate training expertise along with the unique environment of our crazy animals to learn a lot, have fun, and bond.',
    cta: {
      label: 'See all training programs and team-building experiences',
      href: '/corporate',
    },
    image: {
      src: trainingImage,
      alt: 'Corporate team enjoying a farm lunch experience with alpacas',
      width: 1080,
      height: 1440,
    },
    className: 'lg:-rotate-1 lg:translate-y-10',
  },
  {
    title: 'Buy an animal from the farm',
    fact: 'FOR SALE',
    copy: 'Add lovingly and Udderly ridiculously raised farm animals to your pastures.',
    cta: { label: 'View all animals for sale', href: '/animals-for-sale' },
    image: {
      src: animalsForSale,
      alt: 'Two fluffy mini Highland calves standing in a sunny pasture',
      width: 1080,
      height: 1440,
    },
    className: 'lg:rotate-2 lg:translate-y-2',
  },
] as const

export const homepageOwners = {
  kicker: 'Meet the owners',
  title: 'Welcome to Udderly Ridiculous Farm Life',
  paragraphs: [
    'Hi, weâ€™re Cheryl & Greg! Beside us is our friendly farm greeter dog, Aspen. Welcome to Udderly Ridiculous Farm Life, our third-generation family farm about 30min from Kitchener-Waterloo. Our story began with a ridiculous idea to make goat-milk ice cream, which quickly grew to experiences when customers asked us to offer Goat Yoga. We thought, â€œWhoâ€™d want goats chewing on their Lululemon pants?â€ (apparently a lot of people).',
    'Our family farm has become the place for people seeking a true connection to animals and agriculture. A place where sustainability thrives and the human-animal bond sparks joy and understanding.',
  ],
  fastForward: 'Fast forward to todayâ€¦',
  milestones: [
    '14 awards for our experiences',
    'Gone viral on TikTok and Instagram',
    'Been featured in the news',
    'Top 10% of worldwide attractions',
    'Over 40,000 guests since 2021',
  ],
  cta: { label: 'Learn more about our ridiculous story', href: '/our-farm' },
  family: {
    src: ownersFamily,
    alt: 'Cheryl and Greg with their farm greeter dog Aspen in the pasture',
    caption: 'Cheryl, Greg & Aspen',
    width: 1080,
    height: 800,
  },
  fun: {
    src: ownersFun,
    alt: 'Greg crawling out of a calf hutch wearing the chain as a necklace',
    caption: 'Yes, they are always like this.',
    width: 1080,
    height: 1440,
  },
}

export const homepageMedia = {
  kicker: 'In the media',
  title: 'Ridiculousness is contagious',
  cta: { label: 'Book your ridiculous adventure', href: '/experiences' },
  videos: [
    {
      outlet: 'CTV News',
      logo: ctvLogo,
      url: 'https://www.youtube.com/watch?v=BhDlGWU_5IM',
    },
    {
      outlet: 'Global News',
      logo: globalNewsLogo,
      url: 'https://www.youtube.com/watch?v=UPM1RK03uSA',
    },
    {
      outlet: 'Breakfast Television',
      logo: btLogo,
      url: 'https://www.youtube.com/watch?v=nk_fYKVjHMg',
    },
    {
      outlet: 'CityNews',
      logo: cityNewsLogo,
      url: 'https://www.youtube.com/watch?v=IvosBu-gVKg',
    },
    {
      outlet: 'CHCH',
      logo: chchLogo,
      url: 'https://www.youtube.com/watch?v=broq29VZD_0',
    },
    {
      outlet: 'Fibe TV1',
      logo: fibeLogo,
      url: 'https://www.youtube.com/watch?v=E2OS1hQK2RE',
    },
    {
      outlet: 'Rogers TV',
      logo: rogersLogo,
      url: 'https://www.youtube.com/watch?v=WxCLaslbzp0',
    },
    {
      outlet: 'Yes TV',
      logo: yesTvLogo,
      url: 'https://www.youtube.com/watch?v=tY7SLm8JoTI&t=277s',
    },
  ],
}

export const homepageWelfare = {
  kicker: 'Seriously, though',
  title: 'How we keep our animals happy and healthy',
  hintDesktop: 'Hover over the beautiful faces',
  hintMobile: 'Tap a face to read more',
  cta: {
    label: 'Experience their happiness with a farm experience',
    href: '/experiences',
  },
  points: [
    {
      name: 'Rest like a corporate girlie',
      copy: "We limit the number of experiences and number of people per experience. Our animals rest more than the average corporate girlie working a 9-5. Because of this, it's smart to book an experience early in advance before spots fill up.",
      image: { src: welfare1, alt: 'Alpaca face close-up', width: 900, height: 900 },
    },
    {
      name: 'Clean ya shoes',
      copy: "We ask guests to sanitize their shoes with our sanitary foot mat before entering the farm. We don't want two years of spit and chewing gum bacteria staying on the farm (yuck). It's a biohazard thing!",
      image: { src: welfare2, alt: 'Goat resting its head, eyes closed', width: 900, height: 900 },
    },
    {
      name: 'No jumping jacks near alpacas',
      copy: 'We provide a detailed safety and handling briefing to make sure you and the animals are safe at all times. If you start doing jumping jacks next to the alpacas, they will run from you like their lives depend on it.',
      image: { src: welfare3, alt: 'Mini Highland calf face', width: 900, height: 900 },
    },
    {
      name: 'You do our job',
      copy: 'Our experiences are designed to be safe and enriching for the animals. For example, in our mini Highland cow experience, one part of it is brushing our cows. So, you not only take care of them for us, but the cows tilt their heads up and absolutely get lost in the brushing!',
      image: { src: welfare4, alt: 'Goat with its tongue out', width: 900, height: 900 },
    },
    {
      name: 'Not a petting zoo',
      copy: 'We are not a petting farm/zoo. We do not sell feed and do not provide unrestricted access to the pastures. That means you can only interact with them during an experience. That\'s right... the animals are HOT commodities.',
      image: { src: welfare5, alt: 'White hen', width: 900, height: 900 },
    },
    {
      name: 'Everyone has a bestie',
      copy: 'We keep the animals together in their own pastures to promote their social wellbeing. Some of them ask the others for lunch money, but our guard llama, Snickers, watches over and does his job well.',
      image: { src: welfare6, alt: 'White alpaca smiling', width: 900, height: 900 },
    },
    {
      name: 'An apple a day',
      copy: "We provide excellent veterinary care and regular checkups. Our animals are treated better than most of us treat ourselves. Do you have a nutritionist and a personal doctor on call? If you do, we're sorry for calling you out like that.",
      image: { src: welfare7, alt: 'Cream Highland cow grinning', width: 900, height: 900 },
    },
    {
      name: 'Resort with room service',
      copy: 'We prioritize natural behaviours and enrichment for our animals. From climbing structures for goats to grazing pastures for alpacas, we ensure they have opportunities to play, explore, and thrive. Basically, itâ€™s a luxury resort with room service, but for animals.',
      image: { src: welfare8, alt: 'Mini donkey showing its teeth', width: 900, height: 900 },
    },
  ],
}

export const homepageStore = {
  store: {
    badge: 'Farm Market Store',
    title: 'Bring a piece of the farm home with you',
    copy: 'After your experience, take home a souvenir. Whether itâ€™s a conversation starter or a treat for your belly. Weâ€™ve stocked items from over 100 local producers, and you know itâ€™s good because weâ€™re ridiculously picky about what we offer! Itâ€™s a win-win-win: you support local businesses, support us, and take something special home with you. We love a triple win!',
    cta: { label: 'See whatâ€™s inside', href: '/our-farm' },
    image: {
      src: storePhoto,
      alt: 'Looking through the doorway into the Farm Market Store with wooden barrels and local products',
      width: 1080,
      height: 800,
    },
  },
  iceCream: {
    badge: 'Goat Milk Ice-Cream',
    title: 'Enjoy our goat milk ice-cream',
    paragraphs: [
      'Are you like 65% of lactose intolerant folks? No problem. Our award-winning goat milk ice cream is the perfect treat for a smooth car ride homeâ€¦no awkward pit stops or windows-down moments.',
      'Packed with more nutrients than regular ice cream and featuring rich, unique flavours like Vanilla Lavender and Wine & Dark Chocolate, itâ€™s all made with real, locally sourced ingredients.',
      'Youâ€™re on a farm with goatsâ€¦ you need to try goat milk ice cream!',
    ],
    cta: { label: 'See the ridiculous flavours', href: '/our-farm' },
    image: {
      src: iceCream,
      alt: 'Stacked tubs of Udderly Ridiculous goat milk ice cream in many flavours',
      width: 1080,
      height: 800,
    },
  },
  giftGoat: {
    kicker: 'Gift A Goat',
    title: 'Eating ice-cream gives back',
    copy: 'For every tub of Udderly Ridiculous goat milk ice cream you enjoy, we donate a portion of the profit to provide goats to rural communities in need through our Gift a Goatâ„¢ program, in partnership with World Vision Canada.',
    countLabel: 'Goats gifted',
    target: 118,
    image: {
      src: giftAGoat,
      alt: 'Gift A Goat program logo',
      width: 512,
      height: 512,
    },
  },
}

export const homepageReviews = {
  title: 'What happens on the farm never stays on the farm',
  cta: {
    label: 'Experience the ridiculousness for yourself',
    href: '/experiences',
  },
  googleAttribution: 'Reviews from Google Maps',
  googleOrderNote: "Shown in Google's order of relevance.",
  readMoreLabel: 'Read more on Google',
  unavailableCopy:
    'Google reviews will appear here once the farmâ€™s Google Maps listing is connected.',
}

export const homepageNewsletter = {
  title: 'The Udderly Update',
  copy: 'Sign up for our monthly email newsletter to be the first to know about special promotions, new experiences, farm & animal updates, and just ridiculous content thatâ€™ll make you gasp, ooh, aw, and woah!',
  confirmation: 'Placeholder confirmation â€” nothing is stored yet.',
  mobileAnimals: [
    { src: newsletterMobile1, alt: 'Alpaca peeking over the newsletter form', rotate: '-rotate-3' },
    { src: newsletterMobile2, alt: 'Mini donkey peeking over the newsletter form', rotate: 'rotate-2' },
    { src: newsletterMobile3, alt: 'Goat peeking over the newsletter form', rotate: '-rotate-2' },
    { src: newsletterMobile4, alt: 'Mini Highland cow peeking over the newsletter form', rotate: 'rotate-3' },
  ],
  leftAnimals: [
    { src: newsletterLeftUpper, alt: 'Alpaca peeking from behind the newsletter form', position: 'top-[8%]' },
    { src: newsletterLeftLower, alt: 'Mini donkey peeking from behind the newsletter form', position: 'bottom-[5%]' },
  ],
  rightAnimals: [
    { src: newsletterRightUpper, alt: 'Goat peeking from behind the newsletter form', position: 'top-[8%]' },
    { src: newsletterRightLower, alt: 'Mini Highland cow peeking from behind the newsletter form', position: 'bottom-[5%]' },
  ],
}

export const homepageUrbort = {
  title: 'URBORT',
  copy: "URBORT stands for Udderly Ridiculous Board of Ridiculous Things. It's a compilation of all the insane things we've done. It's like going to Las Vegas and rather than being all hush hush about the trip, we instead document, record, analyze, and fully display it for the world to see.",
  cta: { label: "See all the ridiculous things we've done", href: '/urbort' },
  articles: [
    {
      title: "World's First Cow Wedding",
      href: '/urbort',
      rotate: '-rotate-2',
      image: {
        src: urbort1,
        alt: 'Highland cow wearing a white wedding veil and flower crown beside a fence',
        width: 1100,
        height: 756,
      },
    },
    {
      title: 'Biggest, Littlest Collab',
      href: '/urbort',
      rotate: 'rotate-1',
      image: {
        src: urbort2,
        alt: 'Greg with farm animals in a split-frame collage',
        width: 1080,
        height: 1080,
      },
    },
    {
      title: 'Viral Alpaca Sex',
      href: '/urbort',
      rotate: 'rotate-2',
      image: {
        src: urbort3,
        alt: 'Two alpacas in a pasture with colourful leashes',
        width: 1080,
        height: 1080,
      },
    },
  ],
}

export { homepageFaqs } from '@/content/homepage-faqs'

