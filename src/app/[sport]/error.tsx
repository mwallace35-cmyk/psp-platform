"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { captureError } from "@/lib/error-tracking";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SportError({ error, reset }: ErrorProps) {
  const params = useParams();
  const sport = params?.sport ? String(params.sport) : "sport";

  useEffect(() => {
    // Capture the sport-level error for logging and external tracking
    captureError(error, {
      digest: error.digest,
      component: "app/[sport]/error.tsx",
      sport,
    });
  }, [error, sport]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-secondary, #f5f5f5)",
        fontFamily: "var(--font-dm-sans, sans-serif)",
        padding: "40px 20px",
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
            color: "var(--psp-navy)",
            marginBottom: "16px",
          }}
        >
          😕
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "var(--psp-navy)",
            marginBottom: "12px",
          }}
        >
          Error loading {sport} content
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "32px",
            lineHeight: "1.6",
          }}
        >
          We encountered a problem while loading this page. Please try again or return to browse other sports.
        </p>

        {(error.message || error.digest) && (
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
              backgroundColor: "var(--psp-navy)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "var(--psp-navy-mid)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                "var(--psp-navy)";
            }}
            onFocus={(e) => {
              (e.target as HTMLButtonElement).style.outline = "2px solid var(--psp-gold)";
              (e.target as HTMLButtonElement).style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              (e.target as HTMLButtonElement).style.outline = "none";
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
                color: "var(--psp-navy)",
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
              onFocus={(e) => {
                (e.target as HTMLButtonElement).style.outline = "2px solid var(--psp-gold)";
                (e.target as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.target as HTMLButtonElement).style.outline = "none";
              }}
            >
              Go to homepage
            </button>
          </Link>

          <Link href="/basketball" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#e8ecf3",
                color: "var(--psp-navy)",
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
              onFocus={(e) => {
                (e.target as HTMLButtonElement).style.outline = "2px solid var(--psp-gold)";
                (e.target as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.target as HTMLButtonElement).style.outline = "none";
              }}
            >
              Browse sports
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
