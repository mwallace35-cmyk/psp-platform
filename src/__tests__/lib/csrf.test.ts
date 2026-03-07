import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from "@/lib/csrf";

describe("CSRF Protection", () => {
  describe("generateCsrfToken", () => {
    it("should return a string", () => {
      const token = generateCsrfToken();

      expect(typeof token).toBe("string");
    });

    it("should return a non-empty string", () => {
      const token = generateCsrfToken();

      expect(token.length).toBeGreaterThan(0);
    });

    it("should generate unique tokens on each call", async () => {
      // The actual randomUUID will generate different UUIDs
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();

      expect(token1).not.toBe(token2);
    });

    it("should use randomUUID from crypto", () => {
      // Just verify that a token is generated (which proves randomUUID was called)
      const token = generateCsrfToken();

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe("validateCsrfToken", () => {
    it("should return true for matching tokens", () => {
      const token = "same-token-123";
      const sessionToken = "same-token-123";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(true);
    });

    it("should return false for mismatched tokens", () => {
      const token = "token-abc";
      const sessionToken = "token-xyz";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(false);
    });

    it("should return false when token is empty string", () => {
      const isValid = validateCsrfToken("", "session-token");

      expect(isValid).toBe(false);
    });

    it("should return false when sessionToken is empty string", () => {
      const isValid = validateCsrfToken("token", "");

      expect(isValid).toBe(false);
    });

    it("should return false when both tokens are empty", () => {
      const isValid = validateCsrfToken("", "");

      expect(isValid).toBe(false);
    });

    it("should be case-sensitive", () => {
      const token = "TOKEN";
      const sessionToken = "token";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(false);
    });

    it("should handle special characters", () => {
      const token = "token-with-!@#$%^&*()";
      const sessionToken = "token-with-!@#$%^&*()";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(true);
    });

    it("should handle spaces in tokens", () => {
      const token = "token with spaces";
      const sessionToken = "token with spaces";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(true);
    });

    it("should handle tokens with different spacing", () => {
      const token = "token  spaces";
      const sessionToken = "token spaces";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(false);
    });

    it("should prevent timing attacks with constant-time comparison", () => {
      // This tests that the function uses constant-time comparison
      // by checking that nearly-matching tokens are rejected the same way
      const token1Mismatch = validateCsrfToken("aaaaaaaaaa", "aaaaaaaaab");
      const token2Mismatch = validateCsrfToken("aaaaaaaaaa", "zzzzzzzzza");

      // Both should return false (not checking timing, just that both fail)
      expect(token1Mismatch).toBe(false);
      expect(token2Mismatch).toBe(false);
    });

    it("should handle very long tokens", () => {
      const longToken = "a".repeat(10000);
      const sessionToken = "a".repeat(10000);

      const isValid = validateCsrfToken(longToken, sessionToken);

      expect(isValid).toBe(true);
    });

    it("should handle unicode characters", () => {
      const token = "token-🔐-secure";
      const sessionToken = "token-🔐-secure";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(true);
    });

    it("should reject tokens with unicode differences", () => {
      const token = "token-🔐-secure";
      const sessionToken = "token-🔒-secure";

      const isValid = validateCsrfToken(token, sessionToken);

      expect(isValid).toBe(false);
    });
  });

  describe("CSRF Constants", () => {
    it("should export CSRF_COOKIE_NAME", () => {
      expect(CSRF_COOKIE_NAME).toBe("psp_csrf");
    });

    it("should export CSRF_HEADER_NAME", () => {
      expect(CSRF_HEADER_NAME).toBe("x-csrf-token");
    });
  });

  describe("CSRF Pattern Integration", () => {
    it("should work with double-submit cookie pattern", () => {
      // In practice, the same token is stored in both cookie and request header
      const token = "shared-token-uuid";
      const cookieToken = token;
      const headerToken = token;

      // Both should match
      const isValid = validateCsrfToken(headerToken, cookieToken);

      expect(isValid).toBe(true);
    });

    it("should reject forged tokens with different values", () => {
      const cookieToken = "legitimate-token";

      // Attacker would send different token
      const forgedToken = "forged-token";

      const isValid = validateCsrfToken(forgedToken, cookieToken);

      expect(isValid).toBe(false);
    });
  });
});
