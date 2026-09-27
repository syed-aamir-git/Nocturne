import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  Library,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Music2,
  Clock,
  Layers,
} from 'lucide-react';
import { useUI } from '../../state/UIContext';
import { IconButton } from '../primitives/IconButton';
import { MOCK_PLAYLISTS } from '../../data/mockData';
import { getNocturnalHourPhase } from '../../utilities/formatters';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenuOpen } = useUI();
  const location = useLocation();
  const [timePhase, setTimePhase] = useState(() => getNocturnalHourPhase());

  // Update late-night phase every minute
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

  const navItems = [
    { to: '/', label: 'Sanctum', icon: <Compass size={19} /> },
    { to: '/search', label: 'Resonance', icon: <Search size={19} /> },
    { to: '/library', label: 'Archived Souls', icon: <Library size={19} /> },
    { to: '/design-system', label: 'Design System', icon: <Layers size={19} /> },
  ];

  return (
    <aside
      className={`nocturne-sidebar ${sidebarCollapsed ? 'nocturne-sidebar--collapsed' : ''} ${
        mobileMenuOpen ? 'nocturne-sidebar--open' : ''
      }`}
    >
      {/* Brand & Collapse */}
      <div className="nocturne-sidebar__brand">
        <NavLink to="/" className="nocturne-sidebar__logo-link" onClick={handleLinkClick}>
          <div className="nocturne-sidebar__logo-icon">
            <Sparkles size={20} />
          </div>
          {!sidebarCollapsed && (
            <div className="nocturne-sidebar__logo-text">
              <span className="nocturne-sidebar__title">NOCTURNE</span>
              <span className="nocturne-sidebar__tagline">
                Music for the hours that belong to you.
              </span>
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
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </IconButton>
      </div>

      {/* Main Navigation */}
      <nav className="nocturne-sidebar__nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              className={`nocturne-nav-item ${isActive ? 'nocturne-nav-item--active' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Curated Playlists */}
      {!sidebarCollapsed && (
        <>
          <div className="nocturne-sidebar__section-title">
            <span>Midnight Archives</span>
            <Music2 size={13} />
          </div>

          <div className="nocturne-sidebar__playlists">
            {MOCK_PLAYLISTS.map((pl) => (
              <NavLink
                key={pl.id}
                to={`/playlist/${pl.id}`}
                onClick={handleLinkClick}
                className="nocturne-playlist-link"
                title={pl.title}
              >
                <span>{pl.title}</span>
              </NavLink>
            ))}
          </div>
        </>
      )}

      {/* Footer / Nocturnal Phase */}
      {!sidebarCollapsed && (
        <div className="nocturne-sidebar__footer">
          <div className="nocturne-sidebar__phase-badge">
            <span className="nocturne-sidebar__phase-dot" />
            <Clock size={13} />
            <span>{timePhase.label}</span>
          </div>
          <span style={{ fontSize: '10.5px', color: 'var(--text-low)', fontStyle: 'italic' }}>
            {timePhase.subtext}
          </span>
        </div>
      )}
    </aside>
  );
};
