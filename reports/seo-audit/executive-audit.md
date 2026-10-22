# SEO and WordPress migration audit

Date: 2026-10-21. Search type: web. Range in both exports: last 16 months, with daily rows from 2025-06-20 through 2026-10-19 (487 days). WordPress source: 93 published pages and posts in the sanitized extract (87 pages, 6 posts). No form submissions or email addresses are in that file. Rank Math and Yoast values below are stored plugin fields, not a live render of the WordPress HTML, and a Rank Math score is not a Google result.

## Totals

Use the chart files for sitewide and filtered totals. Do not add the Mini Highland Cow export on top of the sitewide export. The open experience page is already inside the sitewide chart.

| Set | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| Sitewide chart | 86,655 | 2,708,135 | 3.20% | 7.52 |
| Mini Highland Cow page filter | 17,201 | 1,261,818 | 1.36% | 6.20 |

Position is weighted by daily impressions. The filtered chart matches the main Search Console row for `https://udderlyridiculousfarmlife.com/mini-highland-cow-experience/`.

The sitewide page export has 235 rows. After folding trailing-slash and query-string variants into one path, those rows sum to 88,540 clicks and 4,387,213 impressions. Page impressions are higher than the chart because one search can be counted on more than one URL. Page-row clicks are close to the chart and are used only to compare URLs. The matrix sums the variants. Advertising and social click parameters were not copied into the report.

The sitewide device rows sum to the chart: mobile 63,595 clicks, desktop 22,045, tablet 1,015. The country rows also sum to the chart. Canada has 77,689 clicks and the United States has 5,607. The filtered device file for Mini Highland Cow sums to 7,935 clicks, which does not match the 17,201 chart clicks, so it is not used as that page’s device mix.

Both query exports stop at 1,000 rows. Sitewide query rows account for 49,083 clicks and 1,444,413 impressions, about 57% of chart clicks and 53% of chart impressions. The Mini Highland Cow query rows account for 7,935 clicks and 809,011 impressions, about 46% of that page’s clicks and 64% of its impressions. Queries outside those files are not listed.

## Where the clicks go

Of the 88,540 page-row clicks:

- 82,091 are on paths the new site already uses.
- 2,876 are on `/private-mini-highland-experience`, which staging already 301s to `/mini-highland-cow-experience`.
- 2,046 are on 15 paths with a proposed destination that is not implemented.
- 1,525 are on 76 paths with no safe destination yet.
- 2 are on media URLs. Those stay unmatched. Do not point an image URL at an HTML page.

The largest preserve paths are the homepage (27,947 clicks, position 11.68), the open Mini Highland Cow page (17,202 clicks after variants, position 6.20), Animals for Sale (12,461, position 6.78), the Experiences hub (10,005, position 7.42), and Goat Yoga (4,972, position 6.90).

## Ten priorities

1. Publish the Mini Highland Cow page before any production cutover. It is the largest impression URL, and the private URL’s 2,876 clicks and 212,375 impressions will land on it. Staging still 404s that destination because the draft is unpublished.
2. Rewrite the open-page snippet around the query `mini highland cow`. In the filtered query export that query has 217,531 impressions, position 2.33, and a 0.11% CTR (230 clicks). The page’s overall CTR is 1.36%, against a 3.20% site CTR.
3. Fill and publish Baby Goat Playtime. The path has 434 clicks, 247,232 impressions, position 2.72, and a 0.18% CTR. The draft has no body, price, or SEO fields. The stored Rank Math description says the visit is limited time; confirm that before reusing it.
4. Publish Goat Yoga. It has 4,972 clicks and 194,703 impressions at position 6.90. In the truncated sitewide query export, `goat yoga` has 1,857 clicks, 42,758 impressions, and position 5.84. The draft already has body, price, gallery, and SEO text, and its booking link is not verified.
5. Publish Animals for Sale listings before cutover. The hub has 12,461 clicks at a 5.67% CTR. `mini highland cow for sale` has 1,420 clicks and a 13.48% CTR at position 5.01 in the query export. Sale intent should stay on the sale pages.
6. Raise the Farm Glamping snippet. The page has 2,039 clicks, 224,731 impressions, position 6.22, and a 0.91% CTR.
7. Write the two Taste of Farm Life drafts. Together the page rows have 486 clicks and 236,911 impressions, at positions 5.32 and 4.07, with CTRs of 0.23% and 0.18%.
8. Publish Alpaca Walks. It has 1,247 clicks, 132,418 impressions, position 10.33, and a 0.94% CTR. The draft has the main fields, and the booking link is not verified.
9. Raise the Farm Market snippet. It has 538 clicks, 141,347 impressions, position 6.04, and a 0.38% CTR.
10. Keep the homepage path and improve non-brand relevance. Brand queries such as `udderly ridiculous farm life` already sit near position 2.3 with a 23% CTR. The homepage’s all-query position is 11.68.

## Critical migration risks

- Cutting over while the 15 experience drafts are unpublished turns their current URLs into 404s. Goat Yoga, the Highland Cow page, glamping’s related visits, and the picnic pages are in that set.
- The private Mini Highland Cow 301 is correct only after the consolidated page is published and its description covers a private session. It is implemented on staging, not on public WordPress or DNS.
- `/mini-cattle-for-sale` (477 clicks), `/promotions` (336 clicks), and `/cow-wedding` (136 clicks) have no assigned destination.
- Stored Yoast and Rank Math titles disagree on some pages. The Experiences hub Yoast title still contains the long farm suffix, while Rank Math says `Farm Experiences | Udderly Ridiculous Farm Life`. Some Yoast descriptions still contain `%%title%%` tokens. Neither set was checked against the live HTML.
- Several stored descriptions claim awards or television appearances. Those claims need the owner’s confirmation before they are saved in Sanity.
- Three experience drafts have a booking URL with the verified flag empty. Those links stay off.
- Staging remains noindex, `robots.txt` disallows all crawling, and `/sitemap.xml` is 404 while the public canonical origin is unset. Leave that in place until launch.

The page-by-page rows are in `migration-matrix.csv`. Query notes are in `keyword-opportunities.md`. Redirects are in `redirect-proposal.md`. The 15 drafts are in `experience-draft-readiness.md`.
