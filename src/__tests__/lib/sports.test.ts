import { describe, it, expect } from "vitest";
import { VALID_SPORTS, SPORT_META, isValidSport } from "@/lib/sports";

describe("Sports Configuration", () => {
  it("should have 7 valid sports", () => {
    expect(VALID_SPORTS).toHaveLength(7);
  });

  it("should include all expected sports", () => {
    expect(VALID_SPORTS).toContain("football");
    expect(VALID_SPORTS).toContain("basketball");
    expect(VALID_SPORTS).toContain("baseball");
    expect(VALID_SPORTS).toContain("track-field");
    expect(VALID_SPORTS).toContain("lacrosse");
    expect(VALID_SPORTS).toContain("wrestling");
    expect(VALID_SPORTS).toContain("soccer");
  });

  it("isValidSport should return true for valid sports", () => {
    expect(isValidSport("football")).toBe(true);
    expect(isValidSport("basketball")).toBe(true);
    expect(isValidSport("baseball")).toBe(true);
  });

  it("isValidSport should return false for invalid sports", () => {
    expect(isValidSport("hockey")).toBe(false);
    expect(isValidSport("")).toBe(false);
    expect(isValidSport("FOOTBALL")).toBe(false);
  });

  it("every sport should have metadata", () => {
    for (const sport of VALID_SPORTS) {
      const meta = SPORT_META[sport];
      expect(meta).toBeDefined();
      expect(meta.name).toBeTruthy();
      expect(meta.emoji).toBeTruthy();
      expect(meta.color).toBeTruthy();
      expect(meta.statCategories).toBeInstanceOf(Array);
      expect(meta.statCategories.length).toBeGreaterThan(0);
    }
  });
});
