import React, { useState } from 'react';
import { Coffee, X } from 'lucide-react';

interface AddBreakModalProps {
  isOpen: boolean;
  onAdd: (title: string, durationMinutes: number) => void;
  onClose: () => void;
}

export const AddBreakModal: React.FC<AddBreakModalProps> = ({
  isOpen,
  onAdd,
  onClose
}) => {
  const [title, setTitle] = useState('Opening Prayer & Welcome');
  const [duration, setDuration] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), Number(duration) || 5);
    onClose();
  };

  const presetDurations = [2, 3, 5, 10, 15, 20];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content add-break-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={20} color="#fbbf24" />
            <h3 style={{ margin: 0 }}>Add Setlist Break / Intermission</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label>Break Title / Purpose</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Opening Prayer, Speaker, Intermission"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Duration: <strong>{duration} minutes</strong></label>
            <div className="break-duration-presets">
              {presetDurations.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`break-time-pill ${duration === m ? 'active' : ''}`}
                  onClick={() => setDuration(m)}
                >
                  {m}m
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={120}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ marginTop: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Add Break
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
