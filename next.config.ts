import type { NextConfig } from "next";

/**
 * Performance-focused Next.js configuration
 *
 * Key optimizations:
 * 1. optimizePackageImports: Reduces bundle size by only including needed exports
 * 2. Image optimization: AVIF/WebP formats reduce image bytes
 * 3. Cache headers: Aggressive caching for static assets (1 year)
 * 4. Bundle analyzer: Available with ANALYZE=true npm run build
 *
 * For more details, see PERFORMANCE_GUIDE.md
 */

// Bundle analyzer: enable with ANALYZE=true next build
// Usage: ANALYZE=true npm run build
// This will generate .next/analyze reports for client and server bundles
let config: NextConfig = {
  // Optimize package imports for large dependencies
  // Prevents importing entire libraries when only specific exports are needed
  // Impact: Saves ~10-15% bundle size by removing unused code
  experimental: {
    optimizePackageImports: [
      "@supabase/supabase-js",
      "@supabase/ssr",
      "zod",
      "lucide-react",
      "@nivo/bar",
      "@nivo/core",
      "@nivo/heatmap",
      "@nivo/line",
    ],
  },

  // Image optimization configuration
  // Reduces image size by 40-80% using modern formats (AVIF/WebP)
  images: {
    // Modern formats: AVIF (smallest) and WebP (fallback), with original as final fallback
    formats: ["image/avif", "image/webp"],
    // Responsive image sizes (breakpoints for srcset)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Small image sizes (thumbnails, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache images at the CDN level for 1 year
    minimumCacheTTL: 31536000,
  },

  // Caching headers for static assets
  // Security headers are set in middleware.ts (single source of truth)
  // Only cache headers remain here (they apply to static assets)
  async headers() {
    return [
      // Cache static assets for 1 year (immutable)
      {
        source: "/(_next/static|public)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache fonts for 1 year
      {
        source: "/:path*(woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache image and media files for 1 year
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // WordPress → Next.js URL redirects
      {
        source: "/football/",
        destination: "/football",
        permanent: true,
      },
      {
        source: "/basketball/",
        destination: "/basketball",
        permanent: true,
      },
      {
        source: "/potw/",
        destination: "/potw",
        permanent: true,
      },
      {
        source: "/all-americans/",
        destination: "/football/records",
        permanent: true,
      },
      {
        source: "/team-awards/",
        destination: "/football/championships",
        permanent: true,
      },
      {
        source: "/yearly-awards/",
        destination: "/football/leaderboards",
        permanent: true,
      },
      {
        source: "/camps-showcases/",
        destination: "/",
        permanent: true,
      },
      // /[sport]/all-city → /[sport]/awards redirects (route rename)
      {
        source: "/:sport/all-city",
        destination: "/:sport/awards",
        permanent: true,
      },
      // Deleted routes → appropriate landing pages
      {
        source: "/pulse",
        destination: "/",
        permanent: true,
      },
      {
        source: "/pulse/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/hof",
        permanent: true,
      },
      {
        source: "/recruiting/portal",
        destination: "/recruit-finder",
        permanent: true,
      },
      {
        source: "/recruiting/central",
        destination: "/recruiting",
        permanent: true,
      },
      {
        source: "/coming-soon",
        destination: "/",
        permanent: true,
      },
      {
        source: "/community",
        destination: "/",
        permanent: true,
      },
      {
        source: "/alumni",
        destination: "/our-guys/directory",
        permanent: true,
      },
      {
        source: "/pipeline",
        destination: "/recruiting",
        permanent: true,
      },
      {
        source: "/archive/",
        destination: "/football/championships",
        permanent: true,
      },
      {
        source: "/archive-:year/",
        destination: "/football",
        permanent: true,
      },
      {
        source: "/recruiting/",
        destination: "/recruiting",
        permanent: true,
      },
      {
        source: "/next-level",
        destination: "/our-guys",
        permanent: true,
      },
      {
        source: "/next-level/",
        destination: "/our-guys",
        permanent: true,
      },
      {
        source: "/philly-everywhere/",
        destination: "/our-guys",
        permanent: true,
      },
      {
        source: "/pros/",
        destination: "/our-guys",
        permanent: true,
      },
      {
        source: "/standings/",
        destination: "/football/standings",
        permanent: true,
      },
      {
        source: "/teams/",
        destination: "/schools",
        permanent: true,
      },
      {
        source: "/stats/",
        destination: "/football/leaderboards",
        permanent: true,
      },
      {
        source: "/players/compare/",
        destination: "/compare",
        permanent: true,
      },
    ];
  },
};

// Wrap with bundle analyzer when ANALYZE environment variable is set
if (process.env.ANALYZE === "true") {
  const { default: withBundleAnalyzer } = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
  });
  config = withBundleAnalyzer(config);
}

export default config;
