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
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
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

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center min-h-[44px]"
      >
        {loading ? "Signing in..." : "Sign In"}
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
          <h1 className="text-4xl text-white">PSP Admin</h1>
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
