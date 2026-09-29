import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Library,
  ListMusic,
  Disc,
  Users,
  Heart,
  History,
  Clock,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { useTheme } from '../../state/ThemeContext';
import { useLibrary } from '../../state/LibraryContext';
import { IconButton } from '../primitives/IconButton';
import { Tooltip } from '../primitives/Tooltip';
import { getNocturnalHourPhase } from '../../utilities/formatters';
import './Sidebar.css';

interface NavItemConfig {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface NavGroupConfig {
  label: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const { sidebarMode, setSidebarMode } = useTheme();
  const { playlists, likedTrackIds } = useLibrary();
  const location = useLocation();
  const [timePhase, setTimePhase] = useState(() => getNocturnalHourPhase());
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isEffectiveCollapsed = !isMobile && (sidebarMode === 'compact' || sidebarCollapsed);

  const handleToggleSidebar = () => {
    if (sidebarMode === 'compact') {
      setSidebarMode('expanded');
      setSidebarCollapsed(false);
    } else if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else {
      toggleSidebar();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimePhase(getNocturnalHourPhase());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const navGroups: NavGroupConfig[] = [
    {
      label: 'Sanctum',
      items: [
        { to: '/', label: 'Home', icon: <Home size={18} /> },
        { to: '/discover', label: 'Discover', icon: <Compass size={18} /> },
        { to: '/search', label: 'Search', icon: <Search size={18} /> },
      ],
    },
    {
      label: 'Archive',
      items: [
        { to: '/library', label: 'Library', icon: <Library size={18} /> },
        {
          to: '/playlists',
          label: 'Playlists',
          icon: <ListMusic size={18} />,
          badge: playlists.length,
        },
        { to: '/albums', label: 'Albums', icon: <Disc size={18} /> },
        { to: '/artists', label: 'Artists', icon: <Users size={18} /> },
        {
          to: '/liked',
          label: 'Liked Songs',
          icon: <Heart size={18} />,
          badge: likedTrackIds.size > 0 ? likedTrackIds.size : undefined,
        },
        { to: '/import', label: 'Import Music', icon: <Download size={18} /> },
      ],
    },
    {
      label: 'Chronicles',
      items: [
        { to: '/recently-played', label: 'Recently Played', icon: <History size={18} /> },
        { to: '/history', label: 'History', icon: <Clock size={18} /> },
        { to: '/statistics', label: 'Statistics', icon: <BarChart2 size={18} /> },
      ],
    },
    {
      label: 'System',
      items: [
        { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
      ],
    },
  ];

  return (
    <aside
      className={`nocturne-sidebar ${isEffectiveCollapsed ? 'nocturne-sidebar--collapsed' : ''} ${
        mobileMenuOpen ? 'nocturne-sidebar--open' : ''
      }`}
      role="navigation"
      aria-label="Primary Navigation"
    >
      {/* Brand Header */}
      <div className="nocturne-sidebar__brand">
        <NavLink to="/" className="nocturne-sidebar__logo-link" onClick={handleLinkClick}>
          <div className="nocturne-sidebar__logo-icon">
            <Sparkles size={16} />
          </div>
          {!isEffectiveCollapsed && (
            <div className="nocturne-sidebar__logo-text">
              <span className="nocturne-sidebar__title">NOCTURNE</span>
              <span className="nocturne-sidebar__tagline">Music for the hours that belong to you.</span>
            </div>
          )}
        </NavLink>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={handleToggleSidebar}
          aria-label={isEffectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="desktop-only"
        >
          {isEffectiveCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </IconButton>
      </div>

      {/* Nav Groups */}
      <div className="nocturne-sidebar__scroll-area">
        {navGroups.map((group) => (
          <div key={group.label} className="nocturne-sidebar__group">
            {!isEffectiveCollapsed && (
              <span className="nocturne-sidebar__group-label">{group.label}</span>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.to;
              const linkElement = (
                <NavLink
                  to={item.to}
                  onClick={handleLinkClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={`nocturne-sidebar__nav-item ${
                    isActive ? 'nocturne-sidebar__nav-item--active' : ''
                  }`}
                >
                  {item.icon}
                  {!isEffectiveCollapsed && <span>{item.label}</span>}
                  {!isEffectiveCollapsed && item.badge && (
                    <span className="nocturne-sidebar__badge">{item.badge}</span>
                  )}
                </NavLink>
              );

              if (isEffectiveCollapsed) {
                return (
                  <Tooltip key={item.to} content={item.label} position="right">
                    {linkElement}
                  </Tooltip>
                );
              }

              return <React.Fragment key={item.to}>{linkElement}</React.Fragment>;
            })}
          </div>
        ))}
      </div>

      {/* Footer Clock Phase */}
      <div className="nocturne-sidebar__footer">
        <div className="nocturne-sidebar__phase-badge">
          <span className="nocturne-sidebar__phase-dot" />
          {!isEffectiveCollapsed && <span>{timePhase.label}</span>}
        </div>
        {!isEffectiveCollapsed && (
          <span style={{ fontSize: '10.5px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            24-BIT
          </span>
        )}
      </div>
    </aside>
  );
};
