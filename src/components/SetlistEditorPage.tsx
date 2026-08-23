import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, Coffee, ChevronUp, ChevronDown, 
  Search, X, Calendar, Clock, Sliders, Disc, Check 
} from 'lucide-react';
import type { Setlist, SetlistItem, Song } from '../types';
import { AddBreakModal } from './common/AddBreakModal';

interface SetlistEditorPageProps {
  initialSetlist?: Setlist | null;
  songs: Song[];
  onSave: (setlist: Setlist) => void;
  onCancel: () => void;
}

export const SetlistEditorPage: React.FC<SetlistEditorPageProps> = ({
  initialSetlist,
  songs,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(initialSetlist?.name || '');
  const [eventDate, setEventDate] = useState(
    initialSetlist?.eventDate || new Date().toISOString().split('T')[0]
  );
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(
    initialSetlist?.targetDurationMinutes || 30
  );
  const [notes, setNotes] = useState(initialSetlist?.notes || '');
  const [items, setItems] = useState<SetlistItem[]>(initialSetlist?.items || []);

  const [isSongPickerOpen, setIsSongPickerOpen] = useState(false);
  const [isAddBreakOpen, setIsAddBreakOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    const setlistToSave: Setlist = {
      id: initialSetlist?.id || `setlist-${Date.now()}`,
      name: name.trim(),
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      targetDurationMinutes: Number(targetDurationMinutes) || 30,
      notes: notes.trim(),
      items: items,
      createdAt: initialSetlist?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSave(setlistToSave);
  };

  const handleAddSongItem = (song: Song) => {
    const newItem: SetlistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'song',
      songId: song.id
    };
    setItems((prev) => [...prev, newItem]);
    setIsSongPickerOpen(false);
  };

  const handleAddBreakConfirm = (breakTitle: string, breakDurationMinutes: number) => {
    const newItem: SetlistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'break',
      breakTitle,
      breakDurationMinutes
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredSongsForPicker = songs.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      (s.bank && s.bank.toLowerCase().includes(q)) ||
      (s.rhythm && s.rhythm.toLowerCase().includes(q)) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalEstimatedMinutes = items.reduce((acc, it) => {
    if (it.type === 'break') return acc + (it.breakDurationMinutes || 5);
    return acc + 4.5;
  }, 0);

  return (
    <div className="page-container">
      {/* Top Header Actions */}
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onCancel}>
          <ArrowLeft size={18} /> Cancel
        </button>

        <h2 className="editor-page-heading">
          {initialSetlist ? 'Edit Setlist' : 'Create New Setlist'}
        </h2>

        <button type="button" className="primary-btn" onClick={handleSave}>
          <Save size={18} /> Save Setlist
        </button>
      </div>

      <form onSubmit={handleSave} className="setlist-editor-form">
        {/* Setlist Meta Card */}
        <div className="editor-card">
          <div className="card-title">📋 Setlist Details</div>
          
          <div className="form-group">
            <label>Setlist Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Youth Fellowship - Sunday Service"
              required
            />
          </div>

          <div className="form-row-2" style={{ marginTop: '12px' }}>
            <div className="form-group">
              <label><Calendar size={13} /> Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label><Clock size={13} /> Target Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={300}
                value={targetDurationMinutes}
                onChange={(e) => setTargetDurationMinutes(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Set Notes / Musician Cues</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Transition smoothly from song 1 to song 2 in G major"
            />
          </div>
        </div>

        {/* Setlist Items & Order Card */}
        <div className="editor-card">
          <div className="editor-card-header">
            <div>
              <div className="card-title">🎵 Tracklist Sequence ({items.length})</div>
              <span className="card-subtitle">
                Est. Playtime: ~{Math.round(totalEstimatedMinutes)} min / {targetDurationMinutes} min target
              </span>
            </div>

            <div className="toolbar-btns">
              <button
                type="button"
                className="primary-btn small"
                onClick={() => {
                  setSearchQuery('');
                  setIsSongPickerOpen(true);
                }}
              >
                <Plus size={14} /> Add Song
              </button>
              <button
                type="button"
                className="secondary-btn small"
                onClick={() => setIsAddBreakOpen(true)}
              >
                <Coffee size={14} /> Add Break
              </button>
            </div>
          </div>

          <div className="items-list" style={{ marginTop: '12px' }}>
            {items.map((item, index) => {
              if (item.type === 'break') {
                return (
                  <div key={item.id} className="item-row break-row">
                    <div className="item-order break">{index + 1}</div>
                    <div className="break-info">
                      <Coffee size={16} color="#fbbf24" />
                      <span className="break-title">{item.breakTitle || 'Break'}</span>
                      <span className="break-mins">({item.breakDurationMinutes || 5} min)</span>
                    </div>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="order-btn"
                        disabled={index === 0}
                        onClick={() => handleMoveItem(index, 'up')}
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        className="order-btn"
                        disabled={index === items.length - 1}
                        onClick={() => handleMoveItem(index, 'down')}
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveItem(index)}
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              }

              const song = songs.find((s) => s.id === item.songId);
              if (!song) return null;

              return (
                <div key={item.id} className="item-row song-row">
                  <div className="item-order">{index + 1}</div>

                  <div className="song-main-details">
                    <div className="song-header-line">
                      <span className="song-title-text">{song.title}</span>
                      {song.artist && <span className="song-artist-text">• {song.artist}</span>}
                    </div>

                    <div className="song-cues-row">
                      <span className="badge key-badge">
                        Key {song.currentKey || song.originalKey}
                      </span>
                      {song.bank && <span className="badge bank-badge"><Sliders size={11} /> {song.bank}</span>}
                      {song.rhythm && <span className="badge rhythm-badge"><Disc size={11} /> {song.rhythm}</span>}
                      {song.tempo > 0 && <span className="badge tempo-badge">⏱️ {song.tempo} BPM</span>}
                    </div>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      className="order-btn"
                      disabled={index === 0}
                      onClick={() => handleMoveItem(index, 'up')}
                      title="Move Up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="order-btn"
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveItem(index, 'down')}
                      title="Move Down"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveItem(index)}
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div 
                className="empty-items-state" 
                onClick={() => {
                  setSearchQuery('');
                  setIsSongPickerOpen(true);
                }}
              >
                <Plus size={24} color="var(--accent-color)" />
                <h4>Setlist is empty</h4>
                <p>Tap here or "+ Add Song" to choose songs from your repertoire</p>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Song Picker Modal */}
      {isSongPickerOpen && (
        <div className="modal-backdrop" onClick={() => setIsSongPickerOpen(false)}>
          <div className="modal-content song-picker-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--accent-color)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Select Song to Add</h3>
              </div>
              <button className="icon-btn" onClick={() => setIsSongPickerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="picker-search-bar">
              <Search size={16} className="picker-search-icon" />
              <input
                type="text"
                placeholder="Search by song name, artist, bank, rhythm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>

            <div className="picker-songs-list">
              {filteredSongsForPicker.map((song) => {
                const isAlreadyAdded = items.some((it) => it.type === 'song' && it.songId === song.id);

                return (
                  <div
                    key={song.id}
                    className={`picker-song-card ${isAlreadyAdded ? 'already-added' : ''}`}
                    onClick={() => handleAddSongItem(song)}
                  >
                    <div className="picker-song-info">
                      <div className="picker-title-row">
                        <span className="picker-song-title">{song.title}</span>
                        {song.artist && <span className="picker-song-artist">{song.artist}</span>}
                      </div>

                      <div className="picker-badges-row">
                        <span className="badge key-badge">Key {song.currentKey || song.originalKey}</span>
                        {song.bank && <span className="badge bank-badge">🎹 {song.bank}</span>}
                        {song.rhythm && <span className="badge rhythm-badge">🥁 {song.rhythm}</span>}
                        {song.tempo > 0 && <span className="badge tempo-badge">⏱️ {song.tempo} BPM</span>}
                      </div>
                    </div>

                    <div className="picker-add-action">
                      {isAlreadyAdded ? (
                        <span className="already-tag">
                          <Check size={13} /> Added
                        </span>
                      ) : (
                        <button type="button" className="primary-btn small">
                          <Plus size={13} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredSongsForPicker.length === 0 && (
                <div className="empty-picker-state">
                  <p>No songs found matching "{searchQuery}".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Add Break Modal */}
      <AddBreakModal
        isOpen={isAddBreakOpen}
        onAdd={handleAddBreakConfirm}
        onClose={() => setIsAddBreakOpen(false)}
      />
    </div>
  );
};
