#!/usr/bin/env bash
set -euo pipefail

# Deploy the public website to production on a Linux DigitalOcean server.
# Run from the checked-out repository. Do not execute this during local scaffolding.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

COMPOSE_PROJECT="udderly-website-production"
COMPOSE_FILE="docker-compose.production.yml"
HEALTH_ATTEMPTS="${HEALTH_ATTEMPTS:-30}"
HEALTH_SLEEP_SECONDS="${HEALTH_SLEEP_SECONDS:-2}"

# Docker Compose reads .env by default. Set DEPLOY_ENV_FILE explicitly for a
# differently named server environment file, such as .env.production.
COMPOSE_ARGS=(-p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}")
if [[ -n "${DEPLOY_ENV_FILE:-}" ]]; then
  if [[ ! -f "${DEPLOY_ENV_FILE}" ]]; then
    echo "Deployment blocked: DEPLOY_ENV_FILE does not exist." >&2
    exit 1
  fi
  COMPOSE_ARGS+=(--env-file "${DEPLOY_ENV_FILE}")
fi

if [[ "${CONFIRM_PRODUCTION_DEPLOY:-}" != "yes" ]]; then
  echo "Production deployment is blocked. Set CONFIRM_PRODUCTION_DEPLOY=yes only after approving the cutover." >&2
  exit 1
fi

# Do not silently pull code or alter the checked-out revision during deployment.
# Update and review the intended release separately before running this script.
# A missing or unreadable checkout must fail closed rather than bypassing Git checks.
if ! RELEASE_GIT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" ||
   [[ "${RELEASE_GIT_ROOT}" != "${ROOT_DIR}" ]]; then
  echo "Production deployment is blocked: release directory must be the Git checkout root." >&2
  exit 1
fi
if ! RELEASE_GIT_STATUS="$(git status --porcelain --untracked-files=normal)"; then
  echo "Production deployment is blocked: Git status could not be verified." >&2
  exit 1
fi
if [[ -n "${RELEASE_GIT_STATUS}" ]]; then
  echo "Production deployment is blocked because tracked or untracked files have uncommitted changes." >&2
  exit 1
fi

echo "Validating production hostname and canonical origin..."
docker compose "${COMPOSE_ARGS[@]}" config --format json | node scripts/validate-production-hosts.mjs

echo "Checking published Sanity content required for production..."
if ! node scripts/audit-published-content.mjs; then
  echo "Production deployment blocked: published content audit failed. Resolve legal and content blockers before release." >&2
  exit 1
fi

echo "Capturing the currently running container image for recovery..."
PREVIOUS_CONTAINER_ID="$(docker compose "${COMPOSE_ARGS[@]}" ps -q website)"
PREVIOUS_IMAGE_ID=""
if [[ -n "${PREVIOUS_CONTAINER_ID}" ]]; then
  PREVIOUS_IMAGE_ID="$(docker inspect --format '{{.Image}}' "${PREVIOUS_CONTAINER_ID}")"
  if [[ -z "${PREVIOUS_IMAGE_ID}" ]]; then
    echo "Deployment blocked: could not determine the previous container image." >&2
    exit 1
  fi
fi

report_failed_deploy() {
  local exit_status=$?
  if (( exit_status != 0 )); then
    echo "Deployment failed (exit ${exit_status}). Do not cut over traffic or enable indexing." >&2
    if [[ -n "${PREVIOUS_IMAGE_ID}" ]]; then
      echo "Previous website image ID for an approved manual recovery: ${PREVIOUS_IMAGE_ID}" >&2
    else
      echo "No existing website container image was found before this attempt." >&2
    fi
    echo "Do not prune Docker images until the release and recovery are verified." >&2
  fi
}
trap report_failed_deploy EXIT

echo "Building and starting ${COMPOSE_PROJECT}..."
docker compose "${COMPOSE_ARGS[@]}" up -d --build

echo "Waiting for /health..."
for ((i = 1; i <= HEALTH_ATTEMPTS; i++)); do
  if docker compose "${COMPOSE_ARGS[@]}" exec -T website \
    node -e "fetch('http://127.0.0.1:3000/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    echo "Health check passed. Checking key routes and SEO mode inside the new container..."
    if ! docker compose "${COMPOSE_ARGS[@]}" exec -T -e RUN_RELEASE_ROUTE_CHECK=1 website \
      node --input-type=module -e "$(cat scripts/check-release-routes.mjs)"; then
      echo "Release failed: a key route or crawl policy did not pass. Do not treat this deployment as verified." >&2
      exit 1
    fi
    docker compose "${COMPOSE_ARGS[@]}" ps
    exit 0
  fi

  echo "Health check attempt ${i}/${HEALTH_ATTEMPTS} failed; retrying..."
  sleep "${HEALTH_SLEEP_SECONDS}"
done

echo "Website container never became healthy." >&2
docker compose "${COMPOSE_ARGS[@]}" ps >&2
exit 1
