/**
 * Guards for creating missing Sanity drafts.
 *
 * createIfNotExists against an existing drafts.* id can rewrite that draft.
 * Callers must check live document IDs first and skip anything that already exists.
 * This module does not write to Sanity. Preview is the only behavior it provides.
 */

const PROTECTED_PREFIXES = ['drafts.experience-', 'drafts.adoption', 'drafts.animal', 'drafts.animalListing']

const PROTECTED_IDS = new Set([
  'homepage',
  'siteSettings',
  'experiencesHub',
  'drafts.homepage',
  'drafts.siteSettings',
  'drafts.experiencesHub',
  'drafts.navigation',
  'drafts.policy-experience-cancellation',
])

export type DraftSeedPlan = {
  create: string[]
  skipExisting: string[]
  refused: string[]
}

export function isProtectedDraftId(id: string): boolean {
  if (PROTECTED_IDS.has(id)) return true
  if (id.startsWith('drafts.policy-') && id !== 'drafts.policy-privacy' && id !== 'drafts.policy-terms' && id !== 'drafts.policy-cookies') {
    return true
  }
  return PROTECTED_PREFIXES.some((prefix) => id.startsWith(prefix))
}

/** Returns ids that are safe to create. Existing and protected ids are never create candidates. */
export function planDraftCreates(existingIds: Iterable<string>, proposedIds: readonly string[]): DraftSeedPlan {
  const existing = new Set(existingIds)
  const create: string[] = []
  const skipExisting: string[] = []
  const refused: string[] = []

  for (const id of proposedIds) {
    if (!id.startsWith('drafts.') || isProtectedDraftId(id)) {
      refused.push(id)
      continue
    }
    if (existing.has(id)) {
      skipExisting.push(id)
      continue
    }
    create.push(id)
  }

  return { create, skipExisting, refused }
}
