import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { SongDisplaySettings } from '../../types';

interface SongDisplaySettingsPageProps {
  settings: SongDisplaySettings;
  onUpdate: (settings: SongDisplaySettings) => void;
  onBack: () => void;
}

export const SongDisplaySettingsPage: React.FC<SongDisplaySettingsPageProps> = ({
  settings,
  onUpdate,
  onBack
}) => {
  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>
        <h2 className="editor-page-heading">Song Viewer Preferences</h2>
      </div>

      {/* Typography & Sizing */}
      <div className="editor-card">
        <div className="card-title">🔤 Typography & Font Sizing</div>
        <p className="settings-card-desc">Adjust default font sizing for lyrics and chord badges on lead sheets.</p>

        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Lyrics Font Size: {settings.lyricsFontSize}px</span>
            <span className="row-sub-title">Readable font size for lyrics (Min 10px)</span>
          </div>
          <div className="settings-row-control">
            <input
              type="range"
              min={10}
              max={36}
              value={settings.lyricsFontSize}
              onChange={(e) => onUpdate({ ...settings, lyricsFontSize: Number(e.target.value) })}
              className="settings-slider"
            />
          </div>
        </div>

        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Chord Font Size: {settings.chordFontSize}px</span>
            <span className="row-sub-title">Controls badge size of musical chords (Min 10px)</span>
          </div>
          <div className="settings-row-control">
            <input
              type="range"
              min={10}
              max={30}
              value={settings.chordFontSize}
              onChange={(e) => onUpdate({ ...settings, chordFontSize: Number(e.target.value) })}
              className="settings-slider"
            />
          </div>
        </div>
      </div>

      {/* Chord Diagrams & Visual Fingerings (Custom Segmented Bars - No Browser Selects) */}
      <div className="editor-card">
        <div className="card-title">🎹 Chord Diagrams & Visual Fingerings</div>
        <p className="settings-card-desc">Choose which instrument diagrams appear when tapping chords.</p>

        <div className="settings-row-item vertical">
          <div className="settings-row-label">
            <span className="row-main-title">Diagram Popup Preference</span>
            <span className="row-sub-title">Keyboard visualizer vs Guitar fretboard</span>
          </div>
          <div className="segmented-toggle-bar">
            <button
              type="button"
              className={`segment-btn ${settings.diagramPreference === 'both' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, diagramPreference: 'both' })}
            >
              🎹 + 🎸 Both
            </button>
            <button
              type="button"
              className={`segment-btn ${settings.diagramPreference === 'piano' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, diagramPreference: 'piano' })}
            >
              🎹 Piano Only
            </button>
            <button
              type="button"
              className={`segment-btn ${settings.diagramPreference === 'guitar' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, diagramPreference: 'guitar' })}
            >
              🎸 Guitar Only
            </button>
            <button
              type="button"
              className={`segment-btn ${settings.diagramPreference === 'none' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, diagramPreference: 'none' })}
            >
              🚫 None
            </button>
          </div>
        </div>

        <div className="settings-row-item vertical" style={{ marginTop: '12px' }}>
          <div className="settings-row-label">
            <span className="row-main-title">Accidentals Notation</span>
            <span className="row-sub-title">Sharps vs Flats notation</span>
          </div>
          <div className="segmented-toggle-bar">
            <button
              type="button"
              className={`segment-btn ${settings.accidentalPreference === 'sharps' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, accidentalPreference: 'sharps' })}
            >
              ♯ Sharps (C#, D#, F#, G#)
            </button>
            <button
              type="button"
              className={`segment-btn ${settings.accidentalPreference === 'flats' ? 'active' : ''}`}
              onClick={() => onUpdate({ ...settings, accidentalPreference: 'flats' })}
            >
              ♭ Flats (Db, Eb, Gb, Ab)
            </button>
          </div>
        </div>
      </div>

      {/* Multi Column Layout Custom Switch */}
      <div className="editor-card">
        <div className="card-title">📱 Layout Preferences</div>

        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Multi-Column View (Tablets / Laptops)</span>
            <span className="row-sub-title">Splits long lead sheets into two columns so entire songs fit without scrolling</span>
          </div>
          <div 
            className={`custom-switch ${settings.twoColumnLayout ? 'checked' : ''}`}
            onClick={() => onUpdate({ ...settings, twoColumnLayout: !settings.twoColumnLayout })}
          >
            <div className="switch-knob" />
          </div>
        </div>
      </div>
    </div>
  );
};
