// Plain ESM (not TypeScript) on purpose: the site, scripts/*.mjs and the
// generator's promote.js all import this one copy, so filenames, URLs and the
// build-time slug-collision check can never disagree.

/**
 * URL-friendly slug: lowercase ASCII, hyphen-separated.
 * ł/đ/ø are mapped by hand because NFD does not decompose them.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/đ/g, 'd')
    .replace(/ø/g, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * URL segment for an icon's city page. Defaults to the slugified city name, but
 * an icon may override it with an explicit `slug` when a city has more than one
 * icon (e.g. Hanoi's Turtle Tower vs its Temple of Literature) — this keeps the
 * displayed city name clean while the URLs stay unique.
 * @param {{ city: string, slug?: string }} icon
 * @returns {string}
 */
export function getCitySlug(icon) {
  return icon.slug ?? slugify(icon.city);
}
