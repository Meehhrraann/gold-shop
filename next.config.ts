import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["chat-ticket.storage.c2.liara.space"],
  },
  eslint: {
    // This allows the build to finish even if you have unused variables
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows the build to finish even if you have TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
