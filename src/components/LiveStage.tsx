import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Play, Pause, 
  Minus, Plus, Sliders, Maximize, Minimize, Coffee, Music, ArrowRight 
} from 'lucide-react';
import type { Song, Setlist, AppSettings } from '../types';
import { KeyboardHUD } from './KeyboardHUD';
import { SongViewer } from './SongViewer';
import { transposeNote } from '../utils/chordTheory';

interface LiveStageProps {
  song?: Song | null;
  setlist?: Setlist | null;
  currentSetlistIndex?: number;
  onExitStage: () => void;
  onSelectSongIndex?: (index: number) => void;
  onChordClick: (chord: string) => void;
  settings: AppSettings;
}

export const LiveStage: React.FC<LiveStageProps> = ({
  song,
  setlist,
  currentSetlistIndex = 0,
  onExitStage,
  onSelectSongIndex,
  onChordClick,
  settings
}) => {
  const currentItem = setlist ? setlist.items[currentSetlistIndex] : null;
  const isBreak = currentItem?.type === 'break';

  const [activeTranspose, setActiveTranspose] = useState(song?.transpose || 0);
  const [fontSize, setFontSize] = useState(settings.songDisplay?.lyricsFontSize || 20);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(settings.stageSettings?.defaultScrollSpeed || 4);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBeat, setMetronomeBeat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHUD, setShowHUD] = useState(settings.stageSettings?.showHUD ?? true);

  const stageScrollRef = useRef<HTMLDivElement>(null);
  const autoScrollTimerRef = useRef<number | null>(null);

  // Sync transpose when song changes
  useEffect(() => {
    if (song) {
      setActiveTranspose(song.transpose || 0);
      if (stageScrollRef.current) {
        stageScrollRef.current.scrollTop = 0;
      }
    }
  }, [song?.id]);

  // Auto-scroll loop
  useEffect(() => {
    if (isAutoScrolling && !isBreak) {
      const interval = setInterval(() => {
        if (stageScrollRef.current) {
          stageScrollRef.current.scrollTop += scrollSpeed * 0.5;
        }
      }, 50);
      autoScrollTimerRef.current = interval as unknown as number;
    } else {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    }

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed, isBreak]);

  // Visual metronome pulse
  useEffect(() => {
    if (!isMetronomeActive || !song?.tempo || isBreak) return;

    const intervalMs = (60 / song.tempo) * 1000;
    const timer = setInterval(() => {
      setMetronomeBeat(true);
      setTimeout(() => setMetronomeBeat(false), 120);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isMetronomeActive, song?.tempo, isBreak]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextItem();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevItem();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (!isBreak) {
          setIsAutoScrolling((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSetlistIndex, setlist, isBreak]);

  const handleNextItem = () => {
    if (setlist && onSelectSongIndex && currentSetlistIndex < setlist.items.length - 1) {
      onSelectSongIndex(currentSetlistIndex + 1);
    }
  };

  const handlePrevItem = () => {
    if (setlist && onSelectSongIndex && currentSetlistIndex > 0) {
      onSelectSongIndex(currentSetlistIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const effectiveKey = song?.originalKey
    ? transposeNote(song.originalKey, activeTranspose, settings.songDisplay?.accidentalPreference || 'sharps')
    : song?.currentKey || 'C';

  return (
    <div className="live-stage-root">
      {/* Distraction-Free Stage Top Bar */}
      <header className="stage-topbar">
        <div className="stage-left-nav">
          <button className="stage-icon-btn" onClick={onExitStage} title="Exit Live Stage">
            <ArrowLeft size={18} />
          </button>

          <div className="stage-song-info">
            {isBreak ? (
              <>
                <h1 className="stage-song-title" style={{ color: '#fbbf24' }}>
                  ☕ {currentItem?.breakTitle || 'Break / Intermission'}
                </h1>
                <span className="stage-song-artist">
                  Duration: {currentItem?.breakDurationMinutes || 5} minutes
                </span>
              </>
            ) : song ? (
              <>
                <h1 className="stage-song-title">{song.title}</h1>
                <span className="stage-song-artist">
                  {song.artist || 'Unknown'} • Key: <strong>{effectiveKey}</strong>
                  {activeTranspose !== 0 ? ` (${activeTranspose > 0 ? `+${activeTranspose}` : activeTranspose})` : ''}
                </span>
              </>
            ) : null}
          </div>
        </div>

        {/* Setlist Navigation Tracker */}
        {setlist && (
          <div className="stage-setlist-tracker">
            <span className="setlist-badge">
              {currentSetlistIndex + 1}/{setlist.items.length}
            </span>
          </div>
        )}

        <div className="stage-right-actions">
          {/* Visual Metronome Pulse Button (only on song) */}
          {!isBreak && song && settings.stageSettings?.showMetronome && song.tempo > 0 && (
            <button
              className={`stage-tool-btn ${isMetronomeActive ? 'active' : ''}`}
              onClick={() => setIsMetronomeActive(!isMetronomeActive)}
              title="Toggle Silent Metronome"
            >
              <div className={`metronome-dot ${metronomeBeat ? 'beat' : ''}`} />
              <span className="hide-mobile">{song.tempo} BPM</span>
            </button>
          )}

          {/* Toggle HUD (only on song) */}
          {!isBreak && song && (
            <button
              className={`stage-tool-btn ${showHUD ? 'active' : ''}`}
              onClick={() => setShowHUD(!showHUD)}
              title="Toggle Keyboard Bank & Cues HUD"
            >
              <Sliders size={16} />
              <span className="hide-mobile">HUD</span>
            </button>
          )}

          {/* Fullscreen */}
          <button className="stage-icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="stage-scroll-view" ref={stageScrollRef}>
        {isBreak ? (
          /* Dedicated Stage Break / Intermission Screen */
          <div className="stage-break-screen">
            <div className="stage-break-card">
              <div className="break-icon-pill">
                <Coffee size={40} color="#fbbf24" />
              </div>
              <h2 className="break-screen-title">{currentItem?.breakTitle || 'Intermission / Prayer'}</h2>
              <div className="break-timer-badge">
                ⏱️ {currentItem?.breakDurationMinutes || 5} Minutes
              </div>

              {setlist && currentSetlistIndex < setlist.items.length - 1 && (
                <div className="break-up-next-box" onClick={handleNextItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Music size={18} color="var(--accent-color)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Up Next in Setlist:</span>
                  </div>
                  <button type="button" className="primary-btn small" onClick={handleNextItem}>
                    Next Item <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : song ? (
          <>
            {/* Prominent Keyboardist HUD */}
            {showHUD && (
              <div className="stage-hud-wrapper">
                <KeyboardHUD song={song} activeTranspose={activeTranspose} settings={settings} />
              </div>
            )}

            {/* The Lead Sheet */}
            <div className="stage-lead-sheet">
              <SongViewer
                content={song.content}
                transpose={activeTranspose}
                preference={settings.songDisplay?.accidentalPreference || 'sharps'}
                fontSize={fontSize}
                twoColumnLayout={settings.songDisplay?.twoColumnLayout || false}
                onChordClick={onChordClick}
              />
            </div>
          </>
        ) : (
          <div className="stage-empty-state">
            <p>No song selected.</p>
            <button className="primary-btn" onClick={onExitStage}>
              <ArrowLeft size={18} /> Exit Stage
            </button>
          </div>
        )}
      </main>

      {/* Floating Bottom Control Bar */}
      <footer className="stage-footer-bar">
        {/* Setlist Prev / Next Navigation */}
        {setlist && (
          <div className="stage-nav-controls">
            <button
              className="stage-nav-btn"
              onClick={handlePrevItem}
              disabled={currentSetlistIndex === 0}
              title="Previous Item"
            >
              <ChevronLeft size={18} /> <span className="hide-mobile">Prev</span>
            </button>

            <button
              className="stage-nav-btn primary"
              onClick={handleNextItem}
              disabled={currentSetlistIndex >= setlist.items.length - 1}
              title="Next Item"
            >
              <span className="hide-mobile">Next</span> <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Live Transpose Controls (only if song) */}
        {!isBreak && song && settings.stageSettings?.showTransposeButtons && (
          <div className="stage-transpose-cluster">
            <span className="transpose-label">Trans:</span>
            <button
              className="transpose-btn"
              onClick={() => setActiveTranspose((prev) => prev - 1)}
              title="Transpose Down 1 Semitone"
            >
              <Minus size={13} />
            </button>
            <span className="transpose-value">
              {activeTranspose > 0 ? `+${activeTranspose}` : activeTranspose}
            </span>
            <button
              className="transpose-btn"
              onClick={() => setActiveTranspose((prev) => prev + 1)}
              title="Transpose Up 1 Semitone"
            >
              <Plus size={13} />
            </button>
            {activeTranspose !== 0 && (
              <button
                className="transpose-reset-btn"
                onClick={() => setActiveTranspose(0)}
                title="Reset Transpose to 0"
              >
                0
              </button>
            )}
          </div>
        )}

        {/* Auto Scroll Controls (only if song) */}
        {!isBreak && song && settings.stageSettings?.showAutoScroll && (
          <div className="stage-autoscroll-cluster">
            <button
              className={`autoscroll-play-btn ${isAutoScrolling ? 'playing' : ''}`}
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              title="Toggle Auto Scroll (Spacebar)"
            >
              {isAutoScrolling ? <Pause size={14} /> : <Play size={14} />}
              <span>{isAutoScrolling ? 'Stop' : 'Scroll'}</span>
            </button>

            {isAutoScrolling && (
              <input
                type="range"
                min={1}
                max={10}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="speed-slider"
                title={`Speed: ${scrollSpeed}`}
              />
            )}
          </div>
        )}

        {/* Font Sizing (only if song) */}
        {!isBreak && song && (
          <div className="stage-font-cluster">
            <button
              className="font-btn"
              onClick={() => setFontSize((f: number) => Math.max(10, f - 2))}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              className="font-btn"
              onClick={() => setFontSize((f: number) => Math.min(36, f + 2))}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};
