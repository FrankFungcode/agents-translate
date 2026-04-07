#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
CONTENT="${CONTENT:-我们要做一个新的推荐模块，首屏响应要快，并且支持灰度发布。}"
DIRECTION="${DIRECTION:-AUTO}"

URL="${BASE_URL}/api/translate/stream?content=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))' "$CONTENT")&direction=${DIRECTION}"

echo "Checking SSE first-token latency..."
echo "URL: ${BASE_URL}/api/translate/stream"

start_ms=$(python3 - <<'PY'
import time
print(int(time.time() * 1000))
PY
)

first_ms=""

while IFS= read -r line; do
  if [[ "$line" == data:* ]]; then
    if [[ "$line" != *'"done":true'* ]]; then
      first_ms=$(python3 - <<'PY'
import time
print(int(time.time() * 1000))
PY
)
      break
    fi
  fi
done < <(curl -sN "$URL")

if [[ -z "$first_ms" ]]; then
  echo "FAILED: no token received."
  exit 1
fi

latency=$((first_ms - start_ms))
echo "First-token latency: ${latency} ms"

if (( latency < 2000 )); then
  echo "PASS (< 2s)"
else
  echo "WARN (>= 2s)"
fi
