import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeId, ThemeConfig } from '../types';
import { THEMES } from '../utilities/constants';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'nocturne_selected_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    return saved && THEMES.some((t) => t.id === saved) ? saved : 'obsidian';
  });

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }, [themeId]);

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        setThemeId,
        availableThemes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
