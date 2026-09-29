import React, { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './Dropdown.css';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: (DropdownItem | 'divider')[];
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!containerRef.current) return;
        const menuItems = Array.from(
          containerRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
        );
        if (menuItems.length === 0) return;
        const activeIdx = menuItems.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === 'ArrowDown') {
          const nextIdx = activeIdx < menuItems.length - 1 ? activeIdx + 1 : 0;
          menuItems[nextIdx].focus();
        } else {
          const prevIdx = activeIdx > 0 ? activeIdx - 1 : menuItems.length - 1;
          menuItems[prevIdx].focus();
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="nocturne-dropdown" ref={containerRef}>
      <div
        className="nocturne-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`nocturne-dropdown-menu ${
            align === 'left' ? 'nocturne-dropdown-menu--left' : ''
          }`}
          role="menu"
        >

          {items.map((item, index) => {
            if (item === 'divider') {
              return <div key={`div-${index}`} className="nocturne-dropdown-divider" role="separator" />;
            }
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={`nocturne-dropdown-item ${
                  item.active ? 'nocturne-dropdown-item--active' : ''
                } ${item.danger ? 'nocturne-dropdown-item--danger' : ''}`}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
              >
                {item.icon && <span className="nocturne-dropdown-item-icon">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
