/**
 * Environment variable validation and centralized configuration.
 * Ensures required environment variables are available at build time.
 * Provides type-safe access to all environment variables across the application.
 */

import { z } from 'zod';

/**
 * Zod schema for environment variable validation.
 * Ensures all required variables are present at startup.
 */
const envSchema = z.object({
  // Public Supabase configuration (required)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

  // Server-side API keys and secrets (optional with defaults)
  // NOTE: These secrets are critical for security and should NOT be empty in production
  REVALIDATION_SECRET: z.string().optional().default(''),
  PSP_PREVIEW_KEY: z.string().optional().default(''),
  PSP_ALLOWED_IPS: z.string().optional().default(''),
  RESEND_API_KEY: z.string().optional().default(''),
  ANTHROPIC_API_KEY: z.string().optional().default(''),

  // Public analytics configuration (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(''),

  // Node environment (for runtime warnings)
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

/**
 * Retrieve a required environment variable.
 * Throws an error at build/startup time if the variable is missing.
 *
 * @param key - The environment variable key to retrieve
 * @returns The environment variable value
 * @throws Error if the variable is missing
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Require a specific environment variable in production.
 * In production, empty or missing secrets are security risks and must be treated as errors.
 *
 * @param key - The environment variable key
 * @param value - The environment variable value to check
 * @throws Error if value is empty and NODE_ENV is 'production'
 */
function requireInProduction(key: string, value: string): void {
  if (process.env.NODE_ENV === 'production' && (!value || value.length === 0)) {
    throw new Error(
      `[PSP:SECURITY] Required security credential is missing in production: ${key}. ` +
      `This disables authentication for critical endpoints. Set this environment variable immediately.`
    );
  }
}

/**
 * Validate and parse environment variables at startup.
 * Throws an error immediately if any required variables are missing.
 * In production, throws an error if critical secrets are empty (fail-secure approach).
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, messages]) => `${key}: ${messages?.join(', ')}`)
      .join('\n');

    throw new Error(`Environment variable validation failed:\n${errors}`);
  }

  const data = result.data;

  // FAIL SECURE: In production, critical secrets must not be empty
  if (data.NODE_ENV === 'production') {
    const criticalSecrets = [
      { name: 'REVALIDATION_SECRET', value: data.REVALIDATION_SECRET },
      { name: 'PSP_PREVIEW_KEY', value: data.PSP_PREVIEW_KEY },
    ];

    for (const secret of criticalSecrets) {
      requireInProduction(secret.name, secret.value);
    }
  }

  return data;
}

// Lazy initialize to support testing
let validatedEnv: ReturnType<typeof validateEnv> | null = null;

function getValidatedEnv() {
  if (!validatedEnv) {
    validatedEnv = validateEnv();
  }
  return validatedEnv;
}

/**
 * Centralized environment configuration object.
 * Provides type-safe access to all environment variables.
 * Public variables (NEXT_PUBLIC_*) are available client-side.
 * Private variables are only available server-side.
 */
export const env = {
  // Public Supabase configuration
  get supabaseUrl() {
    return getValidatedEnv().NEXT_PUBLIC_SUPABASE_URL;
  },
  get supabaseAnonKey() {
    return getValidatedEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY;
  },

  // Server-side API keys and secrets
  get revalidationSecret() {
    return getValidatedEnv().REVALIDATION_SECRET;
  },
  get previewKey() {
    return getValidatedEnv().PSP_PREVIEW_KEY;
  },
  get allowedIps() {
    return getValidatedEnv().PSP_ALLOWED_IPS;
  },
  get resendApiKey() {
    return getValidatedEnv().RESEND_API_KEY;
  },
  get anthropicApiKey() {
    return getValidatedEnv().ANTHROPIC_API_KEY;
  },

  // Public analytics configuration
  get gaId() {
    return getValidatedEnv().NEXT_PUBLIC_GA_MEASUREMENT_ID;
  },
} as const;

/**
 * Export helper for production-only environment variable validation.
 * Use this when you need to validate that a secret is set in production only.
 */
export { requireInProduction };
