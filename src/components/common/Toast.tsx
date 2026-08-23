import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'info' | 'error';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  // Only display the latest 1 toast to prevent clutter
  const activeToast = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  if (!activeToast) return null;

  return (
    <div className="toast-container" aria-live="polite">
      <ToastItem toast={activeToast} onDismiss={() => onDismiss(activeToast.id)} />
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    // 1-second auto dismiss
    const timer = setTimeout(() => {
      onDismiss();
    }, 1000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={16} color="#22c55e" />;
      case 'warning':
        return <AlertTriangle size={16} color="#fbbf24" />;
      case 'error':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <Info size={16} color="var(--accent-color)" />;
    }
  };

  return (
    <div className={`custom-toast custom-toast-${toast.type}`} onClick={onDismiss}>
      <div className="toast-icon-box">{getIcon()}</div>
      <div className="toast-content-box">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button className="toast-close-btn" onClick={onDismiss} aria-label="Close">
        <X size={12} />
      </button>
    </div>
  );
};
