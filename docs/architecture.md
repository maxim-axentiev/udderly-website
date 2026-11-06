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

No photography is bundled in the website scaffold. Prefer Sanity’s image CDN for CMS-managed assets, with:

- responsive widths
- modern formats
- width/height attributes
- lazy loading below the fold
- high-priority loading only for genuine hero images
- meaningful alt text

## Sanity CMS

Studio lives in `/studio` and is connected to project `umbuxpyp` / dataset `production`.

Content types and page-builder sections are defined there. The public website reads published documents. Sales listings are public website content only; applicant and CRM data stays out of this repository.

### Experience listing

Each experience has two settings that do not change `bookingVerified` or `privateBookingVerified`.

- **Show on the website** (`active`). On, or empty, the experience stays on `/experiences`. Off removes that card from the listing and from the sitemap. The document stays in Sanity, and `/{slug}` still opens the page. A missing value stays visible, so the 15 published experiences remain listed without a content edit.
- **Display order** (`sortOrder`). A number places the card on the listing. Lower numbers come first. Empty keeps the card where the Experiences hub card list already puts it.

Tower of Goats is a hub card, not an experience document, so these two settings do not move or hide it. The homepage’s own experience cards are a separate list.

Editorial types include Experiences, Corporate Programs, Animals, Adoption Offerings, Animals for Sale, URBORT articles, FAQs, Policies, and flexible Pages for unique marketing pages such as Glamping and Corporate Experiences.

Pages should be composed from approved sections rather than giant hard-coded page components.

## Analytics

Do not add GA4, GTM, Meta Pixel, or TikTok Pixel until a later task. Analytics should ship with consent handling. No public analytics environment variables are defined yet.

## Forms

The contact page is the only form that can send. Newsletter signup, gift-card checkout, glamping booking, and experience booking stay disabled.

`POST` `submitContactFn` validates the name, email, and message on the server, then sends one message with Nodemailer. The recipient is fixed as `info@udderlyridiculousfarmlife.com`. `Reply-To` is the visitor’s email. SMTP host, port, username, and password come from `CONTACT_SMTP_*`. Those variables are server-only: they are not `PUBLIC_` or `VITE_` values, and an empty set leaves the form disabled with the existing unavailable notice and `mailto:` link.

The mail server’s acceptance is the success condition. The page says that acceptance is not the same as the message already being in the inbox. A connection, authentication, or rejection error keeps the entered fields and says the message was not sent. Message bodies and credentials are not logged.

A hidden honeypot field is discarded without sending. Repeated submissions are limited to five per hour for one client address, in memory, for this single website process. Behind Traefik, the address is the rightmost `X-Forwarded-For` value only when the socket peer is a private or loopback address. A public socket peer ignores that header. Restarting the container clears the limit.

Cloudflare Turnstile is not configured. Add it only if this honeypot and limit are not enough.

## Docker / Traefik

Staging and production Compose files each define only the `website` service, join the external `web` network, and use `APP_HOST` for routing. Host ports are not published. Traefik itself is not defined here.

Compose project names:

- `udderly-website-staging`
- `udderly-website-production`
