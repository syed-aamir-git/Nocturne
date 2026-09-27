import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { PlayerProvider } from './PlayerContext';
import { LibraryProvider } from './LibraryContext';
import { ToastProvider } from './ToastContext';
import { UIProvider } from './UIContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <UIProvider>
        <PlayerProvider>
          <LibraryProvider>
            <ToastProvider>{children}</ToastProvider>
          </LibraryProvider>
        </PlayerProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export * from './ThemeContext';
export * from './PlayerContext';
export * from './LibraryContext';
export * from './ToastContext';
export * from './UIContext';
