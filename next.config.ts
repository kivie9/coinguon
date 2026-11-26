import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất build sang thư mục 'build' thay vì '.next' để tránh xung đột khi chạy dev và build đồng thời
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  allowedDevOrigins: ['192.168.40.54'],
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
