import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = true,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content confirm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <div className={`confirm-icon-box ${isDanger ? 'danger' : 'info'}`}>
            {isDanger ? <Trash2 size={20} color="#ef4444" /> : <AlertTriangle size={20} color="#fbbf24" />}
          </div>
          <div className="confirm-title-box">
            <h3 className="confirm-title">{title}</h3>
            <p className="confirm-message">{message}</p>
          </div>
          <button className="icon-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        <div className="confirm-actions-row">
          <button type="button" className="secondary-btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={isDanger ? 'danger-btn' : 'primary-btn'}
            onClick={() => {
              onConfirm();
            }}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
