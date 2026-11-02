import type { NextConfig } from "next";

// GitHub Pages serves this repo at /cultivation-life. Local dev leaves the prefix empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // The dev server is bound on 0.0.0.0; browsers that open 127.0.0.1
  // still need this or Next blocks the HMR socket and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  ...(basePath
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
