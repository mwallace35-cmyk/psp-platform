import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/revalidate/route";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Helper to create mock NextRequest
const createMockRequest = (
  body: any,
  authHeader?: string | null
) => {
  const headers = new Map();
  if (authHeader !== undefined) {
    headers.set("authorization", authHeader);
  }

  return {
    headers: {
      get: (key: string) => headers.get(key),
    },
    json: vi.fn(async () => body),
  };
};

// Mock NextResponse
vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body: any, init?: any) => ({
      body,
      status: init?.status || 200,
      headers: new Map(),
    })),
    NextRequest: vi.fn(),
  },
}));

describe("/api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REVALIDATION_SECRET = "test-secret-key";
  });

  describe("authorization", () => {
    it("should reject requests without authorization header", async () => {
      const request = createMockRequest({}) as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Unauthorized", code: "INVALID_AUTH" } },
        { status: 401 }
      );
    });

    it("should reject requests with wrong bearer token", async () => {
      const request = createMockRequest(
        {},
        "Bearer wrong-token"
      ) as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Unauthorized", code: "INVALID_AUTH" } },
        { status: 401 }
      );
    });

    it("should reject requests with missing Bearer prefix", async () => {
      const request = createMockRequest(
        {},
        "test-secret-key"
      ) as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Unauthorized", code: "INVALID_AUTH" } },
        { status: 401 }
      );
    });

    it("should reject requests with null authorization header", async () => {
      const request = createMockRequest({}, null) as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Unauthorized", code: "INVALID_AUTH" } },
        { status: 401 }
      );
    });
  });

  describe("path revalidation", () => {
    it("should accept valid path revalidation", async () => {
      const request = createMockRequest(
        { path: "/" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidatePath } = await import("next/cache");

      await POST(request);

      expect(revalidatePath).toHaveBeenCalledWith("/", "page");
    });

    it("should accept path revalidation with custom type", async () => {
      const request = createMockRequest(
        { path: "/blog", type: "layout" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidatePath } = await import("next/cache");

      await POST(request);

      expect(revalidatePath).toHaveBeenCalledWith("/blog", "layout");
    });

    it("should use default type 'page' when not specified", async () => {
      const request = createMockRequest(
        { path: "/products" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidatePath } = await import("next/cache");

      await POST(request);

      expect(revalidatePath).toHaveBeenCalledWith("/products", "page");
    });

    it("should accept various path formats", async () => {
      const paths = ["/", "/blog", "/blog/post-1", "/api/users"];
      const { revalidatePath } = await import("next/cache");

      for (const path of paths) {
        const request = createMockRequest(
          { path },
          "Bearer test-secret-key"
        ) as any;

        await POST(request);

        expect(revalidatePath).toHaveBeenCalledWith(path, "page");
      }
    });
  });

  describe("tag revalidation", () => {
    it("should accept valid tag revalidation", async () => {
      const request = createMockRequest(
        { tag: "blog-posts" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidateTag } = await import("next/cache");

      await POST(request);

      expect(revalidateTag).toHaveBeenCalledWith("blog-posts", "default");
    });

    it("should accept various tag formats", async () => {
      const tags = ["blog-posts", "products", "users", "cache-v1"];
      const { revalidateTag } = await import("next/cache");

      for (const tag of tags) {
        const request = createMockRequest(
          { tag },
          "Bearer test-secret-key"
        ) as any;

        await POST(request);

        expect(revalidateTag).toHaveBeenCalledWith(tag, "default");
      }
    });
  });

  describe("request body validation", () => {
    it("should return 400 when neither path nor tag provided", async () => {
      const request = createMockRequest(
        {},
        "Bearer test-secret-key"
      ) as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Provide path or tag", code: "MISSING_PARAMS" } },
        { status: 400 }
      );
    });

    it("should accept request with path and ignore missing tag", async () => {
      const request = createMockRequest(
        { path: "/" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidatePath } = await import("next/cache");

      await POST(request);

      expect(revalidatePath).toHaveBeenCalled();
    });

    it("should accept request with tag and ignore missing path", async () => {
      const request = createMockRequest(
        { tag: "blog" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidateTag } = await import("next/cache");

      await POST(request);

      expect(revalidateTag).toHaveBeenCalled();
    });

    it("should prioritize tag revalidation when both path and tag are provided", async () => {
      const request = createMockRequest(
        { path: "/", tag: "blog" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidateTag } = await import("next/cache");
      const { revalidatePath } = await import("next/cache");

      await POST(request);

      expect(revalidateTag).toHaveBeenCalled();
      // revalidatePath should not be called when tag is provided
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("should handle JSON parsing errors", async () => {
      const request = {
        headers: {
          get: (key: string) => key === "authorization" ? "Bearer test-secret-key" : null,
        },
        json: vi.fn(async () => {
          throw new Error("Invalid JSON");
        }),
      } as any;
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Failed to process revalidation request", code: "REVALIDATION_ERROR" } },
        { status: 500 }
      );
    });

    it("should handle revalidation function errors", async () => {
      const request = createMockRequest(
        { path: "/" },
        "Bearer test-secret-key"
      ) as any;
      const { revalidatePath } = await import("next/cache");
      (revalidatePath as any).mockImplementation(() => {
        throw new Error("Revalidation failed");
      });
      const { NextResponse } = await import("next/server");

      await POST(request);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false, error: { message: "Failed to process revalidation request", code: "REVALIDATION_ERROR" } },
        { status: 500 }
      );
    });
  });

  describe("environment variables", () => {
    it("should use REVALIDATION_SECRET from environment", async () => {
      process.env.REVALIDATION_SECRET = "custom-secret";

      const request = createMockRequest(
        { path: "/" },
        "Bearer custom-secret"
      ) as any;

      await POST(request);

      // Verify it was accepted (revalidatePath should be called)
      const { revalidatePath } = await import("next/cache");
      expect(revalidatePath).toHaveBeenCalled();
    });
  });
});
