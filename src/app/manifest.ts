import type { MetadataRoute } from 'next';

// Next.js serves this at /manifest.webmanifest and wires the
// <link rel="manifest"> tag automatically. Icon paths reference the
// file-convention metadata assets in src/app (served at /icon.svg and
// /apple-icon.png).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'City Icons Collection',
    short_name: 'City Icons',
    description:
      'Minimalist line art SVG icons representing cities and their landmarks around the world. Browse, search, download, and copy free city icons.',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
