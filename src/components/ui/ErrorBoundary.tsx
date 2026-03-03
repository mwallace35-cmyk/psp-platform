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
            <h1 className="text-2xl font-bebas text-navy mb-4">Oops!</h1>
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
