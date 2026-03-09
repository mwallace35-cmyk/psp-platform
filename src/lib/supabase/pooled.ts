/**
 * Pooled Supabase Client Configuration
 *
 * Provides connection pooling via PgBouncer for better resource management under load.
 * - Uses PgBouncer connection pool on port 6543 when available
 * - Falls back to direct connection on port 5432 if pooled URL unavailable
 * - Includes health check function for monitoring pool status
 */

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { captureError } from "@/lib/error-tracking";

// Cache for pooled client (singleton pattern)
let pooledClientInstance: ReturnType<typeof createSupabaseClient> | null = null;
let directClientInstance: ReturnType<typeof createSupabaseClient> | null = null;

/**
 * Get or create a pooled Supabase client with connection pooling
 * Uses PgBouncer (port 6543) for connection pooling
 * Reduces connection overhead and improves concurrency under high load
 *
 * @returns Supabase client with pooled connection
 */
export function getPooledSupabaseClient() {
  if (pooledClientInstance) {
    return pooledClientInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pooledUrl = process.env.SUPABASE_POOLED_URL;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase URL or anon key");
  }

  // Use pooled URL if available (PgBouncer on port 6543)
  // Otherwise fall back to direct connection (port 5432)
  const clientUrl = pooledUrl || url;

  pooledClientInstance = createSupabaseClient(clientUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    // Connection settings for pooled client
    global: {
      headers: {
        "x-client-info": "psp-pooled-client",
      },
    },
  });

  return pooledClientInstance;
}

/**
 * Get or create a direct Supabase client (non-pooled)
 * Uses direct connection to Supabase database (port 5432)
 * Use this for long-lived transactions or specific use cases
 *
 * @returns Supabase client with direct connection
 */
export function getDirectSupabaseClient() {
  if (directClientInstance) {
    return directClientInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase URL or anon key");
  }

  directClientInstance = createSupabaseClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-client-info": "psp-direct-client",
      },
    },
  });

  return directClientInstance;
}

/**
 * Health check for connection pool
 * Performs a simple query to verify pool connectivity
 *
 * @returns Health status object with latency and availability
 */
export async function checkPoolHealth() {
  const startTime = Date.now();

  try {
    const client = getPooledSupabaseClient();

    // Simple, fast query to check connectivity
    const { error } = await client
      .from("seasons")
      .select("id", { count: "exact", head: true })
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      return {
        status: "degraded",
        latency,
        message: error.message,
        usingPool: !!process.env.SUPABASE_POOLED_URL,
      };
    }

    return {
      status: "healthy",
      latency,
      message: "Pool connectivity OK",
      usingPool: !!process.env.SUPABASE_POOLED_URL,
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    captureError(error, { function: "checkPoolHealth" });

    return {
      status: "unhealthy",
      latency,
      message: error instanceof Error ? error.message : "Unknown error",
      usingPool: !!process.env.SUPABASE_POOLED_URL,
    };
  }
}

/**
 * Configuration helper: get recommended pooling settings
 * Returns suggested connection pool parameters
 */
export function getPoolConfiguration() {
  const isProduction = process.env.NODE_ENV === "production";
  const maxConnections = isProduction ? 20 : 10;
  const idleTimeout = isProduction ? 300000 : 600000; // 5 min (prod) / 10 min (dev)

  return {
    pooled: !!process.env.SUPABASE_POOLED_URL,
    maxConnections,
    idleTimeout,
    databaseUrl: process.env.DATABASE_URL,
    pooledUrl: process.env.SUPABASE_POOLED_URL,
    recommendations: {
      usePooledForDataReads: true,
      useDirectForTransactions: true,
      batchSize: 100,
      maxConcurrentRequests: isProduction ? 50 : 20,
    },
  };
}
