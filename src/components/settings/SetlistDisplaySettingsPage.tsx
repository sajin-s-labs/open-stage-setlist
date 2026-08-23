import React from 'react';
import { ArrowLeft, CheckSquare, Square, Sliders, Disc, Lightbulb, Music } from 'lucide-react';
import type { SetlistDisplaySettings } from '../../types';

interface SetlistDisplaySettingsPageProps {
  settings: SetlistDisplaySettings;
  onUpdate: (settings: SetlistDisplaySettings) => void;
  onBack: () => void;
}

export const SetlistDisplaySettingsPage: React.FC<SetlistDisplaySettingsPageProps> = ({
  settings,
  onUpdate,
  onBack
}) => {
  const toggle = (key: keyof SetlistDisplaySettings) => {
    onUpdate({
      ...settings,
      [key]: !settings[key]
    });
  };

  const options: { key: keyof SetlistDisplaySettings; title: string; desc: string; icon: any }[] = [
    {
      key: 'showBank',
      title: 'Show Keyboard Bank & Registration',
      desc: 'Displays the Bank # and Registration # badge (e.g. Bank 2 - Reg 1)',
      icon: <Sliders size={18} color="#ec4899" />
    },
    {
      key: 'showRhythm',
      title: 'Show Rhythm / Style & Number',
      desc: 'Displays the rhythm name or pattern (e.g. Pop Fusion #48)',
      icon: <Disc size={18} color="#a855f7" />
    },
    {
      key: 'showTempo',
      title: 'Show Tempo (BPM)',
      desc: 'Displays the song speed (e.g. 98 BPM)',
      icon: <span style={{ fontSize: '1.1rem' }}>⏱️</span>
    },
    {
      key: 'showKey',
      title: 'Show Key & Transpose Offset',
      desc: 'Displays the active key and semitone transpose (e.g. Key: G (-2))',
      icon: <span style={{ fontSize: '1.1rem' }}>🎵</span>
    },
    {
      key: 'showHelperNotes',
      title: 'Show Intro / Melody Helper Cue',
      desc: 'Displays your quick ear-prompt note strip (e.g. C C C B D D E - D D B)',
      icon: <Lightbulb size={18} color="#fbbf24" />
    },
    {
      key: 'showArtist',
      title: 'Show Artist / Sung By',
      desc: 'Displays the artist or fellowship team next to the title',
      icon: <Music size={18} color="#38bdf8" />
    },
    {
      key: 'showEstimatedDuration',
      title: 'Show Estimated Playtime Calculation',
      desc: 'Displays the live calculated playtime against the setlist target duration',
      icon: <span style={{ fontSize: '1.1rem' }}>⏳</span>
    }
  ];

  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>
        <h2 className="editor-page-heading">Setlist Display Customization</h2>
      </div>

      <div className="editor-card">
        <div className="card-title">📋 Configure Setlist Song Row Items</div>
        <p className="settings-card-desc">
          Customize exactly what parameters and cues are visible when browsing songs inside your setlists.
        </p>

        <div className="toggle-list">
          {options.map((opt) => {
            const isChecked = settings[opt.key];

            return (
              <div
                key={opt.key}
                className={`toggle-row-card ${isChecked ? 'active' : ''}`}
                onClick={() => toggle(opt.key)}
              >
                <div className="toggle-left">
                  <div className="toggle-icon-box">{opt.icon}</div>
                  <div className="toggle-texts">
                    <h4 className="toggle-title">{opt.title}</h4>
                    <p className="toggle-desc">{opt.desc}</p>
                  </div>
                </div>

                <div className="toggle-checkbox">
                  {isChecked ? (
                    <CheckSquare size={22} color="var(--accent-color)" />
                  ) : (
                    <Square size={22} color="var(--text-muted)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
