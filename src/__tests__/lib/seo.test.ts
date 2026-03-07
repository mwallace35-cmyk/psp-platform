import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "@/lib/seo";

describe("SEO Metadata Generation", () => {
  it("should generate homepage metadata", () => {
    const meta = generatePageMetadata({ pageType: "homepage" });
    expect(meta.title).toContain("PhillySportsPack");
    expect(meta.description).toBeTruthy();
    expect(meta.openGraph?.images).toBeDefined();
  });

  it("should generate sport hub metadata", () => {
    const meta = generatePageMetadata({ pageType: "sport-hub", sport: "football" });
    expect(meta.title).toContain("Football");
    expect(meta.description).toContain("football");
  });

  it("should generate player metadata", () => {
    const meta = generatePageMetadata({
      pageType: "player-career",
      sport: "football",
      playerName: "Test Player",
      slug: "test-player",
    });
    expect(meta.title).toContain("Test Player");
    expect(meta.title).toContain("Football");
  });

  it("should generate school metadata", () => {
    const meta = generatePageMetadata({
      pageType: "school-profile",
      sport: "basketball",
      schoolName: "Test School",
      slug: "test-school",
    });
    expect(meta.title).toContain("Test School");
    expect(meta.title).toContain("Basketball");
  });

  it("should generate search metadata", () => {
    const meta = generatePageMetadata({
      pageType: "search",
      query: "Jones",
      count: 15,
    });
    expect(meta.title).toContain("Jones");
    expect(meta.description).toContain("15");
  });

  it("should always include openGraph data", () => {
    const types = ["homepage", "sport-hub", "articles", "potw", "events"] as const;
    for (const pageType of types) {
      const meta = generatePageMetadata({
        pageType,
        sport: pageType === "sport-hub" ? "football" : undefined
      });
      expect(meta.openGraph).toBeDefined();
      expect(meta.openGraph?.title).toBeTruthy();
    }
  });
});
