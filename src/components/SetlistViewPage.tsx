import React from 'react';
import { 
  ArrowLeft, Play, Edit3, Calendar, Clock, 
  Coffee, Sliders, Disc, Sparkles, Lightbulb, ChevronRight, Music 
} from 'lucide-react';
import type { Setlist, Song, AppSettings, BuiltInFieldKey } from '../types';

interface SetlistViewPageProps {
  setlist: Setlist;
  songs: Song[];
  settings: AppSettings;
  onBack: () => void;
  onEditSetlist: (setlist: Setlist) => void;
  onRequestDeleteSetlist?: (setlist: Setlist) => void;
  onOpenSong: (song: Song) => void;
  onLaunchLiveStage: (setlist: Setlist, startIndex: number) => void;
}

export const SetlistViewPage: React.FC<SetlistViewPageProps> = ({
  setlist,
  songs,
  settings,
  onBack,
  onEditSetlist,
  onOpenSong,
  onLaunchLiveStage
}) => {
  const songItems = setlist.items.filter((i) => i.type === 'song');
  const fieldVis = settings.fieldVisibility;
  const customFieldDefs = settings.customFields || [];

  const shouldShow = (key: BuiltInFieldKey) => {
    if (!fieldVis) return true;
    return fieldVis[key]?.visibleInSetlist ?? true;
  };

  const totalEstimatedMinutes = setlist.items.reduce((acc, it) => {
    if (it.type === 'break') {
      return acc + (it.breakDurationMinutes || 5);
    }
    return acc + 4.5;
  }, 0);

  return (
    <div className="page-container">
      {/* Top Navigation Bar with Side-by-Side Action Buttons */}
      <div className="page-top-action-bar setlist-header-bar">
        <button className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> My Setlists
        </button>

        <div className="top-actions-right side-by-side-actions">
          <button 
            className="primary-btn" 
            onClick={() => onLaunchLiveStage(setlist, 0)}
            disabled={songItems.length === 0}
          >
            <Play size={16} fill="currentColor" /> Play Stage
          </button>
          <button className="secondary-btn" onClick={() => onEditSetlist(setlist)} title="Edit Setlist">
            <Edit3 size={16} /> Edit
          </button>
        </div>
      </div>

      {/* Setlist Banner Header */}
      <div className="setlist-banner-card">
        <h1 className="setlist-banner-title">{setlist.name}</h1>
        
        <div className="setlist-banner-meta">
          <div className="meta-item">
            <Calendar size={14} />
            <span>{setlist.eventDate || 'No date specified'}</span>
          </div>
          <div className="meta-item">
            <Clock size={14} />
            <span>Target: <strong>{setlist.targetDurationMinutes || 30} min</strong></span>
          </div>
          <div className="meta-item">
            <span className={`duration-status-pill ${totalEstimatedMinutes > setlist.targetDurationMinutes ? 'overtime' : 'ontime'}`}>
              ⏱️ Est. Total: ~{Math.round(totalEstimatedMinutes)} min
            </span>
          </div>
          <div className="meta-item">
            <Music size={14} />
            <span>{songItems.length} songs</span>
          </div>
        </div>

        {setlist.notes && (
          <div className="setlist-banner-notes">
            💡 <strong>Notes:</strong> {setlist.notes}
          </div>
        )}
      </div>

      {/* Songs & Breaks List */}
      <div className="setlist-songs-container">
        <div className="section-title-bar">
          <h3>Setlist Tracklist ({setlist.items.length} items)</h3>
          <span className="section-hint">Tap song to open chords or click Play</span>
        </div>

        <div className="setlist-songs-list">
          {setlist.items.map((item, index) => {
            if (item.type === 'break') {
              return (
                <div 
                  key={item.id} 
                  className="setlist-track-row break-item"
                  onClick={() => onLaunchLiveStage(setlist, index)}
                  title="Launch Live Stage at this break"
                >
                  <div className="track-order-badge break">{index + 1}</div>
                  <div className="break-track-content">
                    <Coffee size={18} color="#fbbf24" />
                    <span className="break-title-text">{item.breakTitle || 'Intermission / Prayer'}</span>
                    <span className="break-duration-pill">({item.breakDurationMinutes || 5} min)</span>
                  </div>
                  <div className="track-right-actions">
                    <button
                      className="play-track-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLaunchLiveStage(setlist, index);
                      }}
                      title="Launch Live Stage at this break"
                    >
                      <Play size={15} fill="currentColor" />
                    </button>
                  </div>
                </div>
              );
            }

            const song = songs.find((s) => s.id === item.songId);
            if (!song) return null;

            return (
              <div 
                key={item.id} 
                className="setlist-track-row song-item"
                onClick={() => onOpenSong(song)}
              >
                <div className="track-order-badge">{index + 1}</div>

                <div className="track-main-info">
                  <div className="track-title-row">
                    <h4 className="track-title">{song.title}</h4>
                    {shouldShow('artist') && song.artist && (
                      <span className="track-artist">• {song.artist}</span>
                    )}
                  </div>

                  {/* Configurable Badges */}
                  <div className="track-badges-row">
                    {shouldShow('key') && (
                      <span className="badge key-badge">
                        Key {song.currentKey || song.originalKey}
                        {shouldShow('transpose') && song.transpose !== 0 ? ` (${song.transpose > 0 ? `+${song.transpose}` : song.transpose})` : ''}
                      </span>
                    )}

                    {shouldShow('bank') && song.bank && (
                      <span className="badge bank-badge">
                        <Sliders size={11} /> {song.bank}
                      </span>
                    )}

                    {shouldShow('rhythm') && song.rhythm && (
                      <span className="badge rhythm-badge">
                        <Disc size={11} /> {song.rhythm}
                      </span>
                    )}

                    {shouldShow('tempo') && song.tempo > 0 && (
                      <span className="badge tempo-badge">
                        ⏱️ {song.tempo} BPM
                      </span>
                    )}

                    {shouldShow('tone') && song.tone && (
                      <span className="badge" style={{ color: 'var(--accent-color)' }}>
                        <Sparkles size={11} /> {song.tone}
                      </span>
                    )}

                    {/* Dynamic User Custom Fields */}
                    {customFieldDefs.map((cf) => {
                      if (!cf.visibleInSetlist) return null;
                      const val = song.customFields?.[cf.id];
                      if (!val) return null;

                      return (
                        <span key={cf.id} className="badge custom-field-badge">
                          {cf.icon} {val}
                        </span>
                      );
                    })}
                  </div>

                  {/* Helper Melody Notes Cue */}
                  {shouldShow('helperNotes') && song.helperNotes && (
                    <div className="track-melody-cue">
                      <Lightbulb size={13} color="#fbbf24" />
                      <span>{song.helperNotes}</span>
                    </div>
                  )}
                </div>

                {/* Right Quick Actions */}
                <div className="track-right-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="play-track-btn"
                    onClick={() => onLaunchLiveStage(setlist, index)}
                    title="Launch Live Stage from this song"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                  <ChevronRight size={18} className="track-chevron" onClick={() => onOpenSong(song)} />
                </div>
              </div>
            );
          })}

          {setlist.items.length === 0 && (
            <div className="empty-state-box">
              <p>This setlist is currently empty.</p>
              <button className="primary-btn" onClick={() => onEditSetlist(setlist)}>
                <Edit3 size={16} /> Add Songs to Setlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
