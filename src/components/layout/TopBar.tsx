import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Radio, Download, LogIn, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { useTheme } from '../../state/ThemeContext';
import { useToast } from '../../state/ToastContext';
import { useSpotify } from '../../state/SpotifyContext';
import { storageService } from '../../services/storageService';
import { Dropdown } from '../primitives/Dropdown';
import { Avatar } from '../primitives/Avatar';
import { IconButton } from '../primitives/IconButton';
import { AuthModal } from '../modals/AuthModal';
import './TopBar.css';

export const TopBar: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, searchQuery, setSearchQuery } = useUI();
  const { currentTheme, availableThemes, setThemeId, sidebarMode } = useTheme();
  const { showToast } = useToast();
  const { isConnected, userProfile, disconnect } = useSpotify();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Global search keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        if (location.pathname !== '/search') {
          navigate('/search');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, navigate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      storageService.addSearchHistory(trimmed);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const themeDropdownItems = availableThemes.map((theme) => ({
    id: theme.id,
    label: theme.name,
    active: theme.id === currentTheme.id,
    icon: (
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme.accent,
          boxShadow: `0 0 6px ${theme.accent}`,
        }}
      />
    ),
    onClick: () => {
      setThemeId(theme.id);
      showToast('Nocturnal Theme Shifted', `Atmosphere altered to ${theme.name}`, 'atmosphere');
    },
  }));

  return (
    <header className="nocturne-topbar">
      <div className="nocturne-topbar__left">
        <IconButton
          variant="ghost"
          size="md"
          className={`nocturne-topbar__mobile-toggle ${
            sidebarMode === 'hidden' ? 'nocturne-topbar__mobile-toggle--force' : ''
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </IconButton>

        <form className="nocturne-topbar__search-wrap" onSubmit={handleSearchSubmit}>
          <Search size={16} className="nocturne-topbar__search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="nocturne-topbar__search-input"
            placeholder="Search gothic soundscapes, artists, or late-night drones..."
            value={searchQuery}
            onFocus={() => {
              if (location.pathname !== '/search') {
                navigate('/search');
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (location.pathname !== '/search') {
                navigate(`/search?q=${encodeURIComponent(val)}`);
              } else {
                navigate(val ? `/search?q=${encodeURIComponent(val)}` : '/search', { replace: true });
              }
            }}
          />
          <span className="nocturne-topbar__search-shortcut">⌘K</span>
        </form>
      </div>

      <div className="nocturne-topbar__right">
        {/* Hi-Res lossless badge */}
        <div className="nocturne-topbar__hires-badge" title="Bit-perfect 24-bit 96kHz lossless streaming">
          <Radio size={12} color="var(--accent-primary)" />
          <span>FLAC 24/96</span>
        </div>

        {/* Theme mood selector dropdown */}
        <Dropdown
          trigger={
            <button type="button" className="nocturne-topbar__theme-btn">
              <span
                className="nocturne-topbar__theme-dot"
                style={{ backgroundColor: currentTheme.accent, color: currentTheme.accent }}
              />
              <span>{currentTheme.name}</span>
            </button>
          }
          items={themeDropdownItems}
          align="right"
        />

        {/* User profile avatar with account actions */}
        <Dropdown
          trigger={
            <button
              type="button"
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              title={isConnected ? `Connected as ${userProfile?.name}` : 'Sign in / Connect Spotify'}
            >
              <Avatar
                name={userProfile?.name || 'Nocturne Wanderer'}
                src={userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                size="sm"
                ring
              />
            </button>
          }
          items={
            isConnected
              ? [
                  {
                    id: 'status',
                    label: `Spotify: ${userProfile?.name || 'Linked'}`,
                    icon: <Radio size={14} color="var(--indicator-success)" />,
                    onClick: () => navigate('/settings'),
                  },
                  {
                    id: 'import',
                    label: 'Import Music from Spotify',
                    icon: <Download size={14} />,
                    onClick: () => navigate('/import'),
                  },
                  {
                    id: 'settings',
                    label: 'Connected Services',
                    icon: <SettingsIcon size={14} />,
                    onClick: () => navigate('/settings'),
                  },
                  {
                    id: 'disconnect',
                    label: 'Disconnect Spotify',
                    icon: <LogOut size={14} />,
                    onClick: disconnect,
                  },
                ]
              : [
                  {
                    id: 'auth',
                    label: 'Continue with Spotify',
                    icon: <LogIn size={14} color="#1db954" />,
                    onClick: () => setIsAuthModalOpen(true),
                  },
                  {
                    id: 'import',
                    label: 'Import Playlists',
                    icon: <Download size={14} />,
                    onClick: () => navigate('/import'),
                  },
                  {
                    id: 'settings',
                    label: 'Preferences',
                    icon: <SettingsIcon size={14} />,
                    onClick: () => navigate('/settings'),
                  },
                ]
          }
          align="right"
        />

        {/* Global Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </header>
  );
};
