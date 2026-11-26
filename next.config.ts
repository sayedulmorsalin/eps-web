import type { NextConfig } from "next";

const supabasePattern = (() => {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
      return [
        {
          protocol: url.protocol.replace(":", "") as "https" | "http",
          hostname: url.hostname,
          pathname: "/storage/v1/object/public/**",
        },
      ];
    }
  } catch {
    // Ignore malformed env url
  }
  return [];
})();

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.0.102", "127.0.0.1", "*.local"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      ...supabasePattern,
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
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
