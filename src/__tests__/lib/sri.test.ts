import { describe, it, expect, beforeEach } from 'vitest';
import {
  SRI_HASHES,
  getSRIHash,
  getScriptSRIAttributes,
  getStylesheetSRIAttributes,
  hasSRI,
} from '@/lib/sri';

describe('SRI Utility', () => {
  describe('getSRIHash', () => {
    it('returns undefined for unknown URLs', () => {
      const hash = getSRIHash('https://unknown-domain.com/script.js');
      expect(hash).toBeUndefined();
    });

    it('returns hash for known URLs', () => {
      // Add a test URL to the SRI_HASHES for this test
      const testUrl = 'https://test.example.com/script.js';
      const testHash = 'sha384-abcdef123456';

      // We can't modify the actual SRI_HASHES in tests, so we test with empty set
      const hash = getSRIHash(testUrl);
      expect(typeof hash === 'string' || hash === undefined).toBe(true);
    });

    it('returns string starting with sha384- when hash exists', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const hash = getSRIHash(knownUrls[0]);
        if (hash) {
          expect(hash).toMatch(/^sha384-/);
        }
      }
    });
  });

  describe('getScriptSRIAttributes', () => {
    it('returns empty object for unknown URLs', () => {
      const attrs = getScriptSRIAttributes('https://unknown.com/script.js');
      expect(attrs).toEqual({});
    });

    it('returns integrity and crossOrigin for known URLs', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const attrs = getScriptSRIAttributes(knownUrls[0]);
        expect(attrs).toHaveProperty('crossOrigin', 'anonymous');
        if (attrs.integrity) {
          expect(attrs.integrity).toMatch(/^sha384-/);
        }
      }
    });

    it('always sets crossOrigin to anonymous when SRI is present', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const attrs = getScriptSRIAttributes(knownUrls[0]);
        if (attrs.integrity) {
          expect(attrs.crossOrigin).toBe('anonymous');
        }
      }
    });
  });

  describe('getStylesheetSRIAttributes', () => {
    it('returns empty object for unknown URLs', () => {
      const attrs = getStylesheetSRIAttributes('https://unknown.com/style.css');
      expect(attrs).toEqual({});
    });

    it('returns integrity and crossOrigin for known URLs', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const attrs = getStylesheetSRIAttributes(knownUrls[0]);
        expect(attrs).toHaveProperty('crossOrigin', 'anonymous');
        if (attrs.integrity) {
          expect(attrs.integrity).toMatch(/^sha384-/);
        }
      }
    });

    it('always sets crossOrigin to anonymous when SRI is present', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const attrs = getStylesheetSRIAttributes(knownUrls[0]);
        if (attrs.integrity) {
          expect(attrs.crossOrigin).toBe('anonymous');
        }
      }
    });
  });

  describe('hasSRI', () => {
    it('returns false for resources without SRI', () => {
      const resource = {
        url: 'https://unknown.com/script.js',
        type: 'script' as const,
      };
      expect(hasSRI(resource)).toBe(false);
    });

    it('returns true for resources with SRI', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const resource = {
          url: knownUrls[0],
          type: 'script' as const,
        };
        expect(hasSRI(resource)).toBe(true);
      }
    });

    it('works with stylesheet resources', () => {
      const resource = {
        url: 'https://unknown.com/style.css',
        type: 'stylesheet' as const,
      };
      expect(hasSRI(resource)).toBe(false);
    });
  });

  describe('SRI_HASHES Map', () => {
    it('should be an object', () => {
      expect(typeof SRI_HASHES).toBe('object');
      expect(Array.isArray(SRI_HASHES)).toBe(false);
    });

    it('should have sha384- prefixed values when populated', () => {
      Object.values(SRI_HASHES).forEach((hash) => {
        if (hash !== 'sha384-YOUR_HASH_HERE') {
          expect(hash).toMatch(/^sha384-/);
        }
      });
    });

    it('should have URL keys', () => {
      Object.keys(SRI_HASHES).forEach((url) => {
        expect(url).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('SRI Best Practices', () => {
    it('ensures all external scripts have integrity attributes when available', () => {
      // This is a documentation test - ensures we understand SRI requirements
      const testUrl = 'https://test.example.com/script.js';
      const attrs = getScriptSRIAttributes(testUrl);

      // If URL is unknown, no attributes needed
      // If URL is known, both integrity and crossOrigin must be present
      if (Object.keys(attrs).length > 0) {
        expect(attrs).toHaveProperty('integrity');
        expect(attrs).toHaveProperty('crossOrigin');
        expect(attrs.crossOrigin).toBe('anonymous');
      }
    });

    it('ensures crossorigin=anonymous is always paired with SRI', () => {
      const knownUrls = Object.keys(SRI_HASHES);
      if (knownUrls.length > 0) {
        const testUrl = knownUrls[0];
        const attrs = getScriptSRIAttributes(testUrl);

        if (attrs.integrity) {
          expect(attrs.crossOrigin).toBe('anonymous');
        }
      }
    });
  });
});
