import { describe, it, expect, beforeEach, vi } from "vitest";
import { isOriginAllowed, getRequestOrigin, getRequestReferer } from "@/lib/request-security";

// Mock request creator
function createMockRequest(origin?: string, referer?: string): any {
  const headers = new Map();
  if (origin) {
    headers.set("origin", origin);
  }
  if (referer) {
    headers.set("referer", referer);
  }

  return {
    headers: {
      get: (key: string) => headers.get(key),
    },
  };
}

describe("request security utilities", () => {
  beforeEach(() => {
    // Reset environment
    delete process.env.ALLOWED_API_ORIGINS;
  });

  describe("isOriginAllowed", () => {
    it("should allow requests without origin header (same-origin)", () => {
      const request = createMockRequest();
      expect(isOriginAllowed(request)).toBe(true);
    });

    it("should reject cross-origin requests when origin is not in allowlist", () => {
      const request = createMockRequest("https://evil.com");
      expect(isOriginAllowed(request)).toBe(false);
    });

    it("should allow valid HTTP localhost origins during development", () => {
      process.env.ALLOWED_API_ORIGINS = "localhost";
      const request = createMockRequest("http://localhost:3000");
      expect(isOriginAllowed(request)).toBe(true);
    });

    it("should handle multiple allowed origins", () => {
      process.env.ALLOWED_API_ORIGINS = "app.example.com, api.example.com";

      const request1 = createMockRequest("https://app.example.com");
      expect(isOriginAllowed(request1)).toBe(true);

      const request2 = createMockRequest("https://api.example.com");
      expect(isOriginAllowed(request2)).toBe(true);

      const request3 = createMockRequest("https://evil.com");
      expect(isOriginAllowed(request3)).toBe(false);
    });

    it("should handle wildcard subdomain origins", () => {
      process.env.ALLOWED_API_ORIGINS = "*.example.com";

      const request1 = createMockRequest("https://app.example.com");
      expect(isOriginAllowed(request1)).toBe(true);

      const request2 = createMockRequest("https://api.example.com");
      expect(isOriginAllowed(request2)).toBe(true);

      const request3 = createMockRequest("https://evil.com");
      expect(isOriginAllowed(request3)).toBe(false);
    });

    it("should handle malformed origin headers", () => {
      const request = createMockRequest("not-a-valid-url");
      expect(isOriginAllowed(request)).toBe(false);
    });

    it("should handle various URL schemes", () => {
      process.env.ALLOWED_API_ORIGINS = "localhost";

      const httpRequest = createMockRequest("http://localhost:3000");
      expect(isOriginAllowed(httpRequest)).toBe(true);

      const httpsRequest = createMockRequest("https://localhost");
      expect(isOriginAllowed(httpsRequest)).toBe(true);
    });

    it("should handle port numbers in origin", () => {
      process.env.ALLOWED_API_ORIGINS = "localhost";

      const request1 = createMockRequest("http://localhost:3000");
      expect(isOriginAllowed(request1)).toBe(true);

      const request2 = createMockRequest("http://localhost:8080");
      expect(isOriginAllowed(request2)).toBe(true);
    });

    it("should handle exact domain matching", () => {
      process.env.ALLOWED_API_ORIGINS = "example.com";

      // Exact match
      const request1 = createMockRequest("https://example.com");
      expect(isOriginAllowed(request1)).toBe(true);

      // Subdomain should NOT match without wildcard
      const request2 = createMockRequest("https://api.example.com");
      expect(isOriginAllowed(request2)).toBe(false);
    });
  });

  describe("getRequestOrigin", () => {
    it("should return origin header when present", () => {
      const request = createMockRequest("https://example.com");
      expect(getRequestOrigin(request)).toBe("https://example.com");
    });

    it("should return 'same-origin' when origin header is missing", () => {
      const request = createMockRequest();
      expect(getRequestOrigin(request)).toBe("same-origin");
    });

    it("should handle various origin formats", () => {
      const origins = [
        "http://localhost:3000",
        "https://api.example.com",
        "https://example.com:8443",
      ];

      for (const origin of origins) {
        const request = createMockRequest(origin);
        expect(getRequestOrigin(request)).toBe(origin);
      }
    });
  });

  describe("getRequestReferer", () => {
    it("should return referer header when present", () => {
      const request = createMockRequest(undefined, "https://example.com/page");
      expect(getRequestReferer(request)).toBe("https://example.com/page");
    });

    it("should return undefined when referer header is missing", () => {
      const request = createMockRequest();
      expect(getRequestReferer(request)).toBeUndefined();
    });

    it("should handle various referer formats", () => {
      const referers = [
        "http://localhost:3000/api",
        "https://example.com/article/123",
        "https://trusted-app.com/checkout",
      ];

      for (const referer of referers) {
        const request = createMockRequest(undefined, referer);
        expect(getRequestReferer(request)).toBe(referer);
      }
    });

    it("should handle referer with origin together", () => {
      const request = createMockRequest(
        "https://example.com",
        "https://example.com/page"
      );
      expect(getRequestOrigin(request)).toBe("https://example.com");
      expect(getRequestReferer(request)).toBe("https://example.com/page");
    });
  });
});
