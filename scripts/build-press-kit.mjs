import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import sharp from 'sharp';
import { openSync } from 'fontkit';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(readFileSync(join(root, 'public/icons.json'), 'utf8'));
const output = join(root, 'public/press');
mkdirSync(output, { recursive: true });
const filenames = ['fr-paris.svg', 'gb-london.svg', 'pt-lisbon.svg', 'pt-porto.svg',
  'it-rome.svg', 'gr-athens.svg', 'eg-cairo.svg', 'nl-amsterdam.svg',
  'it-venice.svg', 'cz-prague.svg', 'us-new-orleans.svg', 'pt-barcelos.svg'];
const selected = filenames.map(filename => {
  const icon = index.icons.find(item => item.svgFilename === filename);
  if (!icon) throw new Error(`Missing press icon: ${filename}`);
  return icon;
});
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;'}[c]));
const artwork = (icon, x, y, size) => {
  const source = readFileSync(join(root, 'public/icons', icon.svgFilename), 'utf8');
  const inner = source.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `<g id="${esc(icon.svgFilename.replace('.svg', ''))}" transform="translate(${x} ${y}) scale(${size / 120})" color="#172321">${inner}</g>`;
};
// Outline the bundled website font so SVG imports and PNG builds never fall back to system fonts.
const instrumentSans = openSync(join(root, 'scripts/fonts/InstrumentSans.ttf'));
const fonts = new Map([400, 700].map(weight => [weight, instrumentSans.getVariation({ wght: weight, wdth: 100 })]));
const label = (value, x, y, size = 22, fill = '#172321', weight = 400) => {
  const font = fonts.get(weight);
  const run = font.layout(String(value));
  let cursor = 0;
  const paths = run.glyphs.map((glyph, i) => {
    const position = run.positions[i];
    const path = `<path transform="translate(${cursor + position.xOffset} ${position.yOffset})" d="${glyph.path.toSVG()}"/>`;
    cursor += position.xAdvance;
    return path;
  }).join('');
  return `<g aria-label="${esc(value)}" fill="${fill}" transform="translate(${x} ${y}) scale(${size / font.unitsPerEm} ${-size / font.unitsPerEm})">${paths}</g>`;
};
const svg = (width, height, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;

// Editable vectors use the original artwork, not a bitmap or a new interpretation.
const cover = svg(1600, 1000,
  '<rect width="1600" height="1000" fill="#f5f3ec"/>' +
  label('A world of city icons.', 72, 144, 82, '#172321', 700) +
  label(`${index.count} line art icons. SVG + PNG. CC BY 4.0.`, 76, 202, 28) +
  selected.map((icon, i) => {
    const x = 80 + (i % 6) * 248, y = 310 + Math.floor(i / 6) * 280;
    return artwork(icon, x + 25, y, 144) + label(icon.city, x, y + 188, 23, '#172321', 700) + label(icon.country, x, y + 219, 18, '#5d6963');
  }).join('') + label('svgcities.com', 76, 945, 28) + label('Artwork by Studio Partdirector • Attribution required', 838, 945, 20));
writeFileSync(join(output, 'svgcities-cover.svg'), cover);
await sharp(Buffer.from(cover)).png().toFile(join(output, 'svgcities-cover.png'));

// A single labelled sheet that can be imported into Figma; it is not a native component library.
const columns = 8, cell = 200, height = 220 + Math.ceil(index.count / columns) * cell;
const sheet = svg(1600, height,
  `<rect width="1600" height="${height}" fill="white"/>` +
  label('SVG Cities — editable vector sheet', 40, 65, 40, '#172321', 700) +
  label('Studio Partdirector / svgcities.com / CC BY 4.0 — attribution required', 40, 110, 22) +
  index.icons.map((icon, i) => {
    const x = (i % columns) * cell + 20, y = 180 + Math.floor(i / columns) * cell;
    return artwork(icon, x + 20, y, 120) + label(icon.city, x, y + 148, 15) + label(icon.country, x, y + 172, 12, '#5d6963');
  }).join(''));
writeFileSync(join(output, 'svgcities-figma-import.svg'), sheet);

const facts = {
  name: 'SVG Cities', website: 'https://svgcities.com', creator: 'Studio Partdirector',
  creatorWebsite: 'https://partdirector.ch', contact: 'icons@partdirector.ch',
  icons: index.count, countriesAndTerritories: new Set(index.icons.map(i => i.country)).size,
  formats: ['SVG', 'PNG (512×512 export on the website)'],
  artworkLicense: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  shortDescription: 'Free line art city icons by Studio Partdirector. Browse the world, download SVG or PNG, and credit the artwork.',
  description: `SVG Cities is a collection of ${index.count} line art icons representing cities around the world, created by Studio Partdirector. Browse by city, country or region, explore an interactive map, or discover a destination with City Roulette. Download an individual SVG or PNG, copy SVG markup, or download the full SVG collection. The artwork is released under CC BY 4.0: credit the creator, link to the license and indicate changes.`,
  communityDiscussion: {
    url: "https://www.reddit.com/r/Cities/comments/1p80aee/made_200_minimalist_city_icons_roast_my_choices/",
    title: "Made 200+ minimalist city icons. Roast my choices.",
    metrics: { approximateViews: 90000, upvotes: 290, comments: 188, upvoteRatioPercent: 98,
      source: "Creator-provided Reddit Post Insights screenshot", screenshotProvidedOn: "2026-10-18", live: false },
    summary: "An earlier version of SVG Cities was shared on r/Cities as “Made 200+ minimalist city icons. Roast my choices.” Readers debated the symbols and suggested more cities. The creator’s update credits the feedback with additions including Albuquerque, New Orleans, San Francisco and Córdoba in both Argentina and Spain.",
  },
  featuredIcons: selected,
};
writeFileSync(join(output, 'facts.json'), JSON.stringify(facts, null, 2) + '\n');
const readme = `SVG Cities — press kit\n\n${facts.description}\n\nWebsite: ${facts.website}\nCreator: Studio Partdirector (${facts.creatorWebsite})\nContact: ${facts.contact}\n\nCommunity discussion\n${facts.communityDiscussion.summary}\nReddit Post Insights snapshot provided 18 October 2026: approximately 90,000 views, 290 upvotes, 188 comments, 98% upvote ratio. These are snapshot figures, not live counters.\n${facts.communityDiscussion.url}\n\nContents\n- svgcities-cover.png: 1600×1000 editorial preview\n- svgcities-cover.svg: editable preview artwork\n- icons/: 12 selected original SVGs\n- svgcities-figma-import.svg: all ${index.count} icons on a labelled vector sheet; import into Figma. This is not a .fig file or a native component library.\n- facts.json: collection facts and source URLs\n\nCredit\nCity icons by Studio Partdirector — https://svgcities.com — CC BY 4.0 (${facts.licenseUrl}). Indicate any changes.\nThe artwork license does not imply endorsement or clear third-party trademark or other rights.\n\nUse canonical URLs for editorial references. For campaign links, use utm_source=<publication>&utm_medium=referral&utm_campaign=svgcities_launch&utm_content=<placement>.\n`;
writeFileSync(join(output, 'README.txt'), readme);
const mtime = new Date('2020-01-01T00:00:00Z');
const entry = data => [data, { mtime }];
const entries = {};
for (const file of ['svgcities-cover.png','svgcities-cover.svg','svgcities-figma-import.svg','facts.json','README.txt']) {
  entries[file] = entry(readFileSync(join(output, file)));
}
for (const icon of selected) entries[`icons/${icon.svgFilename}`] = entry(readFileSync(join(root, 'public/icons', icon.svgFilename)));
writeFileSync(join(output, 'svgcities-press-kit.zip'), zipSync(entries, { level: 9, mtime }));
console.log(`Press kit: ${selected.length} featured icons; Figma import sheet: ${index.count} icons.`);

// Directory submissions require 1200×800 previews alongside the complete collection.
const directoryPreview = await sharp(Buffer.from(cover)).resize(1200, 800, { fit: 'contain', background: '#f5f3ec' }).png().toBuffer();
const directoryEntries = {
  'preview.png': entry(directoryPreview),
  'thumbnail.png': entry(directoryPreview),
  'README.txt': entry(Buffer.from(`SVG Cities by Studio Partdirector\nhttps://svgcities.com\n\n${index.count} original SVG city icons. Scalable vector artwork; no fixed print DPI.\nFree for personal and commercial use under CC BY 4.0. Attribution is required.\nCredit Studio Partdirector, link to https://svgcities.com and https://creativecommons.org/licenses/by/4.0/ and indicate any changes.\nOriginal source and applicable artwork license: https://svgcities.com/license\n\nPreview images: 1200 x 800 PNG.\n`)),
};
for (const icon of index.icons) directoryEntries[`icons/${icon.svgFilename}`] = entry(readFileSync(join(root, 'public/icons', icon.svgFilename)));
writeFileSync(join(output, 'svgcities-directory-kit.zip'), zipSync(directoryEntries, { level: 9, mtime }));
