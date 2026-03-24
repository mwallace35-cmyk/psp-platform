'use client';

import React, { ReactNode, ReactElement } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for development
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Future: Send to Sentry or error tracking service
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-navy to-navy-mid flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="psp-h2 text-navy mb-4">Oops!</h1>
            <p className="text-gray-600 mb-6">
              Something went wrong. Our team has been notified and we're working on a fix.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-gray-700 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-gold text-navy font-medium rounded-md hover:bg-gold/90 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}

/**
 * ErrorFallback - Inline error component for component-level errors
 * Can be used within components without wrapping entire page
 */
interface ErrorFallbackProps {
  error?: Error;
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorFallback({
  error,
  title = "Something went wrong",
  message = "An error occurred while loading this content. Please try again.",
  onRetry,
  className = "",
}: ErrorFallbackProps) {
  return (
    <div
      className={`error-fallback ${className}`}
      style={{
        background: "var(--psp-white)",
        border: "1px solid var(--psp-gray-200)",
        borderRadius: "0.5rem",
        padding: "2rem 1rem",
        textAlign: "center",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>

      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "var(--psp-navy)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "0.875rem",
          color: "var(--psp-gray-500)",
          marginBottom: "1.5rem",
          maxWidth: "28rem",
        }}
      >
        {message}
      </p>

      {process.env.NODE_ENV === "development" && error && (
        <div
          style={{
            background: "var(--psp-gray-100)",
            borderRadius: "0.375rem",
            padding: "0.75rem",
            marginBottom: "1rem",
            width: "100%",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              fontFamily: "monospace",
              color: "var(--psp-gray-700)",
              wordBreak: "break-all",
              margin: 0,
            }}
          >
            {error.message}
          </p>
        </div>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "var(--psp-gold)",
            color: "var(--psp-navy)",
            padding: "0.5rem 1.25rem",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--psp-gold-light)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--psp-gold)";
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
