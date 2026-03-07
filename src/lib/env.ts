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
  REVALIDATION_SECRET: z.string().optional().default(''),
  PSP_PREVIEW_KEY: z.string().optional().default(''),
  RESEND_API_KEY: z.string().optional().default(''),
  ANTHROPIC_API_KEY: z.string().optional().default(''),

  // Public analytics configuration (optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(''),
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
 * Validate and parse environment variables at startup.
 * Throws an error immediately if any required variables are missing.
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, messages]) => `${key}: ${messages?.join(', ')}`)
      .join('\n');

    throw new Error(`Environment variable validation failed:\n${errors}`);
  }

  return result.data;
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
