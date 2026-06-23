import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "...",
        port: "",
      },
      {
        protocol: "https",
        hostname: "...",
        port: "",
      },
    ],
  },
};

export default nextConfig;
