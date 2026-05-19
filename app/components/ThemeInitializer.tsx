'use client';

import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function ThemeInitializer() {
  useEffect(() => {
    // Check if user already has a saved preference in localStorage
    const savedTheme = localStorage.getItem('memorychain_theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return;
    }

    // If authenticated, load theme from backend preferences
    if (api.isAuthenticated()) {
      api.getProfile()
        .then(data => {
          const theme = data.user.preferences?.theme || 'light';
          localStorage.setItem('memorychain_theme', theme);
          document.documentElement.classList.toggle('dark', theme === 'dark');
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
