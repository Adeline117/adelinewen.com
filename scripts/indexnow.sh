#!/usr/bin/env bash
# Tell IndexNow search engines (Bing, Yandex, Naver, Seznam, ...) that the site changed,
# so they recrawl now instead of whenever they next pass by. Run after a deploy lands.
# The key is public on purpose: it only proves this site asked, at /1b7887285121a257d0e7962ecfab3fe0.txt.
set -euo pipefail
KEY=1b7887285121a257d0e7962ecfab3fe0
curl -sS -o /dev/null -w "IndexNow: %{http_code}\n" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"adelinewen.com\",\"key\":\"$KEY\",\"keyLocation\":\"https://adelinewen.com/$KEY.txt\",\"urlList\":[\"https://adelinewen.com/\",\"https://adelinewen.com/zh\",\"https://adelinewen.com/research\",\"https://adelinewen.com/zh/research\",\"https://adelinewen.com/arena\",\"https://adelinewen.com/zh/arena\",\"https://adelinewen.com/papers/Wen2026-HasciDB-NBC.pdf\",\"https://adelinewen.com/papers/Zastrow2026-Airdrop-Governance-SMC.pdf\"]}"
