import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://phillysportspack.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/login",
          "/signup",
          "/profile",
          "/private",
          "/_next",
          "/*.json$",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
