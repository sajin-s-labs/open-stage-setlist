import React from 'react';
import { getChordDiagramData } from '../utils/chordTheory';

interface GuitarVisualizerProps {
  chord: string;
  size?: 'small' | 'medium' | 'large';
}

export const GuitarVisualizer: React.FC<GuitarVisualizerProps> = ({
  chord,
  size = 'medium'
}) => {
  const data = getChordDiagramData(chord);
  const fingering = data.guitarFingering;
  const fallback = (data as any).fallbackChordName;

  const scale = size === 'small' ? 0.75 : size === 'large' ? 1.2 : 1.0;
  const width = 120 * scale;
  const height = 135 * scale;
  const fretCount = 5;
  const stringCount = 6;
  const marginX = 22 * scale;
  const marginTop = 28 * scale;
  const stringSpacing = (width - 2 * marginX) / (stringCount - 1);
  const fretSpacing = (height - marginTop - 15 * scale) / fretCount;

  if (!fingering) {
    return (
      <div style={{ textAlign: 'center', padding: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
        🎸 {chord} (Fingering not available)
      </div>
    );
  }

  const frets = fingering.frets; // [E6, A5, D4, G3, B2, e1]
  const baseFret = fingering.baseFret || 1;

  return (
    <div className="guitar-visualizer-container" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '4px', fontSize: size === 'small' ? '12px' : '14px', fontWeight: 700, textAlign: 'center' }}>
        🎸 <span style={{ color: 'var(--accent-color, #38bdf8)' }}>{chord}</span>
        {fallback && (
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#fbbf24', fontWeight: 500 }}>
            (Showing base chord: {fallback})
          </span>
        )}
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ background: '#0a0a0a', borderRadius: '8px', border: '1px solid #222', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
      >
        {/* Nut or Base Fret Number */}
        {baseFret === 1 ? (
          <line
            x1={marginX}
            y1={marginTop}
            x2={width - marginX}
            y2={marginTop}
            stroke="#94a3b8"
            strokeWidth={4 * scale}
          />
        ) : (
          <text
            x={marginX - 12 * scale}
            y={marginTop + fretSpacing * 0.7}
            fontSize={10 * scale}
            fill="#fbbf24"
            fontWeight="bold"
            textAnchor="middle"
          >
            {baseFret}fr
          </text>
        )}

        {/* Frets (Horizontal lines) */}
        {Array.from({ length: fretCount + 1 }).map((_, fIndex) => (
          <line
            key={`fret-${fIndex}`}
            x1={marginX}
            y1={marginTop + fIndex * fretSpacing}
            x2={width - marginX}
            y2={marginTop + fIndex * fretSpacing}
            stroke="#334155"
            strokeWidth={1.5}
          />
        ))}

        {/* Strings (Vertical lines) */}
        {Array.from({ length: stringCount }).map((_, sIndex) => (
          <line
            key={`string-${sIndex}`}
            x1={marginX + sIndex * stringSpacing}
            y1={marginTop}
            x2={marginX + sIndex * stringSpacing}
            y2={marginTop + fretCount * fretSpacing}
            stroke="#64748b"
            strokeWidth={1 + (5 - sIndex) * 0.3 * scale}
          />
        ))}

        {/* String Indicators (X for mute, O for open) & Finger Dots */}
        {frets.map((fretVal: number, sIndex: number) => {
          const stringX = marginX + sIndex * stringSpacing;

          if (fretVal === -1) {
            // Muted string (X)
            return (
              <text
                key={`mute-${sIndex}`}
                x={stringX}
                y={marginTop - 8 * scale}
                fontSize={10 * scale}
                fill="#ef4444"
                fontWeight="bold"
                textAnchor="middle"
              >
                ×
              </text>
            );
          } else if (fretVal === 0) {
            // Open string (O)
            return (
              <circle
                key={`open-${sIndex}`}
                cx={stringX}
                cy={marginTop - 9 * scale}
                r={3.5 * scale}
                stroke="#22c55e"
                strokeWidth={1.5}
                fill="none"
              />
            );
          } else {
            // Fret dot
            const relativeFret = baseFret === 1 ? fretVal : fretVal - baseFret + 1;
            const dotY = marginTop + (relativeFret - 0.5) * fretSpacing;

            return (
              <g key={`dot-${sIndex}`}>
                <circle
                  cx={stringX}
                  cy={dotY}
                  r={5.5 * scale}
                  fill="var(--accent-color, #38bdf8)"
                  stroke="#fff"
                  strokeWidth={1}
                />
              </g>
            );
          }
        })}
      </svg>
    </div>
  );
};
