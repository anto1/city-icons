import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Ensure static generation works
  trailingSlash: false,
  // Stable build ID for consistent caching
  generateBuildId: async () => {
    return 'city-icons-v1';
  },
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
