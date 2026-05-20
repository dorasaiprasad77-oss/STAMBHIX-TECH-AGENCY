'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { User } from '@/types';

type SettingsTab = 'profile' | 'password' | 'preferences';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [name, setName] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preferences
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setUser(data.user);
      setName(data.user.name || '');
      setTheme(data.user.preferences?.theme || 'light');
      setAiEnabled(data.user.preferences?.aiEnabled ?? true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const data = await api.updateProfile({ name });
      setUser(data.user);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    setSaving(true);
    setMessage('');
    setError('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const data = await api.updateProfile({
        preferences: { theme, aiEnabled },
      });
      setUser(data.user);
      setMessage('Preferences saved');

      // Apply theme
      localStorage.setItem('memorychain_theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (!api.isAuthenticated()) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-primary pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-card-hover rounded w-1/3" />
            <div className="h-64 bg-card rounded-2xl border border-primary" />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'password', label: 'Password', icon: '🔒' },
    { key: 'preferences', label: 'Preferences', icon: '⚙️' },
  ] as const;

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="text-tertiary hover:text-secondary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-primary">Settings</h1>
            <p className="text-sm text-secondary">Manage your account and preferences</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 bg-card rounded-xl p-1 border border-primary">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setMessage(''); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'gold-gradient text-black shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-primary">
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-black text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary">{user?.name}</h2>
                <p className="text-sm text-secondary">{user?.email}</p>
                <p className="text-xs text-tertiary mt-0.5">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '...'}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-tertiary text-sm cursor-not-allowed"
                />
                <p className="text-xs text-tertiary mt-1">Email cannot be changed</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Change Password</h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-primary border border-primary text-primary text-sm focus:border-[#D4A853]/40 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-secondary rounded-2xl shadow-theme-lg border border-primary p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-primary mb-6">Preferences</h2>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Theme */}
              <div className="p-4 bg-card rounded-xl border border-primary">
                <label className="block text-sm font-medium text-secondary mb-3">Theme</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-[#D4A853] bg-[#D4A853]/5 text-[#D4A853]'
                        : 'border-primary text-tertiary hover:text-secondary hover:border-[#D4A853]/30'
                    }`}
                  >
                    <span className="text-lg">☀️</span>
                    <span className="font-medium">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-[#D4A853] bg-[#D4A853]/5 text-[#D4A853]'
                        : 'border-primary text-tertiary hover:text-secondary hover:border-[#D4A853]/30'
                    }`}
                  >
                    <span className="text-lg">🌙</span>
                    <span className="font-medium">Dark</span>
                  </button>
                </div>
              </div>

              {/* AI */}
              <div className="p-4 bg-card rounded-xl border border-primary">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-secondary">AI Features</label>
                    <p className="text-xs text-tertiary mt-0.5">
                      Enable AI analysis and smart suggestions for your memories
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiEnabled(!aiEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      aiEnabled ? 'bg-[#D4A853]' : 'bg-tertiary'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                        aiEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-4 gold-gradient text-black font-semibold rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
