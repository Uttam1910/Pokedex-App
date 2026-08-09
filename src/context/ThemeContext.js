// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'pokedex_theme_preference';

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
    return 'system';
  });

  const [activeTheme, setActiveTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (mode) => {
      let resolved = mode;
      if (mode === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setActiveTheme(resolved);
      root.setAttribute('data-theme', resolved);
    };

    applyTheme(themeMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (e) {}

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setActiveTheme(newTheme);
        root.setAttribute('data-theme', newTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const toggleTheme = (newMode) => {
    setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
