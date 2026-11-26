# Indonesia in Numbers

[![Best National Statistics Site](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/diablosan19/indonesia-in-numbers/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/diablosan19/indonesia-in-numbers/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

An independent national statistics portal for Indonesia: population,
economy, regions and prices, with the latest available national figures.
Built for the make.fun **best-national-statistics-site** bounty.

## What it shows

- **Overview** — 12 headline indicators with animated counters (population
  283.5M, GDP US$1.40tn, growth 5.03%, inflation 2.86% and more), a GDP
  growth chart for 2015–2024, the five largest provinces and a release
  calendar.
- **Population** — an age pyramid for 17 cohorts with a percent / millions
  toggle, ten demographic facts, and a searchable, sortable table of all
  38 provinces.
- **Economy** — a sector donut (top 6 industries + the rest) with a
  share / growth toggle, nominal GDP 2020–2024, and six foreign-trade cards.
- **Regions** — island-group filters driving a clickable list of all
  38 provinces, each with a detail panel (capital, population, share,
  area, density, HDI, poverty, rank).
- **Inflation & Prices** — headline vs core inflation, Jan 2023 – Oct 2025,
  with a headline-only toggle, and the full 11-group CPI basket.
- **Methodology** — how each series is produced, definitions, and
  revision / rounding notes.

Every figure carries its source and year on the page. Province
populations sum to the national total (283.50 million); sector shares
and CPI weights each sum to 100%.

## Screenshots

Four renders of the running site, in `screenshots/` — the cover is the
Overview with all 12 headline cards and the GDP growth chart in one
frame, then Population, Economy, and Regions on a phone.

## Running it

The site is plain static files under `app/` — no build step, no network
requests, no framework. Serve `app/` with any static server and open
`index.html`, on desktop or on a phone.

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to the output directory and writes `dossier.json` with
the kit's vendored `buildDossier`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
