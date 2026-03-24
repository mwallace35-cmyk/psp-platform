'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0],
          },
        },
      });

      if (signupError) throw signupError;

      setSuccess(true);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Could not create account');
      setError(error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--psp-navy)' }}>
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-4xl mb-4" role="img" aria-label="envelope icon">✉️</div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--psp-navy)' }}>Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--psp-gold)' }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--psp-navy)' }}>
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Link href="/">
            <h1 className="psp-h1" style={{ color: 'var(--psp-navy)' }}>
              PhillySportsPack
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Create your account to join the community</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you want to appear"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span aria-label="required" style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-required="true"
              aria-invalid={error && error.toLowerCase().includes('email') ? 'true' : 'false'}
              aria-describedby={error && error.toLowerCase().includes('email') ? 'email-error' : undefined}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
            {error && error.toLowerCase().includes('email') && (
              <div id="email-error" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-2 mt-1" role="alert">
                {error}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span aria-label="required" style={{ color: 'red' }}>*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              aria-required="true"
              minLength={6}
              aria-invalid={error && error.toLowerCase().includes('password') ? 'true' : 'false'}
              aria-describedby={error && error.toLowerCase().includes('password') ? 'password-error' : 'password-hint'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold min-h-[44px]"
            />
            <div id="password-hint" className="text-xs text-gray-500 mt-1">At least 6 characters</div>
            {error && error.toLowerCase().includes('password') && (
              <div id="password-error" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-2 mt-1" role="alert">
                {error}
              </div>
            )}
          </div>

          {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && (
            <div id="form-error" className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-bold text-sm transition disabled:opacity-50 min-h-[44px]"
            style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--psp-gold)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
