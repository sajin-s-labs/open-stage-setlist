import React from 'react';
import { getChordDiagramData, NOTE_TO_SEMITONE } from '../utils/chordTheory';

interface PianoVisualizerProps {
  chord: string;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

export const PianoVisualizer: React.FC<PianoVisualizerProps> = ({
  chord,
  size = 'medium',
  showLabels = true
}) => {
  const data = getChordDiagramData(chord);
  
  // Total 24 keys: 14 white keys, 10 black keys over 2 octaves (C3 to B4)
  // Semitones:
  // White keys: C(0), D(2), E(4), F(5), G(7), A(9), B(11), C(12), D(14), E(16), F(17), G(19), A(21), B(23)
  const whiteKeyOffsets = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
  const whiteKeyLabels = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // Black keys semitones & relative position offsets along white keys
  const blackKeys = [
    { semitone: 1, label: 'C#', xRatio: 0.65 },
    { semitone: 3, label: 'D#', xRatio: 1.7 },
    { semitone: 6, label: 'F#', xRatio: 3.65 },
    { semitone: 8, label: 'G#', xRatio: 4.65 },
    { semitone: 10, label: 'A#', xRatio: 5.7 },
    { semitone: 13, label: 'C#', xRatio: 7.65 },
    { semitone: 15, label: 'D#', xRatio: 8.7 },
    { semitone: 18, label: 'F#', xRatio: 10.65 },
    { semitone: 20, label: 'G#', xRatio: 11.65 },
    { semitone: 22, label: 'A#', xRatio: 12.7 }
  ];

  const scaleMultiplier = size === 'small' ? 0.7 : size === 'large' ? 1.3 : 1.0;
  const whiteKeyWidth = 22 * scaleMultiplier;
  const whiteKeyHeight = 78 * scaleMultiplier;
  const blackKeyWidth = 14 * scaleMultiplier;
  const blackKeyHeight = 50 * scaleMultiplier;
  const totalWidth = 14 * whiteKeyWidth;

  const bassSemitone = data.bassNote ? NOTE_TO_SEMITONE[data.bassNote] : undefined;

  return (
    <div className="piano-visualizer-container" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '4px', fontSize: size === 'small' ? '12px' : '14px', fontWeight: 600 }}>
        🎹 <span style={{ color: 'var(--accent-color, #38bdf8)' }}>{chord}</span>
        {data.notes.length > 0 && (
          <span style={{ marginLeft: '8px', opacity: 0.75, fontSize: '0.85em', fontWeight: 400 }}>
            ({data.notes.join(' - ')})
          </span>
        )}
      </div>

      <svg
        width={totalWidth}
        height={whiteKeyHeight}
        viewBox={`0 0 ${totalWidth} ${whiteKeyHeight}`}
        style={{ borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.35)', background: '#111' }}
      >
        {/* Render White Keys */}
        {whiteKeyOffsets.map((semitone, index) => {
          const isActive = data.pianoKeys.includes(semitone % 12);
          const isBass = bassSemitone !== undefined && semitone % 12 === bassSemitone;
          const x = index * whiteKeyWidth;

          return (
            <g key={`white-${semitone}-${index}`}>
              <rect
                x={x + 0.5}
                y={0}
                width={whiteKeyWidth - 1}
                height={whiteKeyHeight}
                fill={isBass ? '#ef4444' : isActive ? '#38bdf8' : '#f8fafc'}
                stroke="#334155"
                strokeWidth={1}
                rx={2}
              />
              {showLabels && (
                <text
                  x={x + whiteKeyWidth / 2}
                  y={whiteKeyHeight - 6 * scaleMultiplier}
                  textAnchor="middle"
                  fontSize={9 * scaleMultiplier}
                  fontWeight={isActive ? 'bold' : 'normal'}
                  fill={isBass || isActive ? '#0f172a' : '#64748b'}
                >
                  {whiteKeyLabels[index]}
                </text>
              )}
            </g>
          );
        })}

        {/* Render Black Keys */}
        {blackKeys.map((bk) => {
          const isActive = data.pianoKeys.includes(bk.semitone % 12);
          const isBass = bassSemitone !== undefined && bk.semitone % 12 === bassSemitone;
          const x = bk.xRatio * whiteKeyWidth;

          return (
            <g key={`black-${bk.semitone}`}>
              <rect
                x={x}
                y={0}
                width={blackKeyWidth}
                height={blackKeyHeight}
                fill={isBass ? '#f87171' : isActive ? '#0284c7' : '#1e293b'}
                stroke="#0f172a"
                strokeWidth={1}
                rx={2}
              />
              {isActive && (
                <circle
                  cx={x + blackKeyWidth / 2}
                  cy={blackKeyHeight - 8 * scaleMultiplier}
                  r={3.5 * scaleMultiplier}
                  fill="#ffffff"
                />
              )}
            </g>
          );
        })}
      </svg>
      {data.bassNote && (
        <div style={{ marginTop: '4px', fontSize: '11px', color: '#f87171' }}>
          * Left-hand Bass note: <strong>/{data.bassNote}</strong> (Red)
        </div>
      )}
    </div>
  );
};
