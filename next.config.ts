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
};

export default nextConfig;
