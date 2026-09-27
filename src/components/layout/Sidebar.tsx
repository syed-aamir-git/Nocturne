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
} from 'lucide-react';
import { useUI } from '../../state/UIContext';
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
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const location = useLocation();
  const [timePhase, setTimePhase] = useState(() => getNocturnalHourPhase());

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
        { to: '/playlists', label: 'Playlists', icon: <ListMusic size={18} />, badge: '6' },
        { to: '/albums', label: 'Albums', icon: <Disc size={18} /> },
        { to: '/artists', label: 'Artists', icon: <Users size={18} /> },
        { to: '/liked', label: 'Liked Songs', icon: <Heart size={18} /> },
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
      className={`nocturne-sidebar ${sidebarCollapsed ? 'nocturne-sidebar--collapsed' : ''} ${
        mobileMenuOpen ? 'nocturne-sidebar--open' : ''
      }`}
      aria-label="Primary Navigation"
    >
      {/* Brand Header */}
      <div className="nocturne-sidebar__brand">
        <NavLink to="/" className="nocturne-sidebar__logo-link" onClick={handleLinkClick}>
          <div className="nocturne-sidebar__logo-icon">
            <Sparkles size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="nocturne-sidebar__logo-text">
              <span className="nocturne-sidebar__title">NOCTURNE</span>
              <span className="nocturne-sidebar__tagline">Music for the hours that belong to you.</span>
            </div>
          )}
        </NavLink>

        <IconButton
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="desktop-only"
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </IconButton>
      </div>

      {/* Nav Groups */}
      <div className="nocturne-sidebar__scroll-area">
        {navGroups.map((group) => (
          <div key={group.label} className="nocturne-sidebar__group">
            {!sidebarCollapsed && (
              <span className="nocturne-sidebar__group-label">{group.label}</span>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.to;
              const linkElement = (
                <NavLink
                  to={item.to}
                  onClick={handleLinkClick}
                  className={`nocturne-sidebar__nav-item ${
                    isActive ? 'nocturne-sidebar__nav-item--active' : ''
                  }`}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="nocturne-sidebar__badge">{item.badge}</span>
                  )}
                </NavLink>
              );

              if (sidebarCollapsed) {
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
          {!sidebarCollapsed && <span>{timePhase.label}</span>}
        </div>
        {!sidebarCollapsed && (
          <span style={{ fontSize: '10.5px', color: 'var(--text-low)', fontFamily: 'var(--font-mono)' }}>
            24-BIT
          </span>
        )}
      </div>
    </aside>
  );
};
