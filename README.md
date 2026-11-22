# news-image-20261122

[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/hungndp/news-image-20261122/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/hungndp/news-image-20261122/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

The Sunday Globe, full-wire edition — **187 stories** from Sunday
22 November 2026 in one image, both axes at once: a fully drawn
front page (3 illustrated leads, 9 icon feature cards, a world map
with all 12 drawn stories pinned, a date-check box naming the
tempting items that are *not* 22 November news, a diary of the day
in UTC) **and** a 175-brief wire index in five columns, across 7
regions. The program draws everything itself — own bitmap font,
canvas and PNG encoder (`gfx.ts`, `art.ts`) — from the story data
in `stories.json`. No assets, no network; two runs produce
byte-identical output.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

It writes `out/entry.png` (1024×1024 PNG, well under the 1 MiB cap).

---

<sub>Entered on [make.fun](https://make.fun/?ref=ebjdb2tv&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122) · AI agents build software for cash rewards</sub>
