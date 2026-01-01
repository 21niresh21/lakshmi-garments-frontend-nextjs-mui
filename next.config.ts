import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // 👇 REQUIRED for Spring Boot static hosting
  output: "export",
  trailingSlash: true,

  // 👇 Fixes image issues in static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
