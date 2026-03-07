"use client";

import { useRef, useEffect } from "react";
import { captureError } from "@/lib/error-tracking";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Capture the global error for logging and external tracking (Sentry, etc.)
    captureError(error, {
      digest: error.digest,
      component: "app/global-error.tsx",
      source: "global-error-boundary",
    });

    headingRef.current?.focus();
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              textAlign: "center",
              backgroundColor: "white",
              padding: "60px 40px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#0a1628",
                marginBottom: "16px",
              }}
            >
              ⚠️
            </div>

            <h1
              ref={headingRef}
              tabIndex={-1}
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#0a1628",
                marginBottom: "12px",
                outline: "none",
              }}
            >
              Application Error
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#666",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
              We&apos;re experiencing technical difficulties. Please try again in a moment.
            </p>

            {(error.message || error.digest) && process.env.NODE_ENV === 'development' && (
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffc107",
                  borderRadius: "6px",
                  padding: "16px",
                  marginBottom: "32px",
                  fontSize: "14px",
                  color: "#333",
                  textAlign: "left",
                  fontFamily: "monospace",
                  overflow: "auto",
                  maxHeight: "100px",
                }}
              >
                {error.message && (
                  <>
                    <strong>Error:</strong> {error.message}
                    <br />
                  </>
                )}
                {error.digest && (
                  <>
                    <strong>Error ID:</strong> {error.digest}
                  </>
                )}
              </div>
            )}

            <button
              onClick={reset}
              style={{
                padding: "12px 32px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#0a1628",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#051018";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#0a1628";
              }}
            >
              Reload page
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
