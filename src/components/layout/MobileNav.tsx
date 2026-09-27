import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Library, Heart } from 'lucide-react';
import './MobileNav.css';

export const MobileNav: React.FC = () => {
  const items = [
    { to: '/', label: 'Home', icon: <Home size={20} /> },
    { to: '/discover', label: 'Discover', icon: <Compass size={20} /> },
    { to: '/search', label: 'Search', icon: <Search size={20} /> },
    { to: '/library', label: 'Library', icon: <Library size={20} /> },
    { to: '/liked', label: 'Liked', icon: <Heart size={20} /> },
  ];

  return (
    <nav className="nocturne-mobile-nav" aria-label="Mobile Navigation">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `nocturne-mobile-nav__item ${isActive ? 'nocturne-mobile-nav__item--active' : ''}`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
