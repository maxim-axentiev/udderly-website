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

- `/` — homepage
- `/experiences` — published experiences hub
- `/{slug}` — individual experience (legacy root-level URLs)
- `/health` — JSON health check
- `/robots.txt` — crawl policy (disallow while no canonical origin is set)
- `/sitemap.xml` — 404 until `PUBLIC_CANONICAL_ORIGIN` is set

## Production build

```bash
npm run build
npm run start
```

`npm run start` runs the Nitro Node server from `.output/server/index.mjs`. Production containers bind `0.0.0.0:3000`.

After building, run `npm run smoke:local` to start a temporary localhost production server and check public routes, internal links, local asset responses, redirects, retired URLs, and non-indexable local SEO. Run `npm run smoke:canonical` to exercise the same routes using a simulated production canonical origin and verify indexable metadata, canonical URLs, `robots.txt`, and `sitemap.xml`. The runners use localhost ports 3197 and 3198 respectively and stop their servers when finished. Neither command deploys the app, modifies DNS, or verifies external FareHarbor checkout.

After an approved staging deployment, run `npm run smoke:staging -- https://<approved-staging-hostname>` to check the deployed site over HTTPS. It checks health, selected pages, retired routes, redirects, HTTP `X-Robots-Tag`, HTML noindex metadata, disallowed crawling, and disabled sitemap. It rejects production hostnames and does not submit forms or bookings. Do not run it before staging DNS, TLS and the deployment are ready.

Run `npm run audit:content` to read the public, published Sanity dataset without a token and report launch-content readiness. It flags missing or duplicate experience slugs and missing published Privacy, Terms, or Cookies policies as blockers (nonzero exit status). Missing verified booking destinations and missing published prices are review items, not blockers, because some experiences are seasonal or prices may be intentionally withheld. This check does not validate real-time booking availability, charge customers, or publish content.

Run `npm run preflight:local` before preparing a release. It runs all application and release tests, TypeScript checks, ESLint, a fresh production build, and both local HTTP smoke tests in order, stopping on the first failure. This is an offline/local code verification, **not** approval to deploy. The published-content audit (`npm run audit:content`) and staging readiness (`npm run check:staging`) are separate because they depend on live Sanity content and server configuration. Other scripts: `npm run preview`, `npm run test`, `npm run lint`, `npm run typecheck`. `npm run test` includes both application Vitest and Node-based release/infrastructure tests; run only the latter with `npm run test:release`. None of these commands deploy containers or publish Sanity content.

## Docker architecture

`Dockerfile` is a multi-stage production image:

1. Install npm dependencies
2. Build the TanStack Start app
3. Copy only Nitro `.output` into a Node 22 runtime image
4. Run `NODE_ENV=production` on port 3000
5. Health-check `GET /health`

`.env` files are not copied into the image.

For the approval-gated staging release sequence, including DNS, server setup, external smoke tests, manual booking checks and production-only legal gates, see [`docs/staging-release-handoff.md`](docs/staging-release-handoff.md).

## Read-only staging readiness

Before requesting approval for a staging deployment, run `npm.cmd run check:staging` (or `npm run check:staging` on Linux). For a server-specific configuration, run `npm run check:staging -- --env-file .env.staging` with an existing, private environment file. The check resolves Docker Compose without starting containers, validates the staging hostname, HTTPS/noindex routing and blocked email credentials, and verifies both that the directory is the Git checkout root and that its working tree is clean. It never prints environment values. An unset placeholder hostname, missing Docker, or uncommitted files will produce a BLOCKER and a nonzero exit code, which is expected during local development. This check does not establish that DNS, HTTPS certificates, the Traefik server, or FareHarbor checkout are working.

## Read-only production readiness

Run `npm.cmd run check:production` to check production Compose routing and canonical origin, clean Git checkout, and published Sanity legal/experience content without deploying. On a Linux release server, `npm run check:production -- --env-file .env.production` can select the actual existing private server environment file. The command reports independent blockers and review items, fails closed if Docker, Git, or Sanity cannot be inspected, and does not print environment values, start containers, send email or publish content. This does not replace the deployment script's own mandatory checks or verify external DNS, certificates, FareHarbor or email.

## Staging architecture

- Compose file: `docker-compose.staging.yml`
- Compose project name: `udderly-website-staging`
- Joins the external Docker network `web`
- Traefik routes `APP_HOST` to the website container on port 3000 over `websecure` with the `letsencrypt` cert resolver
- Adds `X-Robots-Tag: noindex, nofollow, noarchive`
- Leave `PUBLIC_CANONICAL_ORIGIN` unset so `robots.txt` disallows crawling
- Staging explicitly clears Resend and SMTP credentials so test contact forms cannot deliver real email; production email integration must be tested separately under approval

Deploy script (not run during scaffolding): `scripts/deploy-staging.sh`. Before starting containers, it validates the resolved staging hostname (permitting only farm-owned subdomains under `udderlyridiculousfarmlife.com` and rejecting the production apex and `www` hostnames), Traefik HTTPS routing and backend port, exclusive membership in the external `web` Docker network, no published host ports, no privileged or volume-mounted container access, empty canonical origin, and noindex middleware with `scripts/validate-staging-hosts.mjs`. The example hostname intentionally fails this preflight.

## Production architecture

- Compose file: `docker-compose.production.yml`
- Compose project name: `udderly-website-production`
- Same Traefik HTTPS setup, **without** the staging noindex middleware
- Set `PUBLIC_CANONICAL_ORIGIN` to the confirmed canonical origin before launch
- Do not publish a host port; Traefik reaches the container on the `web` network

Deploy script (not run during scaffolding): `scripts/deploy-production.sh`. Its preflight permits only `udderlyridiculousfarmlife.com` or `www.udderlyridiculousfarmlife.com` as the production router hostname, rejecting staging and unrelated domains. It also checks exclusive use of the external `web` Docker network, no published host ports or privileged/volume-mounted access, and the expected HTTPS Traefik route to port 3000.

After container health reports success, both deployment scripts now check `/`, `/experiences`, `/contact`, six retired URLs (expected 404), four migration redirects (expected exact 301 destination), `robots.txt`, and `sitemap.xml` from inside the newly started container using `scripts/check-release-routes.mjs`. A failed route or crawl-policy check marks the deployment unsuccessful and prints the prior image for manual recovery when available. This does not automatically roll back a container or validate external FareHarbor checkout.

Both deployment scripts read Docker Compose's default `.env` file unless `DEPLOY_ENV_FILE` is explicitly set to an existing environment file. For example, `DEPLOY_ENV_FILE=.env.production` selects the server-only production file; `.env.production.example` is a template and is **not** automatically loaded. Production also requires a successful live read-only published Sanity content audit (`node scripts/audit-published-content.mjs`) before any running container is changed. Missing approved privacy, terms, or cookies policy content blocks production deployment. Production also requires `CONFIRM_PRODUCTION_DEPLOY=yes` and a clean Git checkout. Staging requires `CONFIRM_STAGING_DEPLOY=yes` and a clean checkout. Both deployment scripts fail closed if Git metadata is missing, the release directory is not the checkout root, Git status cannot be read, or tracked/untracked changes are present. Set these only during an approved release. The scripts do not pull from Git.

Before replacing a running container, both scripts record its Docker image ID. If the build or health check fails, they print that image ID for a separately approved manual recovery. They do **not** automatically roll back, and the operator must not prune old images before verifying the release. Recovery involves confirming the previous image still exists, recreating the website service from that pinned image under the same approved environment and network settings, then verifying `/health`, public routes, and Traefik routing. The local mocked recovery test can be run with Git Bash on Windows (`& 'C:\Program Files\Git\bin\bash.exe' scripts/test-deploy-recovery.sh`) or Bash on Linux (`bash scripts/test-deploy-recovery.sh`); this does not access real Docker or mutate Git. Test the real recovery procedure on staging before relying on it in production.

## SEO architecture

Page metadata is built through `src/lib/seo/page-head.ts` instead of repeating raw tags in each route. That helper can later accept Sanity SEO fields.

`PUBLIC_CANONICAL_ORIGIN` is the indexing switch:

- **Set** (production): canonical URLs, Open Graph URL, `robots.txt` allows crawling, `sitemap.xml` is served
- **Unset** (local/staging): no fake canonical URLs, `robots.txt` disallows crawling, `sitemap.xml` returns 404

See `docs/architecture.md` and `docs/seo-migration.md`.

## Sanity Studio

Content is modeled in `/studio` and connected to the Sanity project **Udderly Site**. The public website does not fetch Sanity content yet.

```bash
cd studio
npm install
npm run dev
```

Studio runs at http://localhost:3333

Photography should eventually come from Sanity’s image CDN.

## Intentionally not implemented yet

- Real visual design and brand typography
- Website frontend integration with Sanity
- Authentication
- PostgreSQL, Redis, NestJS, Supabase
- FareHarbor, Wherewolf, Square, Meta, Google, OpenAI, or other business integrations
- Contact forms, Resend, CAPTCHA
- GA4 / GTM / Meta / TikTok analytics
- Real credentials, domains, or redirects
- WordPress URL audit and DNS cutover
