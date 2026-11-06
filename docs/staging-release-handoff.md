# Udderly website: staging release handoff

Status: **local tests pass; staging and production blocked; no deployment attempted**. This is an operator checklist, not deployment authorization. Do not set deployment confirmation flags without explicit approval.

## Current release status, November 6, 2026

This section supersedes older test totals and readiness snapshots below. All checks were read-only or local and were performed against the still-uncommitted working tree at HEAD `1be7a51`.

| Check | Latest result |
| --- | --- |
| `npm.cmd test` | Passed: 315 application tests across 41 files, plus 67 release tests |
| TypeScript, ESLint, build and local HTTP smoke | Passed in the most recent feature verification runs; local smoke covered 42 pages, 134 linked paths, six retired URLs and four redirects |
| `npm.cmd run check:staging` | **Blocked (2):** `APP_HOST` is a placeholder; working tree is not clean |
| `npm.cmd run check:production` | **Blocked (5):** production `APP_HOST` is a placeholder; working tree is not clean; three required published legal policies are missing |
| Production review items (3) | Newsletter signup, gift-card checkout and contact email delivery are not integrated and remain disabled |
| Working tree | 107 modified or untracked entries at the time of this review; no files staged |

**Approval and content work needed:** Select and authorize dedicated staging DNS/host and a production host/canonical origin; review the complete working-tree diff and untracked files, select release files and approve a clean release commit; have authorized editors publish legally reviewed substantive policies at `/privacy-policy`, `/terms-of-service` and `/cookies-policy`. These are not tasks to satisfy with placeholder content, a temporary hostname, or automated staging/production deployment. Other integrations noted above need separate business and technical signoff before they can be enabled.

**Remaining verification after approval:** Re-run the full local preflight on the *exact approved clean release SHA*, verify configured server and TLS prerequisites, deploy to staging only with explicit authorization, and complete external browser, FareHarbor, and SEO checks before considering production. Nothing here authorizes changing DNS, publishing CMS content, committing, pushing or deploying.

## Isolated clean-source review, November 6, 2026

A separate, **non-deployable local snapshot** was created at `%TEMP%\\udderly-clean-release-review-20261106-r2` using `git archive HEAD`, then overlaying all 69 modified tracked files and 23 selected new application tests/release scripts. It deliberately omitted all `reports/` data, local migration-only source/tests, and the URBORT review test that imports ignored JSON. Dependencies were provided with a temporary `node_modules` directory junction to the existing local installation; no new dependency lockfile was generated.

**Results:** 298/298 application tests across 39 test files, TypeScript, production build, and local HTTP smoke all passed. Smoke covered 42 pages, 134 linked paths, six retired URLs, and four redirects. A targeted source scan found zero imports of protected raw migration-data locations. This is separate evidence from the 315/315 tests in the full local workspace: the 17-test difference comes from omitted migration-only tests. The release-script tests were not independently rerun inside the archive snapshot because they inspect Git metadata, and the snapshot is not a Git checkout; the 67/67 release test result above comes from the working tree.

**Scope limitation:** This does not prove a clean committed checkout or Docker deployment. The snapshot has no Git metadata, shares installed dependency files with the development checkout, and is not an approved staging artifact. Before release, verify the exact selected files in a separate clean Git checkout, include only reviewed source and tests, and repeat the complete preflight on the approved release SHA. Do not use the snapshot as a deployment source.

## Isolated Docker runtime review, November 6, 2026

The November 6 non-deployable snapshot built successfully into the local Docker image `udderly-clean-review:local-20261106-r3`. An initial container with `--network none` failed the release-route verifier because `/experiences` returned HTTP 500. There were no published ports. This failure is preserved as evidence that the Experiences route requires expected outbound network connectivity, likely for its CMS data fetch; the exact network failure was not separately instrumented. Do not assume this image works with all outbound traffic disabled.

The same image was then run on Docker's ordinary `bridge` network **without host port bindings or any production credentials**, with `PUBLIC_CANONICAL_ORIGIN` empty. `scripts/check-release-routes.mjs` passed inside the container, including `/health`, `/`, `/experiences`, `/contact`, six retired URLs, four redirects, robots/noindex, and the absence of a staging sitemap. This was not a deployed or externally accessible site. A real staging environment must be able to fetch the required published CMS content and should have outbound connectivity and failure behavior reviewed before signoff.

## Offline Experiences fallback regression, November 6, 2026

A reproducible failure was found in the isolated container: with Docker `--network none`, `/experiences` returned HTTP 500 because `fetchExperienceHub()` propagated a failed Sanity published-card query. The function now uses the existing four-second CMS timeout and catches failures, returning an empty published-card list so the static Experiences hub can render. It does **not** claim booking availability or create unverified booking buttons. A new regression test verifies this behavior.

A new **local-only, non-deployable** Docker image `udderly-clean-review:local-20261106-offlinefix` was built from the same review snapshot with the updated fetch code and test. Repeating the identical `--network none` container release-route check now **passes**, including `/experiences`, all checked retirement/redirect paths, noindex/robots, and sitemap exclusion. The previous network dependency is no longer a page-availability blocker for the Experiences hub, although a healthy Sanity connection is still needed for live published listings, verified booking buttons and CMS edits. The full real-world booking flow remains subject to separate staging review.

## Experience detail outage presentation, November 6, 2026

A wider offline-container scan confirmed that `/goat-cuddles`, `/miniature-donkey-visits` and `/goat-yoga` returned HTTP 500 without Sanity access, while the Experiences hub and other informational pages remained available. These dynamic detail pages deliberately do **not** turn CMS failures into 404 responses: a genuine not-found result is reserved for unpublished or retired experiences.

The catch-all experience detail route now uses an accessible `ExperienceUnavailable` error component explaining that details could not be loaded and linking back to the Experiences hub. In a second isolated `--network none` Docker image (`udderly-clean-review:local-20261106-detail-error`), all three tested detail pages returned HTTP 500 **with the helpful error view**, `/experiences` returned 200, and retired `/mini-cattle-for-sale` retained its 404 response. A new component-level regression test passed alongside all 26 existing detail tests; TypeScript, ESLint, build and local smoke also passed. Smoke now checked 42 pages and 135 linked paths. Real published detail content still requires Sanity connectivity, and the error response remains non-successful for crawlers and monitoring.

## Stalled CMS requests on experience details, November 6, 2026

The individual experience detail fetch and optional experience foundation fetch now both use the existing four-second CMS request timeout. A stalled detail query rejects into the previously tested temporary-unavailability route component; a successful query returning no published record still produces the genuine not-found response. A stalled foundation query returns null without preventing an otherwise successful detail page from rendering. Three new regression assertions cover absent published content, stalled details, and stalled foundation content. Targeted test run: 11/11 passed. TypeScript, ESLint, production build, and local 42-page/135-linked-path smoke passed. This is a local code change only, not an approved deployed runtime test.

## Sitemap partial-outage handling, November 6, 2026

The published experience-slug sitemap fetch now has the same four-second timeout as the other CMS reads. Sitemap assembly catches errors for experience slugs and URBORT article slugs separately: if one published-content query fails, successfully fetched URLs from the other are preserved. If both fail, the response includes only static route entries, never guessed or retired experience URLs. Four additional targeted assertions cover the stalled query, both single-source failures and complete outage. The focused sitemap and CMS tests passed 21/21; TypeScript, ESLint, production build, local smoke (42 pages, 135 linked paths) and simulated canonical SEO smoke all passed. This remains a local change, not an approved production sitemap publication.

## Offline sitemap Docker verification, November 6, 2026

The local non-deployable image `udderly-clean-review:local-20261106-sitemap-resilience` was built from the isolated release review snapshot with the latest sitemap and Sanity fetch changes. Two temporary containers were run with `--network none` and **no published host ports** to simulate unavailable CMS services.

- **Staging configuration:** with `PUBLIC_CANONICAL_ORIGIN` empty, `/` and `/experiences` returned HTTP 200, `/robots.txt` disallowed crawling, and `/sitemap.xml` returned 404.
- **Production-style canonical configuration:** with `PUBLIC_CANONICAL_ORIGIN=https://udderlyridiculousfarmlife.com`, `/` and `/experiences` returned HTTP 200, `/robots.txt` allowed crawling, and `/sitemap.xml` returned HTTP 200 with 27 static URL entries. Neither `/goat-cuddles` nor `/goat-yoga` appeared as a fabricated published experience URL. The offline sitemap request completed in about 3.4 seconds.

The canonical-mode check is **only a local simulation**, not production publication or an approval to enable indexing. The production legal-policy, hostname and clean-release gates remain in force; the static sitemap's legal routes do not satisfy the requirement for substantive published legal content.

## Latest complete local preflight, November 6, 2026

The full `npm.cmd run preflight:local` command was rerun after the experience-detail timeout, outage-view and sitemap fallback changes. **All stages passed:** 324/324 Vitest application tests across 43 files; 67/67 Node release tests; TypeScript; full-project ESLint; production build; and local staging-style and simulated production-canonical HTTP smoke. Each smoke run covered 42 pages, 135 linked paths, six retired URLs and four redirects. Git whitespace checks also passed, with zero staged files and HEAD still `1be7a51`.

A read-only Git comparison confirmed every one of the 70 modified tracked files and 35 untracked files outside `reports/` appears in the proposed release checklist. A further 95 `reports/` files remain excluded by default. This is a **working-tree preflight**, not verification of a clean approved release SHA and not deployment authorization; staging and production readiness blockers remain unchanged until approved release and content actions occur.

## Read-only, least-privilege Docker hardening, November 6, 2026

Both staging and production Compose files now require `read_only: true`, `cap_drop: [ALL]` and `security_opt: [no-new-privileges:true]`, in addition to the existing non-root image user, no host port bindings and HTTPS reverse-proxy routing. The staging and production hostname validators reject configurations that remove any of these runtime safeguards. Their test fixtures and both readiness-check fixtures were updated accordingly; validator/readiness regression tests passed 33/33. Both real Compose files also passed `docker compose config` piped to the respective validators with temporary valid farm hostname values, without deploying or changing DNS.

An isolated container running the review image with `--read-only --cap-drop ALL --security-opt no-new-privileges`, using Docker bridge networking and no published host ports, passed the complete `check-release-routes.mjs` internal route verifier. The verifier was streamed on standard input because the read-only filesystem intentionally prevents copying files into the running container. The temporary container was removed. The latest complete `npm.cmd run preflight:local` then passed: **324/324 application tests (43 files), 69/69 release tests, TypeScript, full ESLint, production build, staging/noindex HTTP smoke and canonical SEO smoke**. Each smoke checked 42 pages, 135 linked paths, six retired URLs and four redirects; `git diff --check` passed, zero staged files, HEAD `1be7a51`.

**Pre-deployment review:** Verify these restrictions on the actual approved staging server and confirm that future integrations (particularly contact email delivery or other write-dependent services) do not require writable application directories. The local test establishes current read-only compatibility but does not replace staging verification or authorize DNS changes, publication or deployment.

## Privilege-override rejection review, November 6, 2026

The staging and production Compose validators now reject `cap_add` capabilities even when `cap_drop: [ALL]` is present; root-user overrides (`root`, `0:0`, `0:node`); host PID or IPC namespaces; and host-device mappings. These are additional **fail-closed configuration checks** and do not enable new runtime services. Both actual Compose files still pass validation with temporary approved-format staging and production hostname test values. Regression tests cover each override independently for both environments.

The complete local preflight passed after the initial validator and test additions: 324/324 application tests across 43 files, 71/71 release tests, TypeScript, project-wide ESLint, production build, local noindex and canonical HTTP smoke, each with 42 pages and 135 linked paths. The final root-user pattern adjustment was separately rechecked using 35/35 targeted readiness/validator tests and `git diff --check`. This remains uncommitted review code; rerun full preflight on an approved clean release SHA before staging. No DNS, production content, or deployment actions were performed.

## Clean-source release dependency reconciliation, November 6, 2026

The current review checklist covers all 70 modified tracked files and all 35 untracked files outside `reports/`; no release files were staged. The isolated snapshot originally omitted the new `src/components/experience/experience-unavailable.tsx`, exposing a missing import in one test suite and TypeScript. After copying the component into the local-only snapshot, the excluded-migration-data build passed 307/307 tests (41 files) and TypeScript. Build, local staging/noindex smoke and simulated production canonical smoke passed with 42 pages and 135 links apiece. The temporary snapshot preparation script was corrected to include the new component on future runs. The original repository's full local preflight separately passed 324 application tests, 71 release tests, TypeScript, lint, build and both smoke modes. Mocked deployment recovery passed all 16 scenarios. This remains a non-deployable snapshot with a shared dependency directory, not a clean Git release checkout or approval to stage, commit or deploy.

## Local results and release identity

- `npm.cmd run preflight:local` passed again on November 5, 2026 **after the release hygiene changes**, including all application tests, **61/61 release tests**, TypeScript, ESLint, production build, local HTTP smoke and simulated canonical SEO smoke. Local HTTP checks covered 34 pages, 134 linked paths, six retired URLs, and four required redirects.
- On November 5, a separate review snapshot of 65 modified tracked files plus 20 selected new application/release files passed the complete local preflight without the ignored migration reports. A fresh local Docker image also built successfully from that snapshot (`udderly-release-review:local-20261105`), and the real container passed `scripts/check-release-routes.mjs` with staging/noindex settings. The temporary container was stopped. The locally cached image is **not** a release, published image, or staging deployment.
- The repository currently contains modified and untracked files. **Do not copy an uncommitted working directory to the server as a release.**
- Before any approved release, review the complete diff and untracked files, confirm no secrets or private exports are included, create an approved commit and record its full Git SHA. No commit or push has been performed by this handoff.
- Git ignores raw WordPress/Sanity snapshots and generated migration exports under selected `reports/` paths so a broad `git add` cannot accidentally include them. The release-file hygiene tests also inspect the Git index and fail if protected raw exports, environment files (other than approved examples), local audit files, or private-key files have been tracked. Curated Markdown reviews, patch proposals, and helper scripts remain untracked until explicitly reviewed. Do not use `git add -f` for raw exports without a separate data/privacy review.
- Re-run the complete local preflight on that exact release revision. `git status --porcelain --untracked-files=normal` must be empty for deployment scripts.

## Dedicated staging host and server prerequisites

- Choose and approve an actual dedicated hostname under `udderlyridiculousfarmlife.com`, other than the apex or `www`. The example placeholder is intentionally rejected. Do **not** change public DNS without approval.
- Have the authorized DNS/server operator point that staging hostname to the correct server and configure/verify Traefik's `websecure` entrypoint, `letsencrypt` resolver and external Docker `web` network. Verify HTTPS certificate and routing externally after deployment.
- On the server only, set `APP_HOST` to that hostname in an existing private environment file. Do not commit real environment values. Staging Compose forces `PUBLIC_CANONICAL_ORIGIN` empty and clears Resend/SMTP credentials.
- Confirm server Git checkout is exactly the approved release SHA with a clean working tree. Avoid deploying from local Windows paths or a directory without Git metadata.
- On the server, run read-only `npm run check:staging -- --env-file .env.staging` (substitute the actual selected private environment filename). Resolve all blockers. It checks Compose configuration and Git status but **does not** verify DNS or a live HTTPS endpoint.

## Approval-gated staging deployment

- Obtain explicit approval naming the hostname and release SHA.
- On the authorized Linux server, from the clean checkout, select the private env file and then run the documented `scripts/deploy-staging.sh` with `CONFIRM_STAGING_DEPLOY=yes`. The script itself validates configuration, checks health and internal release routes, and does not pull or commit code.
- It records the previous website container image ID for **manual** recovery if needed. It does not automatically roll back; retain previous image and verify any recovery on staging first.
- After deployment, run `npm run smoke:staging -- https://<approved-staging-hostname>` and verify TLS, routes, redirects, retired pages, HTTP `X-Robots-Tag`, HTML noindex, blocked robots crawling and absent staging sitemap. If any fail, do not approve production.
- Manually review desktop/mobile navigation, real external FareHarbor booking availability and booking flow without completing an unapproved payment, imagery, accessibility, seasonal pages and farm content. Staging deliberately cannot send contact emails.

## Production-specific gates (not staging blockers)

- The November 5 `npm run audit:content` snapshot reported 15 active experiences and three missing published legal policies: `/privacy-policy`, `/terms-of-service`, `/cookies-policy`. Approved policy copy must be published in Sanity by an authorized editor after legal review. Local fallback text does not clear the production gate.
- Production deployment script automatically reruns the live published-content audit before touching running containers. It also requires approved canonical hostname, a clean Git checkout, explicit production confirmation, and valid Traefik configuration.
- `npm run check:production` also reports non-blocking review warnings when Google Places reviews or contact email delivery are not configured. On November 5, the local check showed **five deployment blockers and one review item**: contact delivery was unconfigured. Google Places reviews rendered when the existing local environment variables were loaded, but production still needs server-side configuration verification.
- Production contact-email delivery, analytics consent behaviour, final external FareHarbor checkout, live TLS/canonical SEO and any cutover/rollback plan need separate approved end-to-end verification.
- **Do not deploy production or switch DNS until all production blockers and signoffs are closed.**

## Exit criteria

Staging is ready for signoff only after a recorded release SHA, clean approved checkout, real owned staging hostname and DNS, valid TLS, successful staging deployment, external staging smoke, manual content/booking review, and an identified recovery path. Local test success alone does not meet these criteria.
