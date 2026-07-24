// Regenerates src/app/favicon.ico from src/app/icon.svg.
//
// The project shipped with create-next-app's default favicon.ico (the Vercel
// triangle) long after icon.svg was replaced with the real mark, so browsers
// that prefer .ico over SVG showed the wrong logo. Run this whenever the mark
// in icon.svg changes:
//
//   node scripts/build-favicon.mjs
//
// The .ico embeds PNG payloads (valid since Windows Vista and supported by
// every current browser) at the sizes browsers actually ask for. Rendering is
// forced to the light-theme colour: .ico cannot carry a media query, so it is
// always the black mark — icon.svg is the one that adapts to dark mode.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'src', 'app', 'icon.svg');
const target = join(root, 'src', 'app', 'favicon.ico');

const SIZES = [16, 32, 48];

// Strip the dark-mode block so rasterisation is deterministic: sharp resolves
// `currentColor` against no scheme, and we always want the black mark here.
const svg = readFileSync(source, 'utf8')
  .replace(/@media\(prefers-color-scheme:dark\)\{[^}]*\}\}?/g, '')
  .replace(/fill="currentColor"/g, 'fill="#000000"');

const pngs = await Promise.all(
  SIZES.map((size) =>
    sharp(Buffer.from(svg), { density: 384 })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  )
);

// ICO container: 6-byte header, then one 16-byte directory entry per image,
// then the PNG payloads. https://en.wikipedia.org/wiki/ICO_(file_format)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(SIZES.length, 4);

let offset = 6 + SIZES.length * 16;
const entries = SIZES.map((size, index) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette size — 0 for PNG
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngs[index].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += pngs[index].length;
  return entry;
});

writeFileSync(target, Buffer.concat([header, ...entries, ...pngs]));
console.log(
  `Wrote ${target.replace(root + '/', '')} — ${SIZES.join('/')}px, ${
    Buffer.concat([header, ...entries, ...pngs]).length
  } bytes`
);
