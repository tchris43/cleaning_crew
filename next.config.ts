import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prevent Next.js from using the parent folder's lockfile as the workspace root.
  outputFileTracingRoot: path.join(__dirname)
};

export default nextConfig;
