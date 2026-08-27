import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { THEME_STORAGE_KEY } from '../utils/storage';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    // ignore local storage errors
  }
  return 'light';
}

export function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark = theme === 'dark';
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = theme;
  root.setAttribute('data-theme', theme);
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme();
    applyThemeToDocument(initial);
    return initial;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme to localStorage', e);
    }
  }, [theme]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      applyThemeToDocument(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    applyThemeToDocument(newTheme);
    setThemeState(newTheme);
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    const initial = getInitialTheme();
    return {
      theme: initial,
      toggleTheme: () => {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyThemeToDocument(next);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {}
      },
      setTheme: (newTheme: Theme) => {
        applyThemeToDocument(newTheme);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch {}
      },
      isDark: initial === 'dark',
    };
  }
  return context;
}


