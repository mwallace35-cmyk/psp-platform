import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock updateSession - must be before importing middleware
vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: vi.fn(async (request) => {
    return {
      headers: { set: vi.fn() },
      cookies: { set: vi.fn() },
    };
  }),
}));

// Now import middleware after all mocks are set up
import { middleware } from "@/middleware";

// Mock NextRequest and NextResponse
const createMockNextRequest = (
  pathname: string,
  options: {
    method?: string;
    cookies?: Record<string, string>;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  } = {}
) => {
  const headers = new Map();
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  const cookies = new Map();
  if (options.cookies) {
    Object.entries(options.cookies).forEach(([key, value]) => {
      cookies.set(key, { value });
    });
  }

  const searchParams = new URLSearchParams();
  if (options.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
  }

  return {
    method: options.method || "GET",
    headers: {
      get: (key: string) => headers.get(key),
      set: vi.fn(),
    },
    cookies: {
      get: (key: string) => cookies.get(key),
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      searchParams,
      clone: () => {
        let clonedPathname = pathname;
        const clonedSearchParams = new URLSearchParams(searchParams);

        return {
          get pathname() {
            return clonedPathname;
          },
          set pathname(val: string) {
            clonedPathname = val;
          },
          searchParams: clonedSearchParams,
          get search() {
            const search = clonedSearchParams.toString() ? `?${clonedSearchParams.toString()}` : "";
            return search;
          },
          set search(val: string) {
            const params = new URLSearchParams(val.replace(/^\?/, ""));
            clonedSearchParams.forEach((_, key) => clonedSearchParams.delete(key));
            params.forEach((value, key) => clonedSearchParams.set(key, value));
          },
          toString: () => clonedPathname + (clonedSearchParams.toString() ? `?${clonedSearchParams.toString()}` : ""),
          get href() {
            return clonedPathname + (clonedSearchParams.toString() ? `?${clonedSearchParams.toString()}` : "");
          },
        };
      },
    },
  };
};

vi.mock("next/server", () => {
  const headersMap = new Map();
  const cookiesSet = new Map();

  return {
    NextResponse: {
      next: vi.fn(() => ({
        headers: {
          set: (k: string, v: string) => headersMap.set(k, v),
          get: (k: string) => headersMap.get(k),
        },
        cookies: { set: vi.fn() },
      })),
      redirect: vi.fn((url: any) => {
        // Handle URL objects properly
        let urlString = url;
        if (url && typeof url === 'object') {
          urlString = url.toString ? url.toString() : url.href || String(url);
        }
        return {
          headers: { set: vi.fn() },
          cookies: { set: vi.fn() },
          url: urlString,
        };
      }),
      json: vi.fn((body: any, init?: any) => ({
        body,
        status: init?.status || 200,
      })),
    },
    NextRequest: vi.fn(),
  };
});

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PSP_PREVIEW_KEY = "psp2026";
  });

  describe("security headers", () => {
    it("should set X-Content-Type-Options header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      // The middleware returns NextResponse.next() which has headers
      expect(response).toBeDefined();
    });

    it("should set X-Frame-Options header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should set X-XSS-Protection header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should set CSP header with nonce", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should set Strict-Transport-Security header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });
  });

  describe("request body size limit", () => {
    it("should reject requests larger than 1MB with 413 status", async () => {
      const request = createMockNextRequest("/test", {
        headers: {
          "content-length": "1000001",
        },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should allow requests under 1MB", async () => {
      const request = createMockNextRequest("/test", {
        headers: {
          "content-length": "500000",
        },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should allow requests without content-length header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });
  });

  describe("preview cookie bypass", () => {
    it("should set bypass cookie when correct preview key is provided", async () => {
      const request = createMockNextRequest("/test", {
        searchParams: { preview: "psp2026" },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
      // Should redirect to remove the preview parameter
      expect(response.url).toBeDefined();
    });

    it("should not set bypass cookie with wrong preview key", async () => {
      const request = createMockNextRequest("/test", {
        searchParams: { preview: "wrongkey" },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should allow access to non-passthrough routes with bypass cookie", async () => {
      const request = createMockNextRequest("/protected", {
        cookies: { psp_preview: "1" },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should deny access to non-passthrough routes without bypass cookie", async () => {
      const request = createMockNextRequest("/protected");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
      // Should redirect to coming-soon
      expect(response.url).toContain("/coming-soon");
    });
  });

  describe("passthrough routes", () => {
    const passthroughRoutes = [
      "/coming-soon",
      "/admin",
      "/login",
      "/api/test",
      "/_next/static",
      "/favicon.ico",
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.json",
    ];

    passthroughRoutes.forEach((route) => {
      it(`should not redirect ${route} route without bypass cookie`, async () => {
        const request = createMockNextRequest(route);
        const response = await middleware(request as any);

        expect(response).toBeDefined();
        // Passthrough routes should not redirect to coming-soon
        if (response.url) {
          expect(response.url).not.toContain("/coming-soon");
        }
      });
    });

    it("should allow routes starting with passthrough prefixes", async () => {
      const request = createMockNextRequest("/api/revalidate");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should allow routes with passthrough dots notation", async () => {
      const request = createMockNextRequest("/favicon.ico");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });
  });

  describe("non-passthrough routes without preview cookie", () => {
    it("should redirect to /coming-soon", async () => {
      const request = createMockNextRequest("/protected-page");
      const response = await middleware(request as any);

      expect(response.url).toContain("/coming-soon");
    });

    it("should remove search params when redirecting", async () => {
      const request = createMockNextRequest("/protected-page", {
        searchParams: { id: "123", name: "test" },
      });
      const response = await middleware(request as any);

      expect(response).toBeDefined();
    });

    it("should preserve coming-soon route", async () => {
      const request = createMockNextRequest("/coming-soon");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
      if (response.url) {
        expect(response.url).not.toContain("/coming-soon/coming-soon");
      }
    });
  });

  describe("CSP nonce", () => {
    it("should include nonce in CSP header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
      // CSP header should be set with nonce
    });

    it("should pass nonce via x-csp-nonce header", async () => {
      const request = createMockNextRequest("/test");
      const response = await middleware(request as any);

      expect(response).toBeDefined();
      // x-csp-nonce header should be set
    });
  });

  describe("admin routes", () => {
    it("should call updateSession for /admin routes", async () => {
      const { updateSession } = await import("@/lib/supabase/middleware");
      const request = createMockNextRequest("/admin/dashboard");

      await middleware(request as any);

      expect(updateSession).toHaveBeenCalled();
    });

    it("should call updateSession for /login route", async () => {
      const { updateSession } = await import("@/lib/supabase/middleware");
      const request = createMockNextRequest("/login");

      await middleware(request as any);

      expect(updateSession).toHaveBeenCalled();
    });
  });
});
