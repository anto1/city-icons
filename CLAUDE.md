# City Icons

Minimalist SVG icon collection (~300 icons, ~150 countries — exact totals are in the README badges and `public/llms.txt`, both checked by `npm run validate:data`). Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.

**Live site:** https://svgcities.com

**SEO: состояние, находки и план** — `docs/seo-plan.md`. Читать перед любой работой над
метаданными, sitemap, заголовками, текстами иконок или локализацией: там зафиксированы
методические ошибки, которые уже были допущены, юридические риски по гербам и список
того, чего делать не надо.

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
- **Build tooling:** SVGO (icon optimization), fflate (zip generation), sharp + fontkit (press kit artwork) — dev deps used by `scripts/`
- **Deploy:** Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages (server components)
│   ├── page.tsx           # Homepage (all icons)
│   ├── layout.tsx         # Root layout, metadata defaults + title template, WebSite JSON-LD, ThemeProvider
│   ├── [country]/         # Dynamic country pages (dynamicParams=false)
│   │   └── [city]/        # Individual city pages (dynamicParams=false)
│   │       └── opengraph-image.tsx  # Dynamic OG image per city
│   ├── map/               # World map of every city (see World Map section)
│   ├── roulette/          # City Roulette feature
│   ├── faq/ statistics/ whats-new/ license/  # Content pages, all built on <ContentPage>
│   ├── press/             # Press kit page (facts + downloadable assets, see Press Kit section)
│   ├── manifest.ts        # Serves /manifest.webmanifest (Next wires the <link> tag)
│   └── sitemap.ts         # XML sitemap generation
├── components/
│   ├── ClientHome.tsx     # Client shell shared by homepage and country pages (search + filters)
│   ├── IconGrid.tsx       # Main grid with proximity hover effect
│   ├── IconCard.tsx       # Shared square icon card (homepage grid + city-page grids)
│   ├── SearchBar.tsx      # Search with autocomplete
│   ├── CityPage.tsx       # City page layout — server component
│   ├── IconActions.tsx    # City page client island: SVG/PNG download, copy, share, credit box
│   ├── ContentPage.tsx    # Shell of faq/statistics/whats-new/license/map: header, breadcrumb, title, footer
│   ├── Breadcrumbs.tsx    # Visible breadcrumb trail (same Crumb[] as breadcrumbList() JSON-LD)
│   ├── JsonLd.tsx         # <script type="application/ld+json">, adds @context
│   ├── RandomIconHeader.tsx # Three featured icons + HeaderControls (home, country, city pages)
│   ├── PageHeader.tsx     # HeaderControls (scroll-top, GitHub, theme) + spacer for content pages
│   ├── IconFooter.tsx     # Country list + footer links
│   ├── AttributionSnippet.tsx # Copyable CC BY credit (city page + license page)
│   ├── PressDownload.tsx  # Tracked press-kit ZIP link
│   ├── ThemeProvider.tsx / ThemeToggle.tsx / ThemedToaster.tsx  # Dark mode
│   ├── map/               # /map internals (no map library)
│   │   ├── WorldMap.tsx   # Client component: region presets, zoom buttons, stage
│   │   ├── useMapViewport.ts # Pan/zoom state + pointer, pinch, wheel, focus gestures
│   │   ├── viewport.ts    # Pure geometry: View, clampView, measureStage
│   │   ├── MapMarkers.tsx # Memoized marker links with hover preview
│   │   ├── types.ts       # MapMarker, RegionView
│   │   ├── projection.ts  # Equirectangular lat/lng → percent helpers
│   │   └── world-land.ts  # GENERATED basemap path (scripts/build-world-basemap.mjs)
│   └── ui/                # button.tsx, input.tsx only (shadcn-style)
├── data/
│   ├── icons/             # 8 region JSON files (europe.json, asia.json, etc.)
│   ├── pending-icons.json # Staged records for icons not drawn yet (not imported by the site)
│   ├── coordinates.json   # GENERATED: icon _id → [lat, lng] (scripts/build-city-coordinates.mjs)
│   ├── coordinates.ts     # Coordinate lookup + missing-coordinate detection
│   ├── changelog.ts       # Weekly icon additions changelog
│   └── index.ts           # Aggregates region JSON; sorted list, country counts, featured icons
├── hooks/                 # useIconSearch, usePrefersReducedMotion
├── lib/
│   ├── site.ts            # SITE_URL, SITE_NAME, STUDIO_ORG, LICENSE_URL… — never hard-code the domain
│   ├── metadata.ts        # pageMetadata(), fitTitle() (60-char title budget), indexRobots()
│   ├── breadcrumbs.ts     # Crumb type + breadcrumbList() JSON-LD
│   ├── slugs.mjs          # slugify + getCitySlug — plain JS, shared with scripts/ and the generator
│   ├── utils.ts           # cn, URL helpers, getLandmark(), search scoring
│   ├── analytics.ts       # trackIconEvent() (aggregate + per-city event), eventKey()
│   ├── regions.ts         # REGIONS display order, compareRegions()
│   ├── map-data.ts        # buildMapData(): markers, region presets, city list for /map
│   ├── svg-export.ts      # fetchSvg, svgToPng, downloadBlob (browser only)
│   ├── added-date.ts      # When an icon was added, from the changelog (sitemap + city page)
│   ├── attribution.ts     # iconAttribution(): escaped HTML + plain-text CC BY credit
│   ├── seo.ts             # Country-page indexing threshold
│   └── constants.ts       # Animation, grid (ICON_GRID_CLASS), hover, breakpoint, PNG_SIZE
└── types/                 # Icon, GridIcon, toGridIcon(), CountryCount

scripts/                   # Node build/maintenance scripts (see Commands)
└── fonts/                 # Instrument Sans TTF + OFL, used only by build-press-kit.mjs
public/
├── icons/                 # SVG files (naming: {country-code}-{city}.svg)
├── llms.txt               # Hand-maintained LLM-facing site summary (counts checked by validate:data)
├── icons.json             # GENERATED, gitignored (scripts/build-downloads.mjs)
├── city-icons.zip         # GENERATED, gitignored (scripts/build-downloads.mjs)
└── press/                 # GENERATED, gitignored (scripts/build-press-kit.mjs)

.github/ISSUE_TEMPLATE/    # City request issue form
```

## Commands

```bash
npm run dev              # Start dev server (Turbopack)
npm run build            # validate-data + build-downloads + build-press-kit, then next build (SSG)
npm run start            # Start production server
npm run lint             # ESLint CLI over the whole repo, scripts/ included
npm run validate:data    # Dataset validation (also gates npm run build)
npm run normalize:svgs   # Normalize/optimize public/icons — run after adding or editing SVGs
npm run build:downloads  # Regenerate public/icons.json + city-icons.zip (build runs this too)
npm run build:press      # Regenerate icons.json, then public/press/ (build runs this too)

node scripts/build-city-coordinates.mjs  # Regenerate src/data/coordinates.json — REQUIRED after adding icons
node scripts/build-world-basemap.mjs     # Regenerate src/components/map/world-land.ts — only when changing the basemap/crop
```

- `validate:data` fails on: duplicate `_id`, duplicate country/city URL slugs, `svgFilename` with no file, orphan SVGs, missing required fields (incl. `description`), a country using two filename prefixes, a `region` that doesn't match its file, a `category` outside the taxonomy, malformed changelog weeks, README badge or `public/llms.txt` counts drifting from the dataset.
- `normalize:svgs` rewrites `fill/stroke="black"` to `currentColor`, normalizes viewBox to `0 0 120 120` (uniform scale + center), runs SVGO. Idempotent.
- `build:downloads` output is deterministic (sorted entries, fixed zip mtimes) — re-running without dataset changes is byte-identical.

## Key Architecture

- **SSG:** All pages pre-rendered at build time via `generateStaticParams()`
- **dynamicParams=false:** Unknown slugs return proper 404 (not soft 404 with 200)
- **Server Components:** Default for pages and layout components; client components marked with `'use client'` only where there is state, effects or event handlers
- **Server→client boundary:** pages map full `Icon` records to slim `GridIcon` via `toGridIcon()` (`src/types/index.ts`) before passing lists to client components. `description` alone is ~108 KB across the dataset and must never be serialized into client props; `category` is also stripped (no client component reads it). Keep both server-side (metadata, JSON-LD, statistics, OG images). Shared helpers (`getIconUrl`, `getLandmark`, search) take `GridIcon`, so they work on both shapes.
- **Client islands only:** `CityPage`, `ContentPage` and the statistics/what's-new content are server components; interactivity lives in small client components (`IconActions`, `ClientHome`, `WorldMap`, `RoulettePage`, header/footer controls). Note the trade-off measured when CityPage moved to the server: page JS dropped ~1.8 kB, but the RSC payload carries the rendered tree, so gzipped HTML grew ~1.5 kB — don't move things server-side expecting smaller HTML.
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
  category: string;       // One of the taxonomy below (validate:data enforces it)
  description: string;    // Required; never send to client components
  symbolStory?: string;   // Why this symbol stands for the city; 200-900 chars when present
}
```

### `slug` — URL collision prevention

A city page URL is `/{slugify(country)}/{getCitySlug(icon)}`, where `getCitySlug()` (`src/lib/slugs.mjs`) returns `icon.slug ?? slugify(icon.city)`. When a city gets a **second** icon, the new entry MUST set an explicit `slug` (e.g. Hanoi's second icon uses `hanoi-temple-of-literature`, São Paulo's uses `sao-paulo-masp`) — otherwise both icons resolve to the same URL and one silently shadows the other. This caused a real production bug; `validate:data` now fails the build on duplicate slug pairs.

### Landmark names

Names are usually `"{City} {Landmark}"`. `getLandmark()` (`src/lib/utils.ts`) strips the city prefix — also the city without a trailing "City"/"Town" ("Ho Chi Minh Bến Thành Market" → "Bến Thành Market") — and is the single source for the page `<title>`, the "About the …" heading and search suggestions. Don't re-derive it inline.

### Category taxonomy

Consolidated set — `validate:data` rejects anything else; consolidate before adding one:
Landmarks, Culture, Buildings, Nature, Architecture, Religion (counts: /statistics).

## Adding New Icons

1. Add SVG to `public/icons/` named `{country-code}-{city}.svg`, using the ISO 3166-1 alpha-2 code — which must match the code already used for that country's files (e.g. Vietnam is `vn-`, not `vt-`; the UK is `gb-`). `validate:data` fails the build if a country's icons use more than one prefix. One deliberate exception: Palestine files are `ps-` and the coordinates script aliases `ps`→`il`, since GeoNames files Jerusalem under IL.
2. Run `npm run normalize:svgs` (currentColor, 120×120 viewBox, SVGO).
3. Add entry to the appropriate region file in `src/data/icons/` — `_id` is the highest across **all** region files + 1.
4. If the city already has an icon, set `slug` on the new entry (see Icon Data Structure) — the build fails on URL collisions otherwise.
5. Update `src/data/changelog.ts` (see Updating Changelog; use the object form for ambiguous cities).
6. Run `node scripts/build-city-coordinates.mjs` to regenerate `src/data/coordinates.json`. **If skipped, the build only prints a warning and the new city is silently missing from `/map`.**
7. Run `npm run validate:data` (also runs as part of `npm run build`).
8. If icon/country totals changed: update the README (badges, region table, and the counts in the intro — only the badges are checked) and the summary line in `public/llms.txt` — `validate:data` fails until the badges and llms.txt match.

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

- Static page plotting every icon as a dot on a minimalist world map, with region zoom presets and a no-JS city list. Pan/zoom over inline SVG — **no runtime map dependency**: `WorldMap.tsx` renders, `useMapViewport.ts` owns view state and gestures, `viewport.ts` is the pure geometry. Markers, region presets and the city list are built at build time by `buildMapData()` (`src/lib/map-data.ts`), which also spreads markers of cities with two icons so both stay clickable.
- **Coordinates** (`src/data/coordinates.json`, generated): GeoNames cities500 dump (CC BY 4.0), matched by ISO country code (from the `svgFilename` prefix) + normalized city name, highest population on ties. Every resolved coordinate is sanity-checked against per-country bounding boxes derived from the dump. Places below the 500-population cutoff (ancient sites, hamlets, romanization mismatches) live in an `OVERRIDES` table in `scripts/build-city-coordinates.mjs` — every override must cite its GeoNames record.
- **Basemap** (`src/components/map/world-land.ts`, generated): Natural Earth 1:110m "land" (public domain), equirectangular projection, cropped to latitudes [-56, 74] (drops Antarctica). Regenerate with `node scripts/build-world-basemap.mjs` only if changing the crop/detail.
- Icons with no coordinates entry are dropped from the map with a loud build-time console warning naming the cities and the fix.

## Static Artifacts

| Path | Produced by | Notes |
|------|-------------|-------|
| `/icons.json` | `scripts/build-downloads.mjs` | Machine-readable index (id, name, city, country, region, category, tags, svgFilename, absolute svgUrl/pageUrl). Gitignored build output. |
| `/city-icons.zip` | `scripts/build-downloads.mjs` | All SVGs + `ATTRIBUTION.txt`; linked from the footer ("Download all"). Deterministic output. Gitignored build output. |
| `/llms.txt` | checked in at `public/llms.txt` | Hand-maintained summary for LLM crawlers. The counts line is checked by `validate:data`; the rest (structure, license) is updated by hand. |
| `/manifest.webmanifest` | `src/app/manifest.ts` | Next.js serves it and injects `<link rel="manifest">` automatically. |
| `/press/*` | `scripts/build-press-kit.mjs` | Cover (PNG + SVG), Figma import sheet, `facts.json`, `README.txt`, `svgcities-press-kit.zip`, `svgcities-directory-kit.zip`. Reads `public/icons.json`, so it runs after `build-downloads`. Gitignored build output. |

## Code Conventions

- **Site constants:** absolute URLs via `absoluteUrl()`/`SITE_URL`, schema.org author/publisher via `STUDIO_ORG` (`src/lib/site.ts`).
- **Page metadata:** `pageMetadata({ path, title, description, … })` from `src/lib/metadata.ts`. The layout supplies authors/creator/publisher/formatDetection/metadataBase; `openGraph`/`twitter` are not deep-merged by Next, so `pageMetadata` restates them. Content pages that want explicit `index, follow` pass `robots: indexRobots()`.
- **JSON-LD:** render with `<JsonLd data={…} />` (adds `@context`); breadcrumbs with `breadcrumbList(trail)` and the visible `<Breadcrumbs trail={…} />` from the same `Crumb[]`.
- **Analytics:** icon interactions go through `trackIconEvent('ICON_DOWNLOAD', city)`; other events call `trackEvent` with the names listed under Analytics Events.
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
| `src/lib/site.ts` / `src/lib/metadata.ts` | Site constants; `pageMetadata`, `fitTitle`, `indexRobots` |
| `src/lib/slugs.mjs` | `slugify`/`getCitySlug` — the one copy, shared with scripts and the generator |
| `src/lib/utils.ts` | URL helpers, `getLandmark`, search scoring (re-exports the slug helpers) |
| `src/lib/constants.ts` | Animation, grid (`ICON_GRID_CLASS`), hover, breakpoint, `PNG_SIZE` |
| `src/data/coordinates.ts` | Coordinate lookup for `/map` + missing-coordinate detection |
| `next.config.ts` | Icon cache headers, redirects for renamed icon files |
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
- Titles go through `fitTitle()`: the first candidate that fits 60 characters including the ` | svgcities` suffix
- Country pages with fewer than 3 icons are `noindex, follow` and left out of the sitemap (`COUNTRY_INDEX_THRESHOLD`, `src/lib/seo.ts`)
- Before changing titles, descriptions or indexing, read `docs/seo-plan.md`

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

License & attribution: `LICENSE_PAGE_VISIT`, `ATTRIBUTION_COPIED` (license page and city-page credit line)

Press: `PRESS_LINK_CLICKED` (footer), `PRESS_KIT_DOWNLOAD_CLICKED`

## Press Kit & Attribution

- **`/press`** (`src/app/press/page.tsx`) lists project facts and links the generated assets in `public/press/`. The footer and sitemap link to it.
- **`scripts/build-press-kit.mjs`** builds a 1600×1000 cover (PNG + SVG) from 12 fixed featured icons, a labelled sheet of every icon for Figma import, `facts.json`, `README.txt`, and two ZIPs: the press kit (cover, sheet, facts, the 12 icons) and the directory kit (1200×800 preview + all icons, the format design directories ask for). The script throws if a featured filename disappears from the dataset.
- **Typography:** labels use the bundled `scripts/fonts/InstrumentSans.ttf` (OFL), outlined to paths with fontkit, so PNG rendering and SVG imports never fall back to system fonts. The cover and the press page header have no eyebrow label.
- **The Figma sheet is a plain SVG**, not a Figma component library — never describe it as a published Community file.
- **Credit line on city pages:** a successful SVG download, PNG download or SVG copy reveals a per-icon credit box (in `IconActions`; `AttributionSnippet` with text built by `iconAttribution()` from the canonical city URL). `fetchSvg()` (`src/lib/svg-export.ts`) rejects non-OK responses and bodies without an `<svg` root.
- **Outreach** pitches and submission records live in `outreach/`, which is local only: gitignored and excluded from deploys by `.vercelignore`. `outreach/<date>/publication-status.json` records what was actually sent or submitted and any replies. A record is not an earned link — check that the link is live (and whether it is `nofollow`) before counting it; confirmed links go into section 2 of `docs/seo-plan.md`.
