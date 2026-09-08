import {animal} from './documents/animal'
import {animalListing} from './documents/animalListing'
import {animalSpecies} from './documents/animalSpecies'
import {easterEgg} from './documents/easterEgg'
import {experience} from './documents/experience'
import {faq} from './documents/faq'
import {page} from './documents/page'
import {post} from './documents/post'
import {promotion} from './documents/promotion'
import {teamMember} from './documents/teamMember'
import {testimonial} from './documents/testimonial'
import {address} from './objects/address'
import {altImage} from './objects/altImage'
import {audioTrack} from './objects/audioTrack'
import {link} from './objects/link'
import {navItem, navLink} from './objects/navItem'
import {pageBuilder} from './objects/pageBuilder'
import {portableText} from './objects/portableText'
import {seo} from './objects/seo'
import {socialLinks} from './objects/socialLinks'
import {ctaSection} from './sections/ctaSection'
import {experienceGrid} from './sections/experienceGrid'
import {faqSection} from './sections/faqSection'
import {gallery} from './sections/gallery'
import {hero} from './sections/hero'
import {imageText} from './sections/imageText'
import {listingGrid} from './sections/listingGrid'
import {meetTheHerd} from './sections/meetTheHerd'
import {postGrid} from './sections/postGrid'
import {promotionBanner} from './sections/promotionBanner'
import {richTextSection} from './sections/richTextSection'
import {testimonialsSection} from './sections/testimonialsSection'
import {videoEmbed} from './sections/videoEmbed'
import {farmSounds} from './singletons/farmSounds'
import {navigation} from './singletons/navigation'
import {siteSettings} from './singletons/siteSettings'

export const schemaTypes = [
  page,
  experience,
  animal,
  animalSpecies,
  animalListing,
  post,
  faq,
  testimonial,
  promotion,
  teamMember,
  easterEgg,
  navigation,
  siteSettings,
  farmSounds,
  seo,
  altImage,
  portableText,
  link,
  navLink,
  navItem,
  address,
  socialLinks,
  audioTrack,
  pageBuilder,
  hero,
  richTextSection,
  imageText,
  experienceGrid,
  meetTheHerd,
  faqSection,
  testimonialsSection,
  gallery,
  ctaSection,
  videoEmbed,
  listingGrid,
  postGrid,
  promotionBanner,
]
