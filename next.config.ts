import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure static generation works
  trailingSlash: false,
  // Add long-lived cache headers for static SVG icons
  async headers() {
    return [
      {
        source: '/icons/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Renamed assets keep their old URL working. Icon files are served with
  // year-long immutable cache headers and may be hotlinked, so a rename would
  // otherwise 404 for anyone already pointing at the old filename.
  async redirects() {
    return [
      {
        source: '/icons/uk-liverpool.svg',
        destination: '/icons/gb-liverpool.svg',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
