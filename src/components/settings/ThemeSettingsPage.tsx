import React, { useState } from 'react';
import { ArrowLeft, Check, Plus, Trash2, Sparkles, X } from 'lucide-react';
import type { ThemeMode, CustomThemeDefinition } from '../../types';

interface ThemeSettingsPageProps {
  currentTheme: ThemeMode;
  currentAccent: string;
  customThemes?: CustomThemeDefinition[];
  activeCustomTheme?: CustomThemeDefinition;
  onUpdateTheme: (theme: ThemeMode, customTheme?: CustomThemeDefinition) => void;
  onUpdateAccent: (accent: string) => void;
  onSaveCustomTheme: (customTheme: CustomThemeDefinition) => void;
  onDeleteCustomTheme: (id: string) => void;
  onBack: () => void;
}

export const ThemeSettingsPage: React.FC<ThemeSettingsPageProps> = ({
  currentTheme,
  currentAccent,
  customThemes = [],
  activeCustomTheme,
  onUpdateTheme,
  onUpdateAccent,
  onSaveCustomTheme,
  onDeleteCustomTheme,
  onBack
}) => {
  const [isCreatingCustomModalOpen, setIsCreatingCustomModalOpen] = useState(false);
  const [customName, setCustomName] = useState('My Stage Palette');
  const [customBg, setCustomBg] = useState('#000000');
  const [customSurface, setCustomSurface] = useState('#0d0d0d');
  const [customText, setCustomText] = useState('#f8fafc');
  const [customAccent, setCustomAccent] = useState('#38bdf8');

  const appThemes: { id: ThemeMode; name: string; desc: string; bg: string; surface: string; border: string }[] = [
    { 
      id: 'oled-dark', 
      name: 'OLED Pitch Black', 
      desc: 'True 100% #000000 pure black pixels across all cards & stage for zero backlight bleed', 
      bg: '#000000', 
      surface: '#000000', 
      border: '#1c1c1e' 
    },
    { 
      id: 'material-dark', 
      name: 'Material Slate', 
      desc: 'Deep slate indigo dark mode for rehearsals and studio practice', 
      bg: '#0f172a', 
      surface: '#1e293b', 
      border: '#334155' 
    },
    { 
      id: 'deep-navy', 
      name: 'Midnight Navy', 
      desc: 'Rich nocturnal blue with subtle glow', 
      bg: '#0b132b', 
      surface: '#1c2541', 
      border: '#3a506b' 
    },
    { 
      id: 'studio-light', 
      name: 'Studio Daylight', 
      desc: 'High-contrast bright daylight theme for outdoor gigs and sunny halls', 
      bg: '#f8fafc', 
      surface: '#ffffff', 
      border: '#cbd5e1' 
    },
    { 
      id: 'emerald', 
      name: 'Forest Emerald', 
      desc: 'Rich deep green organic theme', 
      bg: '#022c22', 
      surface: '#064e3b', 
      border: '#065f46' 
    },
    { 
      id: 'purple', 
      name: 'Royal Stage Purple', 
      desc: 'Vibrant stage violet backdrop', 
      bg: '#1e1035', 
      surface: '#2e1065', 
      border: '#581c87' 
    }
  ];

  const accentColors = [
    { name: 'Sky Blue', hex: '#38bdf8' },
    { name: 'Electric Pink', hex: '#ec4899' },
    { name: 'Emerald Green', hex: '#22c55e' },
    { name: 'Amber Gold', hex: '#fbbf24' },
    { name: 'Purple Violet', hex: '#a855f7' },
    { name: 'Vibrant Orange', hex: '#f97316' },
    { name: 'Cyan Neon', hex: '#06b6d4' }
  ];

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newCustom: CustomThemeDefinition = {
      id: `theme_${Date.now()}`,
      name: customName.trim(),
      bgColor: customBg,
      surfaceColor: customSurface,
      cardBg: customSurface,
      textColor: customText,
      accentColor: customAccent,
      borderColor: 'rgba(255,255,255,0.12)'
    };

    onSaveCustomTheme(newCustom);
    onUpdateTheme('custom', newCustom);
    setIsCreatingCustomModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>
        <h2 className="editor-page-heading">Themes & Appearance</h2>
      </div>

      {/* Preset App Themes */}
      <div className="editor-card">
        <div className="editor-card-header">
          <div>
            <div className="card-title">🎨 Visual Themes</div>
            <p className="settings-card-desc">Applies seamlessly across all views and Live Stage.</p>
          </div>
          <button 
            type="button" 
            className="secondary-btn small"
            onClick={() => setIsCreatingCustomModalOpen(true)}
          >
            <Plus size={14} /> Create Custom Theme
          </button>
        </div>

        <div className="theme-options-grid">
          {appThemes.map((th) => {
            const isSelected = currentTheme === th.id;

            return (
              <div
                key={th.id}
                className={`theme-box-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onUpdateTheme(th.id)}
              >
                <div className="theme-preview-bar" style={{ background: th.bg, borderColor: th.border }}>
                  <div className="theme-sub-swatch" style={{ background: th.surface }} />
                </div>
                <div className="theme-box-header">
                  <span className="theme-box-title">{th.name}</span>
                  {isSelected && <Check size={16} color="var(--accent-color)" />}
                </div>
                <span className="theme-box-desc">{th.desc}</span>
              </div>
            );
          })}

          {/* User Custom Themes */}
          {customThemes.map((ct) => {
            const isSelected = currentTheme === 'custom' && activeCustomTheme?.id === ct.id;

            return (
              <div
                key={ct.id}
                className={`theme-box-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onUpdateTheme('custom', ct)}
              >
                <div className="theme-preview-bar" style={{ background: ct.bgColor, borderColor: ct.borderColor }}>
                  <div className="theme-sub-swatch" style={{ background: ct.surfaceColor }} />
                </div>
                <div className="theme-box-header">
                  <span className="theme-box-title">✨ {ct.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isSelected && <Check size={16} color="var(--accent-color)" />}
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomTheme(ct.id);
                      }}
                      title="Delete Theme"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <span className="theme-box-desc">Custom User-Designed Palette</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="editor-card">
        <div className="card-title">✨ Primary Accent Highlight Color</div>
        <p className="settings-card-desc">Used for active buttons, chord badges, and navigation focus.</p>

        <div className="accent-color-grid">
          {accentColors.map((acc) => {
            const isSelected = currentAccent.toLowerCase() === acc.hex.toLowerCase();

            return (
              <div
                key={acc.name}
                className={`accent-color-circle ${isSelected ? 'active' : ''}`}
                style={{ backgroundColor: acc.hex }}
                onClick={() => onUpdateAccent(acc.hex)}
                title={acc.name}
              >
                {isSelected && <Check size={16} color="#000" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Custom Theme Creator Modal */}
      {isCreatingCustomModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreatingCustomModalOpen(false)}>
          <div className="modal-content custom-theme-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent-color)" />
                <h3 style={{ margin: 0 }}>Design Custom Theme</h3>
              </div>
              <button className="icon-btn" onClick={() => setIsCreatingCustomModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCustom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Theme Name *</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sunset Amber, Electric Dark"
                  required
                  autoFocus
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    style={{ height: '40px', padding: '3px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label>Card & Surface Color</label>
                  <input
                    type="color"
                    value={customSurface}
                    onChange={(e) => setCustomSurface(e.target.value)}
                    style={{ height: '40px', padding: '3px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Text Color</label>
                  <input
                    type="color"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    style={{ height: '40px', padding: '3px', cursor: 'pointer' }}
                  />
                </div>

                <div className="form-group">
                  <label>Accent Highlight Color</label>
                  <input
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    style={{ height: '40px', padding: '3px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Live Preview Bar */}
              <div 
                className="custom-live-preview"
                style={{
                  background: customBg,
                  color: customText,
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${customAccent}`
                }}
              >
                <div style={{ background: customSurface, padding: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>{customName} Preview</span>
                  <span style={{ color: customAccent, fontWeight: 700 }}>[Key G • Chord G/B]</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsCreatingCustomModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save & Apply Theme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
