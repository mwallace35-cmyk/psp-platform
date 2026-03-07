import { describe, it, expect } from "vitest";

/**
 * Data contract tests verify the STAT_TABLE_MAP configuration
 * and cross-sport abstraction without needing a database connection.
 */

// Import the stat table mapping (we test the configuration, not the queries)
import { VALID_SPORTS, SPORT_META } from "@/lib/sports";

describe("Data Layer Contracts", () => {
  describe("STAT_TABLE_MAP coverage", () => {
    it("football should have rushing, passing, receiving, scoring categories", () => {
      const fbMeta = SPORT_META["football"];
      expect(fbMeta.statCategories).toContain("rushing");
      expect(fbMeta.statCategories).toContain("passing");
      expect(fbMeta.statCategories).toContain("receiving");
      expect(fbMeta.statCategories).toContain("scoring");
    });

    it("basketball should have scoring, rebounds, assists categories", () => {
      const bbMeta = SPORT_META["basketball"];
      expect(bbMeta.statCategories).toContain("scoring");
      expect(bbMeta.statCategories).toContain("rebounds");
      expect(bbMeta.statCategories).toContain("assists");
    });

    it("baseball should have batting and pitching categories", () => {
      const baseMeta = SPORT_META["baseball"];
      expect(baseMeta.statCategories).toContain("batting");
      expect(baseMeta.statCategories).toContain("pitching");
    });
  });

  describe("Sport slug validation", () => {
    it("sport slugs should be URL-safe", () => {
      for (const sport of VALID_SPORTS) {
        expect(sport).toMatch(/^[a-z0-9-]+$/);
        expect(sport).not.toContain(" ");
        expect(sport).not.toContain("_");
      }
    });

    it("sport names should be human-readable", () => {
      for (const sport of VALID_SPORTS) {
        const name = SPORT_META[sport].name;
        expect(name.length).toBeGreaterThan(0);
        expect(name[0]).toEqual(name[0].toUpperCase());
      }
    });
  });
});
