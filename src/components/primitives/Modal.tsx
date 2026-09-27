import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="nocturne-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="nocturne-modal-container"
        ref={containerRef}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="nocturne-modal-header">
          {typeof title === 'string' ? (
            <h2 className="nocturne-modal-title">{title}</h2>
          ) : (
            title || <div />
          )}
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </IconButton>
        </div>

        <div className="nocturne-modal-body">{children}</div>

        {footer && <div className="nocturne-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
