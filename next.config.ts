import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Add some debugging
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Ensure static generation works
  trailingSlash: false,
  // Add some debugging info
  generateBuildId: async () => {
    return 'city-icons-' + Date.now();
  }
};

export default nextConfig;
