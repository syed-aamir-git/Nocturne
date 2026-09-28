import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { PlayerBar } from '../components/layout/PlayerBar';
import { RightPanel } from '../components/layout/RightPanel';
import { MobileNav } from '../components/layout/MobileNav';
import { ToastContainer } from '../components/primitives/Toast';
import { LyricsModal } from '../components/lyrics/LyricsModal';
import { useUI } from '../state/UIContext';
import { useToast } from '../state/ToastContext';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, toggleLyrics } = useUI();
  const { toasts, removeToast } = useToast();

  // Global key shortcut: 'L' toggles lyrics view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.key === 'l' || e.key === 'L') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleLyrics();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLyrics]);

  return (
    <div className="nocturne-layout">
      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          className="nocturne-layout__backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="nocturne-layout__body">
        <TopBar />
        <div className="nocturne-layout__center-split">
          <main className="nocturne-layout__content" id="main-content">
            <Outlet />
          </main>
          {/* Optional Right-Side Panel */}
          <RightPanel />
        </div>
      </div>

      {/* Persistent Bottom Audio Player Placeholder */}
      <PlayerBar />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Dedicated Immersive Lyrics & Lore Screen */}
      <LyricsModal />

      {/* Global Notifications & Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
