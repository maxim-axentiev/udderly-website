# Udderly Website — Project Instructions

Applies to work in this repository. Follow the user's current task first; do not expand scope.

## Sources of truth
- Original Lovable design repository (`maxim-axentiev/udderly-site-design`) is the reference for layout, section structure, visual hierarchy and interactions. Its placeholder copy, photos, prices and anchor links are **not** approved content.
- Published Sanity content is the current website content source. Treat drafts, exported fixtures, fallback text and migration reports as evidence, not automatic approval. Preserve owner-approved facts, prices, policies and claims.
- Existing WordPress pages can inform migration, but do not assume old copy is approved or current.
- Never invent prices, booking availability, accessibility details, animal facts, team biographies, awards, certification claims or cancellation terms.
- Check existing components, assets, tests and relevant reports before creating duplicates.

## Execution
- Make the smallest coherent change that satisfies the request; avoid unrelated refactors, dependency changes and broad file scans.
- Prefer reusing existing patterns, components and assets. Keep design consistent with Lovable while using approved content.
- For routine changes, run targeted tests and the relevant TypeScript check. Run full test suite, Studio checks and production build at release checkpoints or when the change warrants them.
- If blocked by a missing fact or approval, leave it unchanged and identify the exact decision needed. Do not silently replace it with invented content.
- Preserve existing uncommitted work; inspect `git status` before changing files. Stage only explicitly intended files.

## Booking, CMS and production safety
- FareHarbor item IDs and URLs are not proof of checkout price or actual bookability. Keep `bookingVerified` and `privateBookingVerified` false unless explicitly authorized to change them.
- Do not create clickable booking actions for unverified items. Public/private booking actions must be independently gated.
- Do not write, publish or delete Sanity documents without explicit authorization for that action.
- Do not commit, push, deploy, modify DNS, change indexing/canonical settings or touch production WordPress without explicit authorization. Staging deployment also requires authorization.
- Staging must remain noindex until a separately authorized production cutover.

## Reporting and efficiency
- For an implementation task, respond briefly with: files changed, behavior delivered, checks run/results and blockers. No report file unless requested.
- For an audit, report only actionable gaps with evidence and a recommended next batch. Avoid re-auditing completed work.
- Ask the user only for genuinely unresolved business decisions; inspect the repository and existing sources first.
- Do not sacrifice correctness, safety or necessary tests merely to shorten execution.
