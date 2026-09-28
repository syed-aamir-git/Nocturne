import React from 'react';
import './Toggle.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const toggleElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || (typeof label === 'string' ? label : 'Toggle')}
      disabled={disabled}
      className={`nocturne-toggle nocturne-toggle--${size} ${checked ? 'nocturne-toggle--checked' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span className="nocturne-toggle__thumb" />
    </button>
  );

  if (!label && !description) {
    return <div className={`nocturne-toggle-standalone ${className}`}>{toggleElement}</div>;
  }

  return (
    <label
      className={`nocturne-toggle-wrapper ${disabled ? 'nocturne-toggle-wrapper--disabled' : ''} ${className}`}
      onClick={handleClick}
    >
      {toggleElement}
      <div className="nocturne-toggle-text">
        {label && <span className="nocturne-toggle-label">{label}</span>}
        {description && <span className="nocturne-toggle-description">{description}</span>}
      </div>
    </label>
  );
};
