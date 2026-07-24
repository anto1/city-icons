#!/usr/bin/env node
/**
 * normalize-svgs.mjs
 *
 * Normalizes all SVGs in public/icons/:
 *   1. Rewrites fill="black" / stroke="black" to currentColor (themeable for
 *      downstream consumers; standalone files still render black because
 *      currentColor defaults to black inside an <img>-loaded SVG document).
 *   2. Normalizes any non-120x120 viewBox to "0 0 120 120" by uniformly
 *      scaling + centering the content inside a wrapper <g> (no distortion,
 *      no cropping).
 *   3. Optimizes with SVGO (preset-default, float precision 2, viewBox kept).
 *
 * Idempotent: re-running on already-normalized files is a no-op.
 * Usage: npm run normalize:svgs
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const ICONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
const TARGET_SIZE = 120;

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Hand-drawn line art in a 120x120 box: precision 2 (= 0.01 units)
          // is far below visible thresholds while cutting most of the bloat.
          convertPathData: { floatPrecision: 2 },
          cleanupNumericValues: { floatPrecision: 2 },
          // Transform precision stays higher so the cn-shanghai fit-scale
          // (120/116 = 1.03448...) is not coarsened.
          convertTransform: { floatPrecision: 4, transformPrecision: 5 },
        },
      },
    },
  ],
};

/**
 * If the viewBox is not "0 0 120 120", wrap the content in a <g> that
 * uniformly scales and centers it into the 120x120 box.
 */
function normalizeViewBox(svg, filename) {
  const viewBoxMatch = svg.match(/<svg[^>]*\bviewBox="([^"]+)"/);
  if (!viewBoxMatch) {
    throw new Error(`${filename}: missing viewBox`);
  }
  const [minX, minY, width, height] = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
  if (minX === 0 && minY === 0 && width === TARGET_SIZE && height === TARGET_SIZE) {
    return svg; // already normalized
  }

  console.log(`  ${filename}: viewBox "${viewBoxMatch[1]}" -> "0 0 ${TARGET_SIZE} ${TARGET_SIZE}" (scale + center)`);

  const scale = Math.min(TARGET_SIZE / width, TARGET_SIZE / height);
  const tx = (TARGET_SIZE - width * scale) / 2 - minX * scale;
  const ty = (TARGET_SIZE - height * scale) / 2 - minY * scale;
  const round = (n) => Number(n.toFixed(5));
  const transform = `translate(${round(tx)} ${round(ty)}) scale(${round(scale)})`;

  const openTagEnd = svg.indexOf('>', svg.indexOf('<svg')) + 1;
  const closeTagStart = svg.lastIndexOf('</svg>');
  let openTag = svg.slice(0, openTagEnd);
  const content = svg.slice(openTagEnd, closeTagStart);

  openTag = openTag
    .replace(/\bviewBox="[^"]+"/, `viewBox="0 0 ${TARGET_SIZE} ${TARGET_SIZE}"`)
    .replace(/\bwidth="[^"]+"/, `width="${TARGET_SIZE}"`)
    .replace(/\bheight="[^"]+"/, `height="${TARGET_SIZE}"`);

  return `${openTag}<g transform="${transform}">${content}</g></svg>`;
}

async function main() {
  const files = (await readdir(ICONS_DIR)).filter((f) => f.endsWith('.svg')).sort();
  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;

  for (const file of files) {
    const path = join(ICONS_DIR, file);
    const original = await readFile(path, 'utf8');
    totalBefore += Buffer.byteLength(original);

    // 1. Fix non-standard viewBox (uniform scale + center, no distortion).
    let svg = normalizeViewBox(original, file);

    // 2. Themeable colors. Done before SVGO because its convertColors plugin
    //    would rewrite "black" to "#000" first; currentColor is left alone.
    svg = svg
      .replaceAll('fill="black"', 'fill="currentColor"')
      .replaceAll('stroke="black"', 'stroke="currentColor"');

    // 3. SVGO optimization.
    svg = optimize(svg, { path, ...svgoConfig }).data;

    // Safety checks: never write out a file that lost its viewBox or shrank
    // to something implausible (guards against a destructive SVGO pass).
    if (!svg.includes(`viewBox="0 0 ${TARGET_SIZE} ${TARGET_SIZE}"`)) {
      throw new Error(`${file}: viewBox missing or wrong after optimization — not writing`);
    }
    if (Buffer.byteLength(svg) < 100) {
      throw new Error(`${file}: suspiciously small output — not writing`);
    }

    totalAfter += Buffer.byteLength(svg);
    if (svg !== original) {
      await writeFile(path, svg);
      changed++;
    }
  }

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  const pct = totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0';
  console.log(`\n${files.length} files processed, ${changed} written.`);
  console.log(`Total size: ${kb(totalBefore)} -> ${kb(totalAfter)} (-${pct}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
