# Experience draft readiness

Read-only check on 2026-10-21. All 15 experience documents are unpublished drafts. None were edited. Search metrics are page rows from the sitewide export, with query-string variants folded into the path. WordPress titles and descriptions are stored Rank Math fields from the sanitized published extract, not a live HTML check.

Alpaca Walks, Goat Cuddles, and Goat Yoga are revision `iqxaelbmvJtLE9nhql4Ult`, active in the document, and still unpublished. Each has a body, price, capacity, hero, gallery, SEO title, and SEO description. Each also has a booking URL with `bookingVerified` empty, so the public button stays off. Their Sanity SEO text matches the stored Rank Math title and description. The descriptions claim awards or television coverage. Confirm those claims before publishing. Do not turn on the booking URLs from this audit.

The other twelve drafts are revision `GPqPjmhHkD02bVdiKLigCq`, inactive, and thin: title, age, and season only. They have no body, price, capacity, hero, gallery, or SEO fields.

## Page metrics and stored WordPress metadata

| Draft | Clicks | Impressions | CTR | Position | Stored Rank Math title | Gap |
|---|---:|---:|---:|---:|---|---|
| Mini Highland Cow Experience | 17,202 | 1,261,834 | 1.36% | 6.20 | The Original Mini Highland Cow Experience \| Udderly Ridiculous | No Sanity SEO, body, price, or capacity. Private URL is separate. |
| Goat Yoga | 4,972 | 194,703 | 2.55% | 6.90 | Goat Yoga \| Udderly Ridiculous Farm Life | Ready except an unverified booking link and the award/TV line. |
| Alpaca Lunch Picnic | 1,747 | 66,852 | 2.61% | 8.11 | Alpaca Lunch Picnic \| Udderly Ridiculous Farm Life | No body, price, or SEO in Sanity. |
| Alpaca Walks | 1,247 | 132,418 | 0.94% | 10.33 | Alpaca Walks & Bond \| Udderly Ridiculous Farm Life | Same gap as Goat Yoga: unverified booking and the award/TV line. |
| Goat Cuddles | 970 | 53,377 | 1.82% | 13.95 | Goat Cuddles \| Udderly Ridiculous Farm Life | Same gap as Goat Yoga. |
| Baby Goat Playtime & Snuggles | 434 | 247,232 | 0.18% | 2.72 | Baby Goat Playtime and Snuggles \| Udderly Ridiculous Farm Life | Thin draft. Stored description says limited time. |
| Goat Recess | 311 | 55,116 | 0.56% | 7.27 | Goat Recess \| Udderly Ridiculous Farm Life | Thin draft. Stored description mentions a 13-time award. |
| Taste of Farm Life | 299 | 132,412 | 0.23% | 5.32 | Taste of Farm Life \| Udderly Ridiculous Farm Life | Thin draft. |
| Alpaca Sunset Picnic | 258 | 11,548 | 2.23% | 13.35 | Alpaca Sunset Picnic \| Udderly Ridiculous Farm Life | Thin draft. |
| Taste of Farm Life Family Friendly | 187 | 104,499 | 0.18% | 4.07 | A Taste Of Farm Life Family Friendly \| Udderly Ridiculous | Thin draft. |
| Miniature Donkey Visits | 85 | 2,108 | 4.03% | 7.13 | Miniature Donkey Visits \| Udderly Ridiculous Farm Life | Thin draft. A separate private-visits WordPress page exists and is not this URL. |
| Mini Highland Calf Meet & Greet | 53 | 19,078 | 0.28% | 7.10 | Mini Highland Calf Meet & Greet \| Udderly Ridiculous Farm Life | Thin draft. Stored title says limited time. |
| Alpaca Experience & Fibre Nesting Ball Workshop | 19 | 790 | 2.41% | 9.85 | Alpaca Experience and Fibre Nesting Ball Workshop | Thin draft. Stored description names individual alpacas. Confirm the names. |
| Private Miniature Donkey Lunch Picnic | 21 on the public path | 467 | 4.50% | 7.03 | Private Miniature Donkey Lunch Picnic | Public path is `/miniature-donkey-lunch-picnic`. Thin draft. |
| Private Miniature Donkey Sunset Picnic | 63 | 3,110 | 2.03% | 3.32 | Private Miniature Donkey Sunset Picnic | Public path is `/miniature-donkey-sunset-picnic`. Thin draft. |

The private Mini Highland Cow WordPress page is not one of the 15 drafts. Its stored description is `Award-winning, see on TV! Brush, feed, and connect with our loveable cows in a peaceful, exclusive setting. Book the original Private Mini Highland Cow Experience!` Confirm the award and television lines before any of that text is added to the consolidated page.

## Proposed metadata

Use these only after the owner confirms the award, television, and limited-time lines. They are not written to Sanity.

| Draft | Proposed title | Proposed description | Intent | Internal link |
|---|---|---|---|---|
| Mini Highland Cow | The Original Mini Highland Cow Experience \| Udderly Ridiculous | Keep the code fallback until the award and television lines are confirmed: meet the cows on an open visit, or book a private session. | Book an open or private visit | `/experiences` and `/animals-for-sale` |
| Goat Yoga | Keep the stored draft title | Keep the stored draft description after confirmation | Book goat yoga | Hub, Goat Cuddles, Baby Goat Playtime |
| Goat Cuddles | Keep the stored draft title | Keep the stored draft description after confirmation | Book goat cuddles | Hub and Goat Yoga |
| Alpaca Walks | Keep the stored draft title | Keep the stored draft description after confirmation | Book an alpaca walk | Hub and the alpaca picnics |
| Baby Goat Playtime | Baby Goat Playtime and Snuggles \| Udderly Ridiculous Farm Life | Reuse the stored description only if the visit is still limited time | Limited-date baby goat visit | Hub and Goat Cuddles |
| Goat Recess | Goat Recess \| Udderly Ridiculous Farm Life | Reuse the stored description only if the award line is confirmed | Seasonal goat visit | Hub |
| Alpaca Lunch Picnic | Alpaca Lunch Picnic \| Udderly Ridiculous Farm Life | Reuse the stored description after the award line is confirmed | Seasonal picnic | Hub and Alpaca Walks |
| Alpaca Sunset Picnic | Alpaca Sunset Picnic \| Udderly Ridiculous Farm Life | Reuse the stored description after the award line is confirmed | Seasonal picnic | Hub and Alpaca Lunch Picnic |
| Taste of Farm Life | Taste of Farm Life \| Udderly Ridiculous Farm Life | Reuse the stored description after the award line is confirmed | Tasting visit | Hub and the family version |
| Taste of Farm Life Family Friendly | A Taste Of Farm Life Family Friendly \| Udderly Ridiculous | Reuse the stored description after the award line is confirmed | Family tasting | Hub and the adult version |
| Mini Highland Calf Meet & Greet | Mini Highland Calf Meet & Greet \| Udderly Ridiculous Farm Life | Reuse the stored description only if the visit is still offered | Limited-date calf visit | Mini Highland Cow page |
| Miniature Donkey Visits | Miniature Donkey Visits \| Udderly Ridiculous Farm Life | Reuse the stored description after the owner confirms it is the public visit | Donkey visit | Hub |
| Donkey lunch picnic | Private Miniature Donkey Lunch Picnic \| Udderly Ridiculous Farm Life | Reuse the stored description after the award line is confirmed | Private lunch picnic | Hub |
| Donkey sunset picnic | Private Miniature Donkey Sunset Picnic \| Udderly Ridiculous Farm Life | Reuse the stored description after confirmation | Private sunset picnic | Hub |
| Fibre workshop | Alpaca Experience and Fibre Nesting Ball Workshop \| Udderly Ridiculous Farm Life | Reuse the stored description after the named alpacas are confirmed | Workshop visit | Hub and Alpaca Walks |

Open price and capacity for Mini Highland Cow are still empty in the draft. The page code shows private price `$250 for 4 people` and private capacity `4–8 people` when those fields are empty. It does not say `$250` covers eight people. Confirm both lines, and supply the open price and capacity, before a bulk write.

## Next bulk update

Do not run a write from this audit. The next phase should:

1. Export the 15 drafts to a local backup that is not committed.
2. Record `_id` and `_rev` for each document.
3. Preview text changes with `planExperienceDraftPatch`. It refuses other document types, a revision mismatch, booking URLs, FareHarbor IDs, and either verified flag.
4. Show a per-document diff and get approval for each description that mentions an award, a broadcast, or a limited date.
5. Apply one `patch` with `ifRevisionID` per approved document. Do not use `createIfNotExists` on an existing `drafts.` id.
6. Read the documents back and stop if any other revision changed.
7. Leave every document unpublished until a separate publish approval.
