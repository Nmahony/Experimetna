import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this app: the parent Experimetna repo also
  // contains an unrelated Next.js app (with its own middleware.ts/lockfile)
  // one directory up, which Next.js would otherwise auto-detect as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
