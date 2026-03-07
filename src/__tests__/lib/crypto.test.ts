import { describe, it, expect } from "vitest";
import { timingSafeEqual } from "@/lib/crypto";

describe("crypto utilities", () => {
  describe("timingSafeEqual", () => {
    it("should return true for identical strings", () => {
      expect(timingSafeEqual("test", "test")).toBe(true);
      expect(timingSafeEqual("secret-key-123", "secret-key-123")).toBe(true);
      expect(timingSafeEqual("Bearer token123", "Bearer token123")).toBe(true);
    });

    it("should return false for different strings", () => {
      expect(timingSafeEqual("test1", "test2")).toBe(false);
      expect(timingSafeEqual("secret-key-123", "secret-key-456")).toBe(false);
      expect(timingSafeEqual("Bearer token1", "Bearer token2")).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(timingSafeEqual("", "")).toBe(false);
      expect(timingSafeEqual("", "test")).toBe(false);
      expect(timingSafeEqual("test", "")).toBe(false);
    });

    it("should handle different length strings", () => {
      expect(timingSafeEqual("short", "much-longer-string")).toBe(false);
      expect(timingSafeEqual("a", "b")).toBe(false);
      expect(timingSafeEqual("abc", "abcdef")).toBe(false);
    });

    it("should handle special characters", () => {
      expect(timingSafeEqual("!@#$%^&*()", "!@#$%^&*()")).toBe(true);
      expect(timingSafeEqual("!@#$%^&*()", "!@#$%^&*(")).toBe(false);
    });

    it("should handle unicode characters", () => {
      expect(timingSafeEqual("café", "café")).toBe(true);
      expect(timingSafeEqual("café", "cafe")).toBe(false);
      expect(timingSafeEqual("你好", "你好")).toBe(true);
      expect(timingSafeEqual("你好", "再见")).toBe(false);
    });

    it("should work with Bearer token format", () => {
      const secret = "test-secret-key";
      const validHeader = `Bearer ${secret}`;
      expect(timingSafeEqual(validHeader, `Bearer ${secret}`)).toBe(true);
      expect(timingSafeEqual(validHeader, `Bearer wrong-key`)).toBe(false);
      expect(timingSafeEqual(validHeader, "Bearer ")).toBe(false);
    });

    it("should work with API key format", () => {
      const apiKey = "sk_live_abc123def456";
      expect(timingSafeEqual(apiKey, "sk_live_abc123def456")).toBe(true);
      expect(timingSafeEqual(apiKey, "sk_live_wrong")).toBe(false);
    });

    it("should maintain constant-time properties", () => {
      // This test verifies that the function performs comparison regardless of where strings differ
      // While we can't measure timing precisely in JS, we can verify the algorithm executes
      const secret = "a".repeat(100);
      const wrong1 = "b" + "a".repeat(99);
      const wrong2 = "a".repeat(99) + "b";

      // All should return false, and should take similar time due to constant-time algorithm
      expect(timingSafeEqual(secret, wrong1)).toBe(false);
      expect(timingSafeEqual(secret, wrong2)).toBe(false);
    });

    it("should handle whitespace", () => {
      expect(timingSafeEqual(" test ", " test ")).toBe(true);
      expect(timingSafeEqual(" test", "test ")).toBe(false);
      expect(timingSafeEqual("test\n", "test")).toBe(false);
      expect(timingSafeEqual("test ", "test")).toBe(false);
    });

    it("should handle very long strings", () => {
      const longString = "x".repeat(10000);
      expect(timingSafeEqual(longString, longString)).toBe(true);
      const longStringWithDiff = longString + "y";
      expect(timingSafeEqual(longString, longStringWithDiff)).toBe(false);
    });
  });
});
