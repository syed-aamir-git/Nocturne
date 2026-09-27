import React from 'react';
import { Moon } from 'lucide-react';
import './EmptyState.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`nocturne-empty-state ${className}`}>
      <div className="nocturne-empty-state__icon-wrap">
        {icon || <Moon size={28} />}
      </div>
      <h3 className="nocturne-empty-state__title">{title}</h3>
      {description && (
        <p className="nocturne-empty-state__desc">{description}</p>
      )}
      {action && <div className="nocturne-empty-state__action">{action}</div>}
    </div>
  );
};
