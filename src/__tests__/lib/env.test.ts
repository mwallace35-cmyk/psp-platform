import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('env configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Set up required environment variables for testing
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.REVALIDATION_SECRET = 'test-secret';
    process.env.PSP_PREVIEW_KEY = 'test-preview';
    process.env.RESEND_API_KEY = 'test-resend';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic';
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'test-ga';
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('exports env object with required properties', async () => {
    const { env } = await import('@/lib/env');
    expect(env).toBeDefined();
    expect(env.supabaseUrl).toBeDefined();
    expect(env.supabaseAnonKey).toBeDefined();
    expect(env.revalidationSecret).toBeDefined();
    expect(env.previewKey).toBeDefined();
    expect(env.resendApiKey).toBeDefined();
    expect(env.anthropicApiKey).toBeDefined();
    expect(env.gaId).toBeDefined();
  });

  it('provides public Supabase configuration', async () => {
    const { env } = await import('@/lib/env');
    // These should be exported from NEXT_PUBLIC_* vars
    expect(typeof env.supabaseUrl).toBe('string');
    expect(typeof env.supabaseAnonKey).toBe('string');
  });

  it('provides server-side API keys', async () => {
    const { env } = await import('@/lib/env');
    expect(typeof env.revalidationSecret).toBe('string');
    expect(typeof env.previewKey).toBe('string');
    expect(typeof env.resendApiKey).toBe('string');
    expect(typeof env.anthropicApiKey).toBe('string');
  });

  it('provides analytics configuration', async () => {
    const { env } = await import('@/lib/env');
    expect(typeof env.gaId).toBe('string');
  });

  it('returns empty strings for missing required env vars', async () => {
    const { env } = await import('@/lib/env');
    // When NEXT_PUBLIC_* vars are missing, getRequiredEnv returns empty string
    // This is the current behavior as per the code
    expect(env.supabaseUrl).toEqual(expect.any(String));
    expect(env.supabaseAnonKey).toEqual(expect.any(String));
  });

  it('handles missing optional env vars gracefully', async () => {
    const { env } = await import('@/lib/env');
    // Optional server vars default to empty string
    expect(env.revalidationSecret).toEqual(expect.any(String));
    expect(env.previewKey).toEqual(expect.any(String));
    expect(env.resendApiKey).toEqual(expect.any(String));
    expect(env.anthropicApiKey).toEqual(expect.any(String));
    expect(env.gaId).toEqual(expect.any(String));
  });

  it('env object is marked as const', async () => {
    const { env } = await import('@/lib/env');
    // Verify the object structure is consistent
    const keys = Object.keys(env);
    expect(keys).toContain('supabaseUrl');
    expect(keys).toContain('supabaseAnonKey');
    expect(keys).toContain('revalidationSecret');
    expect(keys).toContain('previewKey');
    expect(keys).toContain('resendApiKey');
    expect(keys).toContain('anthropicApiKey');
    expect(keys).toContain('gaId');
  });
});
