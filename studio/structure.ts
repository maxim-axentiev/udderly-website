import type {StructureResolver} from 'sanity/structure'

import {SINGLETON_IDS} from './lib/singletons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Website').child(
        S.list()
          .title('Website')
          .items([
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('experience').title('Experiences'),
            S.listItem()
              .title('Meet the herd')
              .child(
                S.list()
                  .title('Meet the herd')
                  .items([
                    S.documentTypeListItem('animal').title('Animals'),
                    S.documentTypeListItem('animalSpecies').title('Species'),
                  ]),
              ),
            S.documentTypeListItem('animalListing').title('Animals for sale'),
            S.documentTypeListItem('post').title('Farm updates'),
          ]),
      ),
      S.divider(),
      S.listItem().title('Reusable content').child(
        S.list()
          .title('Reusable content')
          .items([
            S.documentTypeListItem('faq').title('FAQs'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.documentTypeListItem('promotion').title('Promotions'),
            S.documentTypeListItem('teamMember').title('Team'),
          ]),
      ),
      S.divider(),
      S.listItem().title('Website settings').child(
        S.list()
          .title('Website settings')
          .items([
            S.listItem()
              .title('Navigation')
              .id(SINGLETON_IDS.navigation)
              .child(S.document().schemaType('navigation').documentId(SINGLETON_IDS.navigation)),
            S.listItem()
              .title('Site settings')
              .id(SINGLETON_IDS.siteSettings)
              .child(S.document().schemaType('siteSettings').documentId(SINGLETON_IDS.siteSettings)),
            S.listItem()
              .title('Farm sounds')
              .id(SINGLETON_IDS.farmSounds)
              .child(S.document().schemaType('farmSounds').documentId(SINGLETON_IDS.farmSounds)),
            S.documentTypeListItem('easterEgg').title('Easter eggs'),
          ]),
      ),
    ])
