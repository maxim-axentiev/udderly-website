/**
 * Preview-only planner for a later experience-draft content update.
 * It does not call Sanity. A patch is eligible only when the live revision
 * still matches the approved snapshot and the field set avoids booking activation.
 */

const FORBIDDEN_FIELDS = new Set([
  '_id',
  '_rev',
  '_type',
  'active',
  'bookingVerified',
  'privateBookingVerified',
  'bookingUrl',
  'privateBookingUrl',
  'fareharborItemId',
  'fareharborFlowId',
])

export type ExperienceDraftPatchPlan =
  | { action: 'preview'; id: string; ifRevisionID: string; set: Record<string, string> }
  | { action: 'refuse'; id: string; reason: string }

export function planExperienceDraftPatch(input: {
  id: string
  expectedRev: string
  currentRev: string
  fields: Record<string, string>
}): ExperienceDraftPatchPlan {
  if (!input.id.startsWith('drafts.experience-')) {
    return { action: 'refuse', id: input.id, reason: 'not-an-experience-draft' }
  }
  if (!input.expectedRev || input.currentRev !== input.expectedRev) {
    return { action: 'refuse', id: input.id, reason: 'revision-mismatch' }
  }

  const set: Record<string, string> = {}
  for (const [field, value] of Object.entries(input.fields)) {
    if (FORBIDDEN_FIELDS.has(field) || field.startsWith('booking')) {
      return { action: 'refuse', id: input.id, reason: `field-not-allowed:${field}` }
    }
    const trimmed = value.trim()
    if (!trimmed) continue
    set[field] = trimmed
  }

  if (!Object.keys(set).length) {
    return { action: 'refuse', id: input.id, reason: 'empty-patch' }
  }

  return { action: 'preview', id: input.id, ifRevisionID: input.expectedRev, set }
}
