import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Play, Edit3, Trash2, Sliders, Disc, Sparkles, 
  Music, Filter, Tag, Lightbulb, Copy, ChevronDown, Check 
} from 'lucide-react';
import type { Song, AppSettings, BuiltInFieldKey } from '../types';
import { SHARP_NOTES } from '../utils/chordTheory';

interface SongLibraryProps {
  songs: Song[];
  settings?: AppSettings;
  onOpenSong: (song: Song) => void;
  onPlaySongLive: (song: Song) => void;
  onEditSong: (song: Song) => void;
  onRequestDeleteSong: (song: Song) => void;
  onDuplicateSong: (song: Song) => void;
}

export const SongLibrary: React.FC<SongLibraryProps> = ({
  songs,
  settings,
  onOpenSong,
  onPlaySongLive,
  onEditSong,
  onRequestDeleteSong,
  onDuplicateSong
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const [isKeyDropdownOpen, setIsKeyDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const keyDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  const allTags = Array.from(new Set(songs.flatMap((s) => s.tags || [])));
  const fieldVis = settings?.fieldVisibility;
  const customFieldDefs = settings?.customFields || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyDropdownRef.current && !keyDropdownRef.current.contains(event.target as Node)) {
        setIsKeyDropdownOpen(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShow = (key: BuiltInFieldKey) => {
    if (!fieldVis) return true;
    return fieldVis[key]?.visibleInSongCard ?? true;
  };

  const filteredSongs = songs.filter((song) => {
    const q = searchQuery.toLowerCase();
    const customValues = Object.values(song.customFields || {}).join(' ').toLowerCase();

    const matchesSearch =
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      (song.bank && song.bank.toLowerCase().includes(q)) ||
      (song.rhythm && song.rhythm.toLowerCase().includes(q)) ||
      (song.helperNotes && song.helperNotes.toLowerCase().includes(q)) ||
      customValues.includes(q) ||
      song.tags.some((t) => t.toLowerCase().includes(q));

    const matchesKey =
      selectedKey === 'ALL' || (song.currentKey || song.originalKey) === selectedKey;

    const matchesTag = selectedTag === 'ALL' || song.tags.includes(selectedTag);

    return matchesSearch && matchesKey && matchesTag;
  });

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="page-header-row">
        <div className="page-title-group">
          <div className="page-icon-pill">
            <Music size={20} color="var(--accent-color)" />
          </div>
          <div>
            <h1 className="page-title">All Songs ({songs.length})</h1>
            <p className="page-subtitle">Master repertoire & keyboard setups</p>
          </div>
        </div>
      </div>

      {/* Search & Custom Filter Bar (0 Browser Popups) */}
      <div className="library-filters-container">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search title, artist, bank, rhythm, melody cue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              ×
            </button>
          )}
        </div>

        <div className="filter-dropdowns-row">
          {/* Custom UI Key Dropdown */}
          <div className="custom-dropdown-container" ref={keyDropdownRef}>
            <button
              type="button"
              className={`filter-dropdown-btn ${selectedKey !== 'ALL' ? 'active' : ''}`}
              onClick={() => {
                setIsKeyDropdownOpen(!isKeyDropdownOpen);
                setIsTagDropdownOpen(false);
              }}
            >
              <Filter size={13} />
              <span>{selectedKey === 'ALL' ? 'All Keys' : `Key: ${selectedKey}`}</span>
              <ChevronDown size={13} />
            </button>

            {isKeyDropdownOpen && (
              <div className="custom-dropdown-popover">
                <button
                  type="button"
                  className={`dropdown-option-item ${selectedKey === 'ALL' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedKey('ALL');
                    setIsKeyDropdownOpen(false);
                  }}
                >
                  <span>All Keys</span>
                  {selectedKey === 'ALL' && <Check size={14} color="var(--accent-color)" />}
                </button>

                {SHARP_NOTES.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`dropdown-option-item ${selectedKey === k ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedKey(k);
                      setIsKeyDropdownOpen(false);
                    }}
                  >
                    <span>Key {k}</span>
                    {selectedKey === k && <Check size={14} color="var(--accent-color)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom UI Tag Dropdown */}
          {allTags.length > 0 && (
            <div className="custom-dropdown-container" ref={tagDropdownRef}>
              <button
                type="button"
                className={`filter-dropdown-btn ${selectedTag !== 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  setIsTagDropdownOpen(!isTagDropdownOpen);
                  setIsKeyDropdownOpen(false);
                }}
              >
                <Tag size={13} />
                <span>{selectedTag === 'ALL' ? 'All Tags' : selectedTag}</span>
                <ChevronDown size={13} />
              </button>

              {isTagDropdownOpen && (
                <div className="custom-dropdown-popover">
                  <button
                    type="button"
                    className={`dropdown-option-item ${selectedTag === 'ALL' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedTag('ALL');
                      setIsTagDropdownOpen(false);
                    }}
                  >
                    <span>All Tags</span>
                    {selectedTag === 'ALL' && <Check size={14} color="var(--accent-color)" />}
                  </button>

                  {allTags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`dropdown-option-item ${selectedTag === t ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTag(t);
                        setIsTagDropdownOpen(false);
                      }}
                    >
                      <span>{t}</span>
                      {selectedTag === t && <Check size={14} color="var(--accent-color)" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Songs Cards Grid */}
      <div className="songs-cards-grid">
        {filteredSongs.map((song) => (
          <div 
            key={song.id} 
            className="song-card" 
            onClick={() => onOpenSong(song)}
          >
            <div className="song-card-header">
              <div className="song-card-title-group">
                <h3 className="song-card-title">{song.title}</h3>
                {shouldShow('artist') && song.artist && (
                  <span className="song-card-artist">{song.artist}</span>
                )}
              </div>
              {shouldShow('key') && (
                <div className="song-key-pill">
                  {song.currentKey || song.originalKey}
                  {shouldShow('transpose') && song.transpose !== 0 ? (
                    <span className="transpose-sub">
                      ({song.transpose > 0 ? `+${song.transpose}` : song.transpose})
                    </span>
                  ) : null}
                </div>
              )}
            </div>

            {/* Keyboard Hardware HUD Cues */}
            <div className="song-card-cues">
              {shouldShow('bank') && song.bank && (
                <span className="cue-item bank">
                  <Sliders size={11} /> {song.bank}
                </span>
              )}
              {shouldShow('rhythm') && song.rhythm && (
                <span className="cue-item rhythm">
                  <Disc size={11} /> {song.rhythm}
                </span>
              )}
              {shouldShow('tempo') && song.tempo > 0 && (
                <span className="cue-item tempo">
                  ⚡ {song.tempo} BPM
                </span>
              )}
              {shouldShow('tone') && song.tone && (
                <span className="cue-item tone">
                  <Sparkles size={11} /> {song.tone}
                </span>
              )}

              {/* Custom Fields on Song Card */}
              {customFieldDefs.map((cf) => {
                const val = song.customFields?.[cf.id];
                if (!val || !cf.visibleInSongCard) return null;
                return (
                  <span key={cf.id} className="cue-item custom">
                    {cf.icon} {val}
                  </span>
                );
              })}
            </div>

            {/* Helper Notes / Intro Melody prompt */}
            {shouldShow('helperNotes') && song.helperNotes && (
              <div className="song-card-helper-notes">
                <Lightbulb size={12} color="#fbbf24" style={{ flexShrink: 0 }} />
                <span>{song.helperNotes}</span>
              </div>
            )}

            {/* Tags */}
            {shouldShow('tags') && song.tags && song.tags.length > 0 && (
              <div className="song-card-tags">
                {song.tags.map((t) => (
                  <span key={t} className="tag-chip">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="song-card-footer" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="card-action-btn play"
                onClick={() => onPlaySongLive(song)}
              >
                <Play size={13} /> Live Stage
              </button>

              <div className="card-right-btns">
                <button
                  type="button"
                  className="card-icon-btn"
                  onClick={() => onDuplicateSong(song)}
                  title="Duplicate Song"
                >
                  <Copy size={15} />
                </button>
                <button
                  type="button"
                  className="card-icon-btn"
                  onClick={() => onEditSong(song)}
                  title="Edit Song"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  className="card-icon-btn danger"
                  onClick={() => onRequestDeleteSong(song)}
                  title="Delete Song"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="empty-items-state" style={{ gridColumn: '1 / -1' }}>
            <h4>No songs found</h4>
            <p>Try searching for a different title or resetting your key/tag filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
