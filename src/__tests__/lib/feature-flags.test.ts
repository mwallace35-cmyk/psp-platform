import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  FeatureFlag,
  isFeatureEnabled,
  getAllFeatureFlags,
  getFeatureFlagMetadata,
  initializeFeatureFlagCache,
  isFeatureEnabledCached,
  resetFeatureFlagCache,
} from '@/lib/feature-flags';

describe('Feature Flags System', () => {
  beforeEach(() => {
    resetFeatureFlagCache();
    // Clear environment variables
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('NEXT_PUBLIC_FEATURE_')) {
        delete process.env[key];
      }
    });
  });

  afterEach(() => {
    resetFeatureFlagCache();
  });

  describe('isFeatureEnabled', () => {
    it('should return default value when env var is not set', () => {
      const result = isFeatureEnabled(FeatureFlag.DARK_MODE);
      expect(typeof result).toBe('boolean');
    });

    it('should read from environment variables', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'true';
      expect(isFeatureEnabled(FeatureFlag.DARK_MODE)).toBe(true);

      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'false';
      expect(isFeatureEnabled(FeatureFlag.DARK_MODE)).toBe(false);
    });

    it('should handle "1" as true', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = '1';
      expect(isFeatureEnabled(FeatureFlag.DARK_MODE)).toBe(true);
    });

    it('should handle "yes" as true', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'yes';
      expect(isFeatureEnabled(FeatureFlag.DARK_MODE)).toBe(true);
    });

    it('should handle other values as false', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'random';
      expect(isFeatureEnabled(FeatureFlag.DARK_MODE)).toBe(false);
    });
  });

  describe('getAllFeatureFlags', () => {
    it('should return all flags with their current state', () => {
      const flags = getAllFeatureFlags();
      expect(typeof flags).toBe('object');
      expect(flags[FeatureFlag.DARK_MODE]).toBeDefined();
      expect(flags[FeatureFlag.SENTRY_ENABLED]).toBeDefined();
      expect(flags[FeatureFlag.SESSION_REPLAY]).toBeDefined();
    });

    it('should include all FeatureFlag enum values', () => {
      const flags = getAllFeatureFlags();
      for (const flag of Object.values(FeatureFlag)) {
        expect(flags[flag]).toBeDefined();
      }
    });
  });

  describe('getFeatureFlagMetadata', () => {
    it('should return metadata for all flags', () => {
      const metadata = getFeatureFlagMetadata();
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata.length).toBeGreaterThan(0);
    });

    it('should include name, description, enabled, and default', () => {
      const metadata = getFeatureFlagMetadata();
      const darkModeFlag = metadata.find((m) => m.name === FeatureFlag.DARK_MODE);

      expect(darkModeFlag).toBeDefined();
      expect(darkModeFlag?.name).toBe(FeatureFlag.DARK_MODE);
      expect(typeof darkModeFlag?.description).toBe('string');
      expect(typeof darkModeFlag?.enabled).toBe('boolean');
      expect(typeof darkModeFlag?.default).toBe('boolean');
    });
  });

  describe('Feature Flag Cache', () => {
    it('should initialize cache on first call', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'true';
      initializeFeatureFlagCache();

      // Change env var after caching
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'false';

      // Cached value should not reflect change
      expect(isFeatureEnabledCached(FeatureFlag.DARK_MODE)).toBe(true);
    });

    it('should use cached value after initialization', () => {
      initializeFeatureFlagCache();
      const first = isFeatureEnabledCached(FeatureFlag.DARK_MODE);
      const second = isFeatureEnabledCached(FeatureFlag.DARK_MODE);

      expect(first).toBe(second);
    });

    it('should reset cache properly', () => {
      process.env.NEXT_PUBLIC_FEATURE_DARK_MODE = 'true';
      initializeFeatureFlagCache();
      expect(isFeatureEnabledCached(FeatureFlag.DARK_MODE)).toBe(true);

      resetFeatureFlagCache();
      delete process.env.NEXT_PUBLIC_FEATURE_DARK_MODE;
      initializeFeatureFlagCache();
      // Should now use default
      const result = isFeatureEnabledCached(FeatureFlag.DARK_MODE);
      expect(typeof result).toBe('boolean');
    });

    it('should auto-initialize cache if not already initialized', () => {
      resetFeatureFlagCache();
      const result = isFeatureEnabledCached(FeatureFlag.DARK_MODE);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Feature Flag Values', () => {
    it('should have all expected flags defined', () => {
      const expectedFlags = [
        'DARK_MODE',
        'THEME_SWITCHER',
        'SENTRY_ENABLED',
        'SESSION_REPLAY',
        'ERROR_BOUNDARIES',
        'REDIS_RATE_LIMIT',
        'REDIS_CACHE',
        'EDGE_CACHING',
        'AI_ARTICLE_GENERATION',
        'AI_CORRECTIONS_ASSISTANT',
        'CIRCUIT_BREAKER',
        'EVENT_BUS',
        'ANALYTICS_TRACKING',
        'HEATMAP_TRACKING',
        'ADMIN_DASHBOARD',
        'ADMIN_AUDIT_LOG',
      ];

      for (const flag of expectedFlags) {
        expect((FeatureFlag as any)[flag]).toBeDefined();
      }
    });

    it('should have sensible defaults for production', () => {
      process.env.NODE_ENV = 'production';
      const flags = getAllFeatureFlags();

      // These should typically be true in production
      expect(flags[FeatureFlag.ERROR_BOUNDARIES]).toBe(true);
      expect(flags[FeatureFlag.ADMIN_DASHBOARD]).toBe(true);
    });
  });
});
