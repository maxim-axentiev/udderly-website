# Udderly Ridiculous Farm Life — public website

Standalone SSR marketing website foundation. This repository is only the public site. The private business platform will live in a separate `udderly-platform` repository.

## Stack

- Node.js 22.12.0+
- npm
- React 19
- TypeScript (strict)
- TanStack Start + TanStack Router
- Vite
- Tailwind CSS 4
- Nitro `node-server` production output
- Docker + Traefik labels for future DigitalOcean hosting

## Local installation

```bash
npm install
```

Node.js 22.12.0 or newer is required (`engines.node` is `>=22.12.0`).

## Local development

The site runs locally **without Docker** and without PostgreSQL, Redis, or another backend.

```bash
npm run dev
```

Local URL: [http://localhost:8080](http://localhost:8080)

Useful paths:

- `/` — placeholder homepage
- `/health` — JSON health check
- `/robots.txt` — crawl policy (disallow while no canonical origin is set)
- `/sitemap.xml` — 404 until `PUBLIC_CANONICAL_ORIGIN` is set

## Production build

```bash
npm run build
npm run start
```

`npm run start` runs the Nitro Node server from `.output/server/index.mjs`. Production containers bind `0.0.0.0:3000`.

Other scripts: `npm run preview`, `npm run test`, `npm run lint`, `npm run typecheck`.

## Docker architecture

`Dockerfile` is a multi-stage production image:

1. Install npm dependencies
2. Build the TanStack Start app
3. Copy only Nitro `.output` into a Node 22 runtime image
4. Run `NODE_ENV=production` on port 3000
5. Health-check `GET /health`

`.env` files are not copied into the image.

## Staging architecture

- Compose file: `docker-compose.staging.yml`
- Compose project name: `udderly-website-staging`
- Joins the external Docker network `web`
- Traefik routes `APP_HOST` to the website container on port 3000 over `websecure` with the `letsencrypt` cert resolver
- Adds `X-Robots-Tag: noindex, nofollow, noarchive`
- Leave `PUBLIC_CANONICAL_ORIGIN` unset so `robots.txt` disallows crawling

Deploy script (not run during scaffolding): `scripts/deploy-staging.sh`

## Production architecture

- Compose file: `docker-compose.production.yml`
- Compose project name: `udderly-website-production`
- Same Traefik HTTPS setup, **without** the staging noindex middleware
- Set `PUBLIC_CANONICAL_ORIGIN` to the confirmed canonical origin before launch
- Do not publish a host port; Traefik reaches the container on the `web` network

Deploy script (not run during scaffolding): `scripts/deploy-production.sh`

## SEO architecture

Page metadata is built through `src/lib/seo/page-head.ts` instead of repeating raw tags in each route. That helper can later accept Sanity SEO fields.

`PUBLIC_CANONICAL_ORIGIN` is the indexing switch:

- **Set** (production): canonical URLs, Open Graph URL, `robots.txt` allows crawling, `sitemap.xml` is served
- **Unset** (local/staging): no fake canonical URLs, `robots.txt` disallows crawling, `sitemap.xml` returns 404

See `docs/architecture.md` and `docs/seo-migration.md`.

## Future Sanity integration

Sanity is **not** installed in this foundation. The routing, sitemap, and SEO helpers are structured so a later CMS can supply pages, experiences, blog posts, FAQs, cattle listings, team members, testimonials, promotions, navigation, and site settings. Photography should eventually come from Sanity’s image CDN.

## Intentionally not implemented yet

- Real visual design and brand typography
- Sanity CMS
- Authentication
- PostgreSQL, Redis, NestJS, Supabase
- FareHarbor, Wherewolf, Square, Meta, Google, OpenAI, or other business integrations
- Contact forms, Resend, CAPTCHA
- GA4 / GTM / Meta / TikTok analytics
- Real credentials, domains, or redirects
- WordPress URL audit and DNS cutover
