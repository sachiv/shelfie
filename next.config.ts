import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [
          {
            protocol: "https",
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace(
              "https://",
              ""
            ),
            pathname: "**",
          },
        ]
      : [],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [path.resolve(__dirname, "public/uploads/**")],
      };
    }
    return config;
  },
};

export default nextConfig;
