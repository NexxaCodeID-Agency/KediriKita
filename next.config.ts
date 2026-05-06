import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "znphbhowsptzavbvzchu.supabase.co",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.geojson$/,
      type: "json",
    });
    return config;
  },
};

export default nextConfig;
