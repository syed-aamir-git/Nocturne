import React, { useState, useRef } from 'react';
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

  return (
    <div className="nocturne-dropdown" ref={containerRef}>
      <div
        className="nocturne-dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`nocturne-dropdown-menu ${
            align === 'left' ? 'nocturne-dropdown-menu--left' : ''
          }`}
        >
          {items.map((item, index) => {
            if (item === 'divider') {
              return <div key={`div-${index}`} className="nocturne-dropdown-divider" />;
            }
            return (
              <button
                key={item.id}
                type="button"
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
