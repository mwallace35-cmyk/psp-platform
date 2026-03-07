/**
 * Feature Flags System for PSP Platform
 * Provides a simple but extensible way to manage feature toggles
 * Sources: environment variables (NEXT_PUBLIC_FEATURE_*), then defaults
 * Type-safe flag definitions with descriptions
 */

export enum FeatureFlag {
  // Theme and UI features
  DARK_MODE = 'DARK_MODE',
  THEME_SWITCHER = 'THEME_SWITCHER',

  // Error tracking and monitoring
  SENTRY_ENABLED = 'SENTRY_ENABLED',
  SESSION_REPLAY = 'SESSION_REPLAY',
  ERROR_BOUNDARIES = 'ERROR_BOUNDARIES',

  // Performance and caching
  REDIS_RATE_LIMIT = 'REDIS_RATE_LIMIT',
  REDIS_CACHE = 'REDIS_CACHE',
  EDGE_CACHING = 'EDGE_CACHING',

  // AI and content features
  AI_ARTICLE_GENERATION = 'AI_ARTICLE_GENERATION',
  AI_CORRECTIONS_ASSISTANT = 'AI_CORRECTIONS_ASSISTANT',

  // Data features
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  EVENT_BUS = 'EVENT_BUS',

  // Analytics
  ANALYTICS_TRACKING = 'ANALYTICS_TRACKING',
  HEATMAP_TRACKING = 'HEATMAP_TRACKING',

  // Admin features
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_AUDIT_LOG = 'ADMIN_AUDIT_LOG',
}

/**
 * Feature flag definitions with descriptions and default values
 */
const FEATURE_FLAG_DEFAULTS: Record<FeatureFlag, { description: string; default: boolean }> = {
  [FeatureFlag.DARK_MODE]: {
    description: 'Enable dark mode theme switcher',
    default: true,
  },
  [FeatureFlag.THEME_SWITCHER]: {
    description: 'Show theme toggle in UI',
    default: true,
  },
  [FeatureFlag.SENTRY_ENABLED]: {
    description: 'Enable Sentry error tracking',
    default: process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false,
  },
  [FeatureFlag.SESSION_REPLAY]: {
    description: 'Enable Sentry session replay for error debugging',
    default: false,
  },
  [FeatureFlag.ERROR_BOUNDARIES]: {
    description: 'Enable React Error Boundaries',
    default: true,
  },
  [FeatureFlag.REDIS_RATE_LIMIT]: {
    description: 'Use Redis for distributed rate limiting',
    default: process.env.REDIS_URL ? true : false,
  },
  [FeatureFlag.REDIS_CACHE]: {
    description: 'Use Redis for caching',
    default: process.env.REDIS_URL ? true : false,
  },
  [FeatureFlag.EDGE_CACHING]: {
    description: 'Enable edge caching headers',
    default: process.env.NODE_ENV === 'production',
  },
  [FeatureFlag.AI_ARTICLE_GENERATION]: {
    description: 'Enable AI-powered article generation',
    default: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? true : false,
  },
  [FeatureFlag.AI_CORRECTIONS_ASSISTANT]: {
    description: 'Enable AI corrections assistant',
    default: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? true : false,
  },
  [FeatureFlag.CIRCUIT_BREAKER]: {
    description: 'Enable circuit breaker pattern for resilience',
    default: true,
  },
  [FeatureFlag.EVENT_BUS]: {
    description: 'Enable event bus for cross-component communication',
    default: true,
  },
  [FeatureFlag.ANALYTICS_TRACKING]: {
    description: 'Enable analytics tracking',
    default: process.env.NODE_ENV === 'production',
  },
  [FeatureFlag.HEATMAP_TRACKING]: {
    description: 'Enable heatmap tracking for user interactions',
    default: false,
  },
  [FeatureFlag.ADMIN_DASHBOARD]: {
    description: 'Enable admin dashboard access',
    default: true,
  },
  [FeatureFlag.ADMIN_AUDIT_LOG]: {
    description: 'Enable admin audit logging',
    default: true,
  },
};

/**
 * Check if a feature flag is enabled
 * Reads from NEXT_PUBLIC_FEATURE_* environment variables, then defaults
 * @param flag - The feature flag to check
 * @returns Whether the flag is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // Environment variable override (NEXT_PUBLIC_FEATURE_DARK_MODE=true)
  const envKey = `NEXT_PUBLIC_FEATURE_${flag}`;
  const envValue = process.env[envKey];

  if (envValue !== undefined) {
    return envValue === 'true' || envValue === '1' || envValue === 'yes';
  }

  // Use default
  const definition = FEATURE_FLAG_DEFAULTS[flag];
  return definition?.default ?? false;
}

/**
 * Get all feature flags with their current state
 * Useful for debugging and feature flag dashboards
 * @returns Object mapping flag names to their enabled state
 */
export function getAllFeatureFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = {};

  for (const flag of Object.values(FeatureFlag)) {
    flags[flag] = isFeatureEnabled(flag as FeatureFlag);
  }

  return flags;
}

/**
 * Get feature flag metadata (description and current state)
 * Useful for admin dashboards
 * @returns Array of feature flag metadata
 */
export function getFeatureFlagMetadata(): Array<{
  name: FeatureFlag;
  description: string;
  enabled: boolean;
  default: boolean;
}> {
  return Object.values(FeatureFlag).map((flag) => ({
    name: flag,
    description: FEATURE_FLAG_DEFAULTS[flag].description,
    enabled: isFeatureEnabled(flag),
    default: FEATURE_FLAG_DEFAULTS[flag].default,
  }));
}

/**
 * Cache for feature flags to avoid repeated checks
 * This is especially useful for performance in React components
 */
let flagCache: Map<FeatureFlag, boolean> | null = null;

/**
 * Initialize feature flag cache
 * Call this once at app startup for better performance
 */
export function initializeFeatureFlagCache(): void {
  if (flagCache) return;

  flagCache = new Map();
  for (const flag of Object.values(FeatureFlag)) {
    const envKey = `NEXT_PUBLIC_FEATURE_${flag}`;
    const envValue = process.env[envKey];

    let enabled: boolean;
    if (envValue !== undefined) {
      enabled = envValue === 'true' || envValue === '1' || envValue === 'yes';
    } else {
      enabled = FEATURE_FLAG_DEFAULTS[flag].default;
    }

    flagCache.set(flag, enabled);
  }
}

/**
 * Get cached feature flag state (must call initializeFeatureFlagCache first)
 * @param flag - The feature flag to check
 * @returns Whether the flag is enabled
 */
export function isFeatureEnabledCached(flag: FeatureFlag): boolean {
  if (!flagCache) {
    initializeFeatureFlagCache();
  }

  return flagCache!.get(flag) ?? false;
}

/**
 * Reset feature flag cache (mainly for testing)
 */
export function resetFeatureFlagCache(): void {
  flagCache = null;
}
