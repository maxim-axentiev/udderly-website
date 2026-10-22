# SEO and WordPress migration audit

Date: 2026-10-21. Dataset checked read-only: Sanity `umbuxpyp` / `production`. Staging remains noindex.

## Missing inputs

These files were not in the website repository, Downloads, Documents, Desktop, or the project folders that could be searched without opening private data:

- October 16, 2026 WordPress WXR XML export
- Mini Highland Cow Google Search Console export
- Sitewide Google Search Console set (`Chart(1).csv`, `Pages(1).csv`, `Queries(1).csv`, `Filters(1).csv`, and the rest of that set)

No Rank Math or Yoast fields were read. No plugin score is treated as Google performance. No query, click, or impression totals are reported. Query coverage is not claimed.

## What the new site actually implements

- Title, meta description, Open Graph, and Twitter tags come from `createPageHead`. A canonical link is emitted only when `PUBLIC_CANONICAL_ORIGIN` is set. Staging leaves that origin unset, so pages send `noindex, nofollow, noarchive` and omit canonical URLs.
- `robots.txt` is `Disallow: /` while the canonical origin is unset. A production origin would allow crawling and point at `/sitemap.xml`.
- `/sitemap.xml` returns 404 while the canonical origin is unset. That behavior was left unchanged.
- Homepage JSON-LD is a `WebSite` node only. Organization, breadcrumb, and article schema factories exist and are not filled with invented business details.
- Experience pages use stored SEO title and description when present, otherwise the title pattern `Experience name | Udderly Ridiculous Farm Life` and the short description. The Mini Highland Cow page uses one fallback sentence about an open visit or a private session only when both the SEO description and the short description are empty.
- Images used by the site are local build assets or Sanity images with alt text. Placeholder alt text is dropped.
- The only registered staging redirect is 301 from `/private-mini-highland-experience` and `/private-mini-highland-experience/` to `/mini-highland-cow-experience`. WordPress, DNS, and Cloudflare were not changed.

## Priority pages

| Page | Current state | Migration class |
|---|---|---|
| Homepage | Published Sanity document. Staging is noindex. | No WordPress join. Preserve the new URL. |
| Mini Highland Cow | Unpublished draft. Page code now has open and private booking buttons, both disabled until a verified URL is saved. | Preserve `/mini-highland-cow-experience`. |
| Private Mini Highland Cow | No separate experience document. | Consolidate onto the Mini Highland Cow route. |
| Animals for Sale | Route exists. Legacy URLs unknown. | Investigate. |
| Experiences Hub | Published page at `/experiences`. | Preserve. |
| Goat Yoga | Unpublished draft with stored title, description, price, gallery, and an unverified booking URL. | No public URL yet. |
| Farm Glamping | Route `/farm-glamping`. | Preserve. Do not redirect `/stay` until a legacy URL is verified. |
| Baby Goat Playtime | Unpublished draft. Age and season label only. | Investigate. |
| Farm Market | Route `/farm-market-store`. | Preserve. |
| Historical blog and animal URLs | Not in an accessible export. | Investigate. Do not invent redirects. |

## Publication blockers that also affect SEO

Fifteen experience documents are drafts, so their URLs 404 on staging. Three of those drafts are marked active in the document, but they are still unpublished and do not appear in the published query. Legal pages, team profiles, and URBORT articles are not ready to index. Staging must stay noindex until launch.
