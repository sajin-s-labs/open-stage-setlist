import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, CheckSquare, Square, 
  Sliders, Disc, Sparkles, Lightbulb, Music, Tag, FileText, MoveHorizontal, PlusCircle, X 
} from 'lucide-react';
import type { AppSettings, BuiltInFieldKey, CustomFieldDefinition, FieldLocationVisibility } from '../../types';

interface FieldsManagerSettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

export const FieldsManagerSettingsPage: React.FC<FieldsManagerSettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldIcon, setNewFieldIcon] = useState('🎛️');
  const [newVisibleInSetlist, setNewVisibleInSetlist] = useState(true);
  const [newVisibleInSongCard, setNewVisibleInSongCard] = useState(true);
  const [newVisibleInStageHUD, setNewVisibleInStageHUD] = useState(true);

  const builtInFieldMeta: { key: BuiltInFieldKey; name: string; icon: any; desc: string }[] = [
    { key: 'bank', name: 'Keyboard Bank & Reg', icon: <Sliders size={16} color="#ec4899" />, desc: 'e.g. Bank 2 - Reg 1' },
    { key: 'rhythm', name: 'Rhythm / Style & #', icon: <Disc size={16} color="#a855f7" />, desc: 'e.g. Pop Fusion #48' },
    { key: 'tempo', name: 'Tempo (BPM)', icon: <span style={{ fontSize: '1rem' }}>⏱️</span>, desc: 'e.g. 98 BPM' },
    { key: 'key', name: 'Musical Key / Scale', icon: <span style={{ fontSize: '1rem' }}>🎵</span>, desc: 'e.g. Key: G' },
    { key: 'transpose', name: 'Transpose Offset', icon: <MoveHorizontal size={16} color="#34d399" />, desc: 'e.g. -2, +5' },
    { key: 'tone', name: 'Tone / Voice Layer', icon: <Sparkles size={16} color="#38bdf8" />, desc: 'e.g. Strings + DX Modern' },
    { key: 'helperNotes', name: 'Melody / Intro Cue', icon: <Lightbulb size={16} color="#fbbf24" />, desc: 'e.g. C C C B D D E - D D B' },
    { key: 'timeSignature', name: 'Time Signature', icon: <span style={{ fontSize: '1rem' }}>📐</span>, desc: 'e.g. 4/4, 6/8' },
    { key: 'artist', name: 'Artist / Sung By', icon: <Music size={16} color="#38bdf8" />, desc: 'e.g. Matt Redman' },
    { key: 'tags', name: 'Genre / Group Tags', icon: <Tag size={16} color="#f472b6" />, desc: 'e.g. Youth Fellowship, Worship' },
    { key: 'notes', name: 'Musician Notes', icon: <FileText size={16} color="#94a3b8" />, desc: 'e.g. Drums on Chorus' }
  ];

  const handleToggleBuiltIn = (key: BuiltInFieldKey, location: keyof FieldLocationVisibility) => {
    const currentLoc = settings.fieldVisibility[key] || {
      visibleInSetlist: true,
      visibleInSongCard: true,
      visibleInStageHUD: true
    };

    const updatedVisibility = {
      ...settings.fieldVisibility,
      [key]: {
        ...currentLoc,
        [location]: !currentLoc[location]
      }
    };

    onUpdateSettings({
      ...settings,
      fieldVisibility: updatedVisibility
    });
  };

  const handleToggleCustom = (fieldId: string, location: keyof FieldLocationVisibility) => {
    const updatedCustomFields = settings.customFields.map((cf) => {
      if (cf.id === fieldId) {
        return {
          ...cf,
          [location]: !cf[location]
        };
      }
      return cf;
    });

    onUpdateSettings({
      ...settings,
      customFields: updatedCustomFields
    });
  };

  const handleDeleteCustomField = (fieldId: string) => {
    const updated = settings.customFields.filter((cf) => cf.id !== fieldId);
    onUpdateSettings({
      ...settings,
      customFields: updated
    });
  };

  const handleCreateCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim()) {
      return;
    }

    const newField: CustomFieldDefinition = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: newFieldName.trim(),
      icon: newFieldIcon.trim() || '✨',
      visibleInSetlist: newVisibleInSetlist,
      visibleInSongCard: newVisibleInSongCard,
      visibleInStageHUD: newVisibleInStageHUD
    };

    onUpdateSettings({
      ...settings,
      customFields: [...settings.customFields, newField]
    });

    setNewFieldName('');
    setIsAddModalOpen(false);
  };

  const quickEmojiList = ['🎛️', '🎸', '🎹', '🎙️', '🥁', '🎺', '🎻', '✨', '💡', '🏷️', '🔊', '🎼', '🎯', '⚡', '🎧', '🙌'];

  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>

        <h2 className="editor-page-heading">Fields & Custom Options</h2>

        <button 
          type="button" 
          className="primary-btn" 
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusCircle size={18} /> Add Custom Field
        </button>
      </div>

      {/* Built-in Parameters Visibility Table */}
      <div className="editor-card">
        <div className="card-title">⚙️ Built-In Parameter Visibility</div>
        <p className="settings-card-desc">
          Choose where each parameter should be visible across your app.
        </p>

        <div className="fields-table-container">
          <div className="fields-table-header">
            <div className="col-field-name">Parameter Field</div>
            <div className="col-loc">📋 Setlist</div>
            <div className="col-loc">🎵 Song Card</div>
            <div className="col-loc">🎤 Stage HUD</div>
          </div>

          <div className="fields-table-body">
            {builtInFieldMeta.map((field) => {
              const vis = settings.fieldVisibility[field.key] || {
                visibleInSetlist: true,
                visibleInSongCard: true,
                visibleInStageHUD: true
              };

              return (
                <div key={field.key} className="fields-table-row">
                  <div className="col-field-name">
                    <div className="field-icon-wrap">{field.icon}</div>
                    <div className="field-name-info">
                      <span className="field-name-title">{field.name}</span>
                      <span className="field-name-sub">{field.desc}</span>
                    </div>
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleBuiltIn(field.key, 'visibleInSetlist')}
                  >
                    {vis.visibleInSetlist ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleBuiltIn(field.key, 'visibleInSongCard')}
                  >
                    {vis.visibleInSongCard ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleBuiltIn(field.key, 'visibleInStageHUD')}
                  >
                    {vis.visibleInStageHUD ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Custom Fields Section */}
      <div className="editor-card">
        <div className="editor-card-header">
          <div>
            <div className="card-title">✨ User-Defined Custom Fields ({settings.customFields.length})</div>
            <p className="settings-card-desc">
              Create parameters for your specific keyboard model, band cues, or audio patches.
            </p>
          </div>
          <button 
            type="button" 
            className="secondary-btn small"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {settings.customFields.length > 0 ? (
          <div className="fields-table-container" style={{ marginTop: '12px' }}>
            <div className="fields-table-header">
              <div className="col-field-name">Custom Field</div>
              <div className="col-loc">📋 Setlist</div>
              <div className="col-loc">🎵 Song Card</div>
              <div className="col-loc">🎤 Stage HUD</div>
              <div className="col-action">Action</div>
            </div>

            <div className="fields-table-body">
              {settings.customFields.map((cf) => (
                <div key={cf.id} className="fields-table-row">
                  <div className="col-field-name">
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{cf.icon}</span>
                    <span className="field-name-title">{cf.name}</span>
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleCustom(cf.id, 'visibleInSetlist')}
                  >
                    {cf.visibleInSetlist ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleCustom(cf.id, 'visibleInSongCard')}
                  >
                    {cf.visibleInSongCard ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <div 
                    className="col-loc check-cell"
                    onClick={() => handleToggleCustom(cf.id, 'visibleInStageHUD')}
                  >
                    {cf.visibleInStageHUD ? (
                      <CheckSquare size={20} color="var(--accent-color)" />
                    ) : (
                      <Square size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <div className="col-action">
                    <button 
                      className="icon-btn danger" 
                      onClick={() => handleDeleteCustomField(cf.id)}
                      title="Delete Custom Field"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state-box" style={{ padding: '24px' }}>
            <p>No custom fields added yet. Add custom attributes like Capo, Synth Presets, or Drum Tracks!</p>
            <button className="primary-btn small" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={14} /> Add First Custom Field
            </button>
          </div>
        )}
      </div>

      {/* Add Custom Field Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content add-custom-field-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--accent-color)" />
                <h3 style={{ margin: 0 }}>Add Custom Field</h3>
              </div>
              <button className="icon-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomField} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Custom Field Name *</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. Capo Position, Synth Split, Drum Cue, Vocal Lead"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Icon / Emoji Symbol (Type or select below)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={newFieldIcon}
                    onChange={(e) => setNewFieldIcon(e.target.value)}
                    style={{ width: '64px', textAlign: 'center', fontSize: '1.3rem', padding: '6px' }}
                    maxLength={4}
                    placeholder="Emoji"
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Type any emoji from your keyboard or pick from presets:
                  </span>
                </div>
                <div className="emoji-picker-grid" style={{ marginTop: '8px' }}>
                  {quickEmojiList.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      className={`emoji-btn ${newFieldIcon === ic ? 'selected' : ''}`}
                      onClick={() => setNewFieldIcon(ic)}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Visibility Locations</label>
                <div className="toggle-list" style={{ marginTop: '6px' }}>
                  <div 
                    className={`toggle-row-card ${newVisibleInSetlist ? 'active' : ''}`}
                    onClick={() => setNewVisibleInSetlist(!newVisibleInSetlist)}
                  >
                    <span>📋 Show in Setlist Tracklist</span>
                    {newVisibleInSetlist ? <CheckSquare size={18} color="var(--accent-color)" /> : <Square size={18} color="var(--text-muted)" />}
                  </div>

                  <div 
                    className={`toggle-row-card ${newVisibleInSongCard ? 'active' : ''}`}
                    onClick={() => setNewVisibleInSongCard(!newVisibleInSongCard)}
                  >
                    <span>🎵 Show in Song Library Cards</span>
                    {newVisibleInSongCard ? <CheckSquare size={18} color="var(--accent-color)" /> : <Square size={18} color="var(--text-muted)" />}
                  </div>

                  <div 
                    className={`toggle-row-card ${newVisibleInStageHUD ? 'active' : ''}`}
                    onClick={() => setNewVisibleInStageHUD(!newVisibleInStageHUD)}
                  >
                    <span>🎤 Show in Song Reader & Live Stage HUD</span>
                    {newVisibleInStageHUD ? <CheckSquare size={18} color="var(--accent-color)" /> : <Square size={18} color="var(--text-muted)" />}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" className="secondary-btn" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Create Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
