import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://phillysportspack.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/football", "/basketball", "/baseball", "/soccer", "/lacrosse", "/track-field", "/wrestling"],
        disallow: ["/admin", "/api", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
