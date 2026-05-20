'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 radial-gold" />
      <div className="absolute inset-0 grid-pattern" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <span className="gold-text-gradient text-3xl">✦</span>
            <span className="gold-text-gradient">Stambhix</span>
          </Link>
          <p className="mt-2 text-secondary">Welcome back to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-8 space-y-6">
          <h2 className="text-xl font-semibold text-primary">Sign in</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-tertiary cursor-pointer">
              <input type="checkbox" className="rounded border-primary text-[#D4A853] focus:ring-[#D4A853]/40 bg-primary" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-[#D4A853] hover:text-[#F5C542] font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-tertiary">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#D4A853] hover:text-[#F5C542] font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
