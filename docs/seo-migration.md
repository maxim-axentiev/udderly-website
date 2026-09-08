# SEO migration from WordPress

This website will replace an existing WordPress site. Do not invent the live domain, URL map, or content in this repository.

## Before launch

1. Crawl and export the current WordPress URLs.
2. Preserve existing URLs where the new site can serve the same path.
3. Map changed URLs to 301 redirects in `src/lib/seo/redirects.ts`.
4. Identify intentionally retired URLs and mark them as 410 Gone in the same module.
5. Migrate titles and meta descriptions rather than regenerating them blindly.
6. Migrate canonical rules; production canonical URLs come from `PUBLIC_CANONICAL_ORIGIN` plus the page path.
7. Preserve structured data where it is still valid. Do not invent Organization/LocalBusiness details.
8. Audit image alt text during the Sanity/media migration.
9. Generate the final sitemap after CMS content exists. `/health` must never be included.
10. Verify `robots.txt`: disallow on staging / when canonical origin is unset; allow and reference `sitemap.xml` only in production.
11. Submit the production sitemap in Google Search Console after DNS cutover is ready.
12. Test redirects on staging (or a hosts-file preview) **before** DNS cutover.

## Indexing switch

`PUBLIC_CANONICAL_ORIGIN` controls production indexing:

- Configured: canonical tags, sitemap, robots allow
- Not configured: no fake canonicals, robots disallow, sitemap unavailable

Staging Compose also sends `X-Robots-Tag: noindex, nofollow, noarchive`. Production Compose must not.

## Out of scope for this foundation

Do not audit the live WordPress site in this task. Do not copy Intra or Webflow redirect lists. Do not add placeholder redirects.
