'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const toastColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: '✓',
    iconColor: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: '✕',
    iconColor: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ',
    iconColor: 'text-blue-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠',
    iconColor: 'text-yellow-600',
  },
};

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const colors = toastColors[type];

  return (
    <div
      className={`${colors.bg} ${colors.border} ${colors.text} rounded-lg border-2 p-4 shadow-lg animate-in slide-in-from-top-5 fade-in duration-300 flex items-start gap-3`}
      role="alert"
      aria-atomic="true"
    >
      <span className={`${colors.iconColor} text-lg font-bold flex-shrink-0`}>
        {colors.icon}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${colors.iconColor} flex-shrink-0 hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  if (typeof window === 'undefined') return null;

  const container = document.body;
  if (!container) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    container
  );
}
