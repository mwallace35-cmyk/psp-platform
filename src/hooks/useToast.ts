import { useState, useCallback } from 'react';
import type { ToastType } from '@/components/ui/Toast';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastMessage = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => addToast(message, 'success', duration),
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => addToast(message, 'error', duration),
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => addToast(message, 'info', duration),
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => addToast(message, 'warning', duration),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
