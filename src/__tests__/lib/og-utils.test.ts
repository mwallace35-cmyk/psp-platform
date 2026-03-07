import { describe, it, expect, beforeEach } from "vitest";
import {
  getSportColors,
  truncateText,
  truncateTitle,
  truncateSubtitle,
  buildOgImageUrl,
  validateOGParams,
  type OGImageParams,
  type SportColorMap,
} from "@/lib/og-utils";

describe("OG Utils - Sport Colors", () => {
  it("should return correct colors for football", () => {
    const colors = getSportColors("football");
    expect(colors.primary).toBe("#16a34a");
    expect(colors.secondary).toBe("#0f5132");
    expect(colors.accent).toBe("#22c55e");
    expect(colors.text).toBe("#ffffff");
  });

  it("should return correct colors for basketball", () => {
    const colors = getSportColors("basketball");
    expect(colors.primary).toBe("#ea580c");
    expect(colors.secondary).toBe("#7c2d12");
  });

  it("should return correct colors for baseball", () => {
    const colors = getSportColors("baseball");
    expect(colors.primary).toBe("#dc2626");
    expect(colors.secondary).toBe("#7f1d1d");
  });

  it("should return correct colors for lacrosse", () => {
    const colors = getSportColors("lacrosse");
    expect(colors.primary).toBe("#0891b2");
    expect(colors.secondary).toBe("#155e75");
  });

  it("should return correct colors for wrestling", () => {
    const colors = getSportColors("wrestling");
    expect(colors.primary).toBe("#ca8a04");
  });

  it("should return correct colors for soccer", () => {
    const colors = getSportColors("soccer");
    expect(colors.primary).toBe("#059669");
  });

  it("should return correct colors for track-field", () => {
    const colors = getSportColors("track-field");
    expect(colors.primary).toBe("#7c3aed");
  });

  it("should return PSP brand colors for undefined sport", () => {
    const colors = getSportColors(undefined);
    expect(colors.primary).toBe("#0a1628");
    expect(colors.secondary).toBe("#1a365d");
    expect(colors.accent).toBe("#2563eb");
  });

  it("should return PSP brand colors for invalid sport", () => {
    const colors = getSportColors("invalid" as any);
    expect(colors.primary).toBe("#0a1628");
  });

  it("should have all required color properties", () => {
    const colors = getSportColors("football");
    expect(colors).toHaveProperty("primary");
    expect(colors).toHaveProperty("secondary");
    expect(colors).toHaveProperty("accent");
    expect(colors).toHaveProperty("text");
  });
});

describe("OG Utils - Text Truncation", () => {
  it("should not truncate short text", () => {
    const text = "Short title";
    expect(truncateText(text, 20)).toBe(text);
  });

  it("should truncate long text with ellipsis", () => {
    const text = "This is a very long title that needs to be truncated";
    const result = truncateText(text, 20);
    expect(result).toHaveLength(20);
    expect(result.endsWith("...")).toBe(true);
  });

  it("should use default max chars of 60", () => {
    const text = "a".repeat(100);
    const result = truncateText(text);
    expect(result).toHaveLength(60);
    expect(result.endsWith("...")).toBe(true);
  });

  it("should truncate title to 50 chars", () => {
    const longTitle = "This is an incredibly long title that definitely needs truncation";
    const result = truncateTitle(longTitle);
    expect(result.length).toBeLessThanOrEqual(50);
  });

  it("should truncate subtitle to 80 chars", () => {
    const longSubtitle = "This is a very long subtitle with a lot of additional context that might be important but needs to fit in the OG image";
    const result = truncateSubtitle(longSubtitle);
    expect(result.length).toBeLessThanOrEqual(80);
  });

  it("should handle empty strings", () => {
    expect(truncateText("", 10)).toBe("");
    expect(truncateTitle("")).toBe("");
  });

  it("should handle special characters in text", () => {
    const text = "Title with special chars: & < > \"";
    const result = truncateText(text, 30);
    expect(result).toContain("special");
  });
});

describe("OG Utils - URL Builder", () => {
  beforeEach(() => {
    // Reset env var before each test
    delete process.env.NEXT_PUBLIC_APP_URL;
  });

  it("should build URL with title only", () => {
    const url = buildOgImageUrl({ title: "Test Title" });
    expect(url).toContain("/api/og?");
    expect(url).toContain("title=Test+Title");
  });

  it("should build URL with title and subtitle", () => {
    const url = buildOgImageUrl({
      title: "Test Title",
      subtitle: "Test Subtitle",
    });
    expect(url).toContain("title=Test+Title");
    expect(url).toContain("subtitle=Test+Subtitle");
  });

  it("should include sport in URL", () => {
    const url = buildOgImageUrl({
      title: "Football Stats",
      sport: "football",
    });
    expect(url).toContain("sport=football");
  });

  it("should include type in URL", () => {
    const url = buildOgImageUrl({
      title: "Player Profile",
      type: "player",
    });
    expect(url).toContain("type=player");
  });

  it("should include all parameters", () => {
    const url = buildOgImageUrl({
      title: "John Smith",
      subtitle: "Football Career",
      sport: "football",
      type: "player",
    });
    expect(url).toContain("title=");
    expect(url).toContain("subtitle=");
    expect(url).toContain("sport=football");
    expect(url).toContain("type=player");
  });

  it("should use default base URL when env var not set", () => {
    const url = buildOgImageUrl({ title: "Test" });
    expect(url).toContain("https://phillysportspack.com");
  });

  it("should use NEXT_PUBLIC_APP_URL when set", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://custom-domain.com";
    const url = buildOgImageUrl({ title: "Test" });
    expect(url).toContain("https://custom-domain.com");
  });

  it("should truncate long titles in URL", () => {
    const longTitle = "a".repeat(100);
    const url = buildOgImageUrl({ title: longTitle });
    // Title should be truncated to 50 chars max (47 chars + "...")
    expect(url.length).toBeLessThan(300);
  });

  it("should properly encode special characters", () => {
    const url = buildOgImageUrl({
      title: "Test & Title",
      subtitle: "With < and >",
    });
    expect(url).toContain("Test");
    expect(url).toContain("Title");
  });

  it("should handle all sport types", () => {
    const sports = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"];
    for (const sport of sports) {
      const url = buildOgImageUrl({
        title: "Test",
        sport: sport as any,
      });
      expect(url).toContain(`sport=${sport}`);
    }
  });

  it("should handle all content types", () => {
    const types = ["player", "team", "school", "article", "sport"];
    for (const type of types) {
      const url = buildOgImageUrl({
        title: "Test",
        type: type as any,
      });
      expect(url).toContain(`type=${type}`);
    }
  });
});

describe("OG Utils - Parameter Validation", () => {
  it("should validate valid parameters", () => {
    const result = validateOGParams({ title: "Valid Title" });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject empty title", () => {
    const result = validateOGParams({ title: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Title is required");
  });

  it("should reject missing title", () => {
    const result = validateOGParams({ title: "" });
    expect(result.valid).toBe(false);
  });

  it("should reject title longer than 200 chars", () => {
    const longTitle = "a".repeat(201);
    const result = validateOGParams({ title: longTitle });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Title must be less than 200 characters");
  });

  it("should reject subtitle longer than 300 chars", () => {
    const result = validateOGParams({
      title: "Valid",
      subtitle: "a".repeat(301),
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Subtitle must be less than 300 characters");
  });

  it("should accept long but valid title", () => {
    const validTitle = "a".repeat(200);
    const result = validateOGParams({ title: validTitle });
    expect(result.valid).toBe(true);
  });

  it("should accept long but valid subtitle", () => {
    const result = validateOGParams({
      title: "Valid",
      subtitle: "b".repeat(300),
    });
    expect(result.valid).toBe(true);
  });

  it("should handle whitespace-only titles", () => {
    const result = validateOGParams({ title: "   " });
    expect(result.valid).toBe(false);
  });

  it("should allow optional parameters", () => {
    const result = validateOGParams({
      title: "Valid Title",
      subtitle: undefined,
      sport: undefined,
      type: undefined,
    });
    expect(result.valid).toBe(true);
  });
});

describe("OG Utils - Integration", () => {
  it("should handle complete player profile flow", () => {
    const params = {
      title: "John Smith",
      subtitle: "Football Player",
      sport: "football" as const,
      type: "player" as const,
    };

    const validation = validateOGParams(params);
    expect(validation.valid).toBe(true);

    const url = buildOgImageUrl(params);
    expect(url).toContain("title=");
    expect(url).toContain("sport=football");
    expect(url).toContain("type=player");

    const colors = getSportColors("football");
    expect(colors.primary).toBe("#16a34a");
  });

  it("should handle school profile flow", () => {
    const params = {
      title: "St. Joseph's Prep",
      subtitle: "Basketball School",
      sport: "basketball" as const,
      type: "school" as const,
    };

    const validation = validateOGParams(params);
    expect(validation.valid).toBe(true);

    const url = buildOgImageUrl(params);
    expect(url).toContain("type=school");

    const colors = getSportColors("basketball");
    expect(colors.primary).toBe("#ea580c");
  });

  it("should handle article flow", () => {
    const params = {
      title: "Breaking News: Champions Crowned",
      subtitle: "Season Finale Results",
      sport: "baseball" as const,
      type: "article" as const,
    };

    const validation = validateOGParams(params);
    expect(validation.valid).toBe(true);

    const url = buildOgImageUrl(params);
    expect(url).toContain("type=article");
  });
});
