"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonText } from "@/components/ui/Skeleton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Client-side rate limiting: block if too many failed attempts
    if (isBlocked) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the server-side rate-limited login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        // Handle rate limiting (429) specially
        if (response.status === 429) {
          setError("Too many login attempts. Please try again in 15 minutes.");
          setIsBlocked(true);
          // Reset after a longer period
          setTimeout(() => {
            setIsBlocked(false);
            setFailedAttempts(0);
          }, 15 * 60 * 1000); // 15 minutes
          return;
        }

        setError(data.error || "Login failed");
        setLoading(false);

        // After 5 failed attempts, disable the button for a period
        if (newAttempts >= 5) {
          setIsBlocked(true);
          setTimeout(() => {
            setIsBlocked(false);
            setFailedAttempts(0);
          }, 30000); // 30 seconds
        }
        return;
      }

      // Successful login - redirect
      setFailedAttempts(0);
      setIsBlocked(false);

      // Refresh auth state and redirect
      const supabase = createClient();
      const session = await supabase.auth.getSession();

      if (session.data.session) {
        router.push(redirect);
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="admin-card space-y-4" noValidate>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium mb-1" style={{ color: "var(--psp-gray-700)" }}>
          Email <span aria-label="required">*</span>
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="filter-input w-full min-h-[44px]"
          placeholder="mike@phillysportspack.com"
          required
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'login-error' : undefined}
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium mb-1" style={{ color: "var(--psp-gray-700)" }}>
          Password <span aria-label="required">*</span>
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="filter-input w-full min-h-[44px]"
          placeholder="Enter password"
          required
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'login-error' : undefined}
        />
      </div>

      {error && (
        <div id="login-error" className="badge-error p-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {failedAttempts > 0 && failedAttempts < 5 && (
        <div className="badge-warning p-2 rounded text-sm" role="status" aria-live="polite">
          Failed attempts: {failedAttempts}/5
        </div>
      )}

      <button
        type="submit"
        disabled={loading || isBlocked}
        className="btn-primary w-full text-center min-h-[44px]"
      >
        {loading ? "Signing in..." : isBlocked ? "Too many attempts. Try again soon." : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--psp-navy)" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="psp-h1 text-white">PSP Admin</h1>
          <p style={{ color: "var(--psp-gold)" }}>PhillySportsPack.com</p>
        </div>

        <Suspense fallback={
          <div className="admin-card p-6 space-y-4">
            <SkeletonText lines={2} width="100%" />
            <div style={{ marginTop: "1.5rem" }} />
            <SkeletonText lines={1} width="80%" />
            <SkeletonText lines={3} width="100%" />
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
