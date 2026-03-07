/**
 * Retry utility for async operations with exponential backoff
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Execute an async function with exponential backoff retry logic
 * @param fn - The async function to execute
 * @param options - Retry configuration
 * @returns The result of the function
 * @throws The last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const jitter = Math.random() * baseDelay * 0.5;
        const delay = Math.min(baseDelay * Math.pow(2, attempt) + jitter, maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
