import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/capstone25/cp25ssi3",
  assetPrefix: "/capstone25/cp25ssi3",
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
