"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

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
    <form onSubmit={handleLogin} className="admin-card space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--psp-gray-700)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="filter-input w-full"
          placeholder="mike@phillysportspack.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: "var(--psp-gray-700)" }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="filter-input w-full"
          placeholder="Enter password"
          required
        />
      </div>

      {error && (
        <div className="badge-error p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center"
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

        <Suspense fallback={<div className="admin-card text-center py-8 text-gray-400">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
