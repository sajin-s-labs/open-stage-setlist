import React from 'react';
import { Sliders, Disc, Sparkles, MoveHorizontal, Lightbulb } from 'lucide-react';
import type { Song, AppSettings, BuiltInFieldKey } from '../types';

interface KeyboardHUDProps {
  song: Song;
  activeTranspose?: number;
  compact?: boolean;
  settings?: AppSettings;
}

export const KeyboardHUD: React.FC<KeyboardHUDProps> = ({
  song,
  activeTranspose,
  compact = false,
  settings
}) => {
  const currentTrans = activeTranspose !== undefined ? activeTranspose : song.transpose;
  const transLabel = currentTrans > 0 ? `+${currentTrans}` : `${currentTrans}`;

  const fieldVis = settings?.fieldVisibility;
  const customFieldDefs = settings?.customFields || [];

  const shouldShow = (key: BuiltInFieldKey) => {
    if (!fieldVis) return true;
    return fieldVis[key]?.visibleInStageHUD ?? true;
  };

  return (
    <div className={`keyboard-hud ${compact ? 'compact' : ''}`}>
      <div className="hud-grid">
        {/* Bank & Registration */}
        {shouldShow('bank') && song.bank && (
          <div className="hud-chip highlight-chip">
            <div className="chip-icon">
              <Sliders size={15} />
            </div>
            <div className="chip-content">
              <span className="chip-label">KEYBOARD BANK</span>
              <span className="chip-value">{song.bank}</span>
            </div>
          </div>
        )}

        {/* Rhythm & BPM */}
        {shouldShow('rhythm') && (song.rhythm || song.tempo > 0) && (
          <div className="hud-chip">
            <div className="chip-icon">
              <Disc size={15} />
            </div>
            <div className="chip-content">
              <span className="chip-label">RHYTHM / STYLE</span>
              <span className="chip-value">
                {song.rhythm || 'Free'}{' '}
                {shouldShow('tempo') && song.tempo ? <span className="tempo-tag">@{song.tempo} BPM</span> : null}
              </span>
            </div>
          </div>
        )}

        {/* Tone / Voice */}
        {shouldShow('tone') && song.tone && (
          <div className="hud-chip">
            <div className="chip-icon">
              <Sparkles size={15} />
            </div>
            <div className="chip-content">
              <span className="chip-label">TONE / VOICE</span>
              <span className="chip-value">{song.tone}</span>
            </div>
          </div>
        )}

        {/* Transpose & Key */}
        {shouldShow('key') && (
          <div className="hud-chip">
            <div className="chip-icon">
              <MoveHorizontal size={15} />
            </div>
            <div className="chip-content">
              <span className="chip-label">SCALE & TRANS</span>
              <span className="chip-value">
                {transLabel} semitones{' '}
                <span className="key-tag">
                  {song.originalKey ? `(${song.currentKey || song.originalKey})` : ''}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Dynamic User Custom Fields */}
        {customFieldDefs.map((cf) => {
          if (!cf.visibleInStageHUD) return null;
          const val = song.customFields?.[cf.id];
          if (!val) return null;

          return (
            <div key={cf.id} className="hud-chip">
              <div className="chip-icon" style={{ fontSize: '1rem' }}>
                {cf.icon}
              </div>
              <div className="chip-content">
                <span className="chip-label">{cf.name}</span>
                <span className="chip-value" style={{ color: 'var(--accent-color)' }}>{val}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Melody & Ear Cues */}
      {shouldShow('helperNotes') && song.helperNotes && (
        <div className="helper-notes-strip">
          <div className="helper-notes-icon">
            <Lightbulb size={16} color="#fbbf24" />
          </div>
          <div className="helper-notes-body">
            <span className="helper-notes-title">MELODY / INTRO CUE:</span>
            <span className="helper-notes-text">{song.helperNotes}</span>
          </div>
        </div>
      )}
    </div>
  );
};
