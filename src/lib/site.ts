// Site-wide identity: every absolute URL and every schema.org author/publisher
// on the site is built from these, so a domain or credit change is one edit.

/** Canonical origin, no trailing slash. */
export const SITE_URL = 'https://svgcities.com';

/** og:site_name and the WebSite JSON-LD name. */
export const SITE_NAME = 'City Icons Collection';

export const STUDIO_NAME = 'Studio Partdirector';
export const STUDIO_URL = 'https://partdirector.ch';

export const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';
export const GITHUB_URL = 'https://github.com/anto1/city-icons';

/** Default social preview image (public/og-image.png). */
export const DEFAULT_OG_IMAGE = { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 };

/** schema.org Organization used for author, publisher and creator fields. */
export const STUDIO_ORG = {
  '@type': 'Organization',
  name: STUDIO_NAME,
  url: STUDIO_URL,
} as const;

/** Absolute URL for a site path ("/faq" → "https://svgcities.com/faq"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
