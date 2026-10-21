import { describe, expect, it } from 'vitest'

import { planDraftCreates } from './draft-seed-guard'

describe('draft seed guard', () => {
  it('previews creates and never selects an existing or protected document', () => {
    const plan = planDraftCreates(
      ['drafts.ourStoryPage', 'drafts.experience-goat-yoga', 'homepage'],
      [
        'drafts.ourStoryPage',
        'drafts.contactPage',
        'drafts.experience-goat-yoga',
        'drafts.navigation',
        'drafts.policy-experience-cancellation',
        'drafts.adoptionPage',
        'homepage',
        'drafts.policy-privacy',
      ],
    )

    expect(plan.create).toEqual(['drafts.contactPage', 'drafts.policy-privacy'])
    expect(plan.skipExisting).toEqual(['drafts.ourStoryPage'])
    expect(plan.refused).toEqual([
      'drafts.experience-goat-yoga',
      'drafts.navigation',
      'drafts.policy-experience-cancellation',
      'drafts.adoptionPage',
      'homepage',
    ])
  })

  it('creates nothing when every proposed draft already exists', () => {
    const plan = planDraftCreates(['drafts.contactPage'], ['drafts.contactPage'])
    expect(plan.create).toEqual([])
    expect(plan.skipExisting).toEqual(['drafts.contactPage'])
    expect(plan.refused).toEqual([])
  })
})
