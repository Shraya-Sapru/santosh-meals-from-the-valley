import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Most routes here are DB-backed (booking, admin, pipeline) and dynamic
   * by nature, so Cache Components' prerendering model isn't a fit — every
   * dynamic data access would need its own Suspense boundary for no benefit. */
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
