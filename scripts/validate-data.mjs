// Build-time dataset validation. Run via `npm run validate:data`;
// wired into `npm run build` so a broken dataset fails the build.
//
// Checks:
// - duplicate `_id` across all region files
// - duplicate `slugify(country)/slugify(city)` pairs (URL collisions)
// - `svgFilename` values with no matching file in public/icons
// - orphan SVGs in public/icons not referenced by the dataset
// - missing required fields
// - a country whose icons use more than one filename prefix
// - a `region` that does not match the region file the entry lives in
// - a `category` outside the consolidated taxonomy
// - changelog weeks not in YYYY-Www format
// - README badge and public/llms.txt counts drifting from the dataset

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCitySlug, slugify } from '../src/lib/slugs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDataDir = join(root, 'src', 'data', 'icons');
const iconsPublicDir = join(root, 'public', 'icons');

const REQUIRED_FIELDS = ['_id', 'name', 'city', 'country', 'category', 'tags', 'svgFilename', 'region', 'description'];

// Consolidated taxonomy (see CLAUDE.md) — consolidate before adding a category.
const CATEGORIES = new Set(['Landmarks', 'Culture', 'Buildings', 'Nature', 'Architecture', 'Religion']);

const errors = [];

// Load all region files
const icons = [];
for (const file of readdirSync(iconsDataDir).filter((f) => f.endsWith('.json'))) {
  const entries = JSON.parse(readFileSync(join(iconsDataDir, file), 'utf8'));
  for (const [index, entry] of entries.entries()) {
    icons.push({ entry, file, source: `${file}[${index}]` });
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

// symbolStory is optional, but when present it has to be a real paragraph:
// too short and it says nothing, too long and it stops being a caption.
const SYMBOL_STORY_MIN = 200;
const SYMBOL_STORY_MAX = 900;
for (const { entry, source } of icons) {
  const story = entry.symbolStory;
  if (story === undefined) continue;
  const label = `${source} (${entry.name ?? entry._id ?? 'unknown'})`;
  if (typeof story !== 'string' || story.trim() === '') {
    errors.push(`${label}: "symbolStory" must be a non-empty string when present`);
    continue;
  }
  const length = story.trim().length;
  if (length < SYMBOL_STORY_MIN || length > SYMBOL_STORY_MAX) {
    errors.push(`${label}: "symbolStory" is ${length} characters, expected ${SYMBOL_STORY_MIN}-${SYMBOL_STORY_MAX}`);
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
  // An explicit `slug` overrides the slugified city name so cities with
  // multiple icons still get unique URLs (getCitySlug in src/lib/slugs.mjs).
  const slug = `${slugify(entry.country ?? '')}/${getCitySlug({ city: entry.city ?? '', slug: entry.slug })}`;
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

// Every icon of a country must share one filename prefix. Catches the class of
// bug that produced `vt-hanoi.svg` (Vietnam is `vn-`) and `uk-liverpool.svg`
// (the UK's other icons are `gb-`), where a stray prefix silently breaks the
// country-code lookup in scripts/build-city-coordinates.mjs.
const prefixesByCountry = new Map();
for (const { entry, source } of icons) {
  if (typeof entry.svgFilename !== 'string' || !entry.country) continue;
  const prefix = entry.svgFilename.split('-')[0];
  if (!prefixesByCountry.has(entry.country)) prefixesByCountry.set(entry.country, new Map());
  const seen = prefixesByCountry.get(entry.country);
  if (!seen.has(prefix)) seen.set(prefix, source);
}
for (const [country, seen] of prefixesByCountry) {
  if (seen.size > 1) {
    const detail = [...seen].map(([prefix, source]) => `"${prefix}-" (${source})`).join(' and ');
    errors.push(`${country} uses more than one filename prefix: ${detail} — pick the ISO 3166-1 alpha-2 code and rename the others`);
  }
}

// The region file is the source of truth for grouping; the `region` field is
// what the site reads. They must agree ("Middle East" lives in middle-east.json).
for (const { entry, file, source } of icons) {
  if (typeof entry.region === 'string' && `${slugify(entry.region)}.json` !== file) {
    errors.push(`${source} (${entry.name}): region "${entry.region}" does not match its file ${file}`);
  }
}

for (const { entry, source } of icons) {
  if (typeof entry.category === 'string' && !CATEGORIES.has(entry.category)) {
    errors.push(`${source} (${entry.name}): category "${entry.category}" is not one of ${[...CATEGORIES].join(', ')}`);
  }
}

// weekToDate() throws on a malformed week; catch it here with a clearer message
const changelogSource = readFileSync(join(root, 'src', 'data', 'changelog.ts'), 'utf8');
for (const [, week] of changelogSource.matchAll(/^\s*week: '([^']*)'/gm)) {
  if (!/^\d{4}-W\d{2}$/.test(week)) {
    errors.push(`src/data/changelog.ts: week "${week}" is not in YYYY-Www format`);
  }
}

// README badges and public/llms.txt quote the totals; they must match the dataset
const iconCount = icons.length;
const countryCount = new Set(icons.map(({ entry }) => entry.country)).size;
const cityCount = new Set(icons.map(({ entry }) => `${entry.city}|${entry.country}`)).size;
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const iconBadge = readme.match(/icons-(\d+)-orange/);
const countryBadge = readme.match(/countries-(\d+)-blue/);
if (iconBadge && Number(iconBadge[1]) !== iconCount) {
  errors.push(`README.md icon badge says ${iconBadge[1]}, dataset has ${iconCount} — update README.md`);
}
if (countryBadge && Number(countryBadge[1]) !== countryCount) {
  errors.push(`README.md country badge says ${countryBadge[1]}, dataset has ${countryCount} — update README.md`);
}

const llms = readFileSync(join(root, 'public', 'llms.txt'), 'utf8');
const llmsCounts = llms.match(/(\d+) minimalist SVG line-art icons of (\d+) cities in (\d+) countries/);
if (!llmsCounts) {
  errors.push('public/llms.txt: summary line "N minimalist SVG line-art icons of N cities in N countries" not found');
} else {
  const [, llmsIcons, llmsCities, llmsCountries] = llmsCounts.map(Number);
  if (llmsIcons !== iconCount || llmsCities !== cityCount || llmsCountries !== countryCount) {
    errors.push(
      `public/llms.txt says ${llmsIcons} icons / ${llmsCities} cities / ${llmsCountries} countries, ` +
        `dataset has ${iconCount} / ${cityCount} / ${countryCount} — update public/llms.txt`
    );
  }
}

if (errors.length > 0) {
  console.error(`Dataset validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`Dataset validation passed: ${iconCount} icons, ${cityCount} cities, ${countryCount} countries, ${svgFiles.size} SVG files.`);
