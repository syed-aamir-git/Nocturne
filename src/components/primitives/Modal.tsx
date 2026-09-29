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
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Accessible Focus Trap
      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === containerRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on container or first interactive element
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const firstInput = containerRef.current.querySelector<HTMLElement>('input, button:not([aria-label="Close modal"])');
        if (firstInput) {
          firstInput.focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="nocturne-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="nocturne-modal-container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nocturne-modal-title"
        tabIndex={-1}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div className="nocturne-modal-header">
          {typeof title === 'string' ? (
            <h2 id="nocturne-modal-title" className="nocturne-modal-title">{title}</h2>
          ) : (
            <div id="nocturne-modal-title">{title || <div />}</div>
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
