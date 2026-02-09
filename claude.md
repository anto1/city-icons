# City Icons

Minimalist SVG icon collection showcasing 265 cities worldwide. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS 4.

**Live site:** https://cities.partdirector.ch

## Tech Stack

- **Framework:** Next.js 15 (App Router, Static Site Generation)
- **Frontend:** React 19.1, TypeScript 5
- **Styling:** Tailwind CSS 4, PostCSS
- **UI:** Radix UI (Dialog), Lucide React icons, Sonner (toasts)
- **Analytics:** Fathom Client
- **Fonts:** Instrument Sans (Fontsource)
- **Deploy:** Vercel

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (all icons)
│   ├── layout.tsx         # Root layout, metadata (dynamic city count), JSON-LD, ThemeProvider
│   ├── [country]/         # Dynamic country pages (dynamicParams=false)
│   │   └── [city]/        # Individual city pages (dynamicParams=false)
│   │       └── opengraph-image.tsx  # Dynamic OG image per city
│   ├── roulette/          # City Roulette feature
│   ├── faq/               # FAQ page with structured data
│   ├── statistics/        # Collection statistics page
│   ├── whats-new/         # Weekly changelog of new icons
│   ├── license/           # License page
│   └── sitemap.ts         # XML sitemap generation
├── components/            # React components
│   ├── IconGrid.tsx       # Main grid with hover effects
│   ├── SearchBar.tsx      # Search with autocomplete
│   ├── IconModal.tsx      # Download/copy/share modal
│   ├── CityPage.tsx       # City page layout
│   ├── ThemeProvider.tsx  # Dark mode context provider
│   ├── ThemeToggle.tsx    # Light/dark mode toggle button
│   └── ui/                # Shadcn/Radix UI components
├── data/
│   ├── icons/             # Region JSON files (europe.json, asia.json, etc.)
│   └── changelog.ts       # Weekly icon additions changelog
├── hooks/                 # Custom hooks (useIconSearch, useKeyboardShortcuts)
├── lib/
│   ├── utils.ts           # Slug generation, URL helpers
│   └── constants.ts       # Animation, grid, breakpoint constants
└── types/                 # TypeScript interfaces

public/
└── icons/                 # 265 SVG files (naming: {country-code}-{city}.svg)
```

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build (SSG)
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Key Architecture

- **SSG:** All pages pre-rendered at build time via `generateStaticParams()`
- **dynamicParams=false:** Unknown slugs return proper 404 (not soft 404 with 200)
- **Server Components:** Default for pages; client components marked with `'use client'`
- **SVG Loading:** Icons served as static files with 1-year cache headers
- **Dynamic Routes:** `/[country]` and `/[country]/[city]` for country/city pages
- **OG Images:** Dynamic per-city OG images via `opengraph-image.tsx` using `ImageResponse`
- **Sitemap:** Dates derived from `changelog.ts` (not identical build-time dates)

## Icon Data Structure

Icons defined in `src/data/icons/*.json`:

```typescript
interface IconData {
  _id: string;
  name: string;           // Display name (e.g., "Barcelona Sagrada Familia")
  city: string;           // City name
  country: string;        // Country name
  category: string;       // Category (e.g., "Landmarks")
  tags: string[];         // Search tags
  svgFilename: string;    // File reference (e.g., "es-barcelona.svg")
  description?: string;   // Optional description
  region: string;         // Geographic region
}
```

## Adding New Icons

1. Add SVG to `public/icons/` (naming: `{country-code}-{city}.svg`)
2. Add entry to appropriate region file in `src/data/icons/` (increment `_id` from the highest across all files)
3. Update `src/data/changelog.ts` with the new cities for the current week
4. Rebuild to generate static pages
5. Update city count in this file (layout.tsx metadata count is automatic)

## Updating Changelog

Edit `src/data/changelog.ts` and add a new entry at the top:

```typescript
{
  week: '2025-W03',
  date: 'January 13-17, 2025',
  cities: ['New City 1', 'New City 2'],
  description: 'Optional description of the batch',
}
```

## Code Conventions

- **TypeScript:** Strict mode, interfaces for all props
- **Components:** Server by default, `'use client'` for interactivity
- **Styling:** Tailwind utility classes, responsive via SM/MD/LG/XL breakpoints
- **HTML:** Semantic elements, ARIA attributes, one `<h1>` per page, `<main>` in each page (not layout)
- **State:** React hooks only (useState, useCallback, useMemo)

## Important Files

| File | Purpose |
|------|---------|
| `src/data/index.ts` | Aggregates all region JSON into single array |
| `src/lib/constants.ts` | Grid columns, animation timings, breakpoints |
| `next.config.ts` | Cache headers, SSG config |
| `src/app/layout.tsx` | Global metadata, JSON-LD structured data |
| `src/app/[country]/[city]/opengraph-image.tsx` | Dynamic OG image generation per city |
| `src/app/sitemap.ts` | XML sitemap with changelog-based dates |

## Environment Variables

```
NEXT_PUBLIC_FATHOM_SITE_ID=xxxxx  # Fathom analytics
```

## Dark Mode

- Toggle in top-right corner of all pages
- Persisted in localStorage
- Respects system preference on first visit
- SVG icons use `dark:invert` for visibility
- No flash of wrong theme (inline script in `<head>`)

## SEO

- `<link rel="sitemap">` in root layout `<head>`
- `og:type` is `website` on homepage, `article` on city pages
- Each city page gets a unique OG image (PNG generated at build time via `ImageResponse`)
- Sitemap `<lastmod>` dates vary per page based on changelog entries
- `dynamicParams=false` ensures unknown routes return HTTP 404 (not soft 404)
- Metadata description city count is dynamic via `iconData.length` (no manual updates needed)

## JSON-LD Structured Data

Each page type has specific schema.org structured data:

| Page | Schema Type(s) |
|------|---------------|
| Layout (global) | `WebSite` with `SearchAction` |
| Homepage | `CollectionPage` |
| Country pages | `CollectionPage` + `ItemList` + `BreadcrumbList` |
| City pages | `CreativeWork` + `ImageObject` + `Place` + `BreadcrumbList` |
| FAQ | `FAQPage` |
| Statistics | `WebPage` + `BreadcrumbList` |
| What's New | `WebPage` + `BreadcrumbList` |
| License | `WebPage` + `CreativeWork` + `BreadcrumbList` |
| Roulette | `WebApplication` + `Offer` + `BreadcrumbList` |

## Analytics Events

Tracked via Fathom: `ICON_CLICK`, `ICON_DOWNLOAD`, `ICON_COPY`, `ICON_SHARE`, `SEARCH_PERFORMED`, `ROULETTE_SPIN_STARTED`, `THEME_CHANGED_LIGHT`, `THEME_CHANGED_DARK`
