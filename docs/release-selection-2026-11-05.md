# Proposed release file selection, 2026-11-05

Status: **unapproved inventory only**. Do not stage, commit, push or deploy based on this file without reviewing the exact changes and approving the release SHA.

This listing is a reproducible snapshot of Git changes, not a curated approval. All checkboxes start unchecked.

## November 6 reconciliation (current; supersedes November 5 counts below)

A fresh read-only Git inventory at HEAD `1be7a51` found **69 modified tracked files and 127 untracked files**, including **95 files under `reports/`** and **32 outside `reports/`**. The numbered sections below remain the November 5 snapshot and must not be mistaken for a complete current staging list. These counts may change as work continues. No files have been staged.

**Modified tracked files newly absent from the November 5 list:**

- [ ] `src/components/corporate/sections.tsx`
- [ ] `src/components/home/gift-goat-counter.tsx`
- [ ] `src/components/home/welfare-section.tsx`
- [ ] `src/components/ui/button.tsx`

**Additional untracked release scripts and application tests absent from the November 5 list:**

- [ ] `scripts/verify-booking-overlay.mjs`
- [ ] `scripts/verify-booking-overlay.test.mjs`
- [ ] `src/components/home/gift-goat-counter.test.tsx`
- [ ] `src/lib/button-link.test.tsx`

**Additional untracked documentation:**

- [ ] `docs/release-selection-2026-11-05.md` (this review-only checklist)

**Current release-review grouping:** 69 modified tracked application/config/deployment files; 24 new release scripts and application tests; four new documentation/instruction files; four migration-specific source files requiring separate scrutiny; 95 `reports/` files excluded from any release by default. The `src/lib/urbort/recovered-review.test.tsx` dependency on ignored raw JSON remains an explicit clean-checkout hazard. Do not include it unless refactored and separately verified.

Before choosing a release, regenerate the entire candidate inventory from `git diff --name-only` and `git ls-files --others --exclude-standard`, compare it with this list, review file contents and dependencies, and choose paths individually. **The November 5 checkboxes alone are insufficient for an approved release.**

**Clean-source review:** A November 6 temporary `git archive` snapshot overlaying all 69 modified tracked files and 23 selected new scripts/tests passed 298/298 application tests, TypeScript, production build and 42-page HTTP smoke without importing ignored reports. The four migration-only test/helper files were excluded, along with the test-only dependency on raw URBORT JSON. The `scripts/test-deploy-recovery.sh` helper and documentation were not in that review snapshot. This evidence does not approve a release or replace verification from a clean Git checkout. See `docs/staging-release-handoff.md` for limitations.

**Later November 6 delta (supersedes the 69/127 counts above):** 70 modified tracked files and 129 untracked files (95 under `reports/`, 34 outside). The experience detail outage review also requires individual release review of:

- [ ] `src/routes/$.tsx` (modified tracked route)
- [ ] `src/components/experience/experience-unavailable.tsx` (new error view)
- [ ] `src/lib/experiences/experience-unavailable.test.tsx` (new regression test)

These changes were independently tested in a local, non-deployed Docker snapshot. The archived snapshot is not a staging release, and no paths were staged.

**Additional sitemap review, November 6:** `src/lib/seo/sitemap.ts` and `src/lib/sanity/fetch.ts` now contain independent CMS failure handling and request timeout logic, and the following new test also needs explicit release selection:

- [ ] `src/lib/seo/sitemap-failover.test.ts`

This test is self-contained and does not depend on raw migration reports. The sitemap changes passed targeted tests, build and both local staging/canonical SEO smoke checks.

**November 6 runtime hardening review:** `docker-compose.staging.yml`, `docker-compose.production.yml`, both `scripts/validate-*-hosts.mjs` files, both validator test files, and both `scripts/check-*-readiness.test.mjs` fixtures now require a read-only filesystem, dropped Linux capabilities and no privilege escalation. The local restricted container passed route checks, actual Compose configs passed both validators, and the complete local preflight passed (324 application tests, 69 release tests, both 42-page smoke modes). These paths still require explicit release review and real staging verification. This is not deployment approval.

**Privilege-override validator review, November 6:** Both `scripts/validate-*-hosts.mjs` files and their paired tests also reject Docker `cap_add`, root-user override, shared host PID/IPC namespaces and attached host devices. Both Compose configs validated against these stronger checks. The full preflight passed (324 application tests, 71 release tests, build and both 42-page HTTP smoke modes); after tightening the root-user pattern, all 35 focused validator/readiness tests passed again. Include these changes only after normal file-by-file release review.

## Modified tracked files (65)

- [ ] `.dockerignore`
- [ ] `.env.production.example`
- [ ] `.gitignore`
- [ ] `README.md`
- [ ] `docker-compose.production.yml`
- [ ] `docker-compose.staging.yml`
- [ ] `docs/architecture.md`
- [ ] `eslint.config.js`
- [ ] `package.json`
- [ ] `scripts/deploy-production.sh`
- [ ] `scripts/deploy-staging.sh`
- [ ] `src/components/adopt/adopt-page.tsx`
- [ ] `src/components/consent/consent-banner.tsx`
- [ ] `src/components/consent/consent-manager.tsx`
- [ ] `src/components/contact/contact-page.tsx`
- [ ] `src/components/experience/experience-detail.tsx`
- [ ] `src/components/experience/experiences-presentation.tsx`
- [ ] `src/components/home/media-carousel.tsx`
- [ ] `src/components/home/reviews-carousel.tsx`
- [ ] `src/components/layout/site-header.tsx`
- [ ] `src/components/visit/gift-card-page.tsx`
- [ ] `src/lib/about/pages.test.tsx`
- [ ] `src/lib/about/resolve.ts`
- [ ] `src/lib/adopt/pages.test.tsx`
- [ ] `src/lib/adopt/resolve.ts`
- [ ] `src/lib/consent/consent.test.tsx`
- [ ] `src/lib/consent/model.ts`
- [ ] `src/lib/contact/resend.test.ts`
- [ ] `src/lib/contact/submit.test.ts`
- [ ] `src/lib/contact/submit.ts`
- [ ] `src/lib/content-pages/pages.test.tsx`
- [ ] `src/lib/corporate/model.ts`
- [ ] `src/lib/corporate/pages.test.tsx`
- [ ] `src/lib/corporate/resolve.ts`
- [ ] `src/lib/experiences/approved-listing.test.tsx`
- [ ] `src/lib/experiences/approved-listing.ts`
- [ ] `src/lib/experiences/detail.test.ts`
- [ ] `src/lib/experiences/detail.ts`
- [ ] `src/lib/experiences/filters.ts`
- [ ] `src/lib/experiences/hub-page.test.ts`
- [ ] `src/lib/experiences/hub-page.ts`
- [ ] `src/lib/experiences/public-paths.ts`
- [ ] `src/lib/homepage/cms.test.ts`
- [ ] `src/lib/homepage/cms.ts`
- [ ] `src/lib/legal/resolve.ts`
- [ ] `src/lib/reviews/carousel.test.ts`
- [ ] `src/lib/reviews/carousel.ts`
- [ ] `src/lib/routes/paths.test.ts`
- [ ] `src/lib/routes/paths.ts`
- [ ] `src/lib/sale/resolve.ts`
- [ ] `src/lib/sanity/fetch-experiences-hub.test.ts`
- [ ] `src/lib/sanity/fetch.ts`
- [ ] `src/lib/sanity/queries.ts`
- [ ] `src/lib/seo/canonical.ts`
- [ ] `src/lib/seo/page-head.test.ts`
- [ ] `src/lib/seo/robots.test.ts`
- [ ] `src/lib/seo/sitemap.test.ts`
- [ ] `src/lib/seo/sitemap.ts`
- [ ] `src/lib/site-chrome.test.ts`
- [ ] `src/lib/site-chrome.ts`
- [ ] `src/lib/visit/pages.test.tsx`
- [ ] `studio/schemaTypes/constants.ts`
- [ ] `studio/schemaTypes/documents/experience.ts`
- [ ] `studio/schemaTypes/singletons/experiencesHub.ts`
- [ ] `vitest.config.ts`

## New application, test, and release scripts (20)

- [ ] `scripts/audit-published-content.mjs`
- [ ] `scripts/audit-published-content.test.mjs`
- [ ] `scripts/check-production-readiness.mjs`
- [ ] `scripts/check-production-readiness.test.mjs`
- [ ] `scripts/check-release-routes.mjs`
- [ ] `scripts/check-release-routes.test.mjs`
- [ ] `scripts/check-staging-readiness.mjs`
- [ ] `scripts/check-staging-readiness.test.mjs`
- [ ] `scripts/docker-context.test.mjs`
- [ ] `scripts/release-file-hygiene.test.mjs`
- [ ] `scripts/smoke-local.mjs`
- [ ] `scripts/smoke-staging.mjs`
- [ ] `scripts/smoke-staging.test.mjs`
- [ ] `scripts/test-deploy-recovery.sh`
- [ ] `scripts/validate-production-hosts.mjs`
- [ ] `scripts/validate-production-hosts.test.mjs`
- [ ] `scripts/validate-staging-hosts.mjs`
- [ ] `scripts/validate-staging-hosts.test.mjs`
- [ ] `src/lib/experiences/filters.test.ts`
- [ ] `src/lib/homepage/media-carousel.test.tsx`

## Documentation or agent instructions for explicit review (3)

- [ ] `AGENTS.md`
- [ ] `docs/release-candidate-inventory-2026-11-05.md`
- [ ] `docs/staging-release-handoff.md`

## Migration-only source requiring separate review (4)

- [ ] `src/lib/migration/experiences-first-batch-preview.ts`
- [ ] `src/lib/migration/experiences-first-batch.test.ts`
- [ ] `src/lib/migration/experiences-first-batch.ts`
- [ ] `src/lib/urbort/recovered-review.test.tsx` (exclude from release, imports ignored raw migration JSON)

## Migration reports and raw-data proposals, excluded by default (95)

These files are not deployment inputs. Keep them outside a clean release checkout unless explicitly approved. The checked-in working tree must still be clean for deployment, so create the release from a separate reviewed clean checkout rather than deleting this evidence.

Report paths are intentionally omitted from this checklist. The snapshot total is 95 untracked files under `reports/`.

## Release gate

**Important dependency finding:** `src/lib/urbort/recovered-review.test.tsx` imports three JSON fixtures under the ignored `reports/website-content-migration/urbort-source/` directory. Keep that test in the local migration-review workspace and out of the release commit. It would otherwise fail in a clean checkout. `scripts/release-file-hygiene.test.mjs` now guards against tracked source imports of migration-only reports.

1. Review each source change and choose the correct files. Never use a blind `git add .`.
2. Confirm that selected code and tests are consistent; inspect `git diff --cached --check` and `git diff --cached` once staging is explicitly approved.
3. Run `npm.cmd run preflight:local`, release-file hygiene tests, and the mocked deployment recovery scenarios.
4. Record the approved full commit SHA in a **clean checkout**. Keep report and migration evidence in the current workspace or separate protected storage.
5. Use a real approved staging hostname and server environment file. Do not infer or invent a DNS record.
6. Obtain deployment approval before any staging container or DNS operation. Production has separate legal and integration signoffs.
