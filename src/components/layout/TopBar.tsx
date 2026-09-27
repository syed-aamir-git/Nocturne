import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, Radio } from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { useTheme } from '../../state/ThemeContext';
import { useToast } from '../../state/ToastContext';
import { Dropdown } from '../primitives/Dropdown';
import { Avatar } from '../primitives/Avatar';
import { IconButton } from '../primitives/IconButton';
import './TopBar.css';

export const TopBar: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, searchQuery, setSearchQuery } = useUI();
  const { currentTheme, availableThemes, setThemeId } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
            type="text"
            className="nocturne-topbar__search-input"
            placeholder="Search gothic soundscapes, artists, or late-night drones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
