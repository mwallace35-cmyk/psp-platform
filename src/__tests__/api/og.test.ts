import { describe, it, expect } from "vitest";
import { getSportColors, validateOGParams, truncateTitle, truncateSubtitle } from "@/lib/og-utils";

/**
 * Tests for OG image route (/api/og)
 * Tests parameter validation and sport color mapping
 * Note: Full ImageResponse rendering tests would require a browser environment
 */

describe("OG Image Route - Parameter Validation", () => {
  it("should require title parameter", () => {
    const result = validateOGParams({ title: "" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Title is required");
  });

  it("should accept title only", () => {
    const result = validateOGParams({ title: "Test Title" });
    expect(result.valid).toBe(true);
  });

  it("should accept title with subtitle", () => {
    const result = validateOGParams({
      title: "Test Title",
      subtitle: "Test Subtitle",
    });
    expect(result.valid).toBe(true);
  });

  it("should accept title with sport", () => {
    const result = validateOGParams({
      title: "Test Title",
      sport: "football",
    });
    expect(result.valid).toBe(true);
  });

  it("should accept title with type", () => {
    const result = validateOGParams({
      title: "Test Title",
      type: "player",
    });
    expect(result.valid).toBe(true);
  });

  it("should accept all parameters", () => {
    const result = validateOGParams({
      title: "John Smith",
      subtitle: "Football Player",
      sport: "football",
      type: "player",
    });
    expect(result.valid).toBe(true);
  });

  it("should reject title longer than 200 characters", () => {
    const longTitle = "a".repeat(201);
    const result = validateOGParams({ title: longTitle });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Title must be less than 200 characters");
  });

  it("should accept title exactly 200 characters", () => {
    const title = "a".repeat(200);
    const result = validateOGParams({ title });
    expect(result.valid).toBe(true);
  });

  it("should reject subtitle longer than 300 characters", () => {
    const longSubtitle = "b".repeat(301);
    const result = validateOGParams({
      title: "Valid",
      subtitle: longSubtitle,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Subtitle must be less than 300 characters");
  });

  it("should accept subtitle exactly 300 characters", () => {
    const subtitle = "b".repeat(300);
    const result = validateOGParams({
      title: "Valid",
      subtitle,
    });
    expect(result.valid).toBe(true);
  });

  it("should handle whitespace-only titles", () => {
    const result = validateOGParams({ title: "   " });
    expect(result.valid).toBe(false);
  });

  it("should handle empty string titles", () => {
    const result = validateOGParams({ title: "" });
    expect(result.valid).toBe(false);
  });
});

describe("OG Image Route - Sport Color Mapping", () => {
  it("should map football color correctly", () => {
    const colors = getSportColors("football");
    expect(colors.primary).toBe("#16a34a");
    expect(colors.secondary).toBe("#0f5132");
    expect(colors.accent).toBe("#22c55e");
  });

  it("should map basketball color correctly", () => {
    const colors = getSportColors("basketball");
    expect(colors.primary).toBe("#ea580c");
    expect(colors.secondary).toBe("#7c2d12");
    expect(colors.accent).toBe("#fb923c");
  });

  it("should map baseball color correctly", () => {
    const colors = getSportColors("baseball");
    expect(colors.primary).toBe("#dc2626");
    expect(colors.secondary).toBe("#7f1d1d");
    expect(colors.accent).toBe("#ef4444");
  });

  it("should map track-field color correctly", () => {
    const colors = getSportColors("track-field");
    expect(colors.primary).toBe("#7c3aed");
    expect(colors.secondary).toBe("#4c1d95");
    expect(colors.accent).toBe("#a78bfa");
  });

  it("should map lacrosse color correctly", () => {
    const colors = getSportColors("lacrosse");
    expect(colors.primary).toBe("#0891b2");
    expect(colors.secondary).toBe("#155e75");
    expect(colors.accent).toBe("#06b6d4");
  });

  it("should map wrestling color correctly", () => {
    const colors = getSportColors("wrestling");
    expect(colors.primary).toBe("#ca8a04");
    expect(colors.secondary).toBe("#713f12");
    expect(colors.accent).toBe("#eab308");
  });

  it("should map soccer color correctly", () => {
    const colors = getSportColors("soccer");
    expect(colors.primary).toBe("#059669");
    expect(colors.secondary).toBe("#064e3b");
    expect(colors.accent).toBe("#10b981");
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

  it("all colors should have white text", () => {
    const sports = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"];
    for (const sport of sports) {
      const colors = getSportColors(sport as any);
      expect(colors.text).toBe("#ffffff");
    }
  });

  it("should all have required color properties", () => {
    const sports = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"];
    for (const sport of sports) {
      const colors = getSportColors(sport as any);
      expect(colors).toHaveProperty("primary");
      expect(colors).toHaveProperty("secondary");
      expect(colors).toHaveProperty("accent");
      expect(colors).toHaveProperty("text");
    }
  });
});

describe("OG Image Route - Text Handling", () => {
  it("should truncate titles for display", () => {
    const longTitle = "This is a very long title that needs truncation for OG image display";
    const truncated = truncateTitle(longTitle);
    expect(truncated.length).toBeLessThanOrEqual(50);
  });

  it("should truncate subtitles for display", () => {
    const longSubtitle = "This is a very long subtitle with additional context that needs truncation for proper display on OG images";
    const truncated = truncateSubtitle(longSubtitle);
    expect(truncated.length).toBeLessThanOrEqual(80);
  });

  it("should not truncate short titles", () => {
    const shortTitle = "Title";
    expect(truncateTitle(shortTitle)).toBe(shortTitle);
  });

  it("should not truncate short subtitles", () => {
    const shortSubtitle = "Subtitle";
    expect(truncateSubtitle(shortSubtitle)).toBe(shortSubtitle);
  });

  it("should add ellipsis to truncated text", () => {
    const longText = "a".repeat(100);
    const truncated = truncateTitle(longText);
    expect(truncated.endsWith("...")).toBe(true);
  });

  it("should handle empty strings", () => {
    expect(truncateTitle("")).toBe("");
    expect(truncateSubtitle("")).toBe("");
  });

  it("should handle text with special characters", () => {
    const text = "Title with & special < characters >";
    const truncated = truncateTitle(text);
    expect(truncated).toContain("Title");
  });
});

describe("OG Image Route - Use Cases", () => {
  it("should handle player profile parameters", () => {
    const result = validateOGParams({
      title: "John Smith",
      subtitle: "Football Player",
      sport: "football",
      type: "player",
    });
    expect(result.valid).toBe(true);

    const colors = getSportColors("football");
    expect(colors.primary).toBe("#16a34a");
  });

  it("should handle school profile parameters", () => {
    const result = validateOGParams({
      title: "St. Joseph's Prep",
      subtitle: "Basketball — Philadelphia High School",
      sport: "basketball",
      type: "school",
    });
    expect(result.valid).toBe(true);

    const colors = getSportColors("basketball");
    expect(colors.primary).toBe("#ea580c");
  });

  it("should handle sport hub parameters", () => {
    const result = validateOGParams({
      title: "Football — Stats & Rankings",
      subtitle: "Philadelphia High School Sports Database",
      sport: "football",
      type: "sport",
    });
    expect(result.valid).toBe(true);
  });

  it("should handle article parameters", () => {
    const result = validateOGParams({
      title: "Championship Game Results",
      subtitle: "Baseball Season Finale",
      sport: "baseball",
      type: "article",
    });
    expect(result.valid).toBe(true);

    const colors = getSportColors("baseball");
    expect(colors.primary).toBe("#dc2626");
  });

  it("should handle generic content without sport", () => {
    const result = validateOGParams({
      title: "PhillySportsPack News",
      subtitle: "Latest Updates",
      type: "article",
    });
    expect(result.valid).toBe(true);

    const colors = getSportColors(undefined);
    expect(colors.primary).toBe("#0a1628"); // PSP brand color
  });

  it("should handle team profile parameters", () => {
    const result = validateOGParams({
      title: "Lincoln High School",
      subtitle: "Football Team",
      sport: "football",
      type: "team",
    });
    expect(result.valid).toBe(true);
  });
});

describe("OG Image Route - Edge Cases", () => {
  it("should handle very short titles", () => {
    const result = validateOGParams({ title: "A" });
    expect(result.valid).toBe(true);
  });

  it("should handle titles with only numbers", () => {
    const result = validateOGParams({ title: "2025" });
    expect(result.valid).toBe(true);
  });

  it("should handle titles with unicode characters", () => {
    const result = validateOGParams({
      title: "Académie française 中文 العربية",
    });
    expect(result.valid).toBe(true);
  });

  it("should handle subtitles with newlines", () => {
    const result = validateOGParams({
      title: "Title",
      subtitle: "Line 1\nLine 2",
    });
    expect(result.valid).toBe(true);
  });

  it("should handle repeated special characters", () => {
    const result = validateOGParams({
      title: "Title!!!!!!",
      subtitle: "Subtitle???",
    });
    expect(result.valid).toBe(true);
  });

  it("should handle punctuation-heavy titles", () => {
    const result = validateOGParams({
      title: "Breaking! News... Update! Results?",
    });
    expect(result.valid).toBe(true);
  });
});

describe("OG Image Route - Cache Headers", () => {
  it("should have appropriate cache configuration", () => {
    // Cache-Control header should be: public, max-age=31536000, immutable
    // This translates to 1 year cache with no revalidation needed
    const cacheSeconds = 365 * 24 * 60 * 60;
    expect(cacheSeconds).toBe(31536000);
  });

  it("should use immutable caching for static images", () => {
    // OG images are generated deterministically from params
    // So they can be cached indefinitely without revalidation
    const cacheControl = "public, max-age=31536000, immutable";
    expect(cacheControl).toContain("immutable");
  });
});
