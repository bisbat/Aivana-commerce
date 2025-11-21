import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Example: Increase limit to 2MB
    },
  },
};

export default nextConfig;
