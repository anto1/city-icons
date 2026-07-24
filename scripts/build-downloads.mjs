// Build-time download artifacts. Run via `npm run build:downloads`;
// wired into `npm run build` so both files exist before `next build`
// copies public/ into the static output.
//
// Generates (both gitignored — build artifacts, not source):
// - public/city-icons.zip  All SVG icons plus a short ATTRIBUTION.txt.
//                          Linked from the site footer ("Download All").
// - public/icons.json      Machine-readable index of the full collection for
//                          external consumers, served at /icons.json. Each
//                          entry: id, name, city, country, region, category,
//                          tags, svgFilename, svgUrl (absolute), pageUrl
//                          (absolute). Top level: name, homepage, license,
//                          count, icons.
//
// Output is deterministic (sorted entries, fixed zip mtimes), so re-running
// without dataset changes produces byte-identical files.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDataDir = join(root, 'src', 'data', 'icons');
const iconsPublicDir = join(root, 'public', 'icons');
const baseUrl = 'https://svgcities.com';

// Keep in sync with `slugify` in src/lib/utils.ts (duplicated here because
// that file is TypeScript with path-alias imports, which plain Node can't
// load; if you change one, change the other).
// Mirrors getCitySlug() in src/lib/utils.ts.
function citySlug(icon) {
  return icon.slug ?? slugify(icon.city);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/đ/g, 'd')
    .replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Load all region files, sorted by numeric id for stable output
const icons = [];
for (const file of readdirSync(iconsDataDir).filter((f) => f.endsWith('.json')).sort()) {
  icons.push(...JSON.parse(readFileSync(join(iconsDataDir, file), 'utf8')));
}
icons.sort((a, b) => Number(a._id) - Number(b._id));

// --- public/icons.json -----------------------------------------------------

const index = {
  name: 'City Icons Collection',
  homepage: baseUrl,
  license: 'CC BY 4.0 (icons) — see /license',
  count: icons.length,
  icons: icons.map((icon) => ({
    id: icon._id,
    name: icon.name,
    city: icon.city,
    country: icon.country,
    region: icon.region,
    category: icon.category,
    tags: icon.tags,
    svgFilename: icon.svgFilename,
    svgUrl: `${baseUrl}/icons/${icon.svgFilename}`,
    pageUrl: `${baseUrl}/${slugify(icon.country)}/${citySlug(icon)}`,
  })),
};
writeFileSync(join(root, 'public', 'icons.json'), JSON.stringify(index, null, 2) + '\n');

// --- public/city-icons.zip -------------------------------------------------

const attribution = [
  'City Icons Collection',
  `${icons.length} minimalist SVG city icons by Studio Partdirector`,
  '',
  `Website: ${baseUrl}`,
  `License: CC BY 4.0 — see ${baseUrl}/license`,
  'Attribution: Studio Partdirector (https://partdirector.ch)',
  '',
].join('\n');

// Fixed mtime keeps the zip byte-identical across runs (fflate defaults to
// the current time otherwise). Level 9: ~295 small files, still instant.
const FIXED_MTIME = new Date('2020-01-01T00:00:00Z');
const entries = {
  'ATTRIBUTION.txt': [new TextEncoder().encode(attribution), { mtime: FIXED_MTIME }],
};
for (const file of readdirSync(iconsPublicDir).filter((f) => f.endsWith('.svg')).sort()) {
  entries[`icons/${file}`] = [readFileSync(join(iconsPublicDir, file)), { mtime: FIXED_MTIME }];
}
const zipped = zipSync(entries, { level: 9, mtime: FIXED_MTIME });
writeFileSync(join(root, 'public', 'city-icons.zip'), zipped);

console.log(
  `Wrote public/icons.json (${icons.length} icons) and public/city-icons.zip (${(zipped.length / 1024).toFixed(0)} KB, ${Object.keys(entries).length} files).`
);
