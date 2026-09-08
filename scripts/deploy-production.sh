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

if [[ -d .git ]]; then
  echo "Updating repository..."
  git pull --ff-only
fi

echo "Building and starting ${COMPOSE_PROJECT}..."
docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" up -d --build

echo "Waiting for /health..."
for ((i = 1; i <= HEALTH_ATTEMPTS; i++)); do
  if docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" exec -T website \
    node -e "fetch('http://127.0.0.1:3000/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    echo "Health check passed."
    docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" ps
    exit 0
  fi

  echo "Health check attempt ${i}/${HEALTH_ATTEMPTS} failed; retrying..."
  sleep "${HEALTH_SLEEP_SECONDS}"
done

echo "Website container never became healthy." >&2
docker compose -p "${COMPOSE_PROJECT}" -f "${COMPOSE_FILE}" ps >&2
exit 1
