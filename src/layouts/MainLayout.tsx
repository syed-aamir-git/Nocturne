import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { PlayerBar } from '../components/layout/PlayerBar';
import { RightPanel } from '../components/layout/RightPanel';
import { MobileNav } from '../components/layout/MobileNav';
import { ToastContainer } from '../components/primitives/Toast';
import { LyricsModal } from '../components/lyrics/LyricsModal';
import { EqualizerModal } from '../components/audio/EqualizerModal';
import { useUI } from '../state/UIContext';
import { useAudioSettings } from '../state/AudioSettingsContext';
import { useToast } from '../state/ToastContext';
import { useTheme } from '../state/ThemeContext';
import { usePlayer } from '../state/PlayerContext';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, toggleLyrics } = useUI();
  const { toggleEqualizer } = useAudioSettings();
  const { toasts, removeToast } = useToast();
  const { backgroundMode } = useTheme();
  const { currentTrack } = usePlayer();

  // Global key shortcuts: 'L' toggles lyrics view, 'E' toggles equalizer
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
      } else if ((e.key === 'e' || e.key === 'E') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleEqualizer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLyrics, toggleEqualizer]);

  return (
    <div className="nocturne-layout">
      {/* Dynamic Background Atmosphere Layer */}
      <div className={`nocturne-layout__bg-layer nocturne-layout__bg-${backgroundMode}`}>
        {backgroundMode === 'album_art' && (
          <div
            className="nocturne-layout__bg-artwork"
            style={{
              backgroundImage: `url(${
                currentTrack?.artwork ||
                'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80'
              })`,
            }}
          >
            <div className="nocturne-layout__bg-artwork-overlay" />
          </div>
        )}
        {backgroundMode === 'ambient' && (
          <div className="nocturne-layout__bg-ambient">
            <div className="nocturne-layout__bg-ambient-orb-1" />
            <div className="nocturne-layout__bg-ambient-orb-2" />
          </div>
        )}
      </div>

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

      {/* 7-Band Equalizer & Audio Processing Console */}
      <EqualizerModal />

      {/* Global Notifications & Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
