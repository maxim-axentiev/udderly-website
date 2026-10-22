# Experience draft readiness

Read-only check of the 15 `experience` documents in Sanity `production` on 2026-10-21. All 15 IDs are drafts. None were edited or published. WordPress body copy and Search Console queries were not available, so recommendations below use the draft fields and the approved routes only.

Revisions: Alpaca Walks, Goat Cuddles, and Goat Yoga are `iqxaelbmvJtLE9nhql4Ult`. The other twelve share `GPqPjmhHkD02bVdiKLigCq`.

## What can be reused

Alpaca Walks, Goat Cuddles, and Goat Yoga already store a title, short description, SEO title, SEO description, price display, duration, capacity, age guidance, hero image, gallery, and body. Each also has a booking URL stored and `bookingVerified` empty, so the public page keeps the booking button off. Those stored SEO strings are draft content, not a verified Google result and not a confirmed Rank Math or Yoast export.

The other twelve drafts store a title, age guidance, and a season label. They do not store a body, price, capacity, duration, hero, gallery, short description, or SEO fields. Mini Highland Cow is in that group: age `12+`, season `Year-round`, no open price or capacity in Sanity. The page code adds the approved private display lines `$250 for 4 people` and `4–8 people` without claiming that $250 covers eight people.

## What needs the owner before a bulk write

- Whether the three stored prices, capacities, and SEO descriptions are still accurate.
- Open price and capacity for Mini Highland Cow. They are not in the draft.
- Whether `$250 for 4 people` and `4–8 people` should be written into the Mini Highland Cow draft or left as page fallbacks.
- Verified FareHarbor URLs for the open and private Mini Highland Cow buttons. Historical URLs must not be turned on.
- Body copy, photos, and prices for the twelve thin drafts.
- Anything that would assert awards, TV appearances, or review counts beyond text the owner confirms.

## Proposed SEO, pending confirmation

These titles follow the existing fallback pattern. Descriptions are included only where the draft already has one, or where the page fallback is a single sentence. They are not Search Console winners.

| Draft | Proposed title | Description | Intent | Internal link |
|---|---|---|---|---|
| Mini Highland Cow Experience | Mini Highland Cow Experience \| Udderly Ridiculous Farm Life | Meet mini Highland cows on an open visit, or book a private session for your group. | Book an open or private cow visit | `/experiences` |
| Mini Highland Calf Meet & Greet | Mini Highland Calf Meet & Greet \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Limited-date calf visit | Mini Highland Cow page, `/experiences` |
| Goat Yoga | Keep the stored draft title | Keep the stored draft description after the owner confirms it. | Book goat yoga | `/experiences` |
| Goat Cuddles | Keep the stored draft title | Keep the stored draft description after the owner confirms it. | Book goat cuddles | `/experiences` |
| Goat Recess | Goat Recess \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Seasonal goat visit | `/experiences` |
| Baby Goat Playtime & Snuggles | Baby Goat Playtime & Snuggles \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Limited-date baby goat visit | `/experiences` |
| Alpaca Walks & Bond | Keep the stored draft title | Keep the stored draft description after the owner confirms it. | Book an alpaca walk | `/experiences` |
| Alpaca Lunch Picnic | Alpaca Lunch Picnic \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Seasonal picnic | `/experiences` |
| Alpaca Sunset Picnic | Alpaca Sunset Picnic \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Seasonal picnic | `/experiences` |
| Alpaca Experience & Fibre Nesting Ball Workshop | Alpaca Experience & Fibre Nesting Ball Workshop \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Workshop visit | `/experiences` |
| Miniature Donkey Visits | Miniature Donkey Visits \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Donkey visit | `/experiences` |
| Private Miniature Donkey Lunch Picnic | Private Miniature Donkey Lunch Picnic \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. Public path is `/miniature-donkey-lunch-picnic`. | Private lunch picnic | `/experiences` |
| Private Miniature Donkey Sunset Picnic | Private Miniature Donkey Sunset Picnic \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. Public path is `/miniature-donkey-sunset-picnic`. | Private sunset picnic | `/experiences` |
| Taste of Farm Life | Taste of Farm Life \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Tasting visit | `/experiences` |
| Taste of Farm Life Family Friendly | Taste of Farm Life Family Friendly \| Udderly Ridiculous Farm Life | Leave empty until the farm writes it. | Family tasting | `/experiences` |

## Next bulk update

Do not run a write from this batch. The next phase should:

1. Export the 15 drafts to a local backup that is not committed.
2. Record `_id` and `_rev` for each document.
3. Preview a patch with `planExperienceDraftPatch`. It refuses homepage and other document types, refuses a revision mismatch, and refuses booking URLs, FareHarbor IDs, and either verified flag.
4. Show a per-document diff of only the approved text fields.
5. Apply one `patch` with `ifRevisionID` per approved document. Do not use `createIfNotExists` on an existing `drafts.` id.
6. Read the documents back and stop if any other revision changed.
7. Leave every document unpublished.
