import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
    // 禁用图片优化，直接使用原始 URL（避免代理问题）
    unoptimized: true,
  },
};

export default nextConfig;


