import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* existing config options */
  reactCompiler: true,

  // Enable SVG as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
