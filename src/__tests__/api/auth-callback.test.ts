import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Supabase before importing the route
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Import after mocking
import { createClient } from "@/lib/supabase/server";
import { GET } from "@/app/api/auth/callback/route";

describe("Auth Callback Route", () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseClient = {
      auth: {
        exchangeCodeForSession: vi.fn(),
      },
    };
    (createClient as any).mockResolvedValue(mockSupabaseClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error when code parameter is missing", async () => {
    const req = new Request("http://localhost:3000/api/auth/callback");
    const response = await GET(req);

    expect(response.status).toBe(307); // Redirect status
    expect(response.headers.get("location")).toContain("error=auth_failed");
  });

  it("redirects to login on missing code", async () => {
    const req = new Request("http://localhost:3000/api/auth/callback");
    const response = await GET(req);

    expect(response.headers.get("location")).toContain("/login");
  });

  it("successfully exchanges valid code for session", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code"
    );
    const response = await GET(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/admin");
  });

  it("calls exchangeCodeForSession with correct code", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=my-secret-code"
    );
    await GET(req);

    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      "my-secret-code"
    );
  });

  it("returns error when exchangeCodeForSession fails", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: new Error("Invalid code"),
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=invalid-code"
    );
    const response = await GET(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=auth_failed");
  });

  it("returns error when exchangeCodeForSession returns error object", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: { message: "Code expired" },
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=expired-code"
    );
    const response = await GET(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=auth_failed");
  });

  it("redirects to default /admin path when no next parameter", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code"
    );
    const response = await GET(req);

    expect(response.headers.get("location")).toContain("/admin");
  });

  it("redirects to next parameter when valid relative path", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=/admin/users"
    );
    const response = await GET(req);

    expect(response.headers.get("location")).toContain("/admin/users");
  });

  it("prevents open redirect with //, attacks", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=//evil.com"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).not.toContain("//evil");
    expect(location).toContain("/admin");
  });

  it("prevents open redirect with external domain", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=https://evil.com"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).not.toContain("evil.com");
    expect(location).toContain("/admin");
  });

  it("prevents open redirect with backslash", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=\\\\evil.com"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).not.toContain("evil");
    expect(location).toContain("/admin");
  });

  it("sanitizes path with encoded double slash", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=%2F%2Fevil.com"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    // Should be sanitized to /admin due to the // pattern
    expect(location).not.toContain("evil");
  });

  it("allows valid relative paths with subdirectories", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=/admin/articles/new"
    );
    const response = await GET(req);

    expect(response.headers.get("location")).toContain("/admin/articles/new");
  });

  it("allows paths with query parameters", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=/admin?tab=users"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).toContain("/admin");
  });

  it("rejects path not starting with /", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=admin"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).toContain("/admin");
  });

  it("includes origin in redirect URL", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://example.com:3000/api/auth/callback?code=valid-code&next=/admin/users"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).toContain("http://example.com:3000/admin/users");
  });

  it("handles code with special characters", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const specialCode = "code-with_special.chars+123";
    const req = new Request(
      `http://localhost:3000/api/auth/callback?code=${encodeURIComponent(
        specialCode
      )}`
    );
    await GET(req);

    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      specialCode
    );
  });

  it("handles code with URL-encoded characters", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=code%2Bwith%2Fslash"
    );
    await GET(req);

    expect(
      mockSupabaseClient.auth.exchangeCodeForSession
    ).toHaveBeenCalledWith("code+with/slash");
  });

  it("creates Supabase client for auth exchange", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code"
    );
    await GET(req);

    expect(createClient).toHaveBeenCalled();
  });

  it("handles empty next parameter", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next="
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).toContain("/admin");
  });

  it("handles multiple query parameters in next path", async () => {
    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: null,
    });

    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=valid-code&next=/admin/articles?status=draft&sort=date"
    );
    const response = await GET(req);

    const location = response.headers.get("location") as string;
    expect(location).toContain("/admin/articles");
  });
});
