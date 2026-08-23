import React from 'react';
import { 
  User, Palette, Sliders, Music, 
  Download, Sparkles, ChevronRight, SlidersHorizontal 
} from 'lucide-react';
import type { AppSettings } from '../../types';

interface SettingsHomeProps {
  settings: AppSettings;
  onSelectSubpage: (subpage: string) => void;
}

export const SettingsHome: React.FC<SettingsHomeProps> = ({
  settings,
  onSelectSubpage
}) => {
  const categories = [
    {
      id: 'settings-profile',
      title: 'Musician Profile',
      subtitle: `${settings.userProfile.name} • ${settings.userProfile.role}`,
      icon: <User size={22} color="#38bdf8" />,
      badge: 'Active'
    },
    {
      id: 'settings-fields',
      title: 'Fields & Custom Options Manager',
      subtitle: `Configure Key, BPM, Bank, Rhythm + ${settings.customFields?.length || 0} custom fields`,
      icon: <SlidersHorizontal size={22} color="#fbbf24" />,
      badge: `${settings.customFields?.length || 0} Custom`
    },
    {
      id: 'settings-themes',
      title: 'Themes & Appearance',
      subtitle: `Current: ${settings.theme} • Custom Accent`,
      icon: <Palette size={22} color="#ec4899" />,
      badge: settings.theme
    },
    {
      id: 'settings-song-display',
      title: 'Song Viewer & Repertoire',
      subtitle: 'Font sizes, chord colors, diagram preferences, sharps/flats',
      icon: <Music size={22} color="#22c55e" />
    },
    {
      id: 'settings-stage',
      title: 'Live Stage Preferences',
      subtitle: 'Single-song vs continuous, HUD toggles, autoscroll & metronome',
      icon: <Sliders size={22} color="#a855f7" />
    },
    {
      id: 'settings-backup',
      title: 'Data Backups & Portability',
      subtitle: 'Export JSON, Import backup file, Restore defaults',
      icon: <Download size={22} color="#06b6d4" />
    },
    {
      id: 'settings-about',
      title: 'About Open Stage Setlist',
      subtitle: 'Version 1.3.0 • Offline live stage platform',
      icon: <Sparkles size={22} color="#f43f5e" />
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div className="page-title-group">
          <div className="page-icon-pill">
            <Sliders size={22} color="var(--accent-color)" />
          </div>
          <div>
            <h1 className="page-title">App Settings</h1>
            <p className="page-subtitle">Personalize your stage display, profile, and repertoire</p>
          </div>
        </div>
      </div>

      {/* Settings Categorized List */}
      <div className="settings-category-list">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="settings-category-row"
            onClick={() => onSelectSubpage(cat.id)}
          >
            <div className="category-left">
              <div className="category-icon-box">{cat.icon}</div>
              <div className="category-texts">
                <h3 className="category-title">{cat.title}</h3>
                <p className="category-subtitle">{cat.subtitle}</p>
              </div>
            </div>

            <div className="category-right">
              {cat.badge && <span className="badge">{cat.badge}</span>}
              <ChevronRight size={18} className="category-chevron" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
