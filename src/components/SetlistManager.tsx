import React, { useState } from 'react';
import { 
  Plus, Play, Clock, Calendar, ChevronUp, ChevronDown, Trash2, 
  Coffee, Check, X, Search, Layers 
} from 'lucide-react';
import type { Setlist, SetlistItem, Song } from '../types';

interface SetlistManagerProps {
  setlists: Setlist[];
  songs: Song[];
  onSaveSetlist: (setlist: Setlist) => void;
  onDeleteSetlist: (id: string) => void;
  onLaunchLiveStage: (setlist: Setlist, startIndex?: number) => void;
}

export const SetlistManager: React.FC<SetlistManagerProps> = ({
  setlists,
  songs,
  onSaveSetlist,
  onDeleteSetlist,
  onLaunchLiveStage
}) => {
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(
    setlists.length > 0 ? setlists[0].id : null
  );
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSongPickerOpen, setIsSongPickerOpen] = useState(false);
  const [songSearchQuery, setSongSearchQuery] = useState('');

  // Editing state for active setlist
  const activeSetlist = setlists.find((s) => s.id === selectedSetlistId) || null;

  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTargetMinutes, setEditTargetMinutes] = useState(30);
  const [editNotes, setEditNotes] = useState('');
  const [items, setItems] = useState<SetlistItem[]>([]);

  const handleSelectSetlist = (setlist: Setlist) => {
    setSelectedSetlistId(setlist.id);
    setIsCreatingNew(false);
    setEditName(setlist.name);
    setEditDate(setlist.eventDate);
    setEditTargetMinutes(setlist.targetDurationMinutes);
    setEditNotes(setlist.notes || '');
    setItems(setlist.items);
  };

  const handleStartNewSetlist = () => {
    setIsCreatingNew(true);
    setSelectedSetlistId(null);
    setEditName(`New Setlist - ${new Date().toLocaleDateString()}`);
    setEditDate(new Date().toISOString().split('T')[0]);
    setEditTargetMinutes(30);
    setEditNotes('');
    setItems([]);
  };

  const handleSaveActiveSetlist = () => {
    if (!editName.trim()) {
      alert('Please enter a Setlist Name');
      return;
    }

    const setlistToSave: Setlist = {
      id: activeSetlist && !isCreatingNew ? activeSetlist.id : `setlist-${Date.now()}`,
      name: editName.trim(),
      eventDate: editDate || new Date().toISOString().split('T')[0],
      targetDurationMinutes: Number(editTargetMinutes) || 30,
      notes: editNotes.trim(),
      items: items,
      createdAt: activeSetlist?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    onSaveSetlist(setlistToSave);
    setSelectedSetlistId(setlistToSave.id);
    setIsCreatingNew(false);
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

  const handleAddBreakItem = () => {
    const title = prompt('Enter Break / Intermission Title:', 'Band Break / Prayer');
    if (!title) return;
    const minsStr = prompt('Duration in minutes:', '5');
    const mins = parseInt(minsStr || '5', 10) || 5;

    const newItem: SetlistItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'break',
      breakTitle: title,
      breakDurationMinutes: mins
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

  // Estimated playtime: 4.5 mins per song + break durations
  const totalEstimatedMinutes = items.reduce((acc, it) => {
    if (it.type === 'break') {
      return acc + (it.breakDurationMinutes || 5);
    }
    return acc + 4.5;
  }, 0);

  const filteredSongsForPicker = songs.filter((s) => {
    const q = songSearchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div className="setlist-manager-layout">
      {/* Left Sidebar: Setlist Collection */}
      <aside className="setlist-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Layers size={18} color="var(--accent-color)" />
            <h3>Your Setlists</h3>
          </div>
          <button className="icon-btn highlight" onClick={handleStartNewSetlist} title="Create New Setlist">
            <Plus size={18} />
          </button>
        </div>

        <div className="setlist-list">
          {setlists.map((setlist) => {
            const isSelected = selectedSetlistId === setlist.id && !isCreatingNew;
            const songCount = setlist.items.filter((i) => i.type === 'song').length;

            return (
              <div
                key={setlist.id}
                className={`setlist-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectSetlist(setlist)}
              >
                <div className="card-top">
                  <h4>{setlist.name}</h4>
                </div>
                <div className="card-meta">
                  <span>📅 {setlist.eventDate || 'No date'}</span>
                  <span>🎵 {songCount} songs</span>
                </div>
              </div>
            );
          })}

          {setlists.length === 0 && !isCreatingNew && (
            <div className="empty-sidebar-state">
              <p>No setlists yet.</p>
              <button className="primary-btn" onClick={handleStartNewSetlist}>
                <Plus size={16} /> Create First Setlist
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Setlist Detail / Editor Area */}
      <main className="setlist-main-view">
        {activeSetlist || isCreatingNew ? (
          <div className="setlist-detail-container">
            {/* Header & Quick Action */}
            <div className="setlist-header-bar">
              <div className="setlist-title-group">
                <input
                  type="text"
                  className="setlist-title-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Setlist Name (e.g. Sunday Youth Fellowship)"
                />
                <div className="setlist-meta-inputs">
                  <div className="meta-field">
                    <Calendar size={14} />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>
                  <div className="meta-field">
                    <Clock size={14} />
                    <label>Target:</label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={editTargetMinutes}
                      onChange={(e) => setEditTargetMinutes(Number(e.target.value))}
                      style={{ width: '50px' }}
                    />
                    <span>min</span>
                  </div>
                </div>
              </div>

              <div className="setlist-header-actions">
                <button
                  className="primary-btn stage-launch-btn"
                  onClick={() => {
                    handleSaveActiveSetlist();
                    const setlistToLaunch: Setlist = {
                      id: activeSetlist?.id || `setlist-${Date.now()}`,
                      name: editName,
                      eventDate: editDate,
                      targetDurationMinutes: editTargetMinutes,
                      items,
                      notes: editNotes,
                      createdAt: activeSetlist?.createdAt || Date.now(),
                      updatedAt: Date.now()
                    };
                    onLaunchLiveStage(setlistToLaunch, 0);
                  }}
                  disabled={items.filter((i) => i.type === 'song').length === 0}
                  title="Launch distraction-free performance stage"
                >
                  <Play size={18} fill="currentColor" /> Play Live Stage
                </button>
                <button className="secondary-btn" onClick={handleSaveActiveSetlist} title="Save Setlist Changes">
                  <Check size={18} /> Save
                </button>
                {activeSetlist && !isCreatingNew && (
                  <button
                    className="danger-btn"
                    onClick={() => {
                      if (confirm(`Delete setlist "${activeSetlist.name}"?`)) {
                        onDeleteSetlist(activeSetlist.id);
                        setSelectedSetlistId(setlists[0]?.id || null);
                      }
                    }}
                    title="Delete Setlist"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Setlist Duration Summary Card */}
            <div className="duration-summary-bar">
              <div className="duration-stat">
                <span className="stat-label">TOTAL ESTIMATED DURATION</span>
                <span
                  className={`stat-value ${
                    totalEstimatedMinutes > editTargetMinutes ? 'overtime' : 'ontime'
                  }`}
                >
                  ~{Math.round(totalEstimatedMinutes)} min / {editTargetMinutes} min target
                </span>
              </div>
              <div className="duration-stat">
                <span className="stat-label">TOTAL SONGS</span>
                <span className="stat-value">{items.filter((i) => i.type === 'song').length}</span>
              </div>
            </div>

            {/* Song / Break Items Order List */}
            <div className="setlist-items-section">
              <div className="section-toolbar">
                <h4>Set Order & Hardware Setup</h4>
                <div className="toolbar-btns">
                  <button
                    type="button"
                    className="secondary-btn small"
                    onClick={() => setIsSongPickerOpen(true)}
                  >
                    <Plus size={14} /> Add Song
                  </button>
                  <button
                    type="button"
                    className="secondary-btn small"
                    onClick={handleAddBreakItem}
                  >
                    <Coffee size={14} /> Add Break
                  </button>
                </div>
              </div>

              <div className="items-list">
                {items.map((item, index) => {
                  if (item.type === 'break') {
                    return (
                      <div key={item.id} className="item-row break-row">
                        <div className="item-order">{index + 1}</div>
                        <div className="break-info">
                          <Coffee size={16} color="#fbbf24" />
                          <span className="break-title">{item.breakTitle || 'Break'}</span>
                          <span className="break-mins">({item.breakDurationMinutes || 5} min)</span>
                        </div>
                        <div className="item-actions">
                          <button
                            className="order-btn"
                            disabled={index === 0}
                            onClick={() => handleMoveItem(index, 'up')}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            className="order-btn"
                            disabled={index === items.length - 1}
                            onClick={() => handleMoveItem(index, 'down')}
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const song = songs.find((s) => s.id === item.songId);
                  if (!song) {
                    return (
                      <div key={item.id} className="item-row not-found-row">
                        <span>Song not found</span>
                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="item-row song-row">
                      <div className="item-order">{index + 1}</div>

                      <div className="song-main-details">
                        <div className="song-header-line">
                          <span className="song-title-text">{song.title}</span>
                          <span className="song-artist-text">{song.artist}</span>
                        </div>

                        {/* Hardware Cues Badges */}
                        <div className="song-cues-row">
                          {song.bank && (
                            <span className="badge bank-badge">🎹 {song.bank}</span>
                          )}
                          {song.rhythm && (
                            <span className="badge rhythm-badge">🥁 {song.rhythm}</span>
                          )}
                          {song.tempo > 0 && (
                            <span className="badge tempo-badge">⏱️ {song.tempo} BPM</span>
                          )}
                          <span className="badge key-badge">
                            🎵 Key: {song.currentKey || song.originalKey}
                            {song.transpose !== 0 ? ` (${song.transpose > 0 ? `+${song.transpose}` : song.transpose})` : ''}
                          </span>
                        </div>

                        {song.helperNotes && (
                          <div className="song-melody-hint">
                            💡 <em>{song.helperNotes}</em>
                          </div>
                        )}
                      </div>

                      <div className="item-actions">
                        <button
                          className="play-item-btn"
                          onClick={() => {
                            handleSaveActiveSetlist();
                            const currentSet: Setlist = {
                              id: activeSetlist?.id || `setlist-${Date.now()}`,
                              name: editName,
                              eventDate: editDate,
                              targetDurationMinutes: editTargetMinutes,
                              items,
                              notes: editNotes,
                              createdAt: activeSetlist?.createdAt || Date.now(),
                              updatedAt: Date.now()
                            };
                            onLaunchLiveStage(currentSet, index);
                          }}
                          title="Start Live Stage from this song"
                        >
                          <Play size={15} />
                        </button>
                        <button
                          className="order-btn"
                          disabled={index === 0}
                          onClick={() => handleMoveItem(index, 'up')}
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          className="order-btn"
                          disabled={index === items.length - 1}
                          onClick={() => handleMoveItem(index, 'down')}
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 && (
                  <div className="empty-items-state" onClick={() => setIsSongPickerOpen(true)}>
                    <Plus size={24} />
                    <p>Click here or "+ Add Song" to build this setlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-setlist-selected">
            <Layers size={48} color="var(--accent-color)" />
            <h3>Select a Setlist or Create a New One</h3>
            <p>Organize your songs, keyboard banks, and rhythms for upcoming gigs or fellowships.</p>
            <button className="primary-btn" onClick={handleStartNewSetlist}>
              <Plus size={18} /> Create New Setlist
            </button>
          </div>
        )}
      </main>

      {/* Song Picker Modal */}
      {isSongPickerOpen && (
        <div className="modal-backdrop" onClick={() => setIsSongPickerOpen(false)}>
          <div className="modal-content song-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Song to Add</h3>
              <button className="icon-btn" onClick={() => setIsSongPickerOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="picker-search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by title, artist, or tags..."
                value={songSearchQuery}
                onChange={(e) => setSongSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="picker-songs-list">
              {filteredSongsForPicker.map((song) => (
                <div
                  key={song.id}
                  className="picker-song-item"
                  onClick={() => handleAddSongItem(song)}
                >
                  <div className="picker-song-title">
                    <strong>{song.title}</strong>
                    <span className="picker-song-artist">{song.artist}</span>
                  </div>
                  <div className="picker-song-badges">
                    <span className="badge">Key: {song.currentKey || song.originalKey}</span>
                    {song.bank && <span className="badge">🎹 {song.bank}</span>}
                    {song.rhythm && <span className="badge">🥁 {song.rhythm}</span>}
                  </div>
                </div>
              ))}

              {filteredSongsForPicker.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
                  No songs matching "{songSearchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
