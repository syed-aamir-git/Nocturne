import React from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`nocturne-tabs-nav ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`nocturne-tab-btn ${isActive ? 'nocturne-tab-btn--active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="nocturne-tab-badge">{tab.badge}</span>
            )}
            {isActive && <div className="nocturne-tab-indicator" />}
          </button>
        );
      })}
    </div>
  );
};
