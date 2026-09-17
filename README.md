<p align="center">
  <a href="https://svgcities.com">
    <img src="public/og-image.png" alt="City Icons — 307 minimalist SVG icons of cities around the world" width="600" />
  </a>
</p>

<h1 align="center">City Icons</h1>

<p align="center">
  <strong>307 minimalist line-art SVG icons representing cities and their landmarks from around the world.</strong>
</p>

<p align="center">
  <a href="https://svgcities.com">Live Site</a> ·
  <a href="https://svgcities.com/map">World Map</a> ·
  <a href="https://svgcities.com/whats-new">What's New</a> ·
  <a href="https://svgcities.com/statistics">Statistics</a> ·
  <a href="https://svgcities.com/faq">FAQ</a> ·
  <a href="https://svgcities.com/roulette">City Roulette</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/icons-307-orange" alt="307 icons" />
  <img src="https://img.shields.io/badge/countries-152-blue" alt="152 countries" />
  <img src="https://img.shields.io/badge/regions-8-green" alt="8 regions" />
  <img src="https://img.shields.io/badge/format-SVG-purple" alt="SVG format" />
  <img src="https://img.shields.io/badge/icons-CC_BY_4.0-brightgreen" alt="Icons licensed CC BY 4.0" />
  <img src="https://img.shields.io/badge/code-MIT-brightgreen" alt="Code licensed MIT" />
</p>

---

## What is this?

A curated collection of hand-designed SVG icons — each one captures a city through its most recognizable landmark, symbol, or architectural feature. From the Eiffel Tower to the Sydney Opera House, from Tokyo's temples to Cairo's pyramids.

Browse, search, download, and copy — all for free.

**[→ Browse the collection at svgcities.com](https://svgcities.com)**

## Coverage

| Region | Icons | Example Cities |
|--------|------:|----------------|
| Europe | 130 | Paris, Barcelona, Berlin, Rome, London, Prague, Amsterdam |
| Asia | 49 | Tokyo, Seoul, Shanghai, Delhi, Kyoto, Taipei, Thimphu |
| North America | 30 | New York, San Francisco, Toronto, Chicago, Vancouver |
| Middle East | 26 | Istanbul, Jerusalem, Dubai, Tehran, Baku |
| South America | 19 | Buenos Aires, Rio de Janeiro, São Paulo, Lima, Bogotá |
| Africa | 25 | Cairo, Cape Town, Marrakesh, Nairobi, Accra, Tunis, Windhoek |
| Oceania | 14 | Sydney, Melbourne, Wellington, Perth |
| Central America | 14 | Havana, San Juan, Nassau, Antigua, Willemstad, Soufrière |

Icon and country totals are checked against the dataset at build time by `scripts/validate-data.mjs` (`npm run validate:data`), so these numbers fail the build if they drift.

## Features

- **Browse** 307 city icons organized by country and region
- **Search** by city name, country, tag, or region
- **Explore** every city on the [World Map](https://svgcities.com/map)
- **Download** icons as SVG or PNG, or grab [the whole collection as a ZIP](https://svgcities.com/city-icons.zip)
- **Copy** SVG code directly to your clipboard
- **Share** direct links to individual city pages
- **Discover** random destinations with [City Roulette](https://svgcities.com/roulette)
- **Dark mode** with system preference detection

## Using the Icons

Every icon is a standalone SVG file. Grab them however you like:

**Download from the site**
Visit any city page and click Download or Copy SVG.

**Clone the repo**
```bash
git clone https://github.com/anto1/city-icons.git
# Icons are in public/icons/
ls public/icons/
# fr-paris.svg  de-berlin.svg  jp-tokyo.svg  ...
```

**Direct link**
```
https://svgcities.com/icons/fr-paris.svg
https://svgcities.com/icons/jp-tokyo.svg
```

**Everything at once**
```
https://svgcities.com/city-icons.zip   # all SVGs + attribution file
https://svgcities.com/icons.json       # machine-readable index of the full collection
```

**In HTML**
```html
<img src="https://svgcities.com/icons/fr-paris.svg" alt="Paris" width="56" height="56" />
```

### File Naming

All files follow the pattern `{ISO-country-code}-{city-slug}.svg`:

```
fr-paris.svg       → Paris, France
jp-tokyo.svg       → Tokyo, Japan
us-new-york.svg    → New York, USA
br-rio-de-janeiro.svg → Rio de Janeiro, Brazil
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, SSG) |
| Frontend | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI | Radix UI, Lucide icons, Sonner |
| Analytics | Fathom |
| Deploy | Vercel |

All 307 city pages are statically generated at build time. Icons are served as static files with 1-year immutable cache headers.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx              # Homepage (all icons)
│   ├── [country]/[city]/     # Individual city pages
│   ├── map/                  # World map of every city
│   ├── faq/                  # FAQ with structured data
│   ├── statistics/           # Collection statistics
│   ├── whats-new/            # Weekly changelog
│   ├── roulette/             # City Roulette
│   └── sitemap.ts            # Dynamic XML sitemap
├── components/               # React components (incl. the hand-rolled SVG world map)
├── data/icons/               # Icon metadata by region (JSON)
├── data/coordinates.json     # City coordinates for the map (generated from GeoNames)
├── lib/                      # Utilities (slugify, constants)
└── types/                    # TypeScript interfaces

scripts/                      # Build/maintenance scripts (validation, SVG normalization,
                              # zip/JSON index, coordinates, basemap)
public/icons/                 # 307 SVG files
```

## Development

```bash
npm install
npm run dev             # Start dev server (Turbopack)
npm run build           # Production build (validates data, builds downloads, then SSG)
npm run lint            # ESLint
npm run validate:data   # Dataset checks (duplicate ids/URLs, missing files, badge counts)
npm run normalize:svgs  # Normalize + optimize icon SVGs
```

## Contributing

### Request a City

Missing your city? [Send us an email](mailto:icons@partdirector.ch?subject=City%20Request&body=Please%20add%3A%20%5BCity%2C%20Country%5D) with the city name, country, and optionally the landmark you'd like to see.

### Add an Icon

1. Add your SVG to `public/icons/` using the naming convention: `{country-code}-{city}.svg` (match the prefix of that country's existing files)
2. Run `npm run normalize:svgs`
3. Add metadata to the appropriate region file in `src/data/icons/`
4. Update `src/data/changelog.ts`
5. Regenerate map coordinates: `node scripts/build-city-coordinates.mjs`
6. Run `npm run build` to verify — the build validates the dataset and fails on inconsistencies

### Code Changes

- Use semantic HTML (`nav`, `ul/li`, `article`, `section`)
- Keep structured data valid — test with [Google Rich Results](https://search.google.com/test/rich-results)
- Use theme-aware Tailwind classes (no hardcoded colors)
- No `Math.random()` in render paths (SSG hydration)

## License

- **Icon artwork** (`public/icons/**`) — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Free for any use, including commercial. Give credit to Studio Partdirector, link to the license, and indicate if you made changes.
- **Site source code** (everything else) — [MIT](LICENSE).

Suggested attribution:

```
City Icons by Studio Partdirector — https://svgcities.com — licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
```

See [LICENSE](LICENSE) and the [license page](https://svgcities.com/license) for details.

---

<p align="center">
  Designed by <a href="https://partdirector.ch">Studio Partdirector</a>
</p>
