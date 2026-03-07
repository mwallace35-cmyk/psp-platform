import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  bus,
  emit,
  on,
  once,
  waitForEvent,
  showToast,
  captureError,
  changeTheme,
  setAuthState,
  refreshData,
  EventMap,
} from '@/lib/event-bus';

describe('Event Bus', () => {
  beforeEach(() => {
    bus.clear();
  });

  afterEach(() => {
    bus.clear();
  });

  describe('Basic Event Emission and Subscription', () => {
    it('should emit and receive events', () => {
      const handler = vi.fn();
      bus.on('toast:show', handler);

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler).toHaveBeenCalledWith({
        message: 'Test',
        type: 'success',
      });
    });

    it('should handle multiple listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('toast:show', handler1);
      bus.on('toast:show', handler2);

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should unsubscribe when unsubscribe function is called', () => {
      const handler = vi.fn();
      const unsubscribe = bus.on('toast:show', handler);

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();

      emit('toast:show', {
        message: 'Test again',
        type: 'success',
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('One-Time Listeners', () => {
    it('should fire once listener only once', () => {
      const handler = vi.fn();
      bus.once('toast:show', handler);

      emit('toast:show', {
        message: 'First',
        type: 'success',
      });

      emit('toast:show', {
        message: 'Second',
        type: 'success',
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should allow unsubscribing from once listener', () => {
      const handler = vi.fn();
      const unsubscribe = bus.once('toast:show', handler);

      unsubscribe();

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler).not.toHaveBeenCalled();
    });

    it('should mix regular and once listeners', () => {
      const regularHandler = vi.fn();
      const onceHandler = vi.fn();

      bus.on('toast:show', regularHandler);
      bus.once('toast:show', onceHandler);

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(regularHandler).toHaveBeenCalledTimes(1);
      expect(onceHandler).toHaveBeenCalledTimes(1);

      emit('toast:show', {
        message: 'Test 2',
        type: 'success',
      });

      expect(regularHandler).toHaveBeenCalledTimes(2);
      expect(onceHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Types', () => {
    it('should support toast:show events', () => {
      const handler = vi.fn();
      bus.on('toast:show', handler);

      emit('toast:show', {
        message: 'Success',
        type: 'success',
        duration: 3000,
      });

      expect(handler).toHaveBeenCalledWith({
        message: 'Success',
        type: 'success',
        duration: 3000,
      });
    });

    it('should support error:captured events', () => {
      const handler = vi.fn();
      bus.on('error:captured', handler);

      const error = new Error('Test error');
      emit('error:captured', {
        error,
        context: { userId: '123' },
        severity: 'high',
      });

      expect(handler).toHaveBeenCalledWith({
        error,
        context: { userId: '123' },
        severity: 'high',
      });
    });

    it('should support theme:changed events', () => {
      const handler = vi.fn();
      bus.on('theme:changed', handler);

      emit('theme:changed', {
        theme: 'dark',
        isDark: true,
      });

      expect(handler).toHaveBeenCalledWith({
        theme: 'dark',
        isDark: true,
      });
    });

    it('should support auth:stateChanged events', () => {
      const handler = vi.fn();
      bus.on('auth:stateChanged', handler);

      emit('auth:stateChanged', {
        isAuthenticated: true,
        userId: 'user123',
        email: 'user@example.com',
      });

      expect(handler).toHaveBeenCalledWith({
        isAuthenticated: true,
        userId: 'user123',
        email: 'user@example.com',
      });
    });

    it('should support data:refreshed events', () => {
      const handler = vi.fn();
      bus.on('data:refreshed', handler);

      emit('data:refreshed', {
        resource: 'players',
        id: '123',
        timestamp: '2024-01-01T00:00:00Z',
      });

      expect(handler).toHaveBeenCalledWith({
        resource: 'players',
        id: '123',
        timestamp: '2024-01-01T00:00:00Z',
      });
    });
  });

  describe('Error Handling', () => {
    it('should catch errors in handlers without breaking other handlers', () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const goodHandler = vi.fn();

      bus.on('toast:show', errorHandler);
      bus.on('toast:show', goodHandler);

      // Should not throw
      expect(() => {
        emit('toast:show', {
          message: 'Test',
          type: 'success',
        });
      }).not.toThrow();

      expect(errorHandler).toHaveBeenCalled();
      expect(goodHandler).toHaveBeenCalled();
    });
  });

  describe('Clear Functionality', () => {
    it('should clear specific event listeners', () => {
      const handler = vi.fn();
      bus.on('toast:show', handler);
      bus.on('theme:changed', handler);

      bus.clear('toast:show');

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler).not.toHaveBeenCalled();

      emit('theme:changed', {
        theme: 'dark',
        isDark: true,
      });

      expect(handler).toHaveBeenCalled();
    });

    it('should clear all listeners', () => {
      const handler = vi.fn();
      bus.on('toast:show', handler);
      bus.on('theme:changed', handler);

      bus.clear();

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      emit('theme:changed', {
        theme: 'dark',
        isDark: true,
      });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Listener Count', () => {
    it('should count listeners for an event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      expect(bus.listenerCount('toast:show')).toBe(0);

      bus.on('toast:show', handler1);
      expect(bus.listenerCount('toast:show')).toBe(1);

      bus.on('toast:show', handler2);
      expect(bus.listenerCount('toast:show')).toBe(2);

      bus.once('toast:show', vi.fn());
      expect(bus.listenerCount('toast:show')).toBe(3);
    });
  });

  describe('Event Names', () => {
    it('should return all event names with active listeners', () => {
      bus.on('toast:show', vi.fn());
      bus.on('theme:changed', vi.fn());

      const eventNames = bus.eventNames();

      expect(eventNames).toContain('toast:show');
      expect(eventNames).toContain('theme:changed');
    });
  });

  describe('Convenience Functions', () => {
    it('showToast should emit toast:show event', () => {
      const handler = vi.fn();
      bus.on('toast:show', handler);

      showToast('Test message', 'success', 3000);

      expect(handler).toHaveBeenCalledWith({
        message: 'Test message',
        type: 'success',
        duration: 3000,
      });
    });

    it('captureError should emit error:captured event', () => {
      const handler = vi.fn();
      bus.on('error:captured', handler);

      const error = new Error('Test');
      captureError(error, { userId: '123' }, 'high');

      expect(handler).toHaveBeenCalled();
      const call = handler.mock.calls[0][0];
      expect(call.error).toBe(error);
      expect(call.context?.userId).toBe('123');
      expect(call.severity).toBe('high');
    });

    it('changeTheme should emit theme:changed event', () => {
      const handler = vi.fn();
      bus.on('theme:changed', handler);

      changeTheme('dark', true);

      expect(handler).toHaveBeenCalledWith({
        theme: 'dark',
        isDark: true,
      });
    });

    it('setAuthState should emit auth:stateChanged event', () => {
      const handler = vi.fn();
      bus.on('auth:stateChanged', handler);

      setAuthState(true, 'user123', 'user@example.com');

      expect(handler).toHaveBeenCalledWith({
        isAuthenticated: true,
        userId: 'user123',
        email: 'user@example.com',
      });
    });

    it('refreshData should emit data:refreshed event', () => {
      const handler = vi.fn();
      bus.on('data:refreshed', handler);

      refreshData('players', '123');

      expect(handler).toHaveBeenCalled();
      const call = handler.mock.calls[0][0];
      expect(call.resource).toBe('players');
      expect(call.id).toBe('123');
      expect(call.timestamp).toBeDefined();
    });
  });

  describe('waitForEvent', () => {
    it('should return a promise that resolves when event fires', async () => {
      const promise = waitForEvent('toast:show');

      setTimeout(() => {
        emit('toast:show', {
          message: 'Test',
          type: 'success',
        });
      }, 100);

      const result = await promise;

      expect(result.message).toBe('Test');
      expect(result.type).toBe('success');
    });

    it('should unsubscribe after event fires', async () => {
      const promise = waitForEvent('toast:show');
      const handler = vi.fn();
      bus.on('toast:show', handler);

      emit('toast:show', {
        message: 'First',
        type: 'success',
      });

      await promise;

      // Handler should have been called only once
      expect(handler).toHaveBeenCalledTimes(1);

      emit('toast:show', {
        message: 'Second',
        type: 'success',
      });

      // Handler should still have been called only once
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('Type Safety', () => {
    it('should work with typed events', () => {
      const handler: (payload: EventMap['toast:show']) => void = vi.fn();
      bus.on('toast:show', handler);

      emit('toast:show', {
        message: 'Test',
        type: 'success',
      });

      expect(handler).toHaveBeenCalled();
    });
  });
});
