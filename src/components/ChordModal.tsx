import React, { useState } from 'react';
import { X, Music } from 'lucide-react';
import { PianoVisualizer } from './PianoVisualizer';
import { GuitarVisualizer } from './GuitarVisualizer';
import type { DiagramPreference } from '../types';

interface ChordModalProps {
  chord: string | null;
  onClose: () => void;
  diagramPreference?: DiagramPreference;
}

export const ChordModal: React.FC<ChordModalProps> = ({
  chord,
  onClose,
  diagramPreference = 'both'
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'piano' | 'guitar'>(
    diagramPreference === 'none' ? 'both' : diagramPreference
  );

  if (!chord) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={20} color="var(--accent-color)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Chord Diagram</h3>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'both' ? 'active' : ''}`}
            onClick={() => setActiveTab('both')}
          >
            All Diagrams
          </button>
          <button
            className={`tab-btn ${activeTab === 'piano' ? 'active' : ''}`}
            onClick={() => setActiveTab('piano')}
          >
            🎹 Piano
          </button>
          <button
            className={`tab-btn ${activeTab === 'guitar' ? 'active' : ''}`}
            onClick={() => setActiveTab('guitar')}
          >
            🎸 Guitar
          </button>
        </div>

        <div className="diagrams-wrapper">
          {(activeTab === 'both' || activeTab === 'piano') && (
            <div className="diagram-card">
              <PianoVisualizer chord={chord} size="large" />
            </div>
          )}

          {(activeTab === 'both' || activeTab === 'guitar') && (
            <div className="diagram-card">
              <GuitarVisualizer chord={chord} size="large" />
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button className="primary-btn" onClick={onClose} style={{ width: '100%' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
