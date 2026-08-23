import React, { useState } from 'react';
import { Save, ArrowLeft, Eye, Edit3, Sliders, Disc, Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
import type { Song, ChordFormat, CustomFieldDefinition } from '../types';
import { SongViewer } from './SongViewer';
import { convertChordsOverLyricsToChordPro, convertChordProToChordsOverLyrics } from '../utils/chordParser';
import { SHARP_NOTES } from '../utils/chordTheory';

interface SongEditorProps {
  initialSong?: Song | null;
  customFieldDefinitions?: CustomFieldDefinition[];
  onSave: (song: Song) => void;
  onCancel: () => void;
  onChordClick?: (chord: string) => void;
}

export const SongEditor: React.FC<SongEditorProps> = ({
  initialSong,
  customFieldDefinitions = [],
  onSave,
  onCancel,
  onChordClick
}) => {
  const [title, setTitle] = useState(initialSong?.title || '');
  const [artist, setArtist] = useState(initialSong?.artist || '');
  const [originalKey, setOriginalKey] = useState(initialSong?.originalKey || 'C');
  const [currentKey, setCurrentKey] = useState(initialSong?.currentKey || 'C');
  const [transpose, setTranspose] = useState(initialSong?.transpose || 0);
  const [tempo, setTempo] = useState<number | string>(initialSong?.tempo || 90);
  const [timeSignature, setTimeSignature] = useState(initialSong?.timeSignature || '4/4');

  // Keyboard hardware fields
  const [bank, setBank] = useState(initialSong?.bank || '');
  const [rhythm, setRhythm] = useState(initialSong?.rhythm || '');
  const [tone, setTone] = useState(initialSong?.tone || '');
  const [helperNotes, setHelperNotes] = useState(initialSong?.helperNotes || '');

  // Custom fields state
  const [customFields, setCustomFields] = useState<Record<string, string>>(
    initialSong?.customFields || {}
  );

  const [content, setContent] = useState(initialSong?.content || '');
  const [format, setFormat] = useState<ChordFormat>(initialSong?.format || 'auto');
  const [tagsInput, setTagsInput] = useState((initialSong?.tags || []).join(', '));
  const [notes, setNotes] = useState(initialSong?.notes || '');

  const [editorTab, setEditorTab] = useState<'edit' | 'preview'>('edit');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCustomFieldChange = (fieldId: string, val: string) => {
    setCustomFields((prev) => ({
      ...prev,
      [fieldId]: val
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedSong: Song = {
      id: initialSong?.id || `song-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      originalKey,
      currentKey: currentKey || originalKey,
      transpose: Number(transpose) || 0,
      tempo: Number(tempo) || 0,
      timeSignature,
      bank: bank.trim(),
      rhythm: rhythm.trim(),
      tone: tone.trim(),
      helperNotes: helperNotes.trim(),
      customFields,
      content,
      format,
      tags,
      notes: notes.trim(),
      createdAt: initialSong?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSave(updatedSong);
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = document.getElementById('song-content-area') as HTMLTextAreaElement;
    if (!textarea) {
      setContent((prev) => prev + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleConvertToChordPro = () => {
    const converted = convertChordsOverLyricsToChordPro(content);
    setContent(converted);
    setFormat('chordpro');
  };

  const handleConvertToChordsOverLyrics = () => {
    const converted = convertChordProToChordsOverLyrics(content);
    setContent(converted);
    setFormat('chords-over-lyrics');
  };

  const commonChords = ['C', 'G', 'D', 'Em', 'Am', 'F', 'C/E', 'D/F#', 'G/B', 'A2', 'Cadd9', 'F#m7', 'Bb', 'Eb'];
  const commonSections = ['[Intro]', '[Verse 1]', '[Verse 2]', '[Chorus]', '[Bridge]', '[Ending]'];

  return (
    <div className="page-container">
      {/* Top Action Header */}
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          <ArrowLeft size={18} /> Cancel
        </button>
        <h2 className="editor-page-heading">{initialSong ? 'Edit Song' : 'New Song'}</h2>
        <button type="button" className="primary-btn" onClick={handleSave}>
          <Save size={18} /> Save Song
        </button>
      </div>

      <form onSubmit={handleSave} className="song-editor-form">
        {/* Core Song Details Card */}
        <div className="editor-card">
          <div className="card-title">🎵 Song Info & Scale</div>
          
          <div className="form-row-2">
            <div className="form-group">
              <label>Song Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10,000 Reasons"
                required
              />
            </div>
            <div className="form-group">
              <label>Artist / Sung By</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Matt Redman / Youth Fellowship"
              />
            </div>
          </div>

          <div className="form-row-4" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label>Key</label>
              <select value={originalKey} onChange={(e) => {
                setOriginalKey(e.target.value);
                setCurrentKey(e.target.value);
              }}>
                {SHARP_NOTES.map((k) => (
                  <option key={k} value={k}>Key {k}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Transpose</label>
              <input
                type="number"
                min={-6}
                max={6}
                value={transpose}
                onChange={(e) => setTranspose(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Tempo (BPM)</label>
              <input
                type="number"
                min={30}
                max={250}
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                placeholder="98"
              />
            </div>
            <div className="form-group">
              <label>Time Sig</label>
              <select value={timeSignature} onChange={(e) => setTimeSignature(e.target.value)}>
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="6/8">6/8</option>
                <option value="2/4">2/4</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🎹 KEYBOARD & HARDWARE CUES */}
        <div className="editor-card highlight-card">
          <div className="card-title" style={{ color: 'var(--accent-color)' }}>
            🎹 Keyboard & Live Hardware Cues
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label>
                <Sliders size={13} /> Bank & Registration
              </label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="e.g. Bank 2 - Reg 1"
              />
            </div>
            <div className="form-group">
              <label>
                <Disc size={13} /> Rhythm / Style & Number
              </label>
              <input
                type="text"
                value={rhythm}
                onChange={(e) => setRhythm(e.target.value)}
                placeholder="e.g. Pop Fusion #48"
              />
            </div>
            <div className="form-group">
              <label>
                <Sparkles size={13} /> Tone / Voice Layer
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="e.g. Strings + DX Modern"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label style={{ color: '#fbbf24' }}>
              <Lightbulb size={13} /> Melody / Intro Cues (Ear Prompt)
            </label>
            <input
              type="text"
              value={helperNotes}
              onChange={(e) => setHelperNotes(e.target.value)}
              placeholder="e.g. C C C B D D E - D D B"
              style={{ borderColor: 'rgba(251, 191, 36, 0.4)' }}
            />
          </div>
        </div>

        {/* ✨ USER-DEFINED CUSTOM FIELDS CARD */}
        {customFieldDefinitions.length > 0 && (
          <div className="editor-card" style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <div className="card-title" style={{ color: '#fbbf24' }}>
              ✨ Custom Parameters ({customFieldDefinitions.length})
            </div>
            <div className="form-row-2">
              {customFieldDefinitions.map((cf) => (
                <div key={cf.id} className="form-group">
                  <label>
                    <span style={{ fontSize: '1rem' }}>{cf.icon}</span> {cf.name}
                  </label>
                  <input
                    type="text"
                    value={customFields[cf.id] || ''}
                    onChange={(e) => handleCustomFieldChange(cf.id, e.target.value)}
                    placeholder={`Enter ${cf.name}...`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chords & Lyrics Editor Card */}
        <div className="editor-card">
          <div className="editor-card-header">
            <div className="card-title">📜 Chords & Lyrics</div>

            <div className="tab-pill-group">
              <button
                type="button"
                className={`pill-btn ${editorTab === 'edit' ? 'active' : ''}`}
                onClick={() => setEditorTab('edit')}
              >
                <Edit3 size={13} /> Edit
              </button>
              <button
                type="button"
                className={`pill-btn ${editorTab === 'preview' ? 'active' : ''}`}
                onClick={() => setEditorTab('preview')}
              >
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>

          {/* Quick Insertion Chips (Horizontally Scrollable on Mobile) */}
          <div className="chips-container">
            <div className="chips-scroll-bar">
              <span className="chips-label">Section:</span>
              {commonSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  className="chip-btn section-chip"
                  onClick={() => insertTextAtCursor(`\n${sec}\n`)}
                >
                  {sec}
                </button>
              ))}
            </div>

            <div className="chips-scroll-bar">
              <span className="chips-label">Chord:</span>
              {commonChords.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  className="chip-btn chord-chip"
                  onClick={() => insertTextAtCursor(`[${ch}]`)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Format Tools */}
          <div className="format-tools-bar">
            <button
              type="button"
              className="tool-text-btn"
              onClick={handleConvertToChordPro}
              title="Aligns chords-over-lyrics into [Chord] brackets"
            >
              <RefreshCw size={13} /> To ChordPro brackets
            </button>
            <button
              type="button"
              className="tool-text-btn"
              onClick={handleConvertToChordsOverLyrics}
              title="Expands [Chord] brackets into separate chord lines above lyrics"
            >
              <RefreshCw size={13} /> To Chords-Above-Lyrics
            </button>
          </div>

          {editorTab === 'edit' ? (
            <textarea
              id="song-content-area"
              className="song-textarea"
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Paste chords and lyrics here in either format:

Format 1 (Chords above lyrics):
G       D/F#     Em7       Cadd9
Amazing grace, how sweet the sound

OR Format 2 (ChordPro brackets):
[G]Amazing [D/F#]grace, how [Em7]sweet the [Cadd9]sound`}
            />
          ) : (
            <div className="preview-container">
              <SongViewer
                content={content}
                transpose={Number(transpose) || 0}
                onChordClick={onChordClick || (() => {})}
              />
            </div>
          )}
        </div>

        {/* Optional Tags & Notes */}
        <div className="editor-card">
          <div
            className="collapsible-header"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>🏷️ Tags & Musician Notes</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
              {showAdvanced ? '▲ Hide' : '▼ Expand'}
            </span>
          </div>

          {showAdvanced && (
            <div style={{ marginTop: '14px' }}>
              <div className="form-group">
                <label>Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Youth Fellowship, Worship, Praise, Fast"
                />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Musician / Band Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Drums come in on Chorus, Guitar solo after bridge"
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
