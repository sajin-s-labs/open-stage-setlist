import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { StageSettings } from '../../types';

interface StageSettingsPageProps {
  settings: StageSettings;
  onUpdate: (settings: StageSettings) => void;
  onBack: () => void;
}

export const StageSettingsPage: React.FC<StageSettingsPageProps> = ({
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
        <h2 className="editor-page-heading">Live Stage Performance Settings</h2>
      </div>

      <div className="editor-card">
        <div className="card-title">🎤 Live Stage Tools & Controls</div>
        <p className="settings-card-desc">Customize HUD overlays, auto-scroller, and metronome behavior on stage.</p>

        {/* HUD Toggle Switch */}
        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Show Keyboard & Cues HUD on Stage</span>
            <span className="row-sub-title">Displays bank registrations, rhythm numbers, and intro melody cues</span>
          </div>
          <div
            className={`custom-switch ${settings.showHUD ? 'checked' : ''}`}
            onClick={() => onUpdate({ ...settings, showHUD: !settings.showHUD })}
          >
            <div className="switch-knob" />
          </div>
        </div>

        {/* Metronome Toggle Switch */}
        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Silent Visual Metronome Dot</span>
            <span className="row-sub-title">Silent pulsing tempo indicator on the stage topbar</span>
          </div>
          <div
            className={`custom-switch ${settings.showMetronome ? 'checked' : ''}`}
            onClick={() => onUpdate({ ...settings, showMetronome: !settings.showMetronome })}
          >
            <div className="switch-knob" />
          </div>
        </div>

        {/* Transpose Controls Switch */}
        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Show Live Transpose Semitone Controls</span>
            <span className="row-sub-title">Quick semitone pitch shifter on stage footer</span>
          </div>
          <div
            className={`custom-switch ${settings.showTransposeButtons ? 'checked' : ''}`}
            onClick={() => onUpdate({ ...settings, showTransposeButtons: !settings.showTransposeButtons })}
          >
            <div className="switch-knob" />
          </div>
        </div>

        {/* Auto Scroll Switch */}
        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Enable Auto-Scroll Toolbar</span>
            <span className="row-sub-title">Hands-free scrolling with adjustable speed slider</span>
          </div>
          <div
            className={`custom-switch ${settings.showAutoScroll ? 'checked' : ''}`}
            onClick={() => onUpdate({ ...settings, showAutoScroll: !settings.showAutoScroll })}
          >
            <div className="switch-knob" />
          </div>
        </div>

        {/* Default Scroll Speed Slider */}
        <div className="settings-row-item">
          <div className="settings-row-label">
            <span className="row-main-title">Default Auto-Scroll Speed: {settings.defaultScrollSpeed}</span>
            <span className="row-sub-title">Adjust baseline speed from 1 to 10</span>
          </div>
          <div className="settings-row-control">
            <input
              type="range"
              min={1}
              max={10}
              value={settings.defaultScrollSpeed}
              onChange={(e) => onUpdate({ ...settings, defaultScrollSpeed: Number(e.target.value) })}
              className="settings-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
