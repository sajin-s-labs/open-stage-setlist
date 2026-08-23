import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Upload, User, Image } from 'lucide-react';
import type { UserProfile } from '../../types';

interface ProfileSettingsPageProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

export const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({
  initialProfile,
  onSave,
  onBack
}) => {
  const [name, setName] = useState(initialProfile.name || '');
  const [role, setRole] = useState(initialProfile.role || '');
  const [band, setBand] = useState(initialProfile.band || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(
    initialProfile.bannerUrl || 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)'
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBannerUrl(`url("${event.target.result}") center / cover no-repeat`);
      }
    };
    reader.readAsDataURL(file);
  };

  const bannerPresets = [
    { name: 'Sky & Violet', value: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)' },
    { name: 'Midnight Stage', value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
    { name: 'Sunset Amber', value: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    { name: 'Emerald Wave', value: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' },
    { name: 'Electric Pink', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      role: role.trim(),
      band: band.trim(),
      bio: bio.trim(),
      avatarUrl,
      bannerUrl
    });
    onBack();
  };

  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>

        <h2 className="editor-page-heading">Musician Profile</h2>

        <button type="button" className="primary-btn" onClick={handleSave}>
          <Save size={18} /> Save Profile
        </button>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* Live Profile Card Preview */}
        <div className="editor-card">
          <div className="card-title">Live Sidebar Card Preview</div>
          <div className="profile-preview-card" style={{ background: bannerUrl }}>
            <div className="preview-overlay">
              <div className="preview-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="preview-avatar-img" />
                ) : (
                  <div className="preview-avatar-fallback">
                    <User size={28} color="#fff" />
                  </div>
                )}
              </div>
              <div className="preview-info">
                <h4>{name || 'Your Name'}</h4>
                <p>{role || 'Musician Role'}</p>
                {band && <span>🎸 {band}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Inputs */}
        <div className="editor-card">
          <div className="card-title">👤 Musician & Band Info</div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Musician Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David / Alex"
                required
              />
            </div>

            <div className="form-group">
              <label>Role / Instrument</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Keyboardist & Arranger, Guitarist"
              />
            </div>
          </div>

          <div className="form-row-2" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label>Band / Fellowship / Church</label>
              <input
                type="text"
                value={band}
                onChange={(e) => setBand(e.target.value)}
                placeholder="e.g. Youth Fellowship Band"
              />
            </div>

            <div className="form-group">
              <label>Short Bio / Note</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Yamaha PSR & Synth splits"
              />
            </div>
          </div>
        </div>

        {/* Photos & Background Banner Uploads */}
        <div className="editor-card">
          <div className="card-title">📸 Photos & Banner Background</div>

          <div className="form-row-2">
            {/* Avatar upload */}
            <div className="upload-box-card">
              <span className="upload-box-title">Profile Avatar Photo</span>
              <div className="upload-dropzone" onClick={() => avatarInputRef.current?.click()}>
                <Upload size={20} color="var(--accent-color)" />
                <span className="upload-main-text">Upload Custom Photo</span>
                <span className="upload-sub-text">Saved locally in your browser</span>
              </div>
              <input
                type="file"
                ref={avatarInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleAvatarFile}
              />
              {avatarUrl && (
                <button
                  type="button"
                  className="danger-btn small"
                  style={{ marginTop: '8px', width: '100%' }}
                  onClick={() => setAvatarUrl('')}
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Banner presets or upload */}
            <div className="upload-box-card">
              <span className="upload-box-title">Card Banner Background</span>
              <div className="preset-pill-grid">
                {bannerPresets.map((bp) => (
                  <button
                    key={bp.name}
                    type="button"
                    className="preset-pill-btn"
                    style={{ background: bp.value }}
                    onClick={() => setBannerUrl(bp.value)}
                  >
                    {bp.name}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="secondary-btn small"
                style={{ marginTop: '10px', width: '100%' }}
                onClick={() => bannerInputRef.current?.click()}
              >
                <Image size={14} /> Upload Custom Banner
              </button>
              <input
                type="file"
                ref={bannerInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleBannerFile}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
