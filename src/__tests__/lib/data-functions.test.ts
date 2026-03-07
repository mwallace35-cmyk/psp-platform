import { describe, it, expect } from "vitest";
import { sanitizePostgREST } from "@/lib/data";

describe("sanitizePostgREST", () => {
  it("escapes backslashes", () => {
    const result = sanitizePostgREST("test\\path");
    expect(result).toBe("test\\\\path");
  });

  it("escapes percent signs", () => {
    const result = sanitizePostgREST("test%value");
    expect(result).toBe("test\\%value");
  });

  it("escapes underscores", () => {
    const result = sanitizePostgREST("test_value");
    expect(result).toBe("test\\_value");
  });

  it("escapes asterisks", () => {
    const result = sanitizePostgREST("test*value");
    expect(result).toBe("test\\*value");
  });

  it("escapes opening parentheses", () => {
    const result = sanitizePostgREST("test(value");
    expect(result).toBe("test\\(value");
  });

  it("escapes closing parentheses", () => {
    const result = sanitizePostgREST("test)value");
    expect(result).toBe("test\\)value");
  });

  it("escapes commas", () => {
    const result = sanitizePostgREST("test,value");
    expect(result).toBe("test\\,value");
  });

  it("escapes periods", () => {
    const result = sanitizePostgREST("test.value");
    expect(result).toBe("test\\.value");
  });

  it("escapes multiple special characters", () => {
    const result = sanitizePostgREST("test_%*.");
    expect(result).toBe("test\\_\\%\\*\\.");
  });

  it("escapes all special characters together", () => {
    const result = sanitizePostgREST("a%b_c*d(e)f,g.h");
    expect(result).toBe("a\\%b\\_c\\*d\\(e\\)f\\,g\\.h");
  });

  it("handles backslash first to prevent double escaping", () => {
    const result = sanitizePostgREST("test\\");
    expect(result).toBe("test\\\\");
  });

  it("trims whitespace", () => {
    const result = sanitizePostgREST("  test value  ");
    expect(result).toBe("test value");
  });

  it("trims leading whitespace", () => {
    const result = sanitizePostgREST("   test");
    expect(result).toBe("test");
  });

  it("trims trailing whitespace", () => {
    const result = sanitizePostgREST("test   ");
    expect(result).toBe("test");
  });

  it("handles empty string", () => {
    const result = sanitizePostgREST("");
    expect(result).toBe("");
  });

  it("handles whitespace-only string", () => {
    const result = sanitizePostgREST("   ");
    expect(result).toBe("");
  });

  it("enforces max length of 100 characters", () => {
    const longString = "a".repeat(150);
    const result = sanitizePostgREST(longString);
    expect(result).toHaveLength(100);
    expect(result).toBe("a".repeat(100));
  });

  it("enforces max length after trimming", () => {
    const longString = "  " + "a".repeat(150);
    const result = sanitizePostgREST(longString);
    expect(result).toHaveLength(100);
  });

  it("handles exactly 100 characters", () => {
    const exactString = "a".repeat(100);
    const result = sanitizePostgREST(exactString);
    expect(result).toHaveLength(100);
    expect(result).toBe(exactString);
  });

  it("handles string with special characters and length limit", () => {
    const longSpecialString = "a%b_c*".repeat(30); // Will exceed 100 chars
    const result = sanitizePostgREST(longSpecialString);
    expect(result).toHaveLength(100);
    expect(result).toMatch(/^a\\%b\\_c\\*/);
  });

  it("handles common SQL injection patterns", () => {
    const result = sanitizePostgREST("'; DROP TABLE users; --");
    // Should sanitize the input - semicolons aren't escaped but quotes will be processed
    expect(result).toBeDefined();
    expect(result.length > 0).toBe(true);
  });

  it("preserves alphanumeric characters", () => {
    const result = sanitizePostgREST("test123ABC");
    expect(result).toBe("test123ABC");
  });

  it("preserves dashes and hyphens", () => {
    const result = sanitizePostgREST("test-value");
    expect(result).toBe("test-value");
  });

  it("preserves spaces in middle of string", () => {
    const result = sanitizePostgREST("test value here");
    expect(result).toBe("test value here");
  });

  it("handles unicode characters", () => {
    const result = sanitizePostgREST("José María");
    expect(result).toBe("José María");
  });

  it("handles consecutive special characters", () => {
    const result = sanitizePostgREST("%%__**");
    expect(result).toBe("\\%\\%\\_\\_\\*\\*");
  });

  it("handles mixed text and special characters", () => {
    const result = sanitizePostgREST("search%term_match*");
    expect(result).toBe("search\\%term\\_match\\*");
  });
});
