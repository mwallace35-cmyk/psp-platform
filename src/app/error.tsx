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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary, #f5f5f5)",
        fontFamily: "var(--font-dm-sans, sans-serif)",
        padding: "20px",
      }}
    >
      <div
        aria-live="polite"
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
            color: "var(--psp-navy, #0a1628)",
            marginBottom: "16px",
          }}
        >
          Oops!
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "var(--psp-navy, #0a1628)",
            marginBottom: "12px",
            outline: "none",
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "32px",
            lineHeight: "1.6",
          }}
        >
          We encountered an unexpected error while loading this page. Our team has been notified, and we're working to fix it.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div
            style={{
              backgroundColor: "#f0f4ff",
              border: "1px solid #d0d9ff",
              borderRadius: "6px",
              padding: "16px",
              marginBottom: "32px",
              fontSize: "14px",
              color: "#333",
              textAlign: "left",
              fontFamily: "monospace",
              overflow: "auto",
              maxHeight: "120px",
            }}
          >
            <strong>Details:</strong> {error.message}
            {error.digest && (
              <>
                <br />
                <strong>Error ID:</strong> {error.digest}
              </>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "var(--psp-navy, #0a1628)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "var(--psp-navy-dark, #051018)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "var(--psp-navy, #0a1628)";
            }}
          >
            Try again
          </button>

          <Link href="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#e8ecf3",
                color: "var(--psp-navy, #0a1628)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#d0d9ff";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#e8ecf3";
              }}
            >
              Go to homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
