# Homepage FAQ migration plan (Phase 3B)

Local preparation only. This plan does **not** write to Sanity, patch `siteSettings`, or change live homepage copy.

## Source

- Fixture: `src/content/homepage-faqs.ts` (re-exported from `src/content/homepage.ts`)
- Rendered today as hardcoded paragraphs and `<ul>` lists in `src/components/home/faq-section.tsx`
- Target schema: `studio/schemaTypes/documents/faq.ts`
  - `question` (string, required, max 160)
  - `answer` (Portable Text, required)
  - `category` (required: visiting, booking, animals, glamping, adoption, corporate, accessibility, general)
  - `sortOrder` (number)
  - `active` (boolean)

## Ordered questions

1. Are you a petting farm?
2. Is your farm pet friendly?
3. Are kids allowed on the farm?
4. Do I need a reservation to visit the farm?
5. Is the farm wheelchair accessible?
6. Is parking available?
7. What is your cancellation policy?
8. What happens when there is bad weather?
9. What days and times are you open?
10. How early should I arrive before my experience begins?
11. Is there a washroom on site?

## Mapping

| # | Proposed `_id` | Category (schema-required, not in fixture) | Answer shape |
| --- | --- | --- | --- |
| 01 | `homepageFaq.01-are-you-a-petting-farm` | animals | one paragraph |
| 02 | `homepageFaq.02-is-your-farm-pet-friendly` | animals | one paragraph |
| 03 | `homepageFaq.03-are-kids-allowed-on-the-farm` | visiting | one paragraph |
| 04 | `homepageFaq.04-do-i-need-a-reservation-to-visit-the-farm` | booking | one paragraph |
| 05 | `homepageFaq.05-is-the-farm-wheelchair-accessible` | accessibility | one paragraph |
| 06 | `homepageFaq.06-is-parking-available` | visiting | one paragraph |
| 07 | `homepageFaq.07-what-is-your-cancellation-policy` | booking | intro paragraph + 6 bullets |
| 08 | `homepageFaq.08-what-happens-when-there-is-bad-weather` | booking | one paragraph |
| 09 | `homepageFaq.09-what-days-and-times-are-you-open` | visiting | paragraph + 7 bullets + paragraph + 8 bullets |
| 10 | `homepageFaq.10-how-early-should-i-arrive-before-my-experience-begins` | booking | one paragraph |
| 11 | `homepageFaq.11-is-there-a-washroom-on-site` | visiting | one paragraph |

Wording, punctuation, curly quotes, em dashes, ellipses, and list item text are copied from the fixture. No links or emphasis exist in the source; none are invented.

Cancellation remains a **FAQ document**, not a Policy reference. Opening hours remain a **FAQ document**, not `weeklyHours`.

## Future import (after explicit approval)

1. Review `src/lib/migration/homepage-faqs.ts` and this plan.
2. Run `npm run migrate:homepage-faqs:dry-run` and inspect the JSON (documents, `createIfNotExists` mutations, `homepageFaqs` references). `npm run migrate:homepage-faqs:dry-run -- --apply` is refused.
3. Confirm production has no documents with the `homepageFaq.` prefix (read-only GROQ). This run did **not** query the dataset.
4. After approval, a later change may enable writes that:
   - `createIfNotExists` only documents whose `_id` starts with `homepageFaq.`
   - patch `siteSettings.homepageFaqs` to the previewed reference list
5. Do not `createOrReplace` unrelated FAQ IDs. Do not publish from this script today.

`--apply`, `--write`, and `--publish` are refused.

## Formatting limitations

- CMS homepage answers use Portable Text. Bullet/paragraph spacing can differ slightly from the fixture (`mt-3`/`mt-5` vs renderer `mt-4`).
- `THE SHOW GOES ON!` stays a normal paragraph, not a heading.
- Category values are editorial because the schema requires them.

## Existing documents

No migration IDs exist in the repo. The published Sanity client is read-only, but this phase did not query production. Conflicts with existing FAQ documents are **unverified**.
