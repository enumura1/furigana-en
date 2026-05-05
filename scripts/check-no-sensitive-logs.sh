#!/usr/bin/env bash
# Fail if production source logs to DevTools. Public builds should not expose
# page text, model output, host-level settings, or incidental diagnostics.

set -euo pipefail

cd "$(dirname "$0")/.."

STATUS=0

check() {
  local label="$1"
  local pattern="$2"
  shift 2
  local files=("$@")

  if rg -n "$pattern" "${files[@]}"; then
    echo "ERROR: sensitive logging pattern found: $label" >&2
    STATUS=1
  fi
}

check "console logging in production source" 'console\.(log|warn|error|info|debug|trace)\s*\(' src
check "preview helper or preview logging" '\bpreview\s*\(' src

if [[ "$STATUS" -ne 0 ]]; then
  exit "$STATUS"
fi

echo "OK: no production console logging patterns found."
