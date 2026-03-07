/**
 * Circuit Breaker Pattern Implementation for PSP Platform
 * Prevents cascading failures by stopping requests to failing services
 * States: CLOSED (normal) -> OPEN (failing) -> HALF_OPEN (testing recovery) -> CLOSED
 */

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',           // Normal operation, requests pass through
  OPEN = 'OPEN',               // Service is failing, requests rejected immediately
  HALF_OPEN = 'HALF_OPEN',     // Testing if service has recovered
}

/**
 * Event emitted when circuit breaker state changes
 */
export interface CircuitBreakerStateChangeEvent {
  from: CircuitBreakerState;
  to: CircuitBreakerState;
  timestamp: string;
  reason?: string;
}

/**
 * Configuration for circuit breaker
 */
export interface CircuitBreakerConfig {
  name: string;
  failureThreshold?: number;           // Number of failures before opening (default: 5)
  resetTimeoutMs?: number;             // Time before attempting recovery (default: 30000ms)
  halfOpenMaxAttempts?: number;        // Max attempts in half-open state (default: 3)
  onStateChange?: (event: CircuitBreakerStateChangeEvent) => void;
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker<T> {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED;
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private halfOpenAttempts: number = 0;
  private successCount: number = 0;

  readonly name: string;
  readonly failureThreshold: number;
  readonly resetTimeoutMs: number;
  readonly halfOpenMaxAttempts: number;
  private onStateChange?: (event: CircuitBreakerStateChangeEvent) => void;

  constructor(config: CircuitBreakerConfig) {
    this.name = config.name;
    this.failureThreshold = config.failureThreshold ?? 5;
    this.resetTimeoutMs = config.resetTimeoutMs ?? 30000;
    this.halfOpenMaxAttempts = config.halfOpenMaxAttempts ?? 3;
    this.onStateChange = config.onStateChange;
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Get circuit breaker status
   */
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      timeSinceLastFailure: Date.now() - this.lastFailureTime,
      halfOpenAttempts: this.halfOpenAttempts,
      successCount: this.successCount,
    };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.setState(CircuitBreakerState.CLOSED, 'Manual reset');
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.halfOpenAttempts = 0;
    this.successCount = 0;
  }

  /**
   * Execute a function with circuit breaker protection
   * @param fn - The async function to execute
   * @returns The result of the function
   * @throws CircuitBreakerOpenError if circuit is open
   * @throws Original error from fn if it fails
   */
  async execute(fn: () => Promise<T>): Promise<T> {
    // Check if we need to transition from OPEN to HALF_OPEN
    if (this.state === CircuitBreakerState.OPEN) {
      if (this.canAttemptReset()) {
        this.setState(CircuitBreakerState.HALF_OPEN, 'Reset timeout elapsed');
      } else {
        throw new CircuitBreakerOpenError(
          `Circuit breaker "${this.name}" is open`,
          this.name,
          Math.max(0, this.resetTimeoutMs - (Date.now() - this.lastFailureTime))
        );
      }
    }

    // Check if we've exceeded max attempts in HALF_OPEN state
    if (this.state === CircuitBreakerState.HALF_OPEN && this.halfOpenAttempts >= this.halfOpenMaxAttempts) {
      this.setState(CircuitBreakerState.OPEN, 'Max attempts exceeded in half-open state');
      throw new CircuitBreakerOpenError(
        `Circuit breaker "${this.name}" is open (max attempts exceeded)`,
        this.name,
        this.resetTimeoutMs
      );
    }

    try {
      const result = await fn();

      // Handle success
      this.onSuccess();
      return result;
    } catch (error) {
      // Handle failure
      this.onFailure();
      throw error;
    }
  }

  /**
   * Check if enough time has passed to attempt reset
   */
  private canAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime >= this.resetTimeoutMs;
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.successCount++;
      this.halfOpenAttempts++;

      // If we've succeeded enough times, close the circuit
      if (this.successCount >= this.halfOpenMaxAttempts) {
        this.setState(CircuitBreakerState.CLOSED, 'Recovered from failure');
        this.failureCount = 0;
        this.successCount = 0;
        this.halfOpenAttempts = 0;
      }
    } else if (this.state === CircuitBreakerState.CLOSED) {
      // Reset failure count on continued success
      this.failureCount = 0;
      this.successCount = 0;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.lastFailureTime = Date.now();
    this.failureCount++;
    this.successCount = 0;

    if (this.state === CircuitBreakerState.CLOSED) {
      if (this.failureCount >= this.failureThreshold) {
        this.setState(CircuitBreakerState.OPEN, `Failure threshold (${this.failureThreshold}) exceeded`);
      }
    } else if (this.state === CircuitBreakerState.HALF_OPEN) {
      this.halfOpenAttempts++;
      this.setState(CircuitBreakerState.OPEN, 'Failed during recovery attempt');
    }
  }

  /**
   * Change state and emit event
   */
  private setState(newState: CircuitBreakerState, reason: string): void {
    if (newState === this.state) return;

    const oldState = this.state;
    this.state = newState;

    if (this.onStateChange) {
      this.onStateChange({
        from: oldState,
        to: newState,
        timestamp: new Date().toISOString(),
        reason,
      });
    }
  }
}

/**
 * Error thrown when circuit breaker is open
 */
export class CircuitBreakerOpenError extends Error {
  readonly circuitName: string;
  readonly retryAfterMs: number;

  constructor(message: string, circuitName: string, retryAfterMs: number) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
    this.circuitName = circuitName;
    this.retryAfterMs = retryAfterMs;

    Object.setPrototypeOf(this, CircuitBreakerOpenError.prototype);
  }
}

/**
 * Global registry of circuit breakers for monitoring and management
 */
const circuitBreakerRegistry = new Map<string, CircuitBreaker<any>>();

/**
 * Create or get a circuit breaker from the registry
 */
export function createCircuitBreaker<T>(config: CircuitBreakerConfig): CircuitBreaker<T> {
  if (circuitBreakerRegistry.has(config.name)) {
    return circuitBreakerRegistry.get(config.name) as CircuitBreaker<T>;
  }

  const breaker = new CircuitBreaker<T>(config);
  circuitBreakerRegistry.set(config.name, breaker);
  return breaker;
}

/**
 * Get a circuit breaker by name
 */
export function getCircuitBreaker<T>(name: string): CircuitBreaker<T> | undefined {
  return circuitBreakerRegistry.get(name) as CircuitBreaker<T> | undefined;
}

/**
 * Get all circuit breakers with their status
 */
export function getAllCircuitBreakers() {
  return Array.from(circuitBreakerRegistry.entries()).map(([name, breaker]) => ({
    name,
    status: breaker.getStatus(),
  }));
}

/**
 * Reset all circuit breakers
 */
export function resetAllCircuitBreakers(): void {
  for (const breaker of circuitBreakerRegistry.values()) {
    breaker.reset();
  }
}

/**
 * Clear circuit breaker registry (mainly for testing)
 */
export function clearCircuitBreakerRegistry(): void {
  circuitBreakerRegistry.clear();
}

/**
 * Decorator-style helper for protecting functions with a circuit breaker
 * @param name - Name of the circuit breaker
 * @param config - Optional circuit breaker configuration
 */
export function withCircuitBreaker<T>(
  name: string,
  config: Omit<CircuitBreakerConfig, 'name'> = {}
): (fn: () => Promise<T>) => Promise<T> {
  const breaker = createCircuitBreaker<T>({ name, ...config });

  return async (fn: () => Promise<T>) => {
    return breaker.execute(fn);
  };
}
