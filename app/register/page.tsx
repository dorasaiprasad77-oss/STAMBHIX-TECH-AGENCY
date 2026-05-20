'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.register(name, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <p className="mt-2 text-secondary">Start managing your agency</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-8 space-y-6">
          <h2 className="text-xl font-semibold text-primary">Create your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm placeholder-tertiary focus:border-[#D4A853]/40 focus:outline-none transition-all"
              placeholder="Your name"
            />
          </div>

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
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-tertiary">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D4A853] hover:text-[#F5C542] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
