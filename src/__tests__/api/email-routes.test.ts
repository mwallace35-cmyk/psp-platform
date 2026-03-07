import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock rate-limit
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: vi.fn((_ip: string, _max: number, _window: number) => ({
    success: true,
    remaining: 29,
  })),
}));

// Mock Supabase - must be before importing routes
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Import and setup
import { createClient } from "@/lib/supabase/server";
import { GET as confirmGet } from "@/app/api/email/confirm/route";
import { GET as unsubscribeGet } from "@/app/api/email/unsubscribe/route";

describe("Email Confirmation Route", () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseClient = {
      from: vi.fn(),
    };
    (createClient as any).mockResolvedValue(mockSupabaseClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error when token parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/email/confirm");
    const response = await confirmGet(req);

    expect(response.status).toBe(307); // Redirect status
    expect(response.headers.get("location")).toContain("error=invalid-token");
  });

  it("redirects with error for invalid token", async () => {
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: new Error("Not found") }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=invalid-token"
    );
    const response = await confirmGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=invalid-token");
  });

  it("redirects with error when already confirmed", async () => {
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=already-confirmed"
    );
    const response = await confirmGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=invalid-token");
  });

  it("successfully confirms email subscription", async () => {
    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { email: "test@example.com" },
        error: null,
      }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=valid-token"
    );
    const response = await confirmGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("subscribed=true");
  });

  it("calls update with correct parameters", async () => {
    const updateMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockReturnThis();
    const selectMock = vi.fn().mockReturnThis();

    mockSupabaseClient.from.mockReturnValue({
      update: updateMock,
      eq: eqMock,
      select: selectMock,
      single: vi.fn().mockResolvedValue({
        data: { email: "test@example.com" },
        error: null,
      }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=test-token"
    );
    await confirmGet(req);

    expect(updateMock).toHaveBeenCalledWith({
      confirmed: true,
      confirmed_at: expect.any(String),
    });
    expect(eqMock).toHaveBeenCalledWith("confirmation_token", "test-token");
    expect(eqMock).toHaveBeenCalledWith("confirmed", false);
  });

  it("handles error when catching exception", async () => {
    mockSupabaseClient.from.mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=test-token"
    );
    const response = await confirmGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=confirm-failed");
  });

  it("confirms subscription with timestamp", async () => {
    const updateSpy = vi.fn().mockReturnThis();

    mockSupabaseClient.from.mockReturnValue({
      update: updateSpy,
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { email: "test@example.com" },
        error: null,
      }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=test-token"
    );
    await confirmGet(req);

    const updateCall = updateSpy.mock.calls[0][0] as any;
    expect(updateCall.confirmed).toBe(true);
    expect(updateCall.confirmed_at).toBeDefined();
    expect(typeof updateCall.confirmed_at).toBe("string");
  });

  it("selects email field from updated row", async () => {
    const selectSpy = vi.fn().mockReturnThis();

    mockSupabaseClient.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: selectSpy,
      single: vi.fn().mockResolvedValue({
        data: { email: "test@example.com" },
        error: null,
      }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/confirm?token=test-token"
    );
    await confirmGet(req);

    expect(selectSpy).toHaveBeenCalledWith("email");
  });
});

describe("Email Unsubscribe Route", () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabaseClient = {
      from: vi.fn(),
    };
    (createClient as any).mockResolvedValue(mockSupabaseClient);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns error when token parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/email/unsubscribe");
    const response = await unsubscribeGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=invalid-token");
  });

  it("successfully unsubscribes email", async () => {
    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=valid-token"
    );
    const response = await unsubscribeGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("unsubscribed=true");
  });

  it("calls delete with correct token", async () => {
    const deleteMock = vi.fn().mockReturnThis();
    const eqMock = vi.fn().mockResolvedValue({ error: null });

    mockSupabaseClient.from.mockReturnValue({
      delete: deleteMock,
      eq: eqMock,
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=test-token"
    );
    await unsubscribeGet(req);

    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("unsubscribe_token", "test-token");
  });

  it("handles database error", async () => {
    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: new Error("Database error") }),
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=test-token"
    );
    const response = await unsubscribeGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=unsubscribe-failed");
  });

  it("handles exception during unsubscribe", async () => {
    mockSupabaseClient.from.mockImplementation(() => {
      throw new Error("Connection error");
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=test-token"
    );
    const response = await unsubscribeGet(req);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("error=unsubscribe-failed");
  });

  it("uses unsubscribe_token field for deletion", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });

    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: eqMock,
    });

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=unsubscribe-token-123"
    );
    await unsubscribeGet(req);

    const eqCall = eqMock.mock.calls[0];
    expect(eqCall[0]).toBe("unsubscribe_token");
    expect(eqCall[1]).toBe("unsubscribe-token-123");
  });

  it("deletes from email_subscribers table", async () => {
    const fromMock = vi.fn().mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    mockSupabaseClient.from = fromMock;

    const req = new NextRequest(
      "http://localhost:3000/api/email/unsubscribe?token=test-token"
    );
    await unsubscribeGet(req);

    expect(fromMock).toHaveBeenCalledWith("email_subscribers");
  });

  it("handles special characters in token", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });

    mockSupabaseClient.from.mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: eqMock,
    });

    const specialToken = "token-with-special-chars_123.abc";
    const req = new NextRequest(
      `http://localhost:3000/api/email/unsubscribe?token=${encodeURIComponent(
        specialToken
      )}`
    );
    await unsubscribeGet(req);

    expect(eqMock).toHaveBeenCalledWith("unsubscribe_token", specialToken);
  });
});
