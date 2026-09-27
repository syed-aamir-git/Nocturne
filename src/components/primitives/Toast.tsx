import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';
import type { ToastMessage } from '../../types';
import './Toast.css';

export interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.variant) {
      case 'success':
        return <CheckCircle size={18} color="#4ade80" />;
      case 'error':
        return <AlertCircle size={18} color="#f87171" />;
      case 'atmosphere':
        return <Sparkles size={18} color="var(--accent-primary)" />;
      default:
        return <Info size={18} color="var(--text-medium)" />;
    }
  };

  return (
    <div className={`nocturne-toast nocturne-toast--${toast.variant || 'default'}`} role="status">
      <div className="nocturne-toast__icon">{getIcon()}</div>
      <div className="nocturne-toast__content">
        <div className="nocturne-toast__title">{toast.title}</div>
        {toast.description && (
          <div className="nocturne-toast__desc">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        className="nocturne-toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="nocturne-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
