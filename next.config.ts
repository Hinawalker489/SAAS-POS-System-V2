import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Explicitly use src directory structure
  experimental: {
    // This ensures Next.js uses src/app
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
