/**
 * Redis client singleton with connection health checks and graceful disconnection.
 * Uses ioredis if available, otherwise safely degrades.
 */

let redisClient: any = null;
let redisInitError: Error | null = null;

/**
 * Safely attempt to load and initialize Redis client
 */
async function initializeRedis(): Promise<any | null> {
  if (redisClient) {
    return redisClient;
  }

  if (redisInitError) {
    return null; // Already tried and failed
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null; // No Redis URL configured
  }

  try {
    // Dynamically require ioredis only if needed
    // This allows the app to work without ioredis installed
    let Redis: any;
    try {
      // Use dynamic import to avoid webpack static analysis
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      Redis = (await import(/* webpackIgnore: true */ 'ioredis')).default;
    } catch (e) {
      // ioredis not installed
      redisInitError = new Error('ioredis not installed');
      return null;
    }

    redisClient = new Redis(redisUrl, {
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      enableOfflineQueue: false,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    // Set up event handlers
    redisClient.on('error', (err: Error) => {
      console.error('[Redis] Connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Ready for commands');
    });

    // Wait for connection to be ready
    await redisClient.ping();
    return redisClient;
  } catch (error) {
    redisInitError = error instanceof Error ? error : new Error(String(error));
    console.error('[Redis] Initialization failed:', redisInitError.message);
    redisClient = null;
    return null;
  }
}

/**
 * Get the Redis client instance.
 * Returns null if Redis is not available or not configured.
 */
export async function getRedisClient(): Promise<any | null> {
  return initializeRedis();
}

/**
 * Check if Redis is currently available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;

    await client.ping();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gracefully disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('[Redis] Disconnected gracefully');
    } catch (error) {
      console.error('[Redis] Error during disconnect:', error);
      // Force disconnect if quit fails
      await redisClient.disconnect();
    } finally {
      redisClient = null;
    }
  }
}

/**
 * Type-safe Redis wrapper for executing commands
 */
export async function executeRedisCommand<T>(
  command: string,
  args: any[],
  fallback: T
): Promise<T> {
  try {
    const client = await getRedisClient();
    if (!client) {
      return fallback;
    }

    const result = await (client as any)[command.toLowerCase()](...args);
    return result as T;
  } catch (error) {
    console.error(`[Redis] Command failed: ${command}`, error);
    return fallback;
  }
}
