#!/bin/bash
P="--project 25d4b032-793e-41af-ac2f-84c1bb5c57a7 --environment production --service ed5c152f-2c6c-4509-96b9-9c6849900b72"
for i in $(seq 1 25); do
  DEP=$(~/.local/bin/railway deployment list $P 2>/dev/null | head -2 | tail -1 | awk '{print $1}')
  STATUS=$(~/.local/bin/railway deployment list $P 2>/dev/null | head -2 | tail -1 | awk '{print $2}')
  echo "check $i: $STATUS ($DEP)"
  if [ "$STATUS" = "HEALTHY" ] || [ "$STATUS" = "FAILED" ]; then
    break
  fi
  sleep 20
done
echo "=== runtime log (last deploy) ==="
~/.local/bin/railway logs --deployment $DEP $P 2>&1 | grep -vE "Healthcheck|Attempt #|Retry window|replicas never|^$" | tail -12
echo "=== curl domain ==="
curl -s -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" https://gh-dash-production.up.railway.app/
