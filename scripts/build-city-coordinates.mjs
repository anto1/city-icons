// Generate src/data/coordinates.json — one [lat, lng] pair per icon _id.
//
// Run via `node scripts/build-city-coordinates.mjs` after adding new icons.
// The map page (/map) skips icons that have no entry here (with a build-time
// warning), so regenerate this file whenever src/data/icons/*.json changes.
//
// Coordinate source: GeoNames cities500 dump (https://www.geonames.org/,
// licensed CC BY 4.0). Icons are matched by ISO country code (taken from the
// svgFilename prefix) plus normalized city name, preferring the highest
// population entry on ties. A small override table covers places that are not
// in cities500 (ancient sites, hamlets, romanization differences); every
// override cites the GeoNames record it was taken from.
//
// The dump is downloaded to node_modules/.cache/geonames/ on first run.
// Set GEONAMES_CITIES500=/path/to/cities500.txt to use an existing copy.
//
// Sanity check: every resolved coordinate (including overrides) is verified
// against per-country bounding boxes derived from the dump itself, so a bad
// match cannot silently place a city in the wrong country/ocean.

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const iconsDataDir = join(root, 'src', 'data', 'icons');
const outFile = join(root, 'src', 'data', 'coordinates.json');

// --- Country-code fixes (svgFilename prefix -> ISO 3166-1 alpha-2 used by GeoNames)
const CC_ALIASES = {
  ps: 'il', // Jerusalem is filed under IL in GeoNames
};

// --- Overrides for places missing from cities500. Values copied verbatim from
// the cited GeoNames records (per-country dumps, download.geonames.org/export/dump/).
const OVERRIDES = {
  'sd|meroe': {
    lat: 16.93829, lng: 33.74881,
    source: 'GeoNames 10346809 "Pyramids of Meroe" (S.PYRS, SD.txt)',
  },
  'jp|shirakawago': {
    lat: 36.2569, lng: 136.9064,
    source: 'GeoNames 6621343 "Shirakawa-go" (P.PPL, Gifu, JP.txt)',
  },
  'kz|schuchinsk': {
    // Icon uses the German-style romanization "Schuchinsk"; GeoNames spells it
    // "Shchuchinsk" (Щучинск).
    lat: 52.93592, lng: 70.18895,
    source: 'GeoNames 1519244 "Shchuchinsk" (P.PPLA2, KZ.txt)',
  },
  'mm|bagan': {
    lat: 21.17264, lng: 94.86154,
    source: 'GeoNames 1302638 "Pagan" [Bagan] (P.PPL, MM.txt)',
  },
  'nl|demeije': {
    lat: 52.12167, lng: 4.79306,
    source: 'GeoNames 2750997 "Meije" (P.PPL, hamlet near Bodegraven, NL.txt)',
  },
};

// --- Load the GeoNames dump ------------------------------------------------
async function loadDump() {
  const envPath = process.env.GEONAMES_CITIES500;
  if (envPath) {
    if (!existsSync(envPath)) {
      throw new Error(`GEONAMES_CITIES500 points to a missing file: ${envPath}`);
    }
    return readFileSync(envPath, 'utf8');
  }
  const cacheDir = join(root, 'node_modules', '.cache', 'geonames');
  const cached = join(cacheDir, 'cities500.txt');
  if (!existsSync(cached)) {
    console.log('Downloading GeoNames cities500.zip (~10 MB)...');
    mkdirSync(cacheDir, { recursive: true });
    const zipPath = join(cacheDir, 'cities500.zip');
    const res = await fetch('https://download.geonames.org/export/dump/cities500.zip');
    if (!res.ok) throw new Error(`GeoNames download failed: HTTP ${res.status}`);
    writeFileSync(zipPath, Buffer.from(await res.arrayBuffer()));
    execSync(`unzip -o -q ${JSON.stringify(zipPath)} cities500.txt -d ${JSON.stringify(cacheDir)}`);
  }
  return readFileSync(cached, 'utf8');
}

// Normalize a place name for matching: strip accents + non-alphanumerics.
function norm(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase();
}

const dump = await loadDump();

// Build lookup: "cc|normname" -> best (highest population) record.
// Also collect per-country bounding boxes for the sanity check.
const index = new Map();
const countryBounds = new Map();
for (const line of dump.split('\n')) {
  if (!line) continue;
  const cols = line.split('\t');
  const cc = cols[8].toLowerCase();
  const lat = Number(cols[4]);
  const lng = Number(cols[5]);
  const pop = Number(cols[14]) || 0;

  const bounds = countryBounds.get(cc) ?? { minLat: 90, maxLat: -90, minLng: 180, maxLng: -180 };
  bounds.minLat = Math.min(bounds.minLat, lat);
  bounds.maxLat = Math.max(bounds.maxLat, lat);
  bounds.minLng = Math.min(bounds.minLng, lng);
  bounds.maxLng = Math.max(bounds.maxLng, lng);
  countryBounds.set(cc, bounds);

  const names = [cols[1], cols[2], ...(cols[3] ? cols[3].split(',') : [])];
  for (const name of names) {
    const key = `${cc}|${norm(name)}`;
    const prev = index.get(key);
    if (!prev || pop > prev.pop) {
      index.set(key, { lat, lng, pop, name: cols[1] });
    }
  }
}

// --- Resolve every icon ----------------------------------------------------
const icons = readdirSync(iconsDataDir)
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(readFileSync(join(iconsDataDir, f), 'utf8')));

const coords = {};
const errors = [];
let overrideCount = 0;

for (const icon of icons) {
  const rawCc = icon.svgFilename.split('-')[0];
  const cc = CC_ALIASES[rawCc] ?? rawCc;
  const cityKey = `${cc}|${norm(icon.city)}`;
  // Synthetic disambiguation suffixes like "São Paulo (MASP)" fall back to the
  // base city name.
  const baseKey = `${cc}|${norm(icon.city.replace(/\s*\(.*\)\s*$/, ''))}`;

  let lat;
  let lng;
  const override = OVERRIDES[cityKey] ?? OVERRIDES[baseKey];
  if (override) {
    ({ lat, lng } = override);
    overrideCount += 1;
  } else {
    const match = index.get(cityKey) ?? index.get(baseKey);
    if (!match) {
      errors.push(`no match for ${icon.city} (${icon.country}, cc=${cc}) — add an OVERRIDES entry with a cited source`);
      continue;
    }
    ({ lat, lng } = match);
  }

  // Sanity: the coordinate must fall inside (a 1° margin around) the bounding
  // box of all GeoNames cities in the icon's country.
  const bounds = countryBounds.get(cc);
  if (!bounds) {
    errors.push(`no GeoNames entries at all for country code "${cc}" (${icon.city})`);
    continue;
  }
  const margin = 1;
  if (
    lat < bounds.minLat - margin || lat > bounds.maxLat + margin ||
    lng < bounds.minLng - margin || lng > bounds.maxLng + margin
  ) {
    errors.push(
      `${icon.city} (${cc}) resolved to ${lat},${lng} — outside ${cc} bounds ` +
      `[${bounds.minLat}..${bounds.maxLat}, ${bounds.minLng}..${bounds.maxLng}]`
    );
    continue;
  }

  coords[icon._id] = [Number(lat.toFixed(4)), Number(lng.toFixed(4))];
}

if (errors.length > 0) {
  console.error(`Coordinate resolution failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

const output = {
  $comment:
    'Generated by scripts/build-city-coordinates.mjs — do not edit by hand. ' +
    'Coordinates from GeoNames (https://www.geonames.org/, CC BY 4.0), keyed by icon _id as [lat, lng].',
  coords: Object.fromEntries(
    Object.entries(coords).sort(([a], [b]) => Number(a) - Number(b))
  ),
};
writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`);
console.log(
  `Wrote ${Object.keys(coords).length}/${icons.length} coordinates ` +
  `(${overrideCount} from overrides) to src/data/coordinates.json`
);
