import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dùng .next-dev khi dev và .next khi build production (tương thích OpenNext Cloudflare)
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  allowedDevOrigins: ['192.168.40.54'],
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@libsql/client', 'libsql'],
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
