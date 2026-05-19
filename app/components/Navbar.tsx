'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    router.push('/');
  };

  // Hide navbar on auth pages and landing page (landing page has its own nav)
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname?.startsWith('/reset-password') || pathname === '/forgot-password') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <span className="text-2xl">🧠</span>
            MemoryChain
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink href="/dashboard" active={pathname === '/dashboard'}>My Memories</NavLink>
                <NavLink href="/analytics" active={pathname === '/analytics'}>Analytics</NavLink>
                <NavLink href="/settings" active={pathname === '/settings'}>Settings</NavLink>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-1">
            {isAuthenticated ? (
              <>
                <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>My Memories</MobileNavLink>
                <MobileNavLink href="/analytics" onClick={() => setMobileMenuOpen(false)}>Analytics</MobileNavLink>
                <MobileNavLink href="/settings" onClick={() => setMobileMenuOpen(false)}>Settings</MobileNavLink>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</MobileNavLink>
                <MobileNavLink href="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</MobileNavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {children}
    </Link>
  );
}
