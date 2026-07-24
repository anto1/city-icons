# City Icons

Minimalist SVG icon collection: 301 icons covering 299 cities in 150 countries. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.

**Live site:** https://svgcities.com

## License

Dual-licensed (see root `LICENSE` file):

- **Icon artwork** (`public/icons/**`): CC BY 4.0 — free for any use including commercial, attribution to Studio Partdirector required, changes must be indicated. No share-alike; irrevocable.
- **Site source code** (everything else): MIT, copyright Studio Partdirector.

All user-facing licensing copy (license page, FAQ, README) must reflect these terms — do not reintroduce the old "free for personal/educational use, contact for commercial use" wording.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Static Site Generation)
- **Frontend:** React 19.1, TypeScript 5
- **Styling:** Tailwind CSS 4, PostCSS
- **UI:** Radix UI (Slot, for Button `asChild`), Lucide React icons, Sonner (toasts)
- **Analytics:** Fathom Client
- **Fonts:** Instrument Sans (`next/font/google`, self-hosted + preloaded, metric-matched fallback)
- **Build tooling:** SVGO (icon optimization), fflate (zip generation) — dev deps used by `scripts/`
- **Deploy:** Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (all icons)
│   ├── layout.tsx         # Root layout, metadata (dynamic icon count), JSON-LD, ThemeProvider
│   ├── [country]/         # Dynamic country pages (dynamicParams=false)
│   │   └── [city]/        # Individual city pages (dynamicParams=false)
│   │       └── opengraph-image.tsx  # Dynamic OG image per city
│   ├── map/               # World map of every city (see World Map section)
│   ├── roulette/          # City Roulette feature
│   ├── faq/               # FAQ page with structured data
│   ├── statistics/        # Collection statistics page
│   ├── whats-new/         # Weekly changelog of new icons
│   ├── license/           # License page
│   ├── manifest.ts        # Serves /manifest.webmanifest (Next wires the <link> tag)
│   └── sitemap.ts         # XML sitemap generation
├── components/            # React components
│   ├── ClientHome.tsx     # Client shell shared by homepage and country pages
│   ├── IconGrid.tsx       # Main grid with hover effects
│   ├── IconCard.tsx       # Shared square icon card (homepage grid + city-page grids)
│   ├── SearchBar.tsx      # Search with autocomplete
│   ├── CityPage.tsx       # City page layout (download SVG/PNG, copy, share)
│   ├── ThemeProvider.tsx  # Dark mode context provider
│   ├── ThemeToggle.tsx    # Light/dark mode toggle button
│   ├── ThemedToaster.tsx  # Sonner Toaster wired to ThemeProvider (dark-mode toasts)
│   ├── map/               # /map internals
│   │   ├── WorldMap.tsx   # Client pan/zoom SVG map (no map library)
│   │   ├── projection.ts  # Equirectangular lat/lng → percent helpers
│   │   └── world-land.ts  # GENERATED basemap path (scripts/build-world-basemap.mjs)
│   └── ui/                # button.tsx, input.tsx only (shadcn-style)
├── data/
│   ├── icons/             # 8 region JSON files (europe.json, asia.json, etc.)
│   ├── coordinates.json   # GENERATED: icon _id → [lat, lng] (scripts/build-city-coordinates.mjs)
│   ├── coordinates.ts     # Coordinate lookup + missing-coordinate detection
│   ├── changelog.ts       # Weekly icon additions changelog
│   └── index.ts           # Aggregates region JSON; precomputed sorts/counts
├── hooks/                 # Custom hooks (useIconSearch)
├── lib/
│   ├── utils.ts           # slugify (handles ł/đ/ø), getCitySlug, URL helpers, search scoring
│   └── constants.ts       # Animation, grid, hover, breakpoint constants
└── types/                 # Icon, GridIcon, toGridIcon()

scripts/                   # Node build/maintenance scripts (see Commands)
public/
├── icons/                 # 301 SVG files (naming: {country-code}-{city}.svg)
├── llms.txt               # Hand-maintained LLM-facing site summary (keep counts in sync)
├── icons.json             # GENERATED, gitignored (scripts/build-downloads.mjs)
└── city-icons.zip         # GENERATED, gitignored (scripts/build-downloads.mjs)

.github/ISSUE_TEMPLATE/    # City request issue form
```

## Commands

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # validate-data + build-downloads, then next build (SSG)
npm run start            # Start production server
npm run lint             # Run ESLint
npm run validate:data    # Dataset validation (also gates npm run build)
npm run normalize:svgs   # Normalize/optimize public/icons — run after adding or editing SVGs
npm run build:downloads  # Regenerate public/icons.json + city-icons.zip (build runs this too)

node scripts/build-city-coordinates.mjs  # Regenerate src/data/coordinates.json — REQUIRED after adding icons
node scripts/build-world-basemap.mjs     # Regenerate src/components/map/world-land.ts — only when changing the basemap/crop
```

- `validate:data` fails on: duplicate `_id`, duplicate country/city URL slugs, `svgFilename` with no file, orphan SVGs, missing required fields, README badge counts drifting from the dataset.
- `normalize:svgs` rewrites `fill/stroke="black"` to `currentColor`, normalizes viewBox to `0 0 120 120` (uniform scale + center), runs SVGO. Idempotent.
- `build:downloads` output is deterministic (sorted entries, fixed zip mtimes) — re-running without dataset changes is byte-identical.

## Key Architecture

- **SSG:** All pages pre-rendered at build time via `generateStaticParams()`
- **dynamicParams=false:** Unknown slugs return proper 404 (not soft 404 with 200)
- **Server Components:** Default for pages; client components marked with `'use client'`
- **Server→client boundary:** pages map full `Icon` records to slim `GridIcon` via `toGridIcon()` (`src/types/index.ts`) before passing lists to client components. `description` alone is ~108 KB across the dataset and must never be serialized into client props; `category` is also stripped (no client component reads it). Keep both server-side (metadata, JSON-LD, statistics, OG images).
- **SVG Loading:** Icons served as static files with 1-year immutable cache headers
- **Dynamic Routes:** `/[country]` and `/[country]/[city]` for country/city pages
- **OG Images:** Dynamic per-city OG images via `opengraph-image.tsx` using `ImageResponse`
- **Sitemap:** Dates derived from `changelog.ts` (not identical build-time dates)
- **Fonts:** `next/font/google` (Instrument Sans) — self-hosted at build time, no runtime Google Fonts request
- **Map:** `/map` is fully static with a hand-rolled SVG pan/zoom — no runtime map library

## Icon Data Structure

Icons defined in `src/data/icons/*.json`. Two types in `src/types/index.ts`:

```typescript
// Slim shape that crosses the server→client boundary
interface GridIcon {
  _id: string;
  name: string;           // Display name (e.g., "Barcelona Sagrada Familia")
  city: string;           // City name
  country: string;        // Country name
  region: string;         // Geographic region (one of the 8 region files)
  tags: string[];         // Search tags (search matches on name + tags)
  svgFilename: string;    // File reference (e.g., "es-barcelona.svg")
  slug?: string;          // Explicit URL segment override — see below
}

// Full record as authored in JSON; server-side only
interface Icon extends GridIcon {
  category?: string;      // Typed optional for GridIcon assignability; every authored record has it
  description?: string;   // Every authored record has it; never send to client components
}
```

### `slug` — URL collision prevention

A city page URL is `/{slugify(country)}/{getCitySlug(icon)}`, where `getCitySlug()` (`src/lib/utils.ts`) returns `icon.slug ?? slugify(icon.city)`. When a city gets a **second** icon, the new entry MUST set an explicit `slug` (e.g. Hanoi's second icon uses `hanoi-temple-of-literature`, São Paulo's uses `sao-paulo-masp`) — otherwise both icons resolve to the same URL and one silently shadows the other. This caused a real production bug; `validate:data` now fails the build on duplicate slug pairs.

### Category taxonomy

Consolidated set — do not invent new categories without consolidating:

| Category | Icons |
|----------|------:|
| Landmarks | 167 |
| Culture | 93 |
| Buildings | 20 |
| Nature | 8 |
| Architecture | 7 |
| Religion | 6 |

## Adding New Icons

1. Add SVG to `public/icons/` named `{country-code}-{city}.svg`. The country-code prefix must match the code already used for that country's files — check with `ls public/icons | grep '^xx-'` (e.g. Vietnam is `vn-`, not `vt-`). Known quirks: UK files are `gb-` except legacy `uk-liverpool.svg`; the coordinates script aliases `uk`→`gb` and `ps`→`il`.
2. Run `npm run normalize:svgs` (currentColor, 120×120 viewBox, SVGO).
3. Add entry to the appropriate region file in `src/data/icons/` — `_id` is the highest across **all** region files + 1.
4. If the city already has an icon, set `slug` on the new entry (see Icon Data Structure) — the build fails on URL collisions otherwise.
5. Update `src/data/changelog.ts` (see Updating Changelog; use the object form for ambiguous cities).
6. Run `node scripts/build-city-coordinates.mjs` to regenerate `src/data/coordinates.json`. **If skipped, the build only prints a warning and the new city is silently missing from `/map`.**
7. Run `npm run validate:data` (also runs as part of `npm run build`).
8. If icon/country totals changed: update README badges and region table (`validate:data` asserts the badge numbers), `public/llms.txt`, and the counts at the top of this file.

## Updating Changelog

Edit `src/data/changelog.ts` and add a new entry at the top. `cities` entries are bare strings, or objects when disambiguation is needed:

```typescript
{
  week: '2026-W30',
  date: 'July 20-26, 2026',
  cities: [
    'Bordeaux',                                                      // unambiguous city
    { city: 'Granada', country: 'Nicaragua' },                       // city name repeats across countries
    { city: 'Hanoi', country: 'Vietnam', slug: 'hanoi-temple-of-literature' }, // second icon of a city
  ],
  description: 'Optional description of the batch',
}
```

Without `country`/`slug`, a string entry matches by city name alone and refers to the city's default (unslugged) icon — wrong dates in the sitemap and What's New page if ambiguous.

## World Map (/map)

- Static page plotting every icon as a dot on a minimalist world map, with region zoom presets and a no-JS city list. `WorldMap.tsx` implements pan/zoom over inline SVG — **no runtime map dependency**.
- **Coordinates** (`src/data/coordinates.json`, generated): GeoNames cities500 dump (CC BY 4.0), matched by ISO country code (from the `svgFilename` prefix) + normalized city name, highest population on ties. Every resolved coordinate is sanity-checked against per-country bounding boxes derived from the dump. Places below the 500-population cutoff (ancient sites, hamlets, romanization mismatches) live in an `OVERRIDES` table in `scripts/build-city-coordinates.mjs` — every override must cite its GeoNames record.
- **Basemap** (`src/components/map/world-land.ts`, generated): Natural Earth 1:110m "land" (public domain), equirectangular projection, cropped to latitudes [-56, 74] (drops Antarctica). Regenerate with `node scripts/build-world-basemap.mjs` only if changing the crop/detail.
- Icons with no coordinates entry are dropped from the map with a loud build-time console warning naming the cities and the fix.

## Static Artifacts

| Path | Produced by | Notes |
|------|-------------|-------|
| `/icons.json` | `scripts/build-downloads.mjs` | Machine-readable index (id, name, city, country, region, category, tags, svgFilename, absolute svgUrl/pageUrl). Gitignored build output. |
| `/city-icons.zip` | `scripts/build-downloads.mjs` | All SVGs + `ATTRIBUTION.txt`; linked from the footer ("Download all"). Deterministic output. Gitignored build output. |
| `/llms.txt` | checked in at `public/llms.txt` | Hand-maintained summary for LLM crawlers — update counts/license manually. |
| `/manifest.webmanifest` | `src/app/manifest.ts` | Next.js serves it and injects `<link rel="manifest">` automatically. |

## Code Conventions

- **TypeScript:** Strict mode, interfaces for all props
- **Components:** Server by default, `'use client'` for interactivity
- **Styling:** Tailwind utility classes, theme-aware colors (no hardcoded hex), responsive via SM/MD/LG/XL breakpoints
- **HTML:** Semantic elements, ARIA attributes, one `<h1>` per page, `<main>` in each page (not layout)
- **State:** React hooks only (useState, useCallback, useMemo)
- **Hydration:** No `Math.random()` in render/useMemo — use deterministic logic for SSG

## Important Files

| File | Purpose |
|------|---------|
| `src/data/index.ts` | Aggregates all region JSON; precomputed sorted list, country counts, featured icons |
| `src/types/index.ts` | `Icon`/`GridIcon` split and `toGridIcon()` boundary mapper |
| `src/lib/utils.ts` | `slugify`, `getCitySlug` (slug override), URL helpers, search scoring |
| `src/lib/constants.ts` | Animation, grid, hover, breakpoint constants |
| `src/data/coordinates.ts` | Coordinate lookup for `/map` + missing-coordinate detection |
| `next.config.ts` | Cache headers, SSG config |
| `src/app/layout.tsx` | Global metadata, JSON-LD structured data |
| `src/app/[country]/[city]/opengraph-image.tsx` | Dynamic OG image generation per city |
| `src/app/sitemap.ts` | XML sitemap with changelog-based dates |
| `scripts/validate-data.mjs` | Build-gating dataset validation |

## Environment Variables

```
NEXT_PUBLIC_FATHOM_SITE_ID=xxxxx  # Fathom analytics
```

## Dark Mode

- Toggle in top-right corner of all pages
- Persisted in localStorage
- Respects system preference on first visit
- No flash of wrong theme (inline script in `<head>`)
- **SVG icons and `dark:invert`:** the SVGs use `fill="currentColor"`, but they are rendered via `<img>`/`next/image`, and `currentColor` does **not** inherit into an `<img>`-loaded SVG document — it defaults to black. So the `dark:invert` class on icon `<img>` elements is still required; removing it as a "cleanup" breaks dark mode. `currentColor` only helps consumers who inline the SVG markup.

## SEO

- `<link rel="sitemap">` in root layout `<head>`
- `og:type` is `website` on homepage, `article` on city pages
- Each city page gets a unique OG image (PNG generated at build time via `ImageResponse`)
- Sitemap `<lastmod>` dates vary per page based on changelog entries
- `dynamicParams=false` ensures unknown routes return HTTP 404 (not soft 404)
- Metadata description icon count is dynamic via `iconData.length` (no manual updates needed)

## JSON-LD Structured Data

Each page type has specific schema.org structured data:

| Page | Schema Type(s) |
|------|---------------|
| Layout (global) | `WebSite` with `SearchAction` |
| Homepage | `CollectionPage` + `ItemList` |
| Country pages | `CollectionPage` + `ItemList` + `BreadcrumbList` |
| City pages | `CreativeWork` + `ImageObject` + `Place` + `BreadcrumbList` |
| Map | `WebPage` + `BreadcrumbList` |
| FAQ | `FAQPage` + `BreadcrumbList` |
| Statistics | `WebPage` + `BreadcrumbList` |
| What's New | `WebPage` + `BreadcrumbList` |
| License | `WebPage` + `CreativeWork` + `BreadcrumbList` |
| Roulette | `WebApplication` + `Offer` + `BreadcrumbList` |

## Analytics Events

Tracked via Fathom (`trackEvent` from `fathom-client`). Icon and country interactions fire an **aggregate** event (queryable total) plus a dynamic per-city/per-country breakdown event:

| Aggregate | Breakdown |
|-----------|-----------|
| `ICON_CLICK` | `ICON_CLICK_<CITY>` |
| `ICON_DOWNLOAD` | `ICON_DOWNLOAD_<CITY>` |
| `ICON_DOWNLOAD_PNG` | `ICON_DOWNLOAD_PNG_<CITY>` |
| `ICON_COPY` | `ICON_COPY_<CITY>` |
| `ICON_SHARE` | `ICON_SHARE_<CITY>` |
| `COUNTRY_CLICKED` | `COUNTRY_<COUNTRY>_CLICKED` |

Search & filters: `SEARCH_PERFORMED`, `SEARCH_NO_RESULTS` (settled query with zero matches — the de facto city-request signal), `FILTER_ALL`, `FILTER_<REGION>`

Theme: `THEME_CHANGED_LIGHT`, `THEME_CHANGED_DARK`

Roulette: `ROULETTE_PAGE_VIEWED`, `ROULETTE_SPIN_STARTED`, `ROULETTE_RESULT_SAME_CITY`, `ROULETTE_RESULT_DUPLICATE_CITY`, `ROULETTE_RESULT_THREE_DIFFERENT`, `ROULETTE_BACK_TO_CITIES_CLICKED`, `ROULETTE_LINK_CLICKED`

Map: `MAP_LINK_CLICKED`, `MAP_MARKER_CLICKED`, `MAP_REGION_VIEW_CLICKED`

Downloads: `DOWNLOAD_ALL_ZIP` (footer "Download all" zip link)

Navigation & links: `SCROLL_TO_TOP_CLICKED`, `GITHUB_CLICKED`, `GITHUB_LINK_CLICKED`, `STUDIO_PARTDIRECTOR_CLICKED`, `STUDIO_PARTDIRECTOR_FOOTER_CLICKED`, `WHATS_NEW_CLICKED`, `STATISTICS_CLICKED`, `FAQ_CLICKED`, `LICENSE_LINK_CLICKED`, `MISSING_CITY_CLICKED`

License page: `LICENSE_PAGE_VISIT`, `ATTRIBUTION_COPIED`
