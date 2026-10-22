import { describe, expect, it } from 'vitest'

import { planExperienceDraftPatch } from './experience-draft-update-plan'

describe('experience draft update plan', () => {
  it('previews a revision-matched text patch and refuses booking activation', () => {
    const preview = planExperienceDraftPatch({
      id: 'drafts.experience-mini-highland-cow-experience',
      expectedRev: 'rev-1',
      currentRev: 'rev-1',
      fields: { 'seo.title': 'Mini Highland Cow Experience | Udderly Ridiculous Farm Life' },
    })

    expect(preview).toEqual({
      action: 'preview',
      id: 'drafts.experience-mini-highland-cow-experience',
      ifRevisionID: 'rev-1',
      set: { 'seo.title': 'Mini Highland Cow Experience | Udderly Ridiculous Farm Life' },
    })

    expect(
      planExperienceDraftPatch({
        id: 'drafts.experience-goat-yoga',
        expectedRev: 'rev-1',
        currentRev: 'rev-2',
        fields: { 'seo.title': 'Goat Yoga' },
      }).action,
    ).toBe('refuse')

    expect(
      planExperienceDraftPatch({
        id: 'homepage',
        expectedRev: 'rev-1',
        currentRev: 'rev-1',
        fields: { 'seo.title': 'Home' },
      }).action,
    ).toBe('refuse')

    const booking = planExperienceDraftPatch({
      id: 'drafts.experience-goat-yoga',
      expectedRev: 'rev-1',
      currentRev: 'rev-1',
      fields: { bookingVerified: 'true' },
    })
    expect(booking).toMatchObject({ action: 'refuse', reason: 'field-not-allowed:bookingVerified' })
  })
})
