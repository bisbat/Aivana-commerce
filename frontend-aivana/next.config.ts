import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, ".."),
  output: "standalone",
  experimental: {
    middlewareClientMaxBodySize: 100 * 1024 * 1024,
    serverActions: {
      bodySizeLimit: 100 * 1024 * 1024,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // basePath: '/capstone25/cp25ssi3',
  // assetPrefix: '/capstone25/cp25ssi3/',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

module.exports = nextConfig;
