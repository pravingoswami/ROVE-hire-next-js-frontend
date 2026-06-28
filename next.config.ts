import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake MUI imports to reduce vendor chunk churn on Windows dev
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material", "@mui/x-charts"],
  },
  // Avoids intermittent vendor-chunk / manifest corruption on Windows dev
  webpack: (config, { dev }) => {
    if (dev && process.platform === "win32") {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
