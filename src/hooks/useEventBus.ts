'use client';

import { useEffect, useCallback } from 'react';
import { EventMap, bus } from '@/lib/event-bus';

/**
 * React hook for subscribing to event bus events
 * Automatically handles cleanup on unmount
 * @param event - Event name to listen for
 * @param handler - Handler function to call when event fires
 * @returns void
 */
export function useEventBus<E extends keyof EventMap>(
  event: E,
  handler: (payload: EventMap[E]) => void
): void {
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    // Subscribe to event
    const unsubscribe = bus.on(event, stableHandler);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [event, stableHandler]);
}

/**
 * React hook for one-time event subscription
 * Handler fires only once, then automatically unsubscribes
 * @param event - Event name to listen for
 * @param handler - Handler function to call when event fires
 * @returns void
 */
export function useEventBusOnce<E extends keyof EventMap>(
  event: E,
  handler: (payload: EventMap[E]) => void
): void {
  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    // Subscribe to event (once)
    const unsubscribe = bus.once(event, stableHandler);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [event, stableHandler]);
}

/**
 * React hook to emit events on the event bus
 * Returns a memoized emit function
 * @returns Function to emit events
 */
export function useEmitEvent() {
  return useCallback(<E extends keyof EventMap>(event: E, payload: EventMap[E]) => {
    bus.emit(event, payload);
  }, []);
}

/**
 * React hook for toast notifications via event bus
 * @returns Toast notification functions
 */
export function useToastEvents() {
  const emit = useEmitEvent();

  return {
    success: (message: string, duration?: number) =>
      emit('toast:show', { message, type: 'success', duration }),
    error: (message: string, duration?: number) =>
      emit('toast:show', { message, type: 'error', duration }),
    info: (message: string, duration?: number) =>
      emit('toast:show', { message, type: 'info', duration }),
    warning: (message: string, duration?: number) =>
      emit('toast:show', { message, type: 'warning', duration }),
  };
}

/**
 * React hook for auth state changes via event bus
 * @returns Auth state functions
 */
export function useAuthStateEvents() {
  const emit = useEmitEvent();

  return {
    setAuthenticated: (userId: string, email: string) =>
      emit('auth:stateChanged', { isAuthenticated: true, userId, email }),
    setUnauthenticated: () =>
      emit('auth:stateChanged', { isAuthenticated: false }),
  };
}

/**
 * React hook for theme changes via event bus
 * @returns Theme change functions
 */
export function useThemeEvents() {
  const emit = useEmitEvent();

  return {
    changeTheme: (theme: 'light' | 'dark' | 'system', isDark: boolean) =>
      emit('theme:changed', { theme, isDark }),
  };
}

/**
 * React hook for data refresh events
 * @returns Data refresh functions
 */
export function useDataRefreshEvents() {
  const emit = useEmitEvent();

  return {
    refresh: (resource: string, id?: string | number) =>
      emit('data:refreshed', { resource, id, timestamp: new Date().toISOString() }),
  };
}
