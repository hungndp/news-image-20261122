# The Sunday Globe — 22 November 2026

[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/hungndp/news-image-20261122/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/hungndp/news-image-20261122/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

A curated front page summing up Sunday 22 November 2026 in one
image: **36 stories** across 7 regions, 12 drawn cards (3
illustrated leads + 9 feature cards), a world map with all 12
stories pinned, a date-check box naming the tempting items that
are *not* 22 November news, a diary of the day in UTC, and 24
one-line briefs.

Run it with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

It writes `out/entry.png` (1024×1024, deterministic — two runs
produce byte-identical output). No network, no assets: the program
draws everything with its own bitmap font, canvas and PNG encoder
(`gfx.ts`, `art.ts`) from the story data in `stories.json`.
