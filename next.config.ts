import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        destination: "/football/leaderboards/scoring",
        permanent: true,
      },
      {
        source: "/camps-showcases/",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/archive",
        destination: "/archive/content",
        permanent: false,
      },
      {
        source: "/archive/",
        destination: "/archive/content",
        permanent: false,
      },
      {
        source: "/archive-:year/",
        destination: "/football",
        permanent: true,
      },
      {
        source: "/recruiting/",
        destination: "/football",
        permanent: true,
      },
      {
        source: "/next-level/",
        destination: "/football",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
