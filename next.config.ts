import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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
