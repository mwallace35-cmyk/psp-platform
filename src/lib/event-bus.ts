/**
 * Event Bus for Cross-Component Communication in PSP Platform
 * Provides a simple, typed event system for decoupled communication
 * between components without prop drilling or context complexity
 */

/**
 * Define all possible events and their payloads
 */
export interface EventMap {
  // Toast/notification events
  'toast:show': {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  };

  // Error tracking events
  'error:captured': {
    error: Error;
    context?: Record<string, unknown>;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  };

  // Theme events
  'theme:changed': {
    theme: 'light' | 'dark' | 'system';
    isDark: boolean;
  };

  // Auth events
  'auth:stateChanged': {
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
  };

  // Data refresh events
  'data:refreshed': {
    resource: string;
    id?: string | number;
    timestamp: string;
  };

  // Modal/dialog events
  'modal:open': {
    id: string;
    data?: Record<string, unknown>;
  };

  'modal:close': {
    id: string;
  };

  // Navigation events
  'navigation:started': {
    url: string;
    timestamp: string;
  };

  'navigation:completed': {
    url: string;
    timestamp: string;
  };

  // Performance events
  'performance:mark': {
    name: string;
    duration?: number;
    metadata?: Record<string, unknown>;
  };

  // Custom application events
  [key: string]: any;
}

/**
 * Type-safe event listener
 */
type EventListener<E extends keyof EventMap = keyof EventMap> = (payload: EventMap[E]) => void;

/**
 * Simple typed event bus implementation
 */
class EventBus {
  private listeners: Map<keyof EventMap, Set<EventListener<any>>> = new Map();
  private onceListeners: Map<keyof EventMap, Set<EventListener<any>>> = new Map();

  /**
   * Subscribe to an event with a handler
   * @param event - Event name
   * @param handler - Handler function
   * @returns Unsubscribe function
   */
  on<E extends keyof EventMap>(event: E, handler: EventListener<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  /**
   * Subscribe to an event, handler fires only once
   * @param event - Event name
   * @param handler - Handler function
   * @returns Unsubscribe function
   */
  once<E extends keyof EventMap>(event: E, handler: EventListener<E>): () => void {
    if (!this.onceListeners.has(event)) {
      this.onceListeners.set(event, new Set());
    }

    const wrappedHandler: EventListener<E> = (payload: EventMap[E]) => {
      handler(payload);
      this.off(event, wrappedHandler);
      this.onceListeners.get(event)?.delete(wrappedHandler);
    };

    this.onceListeners.get(event)!.add(wrappedHandler);

    // Return unsubscribe function
    return () => {
      this.off(event, wrappedHandler);
      this.onceListeners.get(event)?.delete(wrappedHandler);
    };
  }

  /**
   * Unsubscribe from an event
   * @param event - Event name
   * @param handler - Handler function to remove
   */
  off<E extends keyof EventMap>(event: E, handler: EventListener<E>): void {
    this.listeners.get(event)?.delete(handler);
    this.onceListeners.get(event)?.delete(handler);
  }

  /**
   * Emit an event to all subscribers
   * @param event - Event name
   * @param payload - Event payload
   */
  emit<E extends keyof EventMap>(event: E, payload: EventMap[E]): void {
    // Call regular listeners
    const regularListeners = this.listeners.get(event);
    if (regularListeners) {
      for (const handler of regularListeners) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event listener for "${String(event)}":`, error);
        }
      }
    }

    // Call once listeners
    const onceListenersCopy = this.onceListeners.get(event);
    if (onceListenersCopy) {
      // Create a copy since handlers will remove themselves
      const handlers = Array.from(onceListenersCopy);
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in once listener for "${String(event)}":`, error);
        }
      }
    }
  }

  /**
   * Unsubscribe all listeners for an event
   * @param event - Event name (optional, if omitted clears all)
   */
  clear<E extends keyof EventMap>(event?: E): void {
    if (event) {
      this.listeners.delete(event);
      this.onceListeners.delete(event);
    } else {
      this.listeners.clear();
      this.onceListeners.clear();
    }
  }

  /**
   * Get number of listeners for an event
   * @param event - Event name
   */
  listenerCount<E extends keyof EventMap>(event: E): number {
    const regular = this.listeners.get(event)?.size ?? 0;
    const once = this.onceListeners.get(event)?.size ?? 0;
    return regular + once;
  }

  /**
   * Get all events with active listeners
   */
  eventNames(): Array<keyof EventMap> {
    const events = new Set<keyof EventMap>();

    for (const event of this.listeners.keys()) {
      events.add(event);
    }

    for (const event of this.onceListeners.keys()) {
      events.add(event);
    }

    return Array.from(events);
  }
}

/**
 * Global event bus instance
 */
const eventBus = new EventBus();

/**
 * Export event bus methods
 */
export const bus = {
  on: eventBus.on.bind(eventBus),
  once: eventBus.once.bind(eventBus),
  off: eventBus.off.bind(eventBus),
  emit: eventBus.emit.bind(eventBus),
  clear: eventBus.clear.bind(eventBus),
  listenerCount: eventBus.listenerCount.bind(eventBus),
  eventNames: eventBus.eventNames.bind(eventBus),
};

/**
 * Convenience functions for common events
 */
export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration?: number) {
  eventBus.emit('toast:show', { message, type, duration });
}

export function captureError(error: Error, context?: Record<string, unknown>, severity?: 'low' | 'medium' | 'high' | 'critical') {
  eventBus.emit('error:captured', { error, context, severity });
}

export function changeTheme(theme: 'light' | 'dark' | 'system', isDark: boolean) {
  eventBus.emit('theme:changed', { theme, isDark });
}

export function setAuthState(isAuthenticated: boolean, userId?: string, email?: string) {
  eventBus.emit('auth:stateChanged', { isAuthenticated, userId, email });
}

export function refreshData(resource: string, id?: string | number) {
  eventBus.emit('data:refreshed', { resource, id, timestamp: new Date().toISOString() });
}

/**
 * Type-safe event emitter for custom use
 */
export function emit<E extends keyof EventMap>(event: E, payload: EventMap[E]) {
  eventBus.emit(event, payload);
}

/**
 * Type-safe event listener for custom use
 */
export function on<E extends keyof EventMap>(event: E, handler: EventListener<E>): () => void {
  return eventBus.on(event, handler);
}

/**
 * Type-safe one-time event listener
 */
export function once<E extends keyof EventMap>(event: E, handler: EventListener<E>): () => void {
  return eventBus.once(event, handler);
}

/**
 * Wait for an event (returns a promise)
 * Useful in async code
 */
export function waitForEvent<E extends keyof EventMap>(event: E): Promise<EventMap[E]> {
  return new Promise((resolve) => {
    const unsubscribe = eventBus.once(event, (payload: EventMap[E]) => {
      unsubscribe();
      resolve(payload);
    });
  });
}
