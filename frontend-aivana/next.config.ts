import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Example: Increase limit to 2MB
    },
  },
  // basePath: '/capstone25/cp25ssi3',
  // assetPrefix: '/capstone25/cp25ssi3',
};

export default nextConfig;
