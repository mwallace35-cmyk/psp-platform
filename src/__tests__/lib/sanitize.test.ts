import { describe, it, expect } from "vitest";
import { sanitizePostgREST } from "@/lib/data";

describe("Search input sanitizer (sanitizePostgREST)", () => {
  it("escapes percent signs", () => {
    const result = sanitizePostgREST("100% genuine");
    expect(result).toBe("100\\% genuine");
  });

  it("escapes multiple percent signs", () => {
    const result = sanitizePostgREST("50% off 50% more");
    expect(result).toBe("50\\% off 50\\% more");
  });

  it("escapes underscores", () => {
    const result = sanitizePostgREST("player_name");
    expect(result).toBe("player\\_name");
  });

  it("escapes multiple underscores", () => {
    const result = sanitizePostgREST("first_name_last_name");
    expect(result).toBe("first\\_name\\_last\\_name");
  });

  it("escapes backslashes", () => {
    const result = sanitizePostgREST("path\\to\\file");
    expect(result).toBe("path\\\\to\\\\file");
  });

  it("escapes asterisks", () => {
    const result = sanitizePostgREST("player*");
    expect(result).toBe("player\\*");
  });

  it("escapes parentheses", () => {
    const result = sanitizePostgREST("Smith (John)");
    expect(result).toBe("Smith \\(John\\)");
  });

  it("escapes opening parenthesis", () => {
    const result = sanitizePostgREST("(start");
    expect(result).toBe("\\(start");
  });

  it("escapes closing parenthesis", () => {
    const result = sanitizePostgREST("end)");
    expect(result).toBe("end\\)");
  });

  it("escapes commas", () => {
    const result = sanitizePostgREST("Smith, John");
    expect(result).toBe("Smith\\, John");
  });

  it("escapes periods", () => {
    const result = sanitizePostgREST("Dr. Smith");
    expect(result).toBe("Dr\\. Smith");
  });

  it("escapes multiple periods", () => {
    const result = sanitizePostgREST("U.S.A.");
    expect(result).toBe("U\\.S\\.A\\.");
  });

  it("handles normal queries unchanged", () => {
    const result = sanitizePostgREST("John Smith");
    expect(result).toBe("John Smith");
  });

  it("handles lowercase queries unchanged", () => {
    const result = sanitizePostgREST("player name");
    expect(result).toBe("player name");
  });

  it("handles numeric queries unchanged", () => {
    const result = sanitizePostgREST("123 456");
    expect(result).toBe("123 456");
  });

  it("handles empty strings", () => {
    const result = sanitizePostgREST("");
    expect(result).toBe("");
  });

  it("handles whitespace-only strings", () => {
    const result = sanitizePostgREST("   ");
    expect(result).toBe("");
  });

  it("trims leading whitespace", () => {
    const result = sanitizePostgREST("   John");
    expect(result).toBe("John");
  });

  it("trims trailing whitespace", () => {
    const result = sanitizePostgREST("Smith   ");
    expect(result).toBe("Smith");
  });

  it("trims both leading and trailing whitespace", () => {
    const result = sanitizePostgREST("   John Smith   ");
    expect(result).toBe("John Smith");
  });

  it("truncates long queries to 100 characters", () => {
    const longQuery = "a".repeat(150);
    const result = sanitizePostgREST(longQuery);
    expect(result.length).toBe(100);
  });

  it("does not truncate queries exactly 100 characters", () => {
    const query = "a".repeat(100);
    const result = sanitizePostgREST(query);
    expect(result.length).toBe(100);
  });

  it("handles multiple special characters together", () => {
    const result = sanitizePostgREST("test%_query*");
    expect(result).toBe("test\\%\\_query\\*");
  });

  it("handles all escape characters in one query", () => {
    const result = sanitizePostgREST("%_%_.,()");
    expect(result).toBe("\\%\\_\\%\\_\\.\\,\\(\\)");
  });

  it("escapes backslash first (prevents double-escaping)", () => {
    const result = sanitizePostgREST("\\");
    expect(result).toBe("\\\\");
  });

  it("preserves internal spaces", () => {
    const result = sanitizePostgREST("John  Smith");
    expect(result).toBe("John  Smith");
  });

  it("handles mixed case normally", () => {
    const result = sanitizePostgREST("JoHn SmItH");
    expect(result).toBe("JoHn SmItH");
  });

  it("handles apostrophes normally", () => {
    const result = sanitizePostgREST("Smith's");
    expect(result).toBe("Smith's");
  });

  it("handles hyphens normally", () => {
    const result = sanitizePostgREST("first-name");
    expect(result).toBe("first-name");
  });

  it("handles at signs normally", () => {
    const result = sanitizePostgREST("email@test.com");
    expect(result).toBe("email@test\\.com");
  });

  it("handles ampersands normally", () => {
    const result = sanitizePostgREST("Tom & Jerry");
    expect(result).toBe("Tom & Jerry");
  });

  it("truncates after escaping", () => {
    const longQuery = "a".repeat(95) + "%%%%%";
    const result = sanitizePostgREST(longQuery);
    expect(result.length).toBeLessThanOrEqual(100);
  });

  it("preserves order of escape operations", () => {
    const result = sanitizePostgREST("a%b_c");
    expect(result).toBe("a\\%b\\_c");
  });

  it("handles repeated same special character", () => {
    const result = sanitizePostgREST("%%%");
    expect(result).toBe("\\%\\%\\%");
  });
});
