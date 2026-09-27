import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, Radio } from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { useTheme } from '../../state/ThemeContext';
import { useToast } from '../../state/ToastContext';
import { storageService } from '../../services/storageService';
import { Dropdown } from '../primitives/Dropdown';
import { Avatar } from '../primitives/Avatar';
import { IconButton } from '../primitives/IconButton';
import './TopBar.css';

export const TopBar: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, searchQuery, setSearchQuery } = useUI();
  const { currentTheme, availableThemes, setThemeId } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

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
          className="nocturne-topbar__mobile-toggle"
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

        {/* User profile avatar */}
        <Avatar
          name="Nocturne Wanderer"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
          size="sm"
          ring
        />
      </div>
    </header>
  );
};
