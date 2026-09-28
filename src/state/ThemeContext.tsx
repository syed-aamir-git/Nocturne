import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  ThemeId,
  ThemeConfig,
  LayoutDensity,
  SidebarMode,
  PlayerSize,
  BackgroundMode,
  AnimationMode,
  AppearanceSettings,
} from '../types/appearance';
import { THEMES } from '../utilities/constants';

interface ThemeContextType {
  // Theme & Appearance Settings
  currentTheme: ThemeConfig;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  availableThemes: ThemeConfig[];

  accentColor: string;
  isCustomAccent: boolean;
  setAccentColor: (color: string, isCustom?: boolean) => void;
  resetAccentColor: () => void;

  layoutDensity: LayoutDensity;
  setLayoutDensity: (density: LayoutDensity) => void;

  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;

  playerSize: PlayerSize;
  setPlayerSize: (size: PlayerSize) => void;

  backgroundMode: BackgroundMode;
  setBackgroundMode: (mode: BackgroundMode) => void;

  backgroundBlur: number;
  setBackgroundBlur: (blur: number) => void;

  interfaceOpacity: number;
  setInterfaceOpacity: (opacity: number) => void;

  animationMode: AnimationMode;
  setAnimationMode: (mode: AnimationMode) => void;

  resetToDefaults: () => void;
  settings: AppearanceSettings;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const APPEARANCE_STORAGE_KEY = 'nocturne_appearance_settings_v2';

const DEFAULT_SETTINGS: AppearanceSettings = {
  themeId: 'nocturne',
  accentColor: '#a855f7',
  isCustomAccent: false,
  layoutDensity: 'comfortable',
  sidebarMode: 'expanded',
  playerSize: 'standard',
  backgroundMode: 'gradient',
  backgroundBlur: 20,
  interfaceOpacity: 85,
  animationMode: 'full',
};

function hexToRgba(hex: string, alpha: number): string {
  try {
    const clean = hex.replace('#', '');
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  } catch {}
  return hex;
}

function getContrastColor(hex: string): string {
  try {
    const clean = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16);
      g = parseInt(clean[1] + clean[1], 16);
      b = parseInt(clean[2] + clean[2], 16);
    } else if (clean.length === 6) {
      r = parseInt(clean.substring(0, 2), 16);
      g = parseInt(clean.substring(2, 4), 16);
      b = parseInt(clean.substring(4, 6), 16);
    }
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.55 ? '#000000' : '#ffffff';
  } catch {
    return '#ffffff';
  }
}

function loadInitialSettings(): AppearanceSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validated: AppearanceSettings = {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };

      if (!THEMES.some((t) => t.id === validated.themeId)) {
        validated.themeId = DEFAULT_SETTINGS.themeId;
      }
      if (!['compact', 'comfortable', 'spacious'].includes(validated.layoutDensity)) {
        validated.layoutDensity = DEFAULT_SETTINGS.layoutDensity;
      }
      if (!['expanded', 'compact', 'hidden'].includes(validated.sidebarMode)) {
        validated.sidebarMode = DEFAULT_SETTINGS.sidebarMode;
      }
      if (!['minimal', 'standard', 'large'].includes(validated.playerSize)) {
        validated.playerSize = DEFAULT_SETTINGS.playerSize;
      }
      if (!['solid', 'gradient', 'album_art', 'ambient'].includes(validated.backgroundMode)) {
        validated.backgroundMode = DEFAULT_SETTINGS.backgroundMode;
      }
      if (!['full', 'reduced', 'off'].includes(validated.animationMode)) {
        validated.animationMode = DEFAULT_SETTINGS.animationMode;
      }
      return validated;
    }
    // Check legacy key
    const legacy = localStorage.getItem('nocturne_selected_theme') as ThemeId;
    if (legacy && THEMES.some((t) => t.id === legacy)) {
      return {
        ...DEFAULT_SETTINGS,
        themeId: legacy,
      };
    }
  } catch (e) {
    console.warn('[ThemeContext] Failed to load appearance settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => loadInitialSettings());

  const currentTheme = THEMES.find((t) => t.id === settings.themeId) || THEMES[0];

  // Apply settings to DOM and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;

    // Attributes
    root.setAttribute('data-theme', settings.themeId);
    root.setAttribute('data-layout-density', settings.layoutDensity);
    root.setAttribute('data-sidebar-mode', settings.sidebarMode);
    root.setAttribute('data-player-size', settings.playerSize);
    root.setAttribute('data-bg-mode', settings.backgroundMode);
    root.setAttribute('data-animation-mode', settings.animationMode);

    // CSS Variables for Blur and Opacity
    root.style.setProperty('--bg-blur', `${settings.backgroundBlur}px`);
    root.style.setProperty('--interface-opacity', `${settings.interfaceOpacity / 100}`);
    root.style.setProperty(
      '--bg-artwork-opacity',
      `${Math.max(0.1, 1.2 - (settings.interfaceOpacity / 100) * 0.65).toFixed(2)}`
    );

    // Accent Color Override
    if (settings.isCustomAccent && settings.accentColor) {
      root.style.setProperty('--accent-primary', settings.accentColor);
      root.style.setProperty('--accent-secondary', settings.accentColor);
      root.style.setProperty('--accent-glow', hexToRgba(settings.accentColor, 0.25));
      root.style.setProperty('--accent-glow-strong', hexToRgba(settings.accentColor, 0.45));
      root.style.setProperty('--accent-border', hexToRgba(settings.accentColor, 0.3));
      root.style.setProperty('--accent-contrast', getContrastColor(settings.accentColor));
    } else {
      root.style.removeProperty('--accent-primary');
      root.style.removeProperty('--accent-secondary');
      root.style.removeProperty('--accent-glow');
      root.style.removeProperty('--accent-glow-strong');
      root.style.removeProperty('--accent-border');
      root.style.removeProperty('--accent-contrast');
    }

    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(settings));
      localStorage.setItem('nocturne_selected_theme', settings.themeId);
    } catch (e) {
      console.warn('[ThemeContext] Failed to persist appearance settings:', e);
    }
  }, [settings]);

  const setThemeId = useCallback((id: ThemeId) => {
    const found = THEMES.find((t) => t.id === id);
    setSettings((prev) => ({
      ...prev,
      themeId: id,
      accentColor: prev.isCustomAccent ? prev.accentColor : found?.accent || prev.accentColor,
    }));
  }, []);

  const setAccentColor = useCallback((color: string, isCustom: boolean = true) => {
    setSettings((prev) => ({
      ...prev,
      accentColor: color,
      isCustomAccent: isCustom,
    }));
  }, []);

  const resetAccentColor = useCallback(() => {
    setSettings((prev) => {
      const thm = THEMES.find((t) => t.id === prev.themeId) || THEMES[0];
      return {
        ...prev,
        accentColor: thm.accent,
        isCustomAccent: false,
      };
    });
  }, []);

  const setLayoutDensity = useCallback((density: LayoutDensity) => {
    setSettings((prev) => ({ ...prev, layoutDensity: density }));
  }, []);

  const setSidebarMode = useCallback((mode: SidebarMode) => {
    setSettings((prev) => ({ ...prev, sidebarMode: mode }));
  }, []);

  const setPlayerSize = useCallback((size: PlayerSize) => {
    setSettings((prev) => ({ ...prev, playerSize: size }));
  }, []);

  const setBackgroundMode = useCallback((mode: BackgroundMode) => {
    setSettings((prev) => ({ ...prev, backgroundMode: mode }));
  }, []);

  const setBackgroundBlur = useCallback((blur: number) => {
    setSettings((prev) => ({ ...prev, backgroundBlur: Math.max(0, Math.min(40, blur)) }));
  }, []);

  const setInterfaceOpacity = useCallback((opacity: number) => {
    setSettings((prev) => ({ ...prev, interfaceOpacity: Math.max(50, Math.min(100, opacity)) }));
  }, []);

  const setAnimationMode = useCallback((mode: AnimationMode) => {
    setSettings((prev) => ({ ...prev, animationMode: mode }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId: settings.themeId,
        setThemeId,
        availableThemes: THEMES,
        accentColor: settings.accentColor,
        isCustomAccent: settings.isCustomAccent,
        setAccentColor,
        resetAccentColor,
        layoutDensity: settings.layoutDensity,
        setLayoutDensity,
        sidebarMode: settings.sidebarMode,
        setSidebarMode,
        playerSize: settings.playerSize,
        setPlayerSize,
        backgroundMode: settings.backgroundMode,
        setBackgroundMode,
        backgroundBlur: settings.backgroundBlur,
        setBackgroundBlur,
        interfaceOpacity: settings.interfaceOpacity,
        setInterfaceOpacity,
        animationMode: settings.animationMode,
        setAnimationMode,
        resetToDefaults,
        settings,
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
