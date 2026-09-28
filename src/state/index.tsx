import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { PlayerProvider } from './PlayerContext';
import { LibraryProvider } from './LibraryContext';
import { ToastProvider } from './ToastContext';
import { UIProvider } from './UIContext';
import { SpotifyProvider } from './SpotifyContext';
import { AudioSettingsProvider } from './AudioSettingsContext';
import { AnalyticsProvider } from './AnalyticsContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <UIProvider>
        <AudioSettingsProvider>
          <AnalyticsProvider>
            <PlayerProvider>
              <LibraryProvider>
                <ToastProvider>
                  <SpotifyProvider>{children}</SpotifyProvider>
                </ToastProvider>
              </LibraryProvider>
            </PlayerProvider>
          </AnalyticsProvider>
        </AudioSettingsProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export * from './ThemeContext';
export * from './PlayerContext';
export * from './LibraryContext';
export * from './ToastContext';
export * from './UIContext';
export * from './SpotifyContext';
export * from './AudioSettingsContext';
export * from './AnalyticsContext';
