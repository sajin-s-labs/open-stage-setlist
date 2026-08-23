import React, { useState } from 'react';
import { ArrowLeft, Play, Edit3, Minus, Plus } from 'lucide-react';
import type { Song, AppSettings } from '../types';
import { KeyboardHUD } from './KeyboardHUD';
import { SongViewer } from './SongViewer';
import { transposeNote } from '../utils/chordTheory';

interface SongViewPageProps {
  song: Song;
  settings: AppSettings;
  onBack: () => void;
  onEditSong: (song: Song) => void;
  onLaunchLiveStage: (song: Song) => void;
  onChordClick: (chord: string) => void;
}

export const SongViewPage: React.FC<SongViewPageProps> = ({
  song,
  settings,
  onBack,
  onEditSong,
  onLaunchLiveStage,
  onChordClick
}) => {
  const [activeTranspose, setActiveTranspose] = useState(song.transpose || 0);
  const [fontSize, setFontSize] = useState(settings.songDisplay?.lyricsFontSize || 19);

  const effectiveKey = song.originalKey
    ? transposeNote(song.originalKey, activeTranspose, settings.songDisplay?.accidentalPreference || 'sharps')
    : song.currentKey || 'C';

  return (
    <div className="page-container">
      {/* Top Action Bar */}
      <div className="page-top-action-bar">
        <button className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="top-actions-right">
          <button 
            className="primary-btn" 
            onClick={() => onLaunchLiveStage(song)}
          >
            <Play size={18} fill="currentColor" /> Play Live Stage
          </button>
          <button 
            className="secondary-btn" 
            onClick={() => onEditSong(song)}
          >
            <Edit3 size={18} /> Edit Song
          </button>
        </div>
      </div>

      {/* Song Header Info Card */}
      <div className="song-detail-header-card">
        <div className="song-header-title-box">
          <h1 className="song-title-main">{song.title}</h1>
          <span className="song-artist-main">{song.artist || 'Unknown Artist'}</span>
        </div>

        {/* Live Key & Transpose Shift Controls */}
        <div className="song-header-controls">
          <div className="key-indicator-box">
            <span className="indicator-label">KEY</span>
            <span className="indicator-value">{effectiveKey}</span>
          </div>

          <div className="transpose-tool-cluster">
            <button 
              type="button"
              className="trans-btn"
              onClick={() => setActiveTranspose((p) => p - 1)}
              title="Transpose Down 1 Semitone"
            >
              <Minus size={14} />
            </button>
            <span className="trans-val">
              {activeTranspose > 0 ? `+${activeTranspose}` : activeTranspose}
            </span>
            <button 
              type="button"
              className="trans-btn"
              onClick={() => setActiveTranspose((p) => p + 1)}
              title="Transpose Up 1 Semitone"
            >
              <Plus size={14} />
            </button>
            {activeTranspose !== 0 && (
              <button 
                type="button" 
                className="trans-reset-btn" 
                onClick={() => setActiveTranspose(0)}
                title="Reset Transpose to 0"
              >
                0
              </button>
            )}
          </div>

          {/* Font Controls */}
          <div className="font-tool-cluster">
            <button 
              type="button"
              className="font-btn" 
              onClick={() => setFontSize((f) => Math.max(10, f - 2))}
              title="Smaller Text"
            >
              A-
            </button>
            <button 
              type="button"
              className="font-btn" 
              onClick={() => setFontSize((f) => Math.min(32, f + 2))}
              title="Larger Text"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Hardware HUD */}
      <div className="song-view-hud-section">
        <KeyboardHUD song={song} activeTranspose={activeTranspose} settings={settings} />
      </div>

      {/* Lead Sheet Card */}
      <div className="song-view-sheet-card">
        <SongViewer
          content={song.content}
          transpose={activeTranspose}
          preference={settings.songDisplay?.accidentalPreference || 'sharps'}
          fontSize={fontSize}
          twoColumnLayout={settings.songDisplay?.twoColumnLayout || false}
          onChordClick={onChordClick}
        />
      </div>
    </div>
  );
};
