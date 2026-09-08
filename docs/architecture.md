# Architecture

Public marketing website for Udderly Ridiculous Farm Life. This repository does not contain the private `udderly-platform` API, databases, workers, or integrations.

## Runtime shape

```
Root HTML shell (`src/routes/__root.tsx`)
  -> Site layout (`SiteHeader` / page / `SiteFooter`)
       -> Route content
```

File-based routes live in `src/routes`. Server-only endpoints:

- `GET /health` → `{ "status": "ok" }`
- `GET /robots.txt` → generated from canonical-origin policy
- `GET /sitemap.xml` → generated when indexing is enabled

Production output is Nitro `node-server`. Local development uses Vite on port 8080 and does not require Docker.

## SEO

`src/lib/seo/page-head.ts` is the shared document-head helper for title, description, canonical URL, Open Graph, Twitter, robots, and JSON-LD. Routes should call that helper instead of assembling meta tags by hand.

`PUBLIC_CANONICAL_ORIGIN` is read per request. It must not be hard-coded as the final Udderly domain until that origin is confirmed.

## Redirects

`src/lib/seo/redirects.ts` is the WordPress migration list. It starts empty on purpose. Global request middleware in `src/start.ts` applies matches as HTTP 301/302/307/308 or 410. Populate the list from the URL audit before launch. See `docs/seo-migration.md`.

## HTTPS / www

Assume the existing Traefik instance already redirects HTTP (`web`) to HTTPS (`websecure`). This Compose config only attaches HTTPS routers.

A `www` → apex (or apex → `www`) redirect needs the confirmed canonical hostname. Do not hard-code it here. After the canonical host is known, add a Traefik redirect middleware for the non-canonical host, or serve both names only long enough to issue 301s.

## Images

No photography is bundled in this scaffold. When Sanity is added, prefer Sanity’s image CDN for CMS-managed assets, with:

- responsive widths
- modern formats
- width/height attributes
- lazy loading below the fold
- high-priority loading only for genuine hero images
- meaningful alt text

## Analytics

Do not add GA4, GTM, Meta Pixel, or TikTok Pixel until a later task. Analytics should ship with consent handling. No public analytics environment variables are defined yet.

## Forms

Public forms are not implemented. When they are added they should use:

- server-side validation
- Zod or an equivalent schema
- server-only secrets
- spam protection such as Cloudflare Turnstile
- clear success and error states

Do not put mail-provider keys in client code.

## Sanity readiness

Likely future CMS types: Page, Experience, Blog Post, FAQ, Cattle Listing, Team Member, Testimonial, Promotion, Navigation, Site Settings.

Pages should be composed from approved sections (Hero, Rich Text, Image + Text, Experience Grid, FAQ, Testimonials, Gallery, CTA, Video, Cattle Listings) rather than giant hard-coded page components. Do not add those schemas in this repository until Sanity is intentionally installed.

## Docker / Traefik

Staging and production Compose files each define only the `website` service, join the external `web` network, and use `APP_HOST` for routing. Host ports are not published. Traefik itself is not defined here.

Compose project names:

- `udderly-website-staging`
- `udderly-website-production`
