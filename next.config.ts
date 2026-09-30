import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-d51f25b9551b4f60a5b021dfb845a17e.r2.dev",
      },
    ],
  },
};

export default nextConfig;