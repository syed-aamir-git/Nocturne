import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from '../primitives/Modal';
import { Button } from '../primitives/Button';
import './ConfirmationModal.css';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle size={22} />;
      case 'warning':
        return <AlertCircle size={22} />;
      default:
        return <Info size={22} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="440px">
      <div className="nocturne-confirm-modal">
        <div className="nocturne-confirm-modal__header">
          <div className={`nocturne-confirm-modal__icon-wrap nocturne-confirm-modal__icon-wrap--${variant}`}>
            {getIcon()}
          </div>
          <div className="nocturne-confirm-modal__text">
            <h3 className="nocturne-confirm-modal__title">{title}</h3>
            <p className="nocturne-confirm-modal__desc">{description}</p>
          </div>
        </div>

        <div className="nocturne-confirm-modal__actions">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            style={
              variant === 'danger'
                ? {
                    background: 'var(--indicator-error, #ef4444)',
                    borderColor: 'var(--indicator-error, #ef4444)',
                    color: '#ffffff',
                  }
                : undefined
            }
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
