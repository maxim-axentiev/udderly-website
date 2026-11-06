#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

# These exported functions intercept calls in child scripts. No real Docker or
# Git operation can execute while this test runs.
git() {
  case "$1" in
    rev-parse)
      if [[ "${MOCK_FAIL_AT:-}" == "git-root" ]]; then return 1; fi
      pwd
      return 0
      ;;
    status)
      if [[ "${MOCK_FAIL_AT:-}" == "git-status" ]]; then return 1; fi
      if [[ "${MOCK_FAIL_AT:-}" == "git-dirty" ]]; then echo ' M package.json'; fi
      return 0
      ;;
    *) echo "Unexpected Git call: $*" >&2; return 90 ;;
  esac
}

docker() {
  case "$1" in
    inspect)
      printf '%s\n' 'sha256:previous-tested-image'
      return 0
      ;;
    compose)
      case " $* " in
        *" config --format json"*)
          if [[ "${MOCK_FAIL_AT:-}" == "compose-config" ]]; then return 48; fi
          printf '%s\n' '{}'
          return 0
          ;;
        *" ps -q website"*)
          if [[ "${MOCK_HAS_PREVIOUS:-yes}" == "yes" ]]; then
            printf '%s\n' 'previous-container'
          fi
          return 0
          ;;
        *" up -d --build"*)
          if [[ "${MOCK_FAIL_AT:-}" == "build" ]]; then return 42; fi
          return 0
          ;;
        *" exec -T -e RUN_RELEASE_ROUTE_CHECK=1 website "*)
          if [[ "${MOCK_FAIL_AT:-}" == "route-check" ]]; then return 1; fi
          return 0
          ;;
        *" exec -T website "*)
          if [[ "${MOCK_FAIL_AT:-}" == "health" ]]; then return 1; fi
          return 0
          ;;
        *" ps "*)
          return 0
          ;;
      esac
      ;;
  esac
  echo "Unexpected Docker call: $*" >&2
  return 90
}
sleep() { :; }
node() {
  if [[ "${1:-}" == "scripts/audit-published-content.mjs" && "${MOCK_FAIL_AT:-}" == "content-audit" ]]; then
    echo 'BLOCKER: simulated unpublished legal policies' >&2
    return 1
  fi
  if [[ "${1:-}" == "scripts/audit-published-content.mjs" ]]; then return 0; fi
  cat >/dev/null
  if [[ "${MOCK_FAIL_AT:-}" == "invalid-host" ]]; then
    echo 'Simulated invalid Compose hostname' >&2
    return 1
  fi
  return 0
}

export -f git docker sleep node
export HEALTH_ATTEMPTS=2 HEALTH_SLEEP_SECONDS=0
for script in deploy-staging.sh deploy-production.sh; do
  unset CONFIRM_STAGING_DEPLOY CONFIRM_PRODUCTION_DEPLOY
  status=0
  output="$(bash "scripts/${script}" 2>&1)" || status=$?
  if [[ "$status" -ne 1 || "$output" != *'deployment is blocked'* || "$output" == *'Validating '* ]]; then
    echo "FAIL approval gate script=$script status=$status" >&2
    echo "$output" >&2
    exit 1
  fi
  echo "PASS script=$script scenario=approval-required exit=$status"
done
export CONFIRM_STAGING_DEPLOY=yes CONFIRM_PRODUCTION_DEPLOY=yes
run_case() {
  local script="$1" scenario="$2" expected_status="$3" expected_text="$4"
  export MOCK_FAIL_AT="$scenario" MOCK_HAS_PREVIOUS=yes
  local output status
  status=0
  output="$(bash "scripts/${script}" 2>&1)" || status=$?
  if [[ "$status" -ne "$expected_status" || "$output" != *"$expected_text"* ]]; then
    echo "FAIL scenario=$scenario status=$status expected=$expected_status" >&2
    echo "$output" >&2
    exit 1
  fi
  if [[ "$scenario" == "content-audit" || "$scenario" == "invalid-host" || "$scenario" == "compose-config" ]]; then
    if [[ "$output" == *'Capturing the currently running container image'* || "$output" == *'Building and starting'* ]]; then
      echo "FAIL: scenario=$scenario did not stop before container operations" >&2
      exit 1
    fi
  fi
  echo "PASS script=$script scenario=$scenario exit=$status"
}

for script in deploy-staging.sh deploy-production.sh; do
  run_case "$script" git-root 1 'release directory must be the Git checkout root'
  run_case "$script" git-status 1 'Git status could not be verified'
  run_case "$script" git-dirty 1 'uncommitted changes'
  run_case "$script" invalid-host 1 'Simulated invalid Compose hostname'
  run_case "$script" compose-config 48 'Validating '
  run_case "$script" build 42 'Previous website image ID for an approved manual recovery: sha256:previous-tested-image'
  run_case "$script" health 1 'Previous website image ID for an approved manual recovery: sha256:previous-tested-image'
  run_case "$script" route-check 1 'Previous website image ID for an approved manual recovery: sha256:previous-tested-image'
  run_case "$script" success 0 'Health check passed.'
done
run_case deploy-production.sh content-audit 1 'Production deployment blocked: published content audit failed'
export MOCK_HAS_PREVIOUS=no MOCK_FAIL_AT=build
status=0
output="$(bash scripts/deploy-staging.sh 2>&1)" || status=$?
if [[ "$status" -ne 42 || "$output" != *'No existing website container image was found before this attempt.'* ]]; then
  echo "FAIL no-previous-image status=$status" >&2
  echo "$output" >&2
  exit 1
fi
echo "PASS no-previous-image exit=42"
