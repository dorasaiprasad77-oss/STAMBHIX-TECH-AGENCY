'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { api } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
        <div className="absolute inset-0 radial-gold" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="w-full max-w-md p-8 relative z-10 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-primary mb-2">Invalid Reset Link</h2>
          <p className="text-secondary mb-6">This link is missing required information. Please request a new password reset.</p>
          <Link
            href="/forgot-password"
            className="inline-block px-5 py-2.5 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] transition-all"
          >
            Request New Reset
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await api.resetPassword(email, token, password);
      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      <div className="absolute inset-0 radial-gold" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="gold-text-gradient text-3xl">✦</span>
            <span className="gold-text-gradient">Stambhix</span>
          </Link>
          <p className="mt-2 text-secondary">Set a new password</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-8 space-y-6">
          <h2 className="text-xl font-semibold text-primary">Reset Password</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl">
              {success} Redirecting to login...
            </div>
          )}

          <div>
            <label htmlFor="email-display" className="block text-sm font-medium text-secondary mb-1">
              Account Email
            </label>
            <input
              id="email-display"
              type="text"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-tertiary text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none transition-all"
              placeholder="Repeat your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin w-8 h-8 border-4 border-[#D4A853] border-t-transparent rounded-full" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
