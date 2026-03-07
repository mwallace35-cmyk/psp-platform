import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CircuitBreaker,
  CircuitBreakerState,
  CircuitBreakerOpenError,
  createCircuitBreaker,
  getCircuitBreaker,
  getAllCircuitBreakers,
  resetAllCircuitBreakers,
  clearCircuitBreakerRegistry,
  withCircuitBreaker,
} from '@/lib/circuit-breaker';

describe('Circuit Breaker Pattern', () => {
  beforeEach(() => {
    clearCircuitBreakerRegistry();
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearCircuitBreakerRegistry();
    vi.useRealTimers();
  });

  describe('CircuitBreaker States', () => {
    it('should start in CLOSED state', () => {
      const breaker = new CircuitBreaker({
        name: 'test',
      });

      expect(breaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it('should transition to OPEN after failure threshold', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 3,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Fail 3 times to hit threshold
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(failingFn);
        } catch (error) {
          // Expected
        }
      }

      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);
    });

    it('should reject requests immediately when OPEN', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Fail once to open
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      // Next request should be rejected immediately
      await expect(breaker.execute(failingFn)).rejects.toThrow(CircuitBreakerOpenError);
    });

    it('should transition from OPEN to HALF_OPEN after timeout', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
        resetTimeoutMs: 5000,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Open the circuit
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Advance time past reset timeout
      vi.advanceTimersByTime(5001);

      const succeedingFn = () => Promise.resolve('success');

      // Should attempt reset
      const result = await breaker.execute(succeedingFn);
      expect(result).toBe('success');
      // Should still be in HALF_OPEN or transitioning
      expect([CircuitBreakerState.HALF_OPEN, CircuitBreakerState.CLOSED]).toContain(
        breaker.getState()
      );
    });

    it('should transition from HALF_OPEN to CLOSED after success', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
        resetTimeoutMs: 5000,
        halfOpenMaxAttempts: 1,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));
      const succeedingFn = () => Promise.resolve('success');

      // Open circuit
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      // Advance time
      vi.advanceTimersByTime(5001);

      // Execute successful request
      await breaker.execute(succeedingFn);

      // Should be closed after successful recovery
      expect(breaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it('should return to OPEN on failure in HALF_OPEN', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
        resetTimeoutMs: 5000,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));
      const anotherFailingFn = () => Promise.reject(new Error('Still failing'));

      // Open circuit
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      // Advance time
      vi.advanceTimersByTime(5001);

      // Fail again in HALF_OPEN
      try {
        await breaker.execute(anotherFailingFn);
      } catch (error) {
        // Expected
      }

      // Should reopen
      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);
    });
  });

  describe('State Change Events', () => {
    it('should emit state change events', async () => {
      const events: any[] = [];

      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
        onStateChange: (event) => {
          events.push(event);
        },
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      expect(events.length).toBeGreaterThan(0);
      expect(events[0].to).toBe(CircuitBreakerState.OPEN);
    });
  });

  describe('Status Information', () => {
    it('should provide status information', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
      });

      const status = breaker.getStatus();

      expect(status.state).toBe(CircuitBreakerState.CLOSED);
      expect(status.failureCount).toBe(0);
      expect(typeof status.lastFailureTime).toBe('number');
    });

    it('should track failure count', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 5,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(failingFn);
        } catch (error) {
          // Expected
        }
      }

      const status = breaker.getStatus();
      expect(status.failureCount).toBe(3);
    });
  });

  describe('Reset', () => {
    it('should reset to CLOSED state', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Open circuit
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      expect(breaker.getState()).toBe(CircuitBreakerState.OPEN);

      // Reset
      breaker.reset();

      expect(breaker.getState()).toBe(CircuitBreakerState.CLOSED);
      expect(breaker.getStatus().failureCount).toBe(0);
    });
  });

  describe('Circuit Breaker Registry', () => {
    it('should create and retrieve circuit breakers', () => {
      const breaker = createCircuitBreaker<string>({
        name: 'test-breaker',
      });

      expect(breaker).toBeDefined();
      expect(breaker.getState()).toBe(CircuitBreakerState.CLOSED);
    });

    it('should return same instance for same name', () => {
      const breaker1 = createCircuitBreaker({
        name: 'test-breaker',
      });

      const breaker2 = createCircuitBreaker({
        name: 'test-breaker',
      });

      expect(breaker1).toBe(breaker2);
    });

    it('should get breaker by name', () => {
      const created = createCircuitBreaker({
        name: 'test-breaker',
      });

      const retrieved = getCircuitBreaker('test-breaker');

      expect(retrieved).toBe(created);
    });

    it('should return all circuit breakers', () => {
      createCircuitBreaker({ name: 'breaker-1' });
      createCircuitBreaker({ name: 'breaker-2' });
      createCircuitBreaker({ name: 'breaker-3' });

      const breakers = getAllCircuitBreakers();

      expect(breakers.length).toBe(3);
      expect(breakers.map((b) => b.name)).toEqual(['breaker-1', 'breaker-2', 'breaker-3']);
    });

    it('should reset all circuit breakers', async () => {
      const breaker1 = createCircuitBreaker({ name: 'breaker-1', failureThreshold: 1 });
      const breaker2 = createCircuitBreaker({ name: 'breaker-2', failureThreshold: 1 });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Open both
      for (const breaker of [breaker1, breaker2]) {
        try {
          await breaker.execute(failingFn);
        } catch (error) {
          // Expected
        }
      }

      expect(breaker1.getState()).toBe(CircuitBreakerState.OPEN);
      expect(breaker2.getState()).toBe(CircuitBreakerState.OPEN);

      // Reset all
      resetAllCircuitBreakers();

      expect(breaker1.getState()).toBe(CircuitBreakerState.CLOSED);
      expect(breaker2.getState()).toBe(CircuitBreakerState.CLOSED);
    });
  });

  describe('withCircuitBreaker Helper', () => {
    it('should protect function with circuit breaker', async () => {
      const fn = withCircuitBreaker('test-helper');

      const result = await fn(() => Promise.resolve('success'));

      expect(result).toBe('success');
    });

    it('should reject when circuit is open', async () => {
      const fn = withCircuitBreaker('test-helper', { failureThreshold: 1 });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Open circuit
      try {
        await fn(failingFn);
      } catch (error) {
        // Expected
      }

      // Next call should fail
      await expect(fn(failingFn)).rejects.toThrow(CircuitBreakerOpenError);
    });
  });

  describe('Error Handling', () => {
    it('should throw CircuitBreakerOpenError with correct info', async () => {
      const breaker = new CircuitBreaker({
        name: 'test',
        failureThreshold: 1,
        resetTimeoutMs: 5000,
      });

      const failingFn = () => Promise.reject(new Error('Failed'));

      // Open circuit
      try {
        await breaker.execute(failingFn);
      } catch (error) {
        // Expected
      }

      // Try to execute when open
      try {
        await breaker.execute(failingFn);
        expect.fail('Should have thrown');
      } catch (error) {
        if (error instanceof CircuitBreakerOpenError) {
          expect(error.circuitName).toBe('test');
          expect(error.retryAfterMs).toBe(5000);
        }
      }
    });
  });
});
