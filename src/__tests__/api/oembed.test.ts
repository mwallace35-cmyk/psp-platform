import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/api/oembed/route";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock rate-limit
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn((_ip: string, _max: number, _window: number) => ({
    success: true,
    remaining: 29,
  })),
}));

// Mock sanitize
vi.mock("@/lib/sanitize", () => ({
  default: vi.fn((html: string) => html),
  sanitizeHtml: vi.fn((html: string) => html),
}));

describe("oEmbed API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error when url parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/oembed");
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.message).toBe("Missing url parameter");
  });

  it("returns error for unsupported platform", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/oembed?url=https://facebook.com/post/123"
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.message).toContain("Unsupported platform");
  });

  it("returns error for TikTok URLs", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/oembed?url=https://tiktok.com/video/123"
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.message).toContain("Unsupported platform");
  });

  it("returns error for YouTube URLs", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/oembed?url=https://youtube.com/watch?v=abc"
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error.message).toContain("Unsupported platform");
  });

  it("successfully handles Twitter URL", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        html: "<blockquote>Test Tweet</blockquote>",
        title: "Tweet",
        author_name: "Test User",
        author_url: "https://twitter.com/user",
        thumbnail_url: "https://example.com/thumb.jpg",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.platform).toBe("twitter");
    expect(data.data.html).toContain("Test Tweet");
    expect(data.data.author_name).toBe("Test User");
    expect(data.data.thumbnail_url).toBe("https://example.com/thumb.jpg");
  });

  it("successfully handles x.com URL", async () => {
    const xUrl = "https://x.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        html: "<blockquote>Test Tweet</blockquote>",
        title: "Tweet",
        author_name: "Test User",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(xUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.platform).toBe("twitter");
  });

  it("successfully handles Instagram URL", async () => {
    const instagramUrl = "https://instagram.com/p/ABC123DEF456/";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        html: "<blockquote>Instagram Post</blockquote>",
        author_name: "Instagram User",
        author_url: "https://instagram.com/user",
        thumbnail_url: "https://example.com/ig-thumb.jpg",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(instagramUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.platform).toBe("instagram");
    expect(data.data.html).toContain("Instagram Post");
  });

  it("handles API error responses gracefully", async () => {
    const twitterUrl = "https://twitter.com/user/status/invalid";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error.message).toContain("oEmbed API returned 404");
  });

  it("handles network fetch errors", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.message).toBe("Failed to fetch embed data");
  });

  it("handles fetch timeout", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockRejectedValueOnce(new Error("Timeout"));

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.message).toBe("Failed to fetch embed data");
  });

  it("includes platform in error response", async () => {
    const twitterUrl = "https://twitter.com/user/status/invalid";
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error.code).toBeDefined();
  });

  it("returns sanitized HTML", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    const dirtyHtml = '<blockquote><script>alert("xss")</script>Test</blockquote>';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        html: dirtyHtml,
        author_name: "Test User",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.html).toBeDefined();
  });

  it("handles missing optional fields in oEmbed response", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        html: "<blockquote>Test</blockquote>",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.title).toBeNull();
    expect(data.data.author_name).toBeNull();
    expect(data.data.thumbnail_url).toBeNull();
  });

  it("handles empty HTML response", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        author_name: "Test User",
      }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.html).toBeNull();
  });

  it("makes fetch request with correct parameters", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html: "<blockquote>Test</blockquote>" }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    await GET(req);

    expect(mockFetch).toHaveBeenCalled();
    const callUrl = mockFetch.mock.calls[0][0] as string;
    expect(callUrl).toContain("publish.twitter.com/oembed");
    expect(callUrl).toContain("omit_script=true");
    expect(callUrl).toContain("maxwidth=400");
  });

  it("passes User-Agent header in fetch request", async () => {
    const twitterUrl = "https://twitter.com/user/status/1234567890";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ html: "<blockquote>Test</blockquote>" }),
    });

    const req = new NextRequest(
      `http://localhost:3000/api/oembed?url=${encodeURIComponent(twitterUrl)}`
    );
    await GET(req);

    expect(mockFetch).toHaveBeenCalled();
    const options = mockFetch.mock.calls[0][1] as any;
    expect(options.headers["User-Agent"]).toBe("PhillySportsPack/1.0");
  });
});
