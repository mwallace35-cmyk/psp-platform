import { describe, it, expect } from "vitest";
import { searchSchema } from "@/lib/validation";

describe("Search API validation", () => {
  it("rejects queries shorter than 2 characters", () => {
    const result = searchSchema.safeParse({ q: "a", type: "player" });
    expect(result.success).toBe(false);
  });

  it("rejects empty queries", () => {
    const result = searchSchema.safeParse({ q: "", type: "player" });
    expect(result.success).toBe(false);
  });

  it("rejects queries longer than 100 characters", () => {
    const longQuery = "a".repeat(101);
    const result = searchSchema.safeParse({ q: longQuery, type: "player" });
    expect(result.success).toBe(false);
  });

  it("accepts valid search queries", () => {
    const result = searchSchema.safeParse({ q: "John Smith", type: "player" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("John Smith");
      expect(result.data.type).toBe("player");
    }
  });

  it("accepts queries at exactly 2 characters", () => {
    const result = searchSchema.safeParse({ q: "ab", type: "player" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("ab");
    }
  });

  it("accepts queries at exactly 100 characters", () => {
    const query = "a".repeat(100);
    const result = searchSchema.safeParse({ q: query, type: "player" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe(query);
    }
  });

  it("validates type parameter enum - accepts 'player'", () => {
    const result = searchSchema.safeParse({ q: "test query", type: "player" });
    expect(result.success).toBe(true);
  });

  it("validates type parameter enum - accepts 'school'", () => {
    const result = searchSchema.safeParse({ q: "test query", type: "school" });
    expect(result.success).toBe(true);
  });

  it("validates type parameter enum - accepts 'coach'", () => {
    const result = searchSchema.safeParse({ q: "test query", type: "coach" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid type parameter", () => {
    const result = searchSchema.safeParse({ q: "test query", type: "invalid" });
    expect(result.success).toBe(false);
  });

  it("allows optional type parameter", () => {
    const result = searchSchema.safeParse({ q: "test query" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBeUndefined();
    }
  });

  it("trims whitespace from queries", () => {
    const result = searchSchema.safeParse({ q: "  test query  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("test query");
    }
  });

  it("trims leading whitespace", () => {
    const result = searchSchema.safeParse({ q: "   test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("test");
    }
  });

  it("trims trailing whitespace", () => {
    const result = searchSchema.safeParse({ q: "test   " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("test");
    }
  });

  it("preserves internal whitespace while trimming", () => {
    const result = searchSchema.safeParse({ q: "  john  smith  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("john  smith");
    }
  });

  it("accepts special characters in queries", () => {
    const result = searchSchema.safeParse({ q: "Smith's High School" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("Smith's High School");
    }
  });

  it("accepts numeric characters in queries", () => {
    const result = searchSchema.safeParse({ q: "Player 23" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("Player 23");
    }
  });
});
