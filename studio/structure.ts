import type {StructureResolver} from 'sanity/structure'

import {
  BoltIcon,
  BookIcon,
  CaseIcon,
  CogIcon,
  CommentIcon,
  ComposeIcon,
  DocumentIcon,
  DocumentTextIcon,
  HeartIcon,
  HelpCircleIcon,
  ListIcon,
  MenuIcon,
  PlayIcon,
} from './lib/icons'
import {SINGLETON_IDS} from './lib/singletons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .title('Home')
        .icon(ComposeIcon)
        .child(
          S.list()
            .title('Home')
            .items([
              S.listItem()
                .title('Homepage')
                .id(SINGLETON_IDS.homepage)
                .icon(ComposeIcon)
                .child(S.document().schemaType('homepage').documentId(SINGLETON_IDS.homepage)),
            ]),
        ),
      S.listItem()
        .title('Visit')
        .icon(BoltIcon)
        .child(
          S.list()
            .title('Visit')
            .items([
              S.listItem()
                .title('Experiences hub')
                .id(SINGLETON_IDS.experiencesHub)
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType('experiencesHub')
                    .documentId(SINGLETON_IDS.experiencesHub)
                    .title('Experiences hub'),
                ),
              S.documentTypeListItem('experience').title('Experiences'),
              S.listItem()
                .title('Corporate Training page')
                .id(SINGLETON_IDS.corporateTrainingPage)
                .icon(CaseIcon)
                .child(
                  S.document()
                    .schemaType('corporateTrainingPage')
                    .documentId(SINGLETON_IDS.corporateTrainingPage)
                    .title('Corporate Training page'),
                ),
              S.documentTypeListItem('corporateProgram').title('Corporate Programs'),
              S.listItem()
                .title('Farm Market Store')
                .id(SINGLETON_IDS.farmMarketPage)
                .icon(DocumentTextIcon)
                .child(
                  S.document().schemaType('farmMarketPage').documentId(SINGLETON_IDS.farmMarketPage),
                ),
              S.listItem()
                .title('Goat Milk Ice Cream')
                .id(SINGLETON_IDS.iceCreamPage)
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('iceCreamPage').documentId(SINGLETON_IDS.iceCreamPage)),
              S.listItem()
                .title('Gift Card')
                .id(SINGLETON_IDS.giftCardPage)
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('giftCardPage').documentId(SINGLETON_IDS.giftCardPage)),
              S.listItem()
                .title('Farm Glamping')
                .id(SINGLETON_IDS.farmGlampingPage)
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType('farmGlampingPage')
                    .documentId(SINGLETON_IDS.farmGlampingPage),
                ),
            ]),
        ),
      S.listItem()
        .title('About')
        .icon(HeartIcon)
        .child(
          S.list()
            .title('About')
            .items([
              S.listItem()
                .title('Our Story')
                .id(SINGLETON_IDS.ourStoryPage)
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('ourStoryPage').documentId(SINGLETON_IDS.ourStoryPage)),
              S.listItem()
                .title('Vision and Values')
                .id(SINGLETON_IDS.visionValuesPage)
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType('visionValuesPage')
                    .documentId(SINGLETON_IDS.visionValuesPage),
                ),
              S.listItem()
                .title('Team page')
                .id(SINGLETON_IDS.teamPage)
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('teamPage').documentId(SINGLETON_IDS.teamPage)),
              S.documentTypeListItem('teamMember').title('Team members'),
              S.listItem()
                .title('FAQ page')
                .id(SINGLETON_IDS.faqPage)
                .icon(HelpCircleIcon)
                .child(S.document().schemaType('faqPage').documentId(SINGLETON_IDS.faqPage)),
            ]),
        ),
      S.listItem()
        .title('The Farm')
        .icon(HeartIcon)
        .child(
          S.list()
            .title('The Farm')
            .items([
              S.documentTypeListItem('animal').title('Animals'),
              S.documentTypeListItem('animalSpecies').title('Animal Species'),
              S.documentTypeListItem('teamMember').title('Team Members'),
              S.listItem()
                .title('URBORT board')
                .id(SINGLETON_IDS.urbortBlogPage)
                .icon(BookIcon)
                .child(
                  S.document().schemaType('urbortBlogPage').documentId(SINGLETON_IDS.urbortBlogPage),
                ),
              S.documentTypeListItem('urbortArticle').title('URBORT articles'),
            ]),
        ),
      S.listItem()
        .title('Take One Home')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Take One Home')
            .items([
              S.listItem()
                .title('Adopt an Animal page')
                .id(SINGLETON_IDS.adoptionPage)
                .icon(DocumentTextIcon)
                .child(
                  S.document().schemaType('adoptionPage').documentId(SINGLETON_IDS.adoptionPage),
                ),
              S.documentTypeListItem('adoptionOffering').title('Adoption Offerings'),
              S.listItem()
                .title('Animals for Sale page')
                .id(SINGLETON_IDS.animalsForSalePage)
                .icon(DocumentTextIcon)
                .child(
                  S.document()
                    .schemaType('animalsForSalePage')
                    .documentId(SINGLETON_IDS.animalsForSalePage),
                ),
              S.documentTypeListItem('animalListing').title('Animals for Sale'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Shared Content')
        .icon(ListIcon)
        .child(
          S.list()
            .title('Shared Content')
            .items([
              S.documentTypeListItem('faq').title('FAQs'),
              S.listItem()
                .title('Contact page')
                .id(SINGLETON_IDS.contactPage)
                .icon(CommentIcon)
                .child(S.document().schemaType('contactPage').documentId(SINGLETON_IDS.contactPage)),
              S.listItem()
                .title('Newsletter page')
                .id(SINGLETON_IDS.newsletterPage)
                .icon(CommentIcon)
                .child(
                  S.document().schemaType('newsletterPage').documentId(SINGLETON_IDS.newsletterPage),
                ),
              S.documentTypeListItem('policy').title('Policies'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
              S.documentTypeListItem('promotion').title('Promotions'),
            ]),
        ),
      S.listItem()
        .title('Website Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Website Settings')
            .items([
              S.listItem()
                .title('Navigation')
                .id(SINGLETON_IDS.navigation)
                .icon(MenuIcon)
                .child(S.document().schemaType('navigation').documentId(SINGLETON_IDS.navigation)),
              S.listItem()
                .title('Site Settings')
                .id(SINGLETON_IDS.siteSettings)
                .icon(CogIcon)
                .child(
                  S.document().schemaType('siteSettings').documentId(SINGLETON_IDS.siteSettings),
                ),
              S.listItem()
                .title('Farm Sounds')
                .id(SINGLETON_IDS.farmSounds)
                .icon(PlayIcon)
                .child(S.document().schemaType('farmSounds').documentId(SINGLETON_IDS.farmSounds)),
              S.documentTypeListItem('easterEgg').title('Easter Eggs'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Other')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Other')
            .items([S.documentTypeListItem('page').title('Pages')]),
        ),
    ])
