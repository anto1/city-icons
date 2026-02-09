# City Icons

A collection of minimalist line-art SVG icons representing cities around the world. Each icon depicts an iconic landmark, symbol, or shape unique to a city.

**Live site:** [svgcities.com](https://svgcities.com)

## What You Can Do

- **Browse** 200+ city icons organized by country and region
- **Search** by city name, country, or region
- **Download** icons as clean, scalable SVG files
- **Copy** SVG code directly to clipboard
- **Share** direct links to individual city pages
- **Discover** random destinations with the City Roulette

---

## Architecture

### Stack

- **Next.js 15** with App Router
- **Static generation (SSG)** — all pages pre-rendered at build time
- **TypeScript** throughout
- **Tailwind CSS** for styling

### Key Design Decisions

| Aspect | Approach |
|--------|----------|
| **Icons** | Static SVG files in `/public/icons/`, served with 1-year cache headers. No inline SVG embedding in HTML. |
| **Icon data** | JSON files in `/src/data/icons/` organized by region. No SVG content in page payloads. |
| **Routing** | Dynamic routes: `/[country]` for country pages, `/[country]/[city]` for individual icons. |
| **SEO** | Server-rendered metadata and JSON-LD structured data. Crawlable internal links throughout. |
| **Performance** | Small HTML, lazy-loaded images, explicit dimensions to prevent layout shift. |

---

## SEO, Accessibility & Performance

### Semantic HTML
- Icon grids use `<ul>/<li>` list elements
- Proper landmarks: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`
- Breadcrumb navigation with `aria-label` and `aria-current`
- One `<h1>` per page with correct heading hierarchy

### SEO
- Unique `<title>` and `<meta description>` per page
- Absolute canonical URLs
- OpenGraph and Twitter Card metadata
- JSON-LD structured data (CollectionPage, CreativeWork, BreadcrumbList)
- XML sitemap with all routes

### Performance
- All pages statically generated
- SVG icons cached for 1 year (`Cache-Control: immutable`)
- No SVG content embedded in HTML — icons loaded as `<img>` assets
- Lazy loading for below-fold images

---

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Homepage
│   ├── [country]/            # Country listing pages
│   │   └── [city]/           # Individual city icon pages
│   ├── license/              # License information
│   ├── roulette/             # City Roulette feature
│   ├── layout.tsx            # Root layout with global metadata
│   └── sitemap.ts            # Dynamic sitemap generation
├── components/               # React components
│   ├── IconGrid.tsx          # Main icon grid (ul/li structure)
│   ├── CityPage.tsx          # Individual city page layout
│   ├── IconFooter.tsx        # Footer with country links
│   └── ...
├── data/
│   └── icons/                # Icon metadata by region (JSON)
│       ├── europe.json
│       ├── asia.json
│       └── ...
├── lib/                      # Utilities (slugify, URL helpers)
└── types/                    # TypeScript type definitions

public/
└── icons/                    # Static SVG files (228 icons)
    ├── de-berlin.svg
    ├── us-new-york.svg
    └── ...
```

---

## Contributing

### Adding Icons

1. Add the SVG file to `/public/icons/` using the naming convention: `{country-code}-{city-name}.svg`
2. Add metadata to the appropriate region file in `/src/data/icons/`
3. Ensure the icon follows the existing line-art style

### Code Changes

When modifying pages or components:

- **Preserve semantic HTML** — use proper elements (`nav`, `ul/li`, `article`, etc.)
- **Keep structured data valid** — test with [Google Rich Results](https://search.google.com/test/rich-results)
- **Maintain crawlable links** — use `<Link>` components, not JS-only navigation
- **Keep JSON-LD small** — avoid embedding large lists in structured data

---

## License

Icons are **free for personal and educational use**.  
Commercial use requires permission — contact [icons@partdirector.ch](mailto:icons@partdirector.ch).

---

Made by [Studio Partdirector](https://partdirector.ch)

*Last updated: December 2024*
