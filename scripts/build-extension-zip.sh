#!/usr/bin/env bash
# Build store-assets/extension.zip from an explicit allowlist.
# Refuses to produce a zip if anything outside the allowlist sneaks in,
# or if any forbidden pattern (.md, .bak, .DS_Store, source-*.png, ...) appears.

set -euo pipefail

cd "$(dirname "$0")/.."

OUT="store-assets/extension.zip"

ALLOW=(
  manifest.json
  LICENSE
  src/background.js
  src/content.js
  src/popup.html
  src/popup.css
  src/popup.js
  icons/icon-16.png
  icons/icon-32.png
  icons/icon-48.png
  icons/icon-128.png
)

for f in "${ALLOW[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "ERROR: required file missing: $f" >&2
    exit 1
  fi
done

mkdir -p "$(dirname "$OUT")"
rm -f "$OUT"
zip -q "$OUT" "${ALLOW[@]}"

ACTUAL=$(unzip -Z1 "$OUT" | sort)
EXPECTED=$(printf '%s\n' "${ALLOW[@]}" | sort)
if [[ "$ACTUAL" != "$EXPECTED" ]]; then
  echo "ERROR: zip contents do not match the allowlist." >&2
  echo "--- expected ---" >&2
  echo "$EXPECTED" >&2
  echo "--- actual ---" >&2
  echo "$ACTUAL" >&2
  rm -f "$OUT"
  exit 1
fi

FORBIDDEN='(\.md$|\.bak$|\.DS_Store|\.zip$|(^|/)\.git(/|$)|source-.*\.png$|(^|/)node_modules(/|$)|\.env($|\.))'
if unzip -Z1 "$OUT" | grep -E "$FORBIDDEN" >/dev/null; then
  echo "ERROR: forbidden pattern in zip:" >&2
  unzip -Z1 "$OUT" | grep -E "$FORBIDDEN" >&2
  rm -f "$OUT"
  exit 1
fi

VERSION=$(awk -F'"' '/"version"/{print $4; exit}' manifest.json)
PERMISSIONS=$(awk '/"permissions"/{flag=1} flag{print; if(/\]/){flag=0}}' manifest.json | tr -d '\n')
MATCHES=$(awk '/"matches"/{flag=1} flag{print; if(/\]/){flag=0}}' manifest.json | tr -d '\n')

echo "✅ Built $OUT"
echo "   version:     $VERSION"
echo "   permissions: $PERMISSIONS"
echo "   matches:     $MATCHES"
echo "   files:       $(unzip -Z1 "$OUT" | wc -l | tr -d ' ')"
echo "   size:        $(du -h "$OUT" | cut -f1)"
echo ""
echo "Contents:"
unzip -Z1 "$OUT" | sed 's/^/   /'
