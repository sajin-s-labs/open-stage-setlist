import React from 'react';
import type { AccidentalPreference } from '../types';
import { parseSongContent } from '../utils/chordParser';
import { parseChordParts } from '../utils/chordTheory';

interface SongViewerProps {
  content: string;
  transpose: number;
  preference?: AccidentalPreference;
  fontSize?: number;
  twoColumnLayout?: boolean;
  onChordClick: (chord: string) => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({
  content,
  transpose,
  preference = 'sharps',
  fontSize = 19,
  twoColumnLayout = false,
  onChordClick
}) => {
  const parsedLines = parseSongContent(content, transpose, preference);

  return (
    <div
      className={`song-viewer ${twoColumnLayout ? 'two-column' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {parsedLines.map((line, idx) => {
        if (line.type === 'empty') {
          return <div key={`line-${idx}`} className="viewer-line empty-line" />;
        }

        if (line.type === 'section-header') {
          return (
            <div key={`section-${idx}`} className="viewer-section-header">
              <span>{line.sectionName}</span>
            </div>
          );
        }

        if (line.type === 'comment') {
          return (
            <div key={`comment-${idx}`} className="viewer-comment">
              # {line.rawText}
            </div>
          );
        }

        // Chord-Lyrics line
        return (
          <div key={`line-${idx}`} className="viewer-line chord-lyric-line">
            {line.pairs?.map((pair, pIdx) => {
              const chordParts = pair.chord ? parseChordParts(pair.chord) : null;

              return (
                <span key={`pair-${pIdx}`} className="chord-lyric-pair">
                  {pair.chord ? (
                    <span
                      className="chord-badge"
                      onClick={() => onChordClick(pair.chord!)}
                      title="Tap for Piano & Guitar fingerings"
                    >
                      <span className="chord-root-quality">
                        {chordParts ? `${chordParts.root}${chordParts.quality}` : pair.chord}
                      </span>
                      {chordParts?.bass && (
                        <span className="chord-slash-bass">/{chordParts.bass}</span>
                      )}
                    </span>
                  ) : (
                    <span className="chord-badge-placeholder">&nbsp;</span>
                  )}
                  <span className="lyric-text">{pair.lyric || (pair.chord ? ' ' : '')}</span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
