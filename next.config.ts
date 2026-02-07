import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
    // Allow larger uploads to /api/ipfs/pin-file
    proxyClientMaxBodySize: "10mb",
  },
};

export default nextConfig;
