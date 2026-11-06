# Release candidate inventory, November 5, 2026

Status: **review only, not a release or authorization to stage, commit, push, publish, or deploy.**

## Git inventory

- Branch: `main`; current HEAD at review: `1be7a51`.
- 65 modified tracked files and 121 untracked files (186 candidate files in total).
- 95 untracked files are under `reports/`. The remaining 26 include application tests, migration helpers, release scripts, `AGENTS.md`, and this project's staging handoff.
- Raw WordPress and Sanity exports under explicitly ignored paths remain outside ordinary `git add`.
- A basic candidate-file scan found **no private-key blocks** and **no high-confidence embedded credential assignments** in untracked sources, apart from an intentional placeholder in a release unit test. Added tracked diff lines also showed no obvious key/token indicators. These are heuristic checks, **not** a full data-protection review.

## Review groups

| Group | Candidates | Release handling |
| --- | ---: | --- |
| Previously tracked application, schema, config and deployment changes | 65 modified tracked files | Review complete diffs, verify tests and approved behavior; preserve all changes |
| New application tests, release-check scripts, migration helpers, and handoff files outside `reports/` | 26 untracked files | Review source and tests individually; do not broadly stage until reviewed |
| Migration evidence, CMS draft proposals, reports, and helper scripts under `reports/` | 95 untracked files | Keep outside the deployable release by default; select only approved documentation/source |
| Raw exports and snapshots protected by `.gitignore` | ignored, not included in counts | Never force-add without separate privacy/data review |

### Credential-accessing helpers requiring special scrutiny

These untracked scripts refer to Sanity authentication/configuration and must not be included casually:

- `reports/about-wordpress-migration/create-drafts.mjs`
- `reports/about-wordpress-migration/finish-and-verify.mjs`
- `reports/about-wordpress-migration/publish-reviewed.mjs`
- `reports/experience-content-review/launch-readiness/apply-seo-descriptions.mjs`
- `reports/experience-content-review/launch-readiness/apply-workshop-capacity.mjs`
- `reports/experience-content-review/launch-readiness/audit-current-seo.mjs`
- `reports/experience-content-review/launch-readiness/check-current-booking.mjs`
- `reports/experience-content-review/launch-readiness/check-workshop.mjs`
- `reports/website-content-migration/_extract-sanity.mjs`

The first five were flagged by a simple source scan for write-capable Sanity client calls. This does not mean they have been executed during this review.

### Deliberate release boundaries

1. Keep `.env`, authenticated CMS exports, private customer information, raw WordPress content, and credentials outside Git.
2. Do not stage the entire `reports/` tree. Separately review generated JSON patches, draft proposals and customer-facing copy for privacy, accuracy and approval.
3. Review changes to `scripts/deploy-*.sh`, Docker Compose, SEO and Sanity publishing rules before any release commit.
4. Confirm seasonal inactive pages and unpublished legal policies are handled according to the existing launch policy. Do not activate bookings or legal copy to satisfy a check.
5. After selecting approved files, review the exact index with `git diff --cached --stat` and `git diff --cached`, then run the full preflight.
6. Only an expressly approved, clean commit with recorded SHA is eligible for staging. Hostname, DNS, certificate and server access are separate gates.

## Known current readiness

- Staging checker: two blockers, **APP_HOST** still a placeholder and **dirty Git working tree**.
- Production checker: five blockers, those two plus missing published Privacy Policy, Terms of Service and Cookies Policy.
- Production integration review: contact email delivery unconfigured; Google Places configuration must be present on the deployment server.
- No release was created and no deployment was attempted during this inventory.
