import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { PlayerProvider } from './PlayerContext';
import { ToastProvider } from './ToastContext';
import { UIProvider } from './UIContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <UIProvider>
        <PlayerProvider>
          <ToastProvider>{children}</ToastProvider>
        </PlayerProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export * from './ThemeContext';
export * from './PlayerContext';
export * from './ToastContext';
export * from './UIContext';
