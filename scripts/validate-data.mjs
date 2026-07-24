// Build-time dataset validation. Run via `npm run validate:data`;
// wired into `npm run build` so a broken dataset fails the build.
//
// Checks:
// - duplicate `_id` across all region files
// - duplicate `slugify(country)/slugify(city)` pairs (URL collisions)
// - `svgFilename` values with no matching file in public/icons
// - orphan SVGs in public/icons not referenced by the dataset
// - missing required fields
// - README icon/country badge counts drifting from the dataset

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDataDir = join(root, 'src', 'data', 'icons');
const iconsPublicDir = join(root, 'public', 'icons');

// Keep in sync with `slugify` in src/lib/utils.ts (duplicated here because
// that file is TypeScript with path-alias imports, which plain Node can't
// load; if you change one, change the other).
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

const REQUIRED_FIELDS = ['_id', 'name', 'city', 'country', 'category', 'tags', 'svgFilename', 'region'];

const errors = [];

// Load all region files
const icons = [];
for (const file of readdirSync(iconsDataDir).filter((f) => f.endsWith('.json'))) {
  const entries = JSON.parse(readFileSync(join(iconsDataDir, file), 'utf8'));
  for (const [index, entry] of entries.entries()) {
    icons.push({ entry, source: `${file}[${index}]` });
  }
}

// Missing required fields
for (const { entry, source } of icons) {
  for (const field of REQUIRED_FIELDS) {
    const value = entry[field];
    const missing = field === 'tags'
      ? !Array.isArray(value) || value.length === 0
      : typeof value !== 'string' || value.trim() === '';
    if (missing) {
      errors.push(`${source} (${entry.name ?? entry._id ?? 'unknown'}): missing or empty required field "${field}"`);
    }
  }
}

// Duplicate _id
const seenIds = new Map();
for (const { entry, source } of icons) {
  const prev = seenIds.get(entry._id);
  if (prev) {
    errors.push(`duplicate _id "${entry._id}": ${prev} and ${source}`);
  } else {
    seenIds.set(entry._id, source);
  }
}

// Duplicate country/city slug pairs (would collide on the same URL)
const seenSlugs = new Map();
for (const { entry, source } of icons) {
  const slug = `${slugify(entry.country ?? '')}/${slugify(entry.city ?? '')}`;
  const prev = seenSlugs.get(slug);
  if (prev) {
    errors.push(`duplicate slug "/${slug}": ${prev} and ${source}`);
  } else {
    seenSlugs.set(slug, source);
  }
}

// svgFilename must exist in public/icons; every SVG must be referenced
const svgFiles = new Set(
  readdirSync(iconsPublicDir).filter((f) => !f.startsWith('.'))
);
const referenced = new Set();
for (const { entry, source } of icons) {
  if (typeof entry.svgFilename !== 'string') continue;
  referenced.add(entry.svgFilename);
  if (!svgFiles.has(entry.svgFilename)) {
    errors.push(`${source} (${entry.name}): svgFilename "${entry.svgFilename}" not found in public/icons`);
  }
}
for (const file of svgFiles) {
  if (!referenced.has(file)) {
    errors.push(`orphan SVG public/icons/${file} is not referenced by any dataset entry`);
  }
}

// README badge counts must match the dataset
const iconCount = icons.length;
const countryCount = new Set(icons.map(({ entry }) => entry.country)).size;
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const iconBadge = readme.match(/icons-(\d+)-orange/);
const countryBadge = readme.match(/countries-(\d+)-blue/);
if (iconBadge && Number(iconBadge[1]) !== iconCount) {
  errors.push(`README.md icon badge says ${iconBadge[1]}, dataset has ${iconCount} — update README.md`);
}
if (countryBadge && Number(countryBadge[1]) !== countryCount) {
  errors.push(`README.md country badge says ${countryBadge[1]}, dataset has ${countryCount} — update README.md`);
}

if (errors.length > 0) {
  console.error(`Dataset validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Dataset validation passed: ${iconCount} icons, ${countryCount} countries, ${svgFiles.size} SVG files.`);
