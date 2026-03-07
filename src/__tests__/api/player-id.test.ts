import { describe, it, expect } from "vitest";
import { playerIdSchema } from "@/lib/validation";

describe("Player ID validation", () => {
  it("rejects non-numeric IDs", () => {
    const result = playerIdSchema.safeParse({ id: "abc123" });
    expect(result.success).toBe(false);
  });

  it("rejects IDs with letters", () => {
    const result = playerIdSchema.safeParse({ id: "123abc" });
    expect(result.success).toBe(false);
  });

  it("rejects IDs with special characters", () => {
    const result = playerIdSchema.safeParse({ id: "123-456" });
    expect(result.success).toBe(false);
  });

  it("rejects IDs with spaces", () => {
    const result = playerIdSchema.safeParse({ id: "123 456" });
    expect(result.success).toBe(false);
  });

  it("accepts valid numeric IDs as strings", () => {
    const result = playerIdSchema.safeParse({ id: "123" });
    expect(result.success).toBe(true);
  });

  it("accepts single digit ID", () => {
    const result = playerIdSchema.safeParse({ id: "1" });
    expect(result.success).toBe(true);
  });

  it("accepts large numeric IDs", () => {
    const result = playerIdSchema.safeParse({ id: "999999999" });
    expect(result.success).toBe(true);
  });

  it("rejects negative IDs with minus sign", () => {
    const result = playerIdSchema.safeParse({ id: "-123" });
    expect(result.success).toBe(false);
  });

  it("rejects zero-prefixed IDs as strings (still numeric)", () => {
    const result = playerIdSchema.safeParse({ id: "0123" });
    expect(result.success).toBe(true);
  });

  it("transforms string to number", () => {
    const result = playerIdSchema.safeParse({ id: "42" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(42);
      expect(typeof result.data.id).toBe("number");
    }
  });

  it("transforms leading zero in numeric string to number without leading zero", () => {
    const result = playerIdSchema.safeParse({ id: "0042" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(42);
      expect(typeof result.data.id).toBe("number");
    }
  });

  it("preserves numeric value after transformation", () => {
    const result = playerIdSchema.safeParse({ id: "12345" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(12345);
    }
  });

  it("rejects empty string", () => {
    const result = playerIdSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  it("rejects decimal numbers", () => {
    const result = playerIdSchema.safeParse({ id: "123.45" });
    expect(result.success).toBe(false);
  });

  it("rejects exponential notation", () => {
    const result = playerIdSchema.safeParse({ id: "1e5" });
    expect(result.success).toBe(false);
  });

  it("rejects plus sign", () => {
    const result = playerIdSchema.safeParse({ id: "+123" });
    expect(result.success).toBe(false);
  });
});
