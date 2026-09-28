import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import './SelectDropdown.css';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface SelectDropdownProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  width?: string | number;
  'aria-label'?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  options,
  onChange,
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  width,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
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
    <div
      ref={containerRef}
      className={`nocturne-select-dropdown ${className}`}
      style={{ width: width || 'auto' }}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        className={`nocturne-select-trigger ${isOpen ? 'nocturne-select-trigger--open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="nocturne-select-trigger-content">
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={14}
          className={`nocturne-select-chevron ${isOpen ? 'nocturne-select-chevron--open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="nocturne-select-menu" role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`nocturne-select-option ${
                  isSelected ? 'nocturne-select-option--selected' : ''
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div>
                  <div className="nocturne-select-option-main">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                  {option.description && (
                    <div className="nocturne-select-option-desc">{option.description}</div>
                  )}
                </div>
                {isSelected && <Check size={14} color="var(--accent-primary)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
