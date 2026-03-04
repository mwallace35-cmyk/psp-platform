import { NextRequest, NextResponse } from "next/server";

/**
 * oEmbed proxy endpoint
 * Fetches embed HTML from Twitter/Instagram oEmbed APIs (free, no auth needed)
 * Usage: GET /api/oembed?url=https://twitter.com/user/status/123
 */

const OEMBED_ENDPOINTS: Record<string, string> = {
  twitter: "https://publish.twitter.com/oembed",
  instagram: "https://graph.facebook.com/v18.0/instagram_oembed",
};

function detectPlatform(url: string): string | null {
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("instagram.com")) return "instagram";
  return null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const platform = detectPlatform(url);
  if (!platform) {
    return NextResponse.json({ error: "Unsupported platform. Only Twitter/X and Instagram URLs are supported." }, { status: 400 });
  }

  const endpoint = OEMBED_ENDPOINTS[platform];

  try {
    const oembedUrl = `${endpoint}?url=${encodeURIComponent(url)}&omit_script=true&maxwidth=400`;
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "PhillySportsPack/1.0" },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `oEmbed API returned ${res.status}`, platform },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      html: data.html || null,
      title: data.title || null,
      author_name: data.author_name || null,
      author_url: data.author_url || null,
      thumbnail_url: data.thumbnail_url || null,
      platform,
    });
  } catch (error) {
    console.error("oEmbed fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch embed data" },
      { status: 500 }
    );
  }
}
