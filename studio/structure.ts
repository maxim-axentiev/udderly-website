import type {StructureResolver} from 'sanity/structure'

import {
  BoltIcon,
  CaseIcon,
  CogIcon,
  ComposeIcon,
  DocumentIcon,
  DocumentTextIcon,
  HeartIcon,
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
              S.documentTypeListItem('corporateProgram').title('Corporate Programs'),
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
              S.documentTypeListItem('urbortArticle').title('URBORT'),
            ]),
        ),
      S.listItem()
        .title('Take One Home')
        .icon(CaseIcon)
        .child(
          S.list()
            .title('Take One Home')
            .items([
              S.documentTypeListItem('adoptionOffering').title('Adoption Offerings'),
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
