import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const normalizeTheme = (value) => (value === 'dark' ? 'dark' : 'light');

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
};

const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({ children }) {
  const [hasPreference, setHasPreference] = useState(() => Boolean(getStoredTheme()));
  const [theme, setTheme] = useState(() => normalizeTheme(getStoredTheme() || getSystemTheme()));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.add('theme-transition');
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 240);
    return () => clearTimeout(timeout);
  }, [theme]);

  useEffect(() => {
    if (hasPreference || typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, [hasPreference]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        setHasPreference(true);
        try {
          localStorage.setItem('theme', next);
        } catch {
          // Ignore storage failures and continue with in-memory theme state.
        }
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
