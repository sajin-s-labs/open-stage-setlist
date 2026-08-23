import React from 'react';
import { ArrowLeft, Smartphone, Monitor, Disc } from 'lucide-react';

interface AboutSettingsPageProps {
  onBack: () => void;
}

export const AboutSettingsPage: React.FC<AboutSettingsPageProps> = ({ onBack }) => {
  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>
        <h2 className="editor-page-heading">About Open Stage Setlist</h2>
      </div>

      <div className="editor-card about-intro-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/app-icon.jpg" 
            alt="Open Stage Setlist Icon" 
            style={{ width: '56px', height: '56px', borderRadius: '14px', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)' }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Open Stage Setlist</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 600 }}>v1.5.0 • Live Repertoire & Stage Engine</span>
          </div>
        </div>

        <p style={{ marginTop: '14px', lineHeight: '1.6', fontSize: '0.92rem', color: 'var(--text-main)' }}>
          Built specifically for live church & event musicians and arranger keyboardists. Solves the pain of forgetting hardware bank registrations, accompaniment styles, transpose offsets, voice patches, and intro melody hooks during live performances.
        </p>
      </div>

      <div className="editor-card">
        <div className="card-title">📦 Cross-Platform Distribution Roadmap</div>
        <p className="settings-card-desc">
          Architected with zero cloud dependencies to run with 0 latency on stage across all your devices:
        </p>

        <div className="roadmap-grid">
          <div className="roadmap-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Smartphone size={18} color="var(--accent-color)" />
              <h4 style={{ margin: 0 }}>Android & Mobile PWA</h4>
            </div>
            <p>Runs offline in Chrome/Firefox browser, or installable as a native standalone `.apk` app.</p>
          </div>

          <div className="roadmap-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Monitor size={18} color="#34d399" />
              <h4 style={{ margin: 0 }}>Windows PC & Laptop</h4>
            </div>
            <p>Standalone portable executable (`.exe` / `.zip`) for stage laptops and monitors.</p>
          </div>

          <div className="roadmap-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Disc size={18} color="#fbbf24" />
              <h4 style={{ margin: 0 }}>Linux (AppImage / .deb)</h4>
            </div>
            <p>Self-contained universal packages for Ubuntu, Debian, Fedora, and Arch Linux setups.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
