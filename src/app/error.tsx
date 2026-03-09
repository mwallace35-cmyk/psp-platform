"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { captureError } from "@/lib/error-tracking";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Capture the error for logging and external tracking
    captureError(error, {
      digest: error.digest,
      component: "app/error.tsx",
    });

    headingRef.current?.focus();
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-5"
      style={{
        backgroundColor: "var(--bg-secondary, #f5f5f5)",
      }}
    >
      <div
        aria-live="polite"
        className="max-w-2xl text-center bg-white p-20 rounded-lg shadow-sm"
      >
        <div className="text-6xl font-bold text-navy mb-4">
          Oops!
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-bold text-navy mb-3 outline-none"
        >
          Something went wrong
        </h1>

        <p className="text-base text-gray-600 mb-8 leading-relaxed">
          We encountered an unexpected error while loading this page. Our team has been notified, and we're working to fix it.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="bg-blue-50 border border-blue-200 rounded px-4 py-4 mb-8 text-sm text-gray-900 text-left font-mono overflow-auto max-h-32">
            <strong>Details:</strong> {error.message}
            {error.digest && (
              <>
                <br />
                <strong>Error ID:</strong> {error.digest}
              </>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 text-base font-semibold bg-navy text-white rounded hover:bg-navy-mid transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold cursor-pointer"
          >
            Try again
          </button>

          <Link href="/" className="no-underline">
            <button className="px-6 py-3 text-base font-semibold bg-blue-100 text-navy rounded hover:bg-blue-200 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold cursor-pointer">
              Go to homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
