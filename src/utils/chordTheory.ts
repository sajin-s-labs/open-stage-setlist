import type { AccidentalPreference, ChordNoteMap } from '../types';

export const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export const NOTE_TO_SEMITONE: Record<string, number> = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

// Common chord formulas (intervals in semitones relative to root)
export const CHORD_INTERVALS: Record<string, number[]> = {
  '': [0, 4, 7], // Major
  'm': [0, 3, 7], // Minor
  'min': [0, 3, 7],
  '7': [0, 4, 7, 10], // Dominant 7
  'm7': [0, 3, 7, 10], // Minor 7
  'min7': [0, 3, 7, 10],
  'maj7': [0, 4, 7, 11], // Major 7
  'M7': [0, 4, 7, 11],
  'dim': [0, 3, 6], // Diminished
  'dim7': [0, 3, 6, 9],
  'aug': [0, 4, 8], // Augmented
  'sus2': [0, 2, 7], // Suspended 2
  'sus4': [0, 5, 7], // Suspended 4
  'sus': [0, 5, 7],
  '7sus4': [0, 5, 7, 10],
  'add9': [0, 4, 7, 14], // Add 9
  'madd9': [0, 3, 7, 14],
  '6': [0, 4, 7, 9], // 6
  'm6': [0, 3, 7, 9],
  '9': [0, 4, 7, 10, 14],
  'm9': [0, 3, 7, 10, 14],
  'maj9': [0, 4, 7, 11, 14],
  '5': [0, 7] // Power chord
};

// Guitar chord fingering database for common chords
// frets: [E6, A5, D4, G3, B2, e1] where -1 = muted (X), 0 = open
export const GUITAR_CHORD_DB: Record<string, { frets: number[]; baseFret?: number; fingers?: number[] }> = {
  'C': { frets: [-1, 3, 2, 0, 1, 0] },
  'Cm': { frets: [-1, 3, 5, 5, 4, 3], baseFret: 1 },
  'C7': { frets: [-1, 3, 2, 3, 1, 0] },
  'Cmaj7': { frets: [-1, 3, 2, 0, 0, 0] },
  'Cadd9': { frets: [-1, 3, 2, 0, 3, 0] },
  'Csus4': { frets: [-1, 3, 3, 0, 1, 1] },
  'D': { frets: [-1, -1, 0, 2, 3, 2] },
  'Dm': { frets: [-1, -1, 0, 2, 3, 1] },
  'D7': { frets: [-1, -1, 0, 2, 1, 2] },
  'Dmaj7': { frets: [-1, -1, 0, 2, 2, 2] },
  'Dsus2': { frets: [-1, -1, 0, 2, 3, 0] },
  'Dsus4': { frets: [-1, -1, 0, 2, 3, 3] },
  'E': { frets: [0, 2, 2, 1, 0, 0] },
  'Em': { frets: [0, 2, 2, 0, 0, 0] },
  'E7': { frets: [0, 2, 0, 1, 0, 0] },
  'Em7': { frets: [0, 2, 2, 0, 3, 0] },
  'Emaj7': { frets: [0, 2, 1, 1, 0, 0] },
  'Esus4': { frets: [0, 2, 2, 2, 0, 0] },
  'F': { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  'Fm': { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'F7': { frets: [1, 3, 1, 2, 1, 1], baseFret: 1 },
  'Fmaj7': { frets: [-1, -1, 3, 2, 1, 0] },
  'F#': { frets: [2, 4, 4, 3, 2, 2], baseFret: 2 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], baseFret: 2 },
  'F#7': { frets: [2, 4, 2, 3, 2, 2], baseFret: 2 },
  'F#m7': { frets: [2, 4, 2, 2, 2, 2], baseFret: 2 },
  'G': { frets: [3, 2, 0, 0, 0, 3] },
  'Gm': { frets: [3, 5, 5, 3, 3, 3], baseFret: 3 },
  'G7': { frets: [3, 2, 0, 0, 0, 1] },
  'Gmaj7': { frets: [3, 2, 0, 0, 0, 2] },
  'Gsus4': { frets: [3, 3, 0, 0, 1, 3] },
  'G/B': { frets: [-1, 2, 0, 0, 0, 3] },
  'A': { frets: [-1, 0, 2, 2, 2, 0] },
  'Am': { frets: [-1, 0, 2, 2, 1, 0] },
  'A7': { frets: [-1, 0, 2, 0, 2, 0] },
  'Am7': { frets: [-1, 0, 2, 0, 1, 0] },
  'Amaj7': { frets: [-1, 0, 2, 1, 2, 0] },
  'Asus2': { frets: [-1, 0, 2, 2, 0, 0] },
  'Asus4': { frets: [-1, 0, 2, 2, 3, 0] },
  'A/C#': { frets: [-1, 4, 2, 2, 2, 0], baseFret: 1 },
  'B': { frets: [-1, 2, 4, 4, 4, 2], baseFret: 2 },
  'Bm': { frets: [-1, 2, 4, 4, 3, 2], baseFret: 2 },
  'B7': { frets: [-1, 2, 1, 2, 0, 2] },
  'Bm7': { frets: [-1, 2, 4, 2, 3, 2], baseFret: 2 },
  'Bmaj7': { frets: [-1, 2, 4, 3, 4, 2], baseFret: 2 },
  'Bb': { frets: [-1, 1, 3, 3, 3, 1], baseFret: 1 },
  'Bbm': { frets: [-1, 1, 3, 3, 2, 1], baseFret: 1 },
  'Bb7': { frets: [-1, 1, 3, 1, 3, 1], baseFret: 1 },
  'Eb': { frets: [-1, 6, 8, 8, 8, 6], baseFret: 6 },
  'Ebm': { frets: [-1, 6, 8, 8, 7, 6], baseFret: 6 },
  'Ab': { frets: [4, 6, 6, 5, 4, 4], baseFret: 4 },
  'Abm': { frets: [4, 6, 6, 4, 4, 4], baseFret: 4 }
};

// Match chord components: Root, Quality, Bass
// e.g. "F#m7/A" -> root: "F#", quality: "m7", bass: "A"
export const CHORD_REGEX = /^([A-G][#b]?)(maj7|maj9|maj|min7|min9|min|m7|m9|m6|m|sus2|sus4|sus|7sus4|dim7|dim|aug|add9|madd9|6|7|9|11|13|5)?(?:\/([A-G][#b]?))?$/;

export function parseChordParts(chordStr: string): { root: string; quality: string; bass?: string } | null {
  const clean = chordStr.trim();
  const match = clean.match(CHORD_REGEX);
  if (!match) return null;
  return {
    root: match[1],
    quality: match[2] || '',
    bass: match[3]
  };
}

export function isChord(token: string): boolean {
  if (!token) return false;
  // Remove common wrapper brackets if any
  const clean = token.replace(/^[\[(]|[\])]$/g, '').trim();
  return CHORD_REGEX.test(clean);
}

export function transposeNote(note: string, semitones: number, preference: AccidentalPreference = 'sharps'): string {
  if (semitones === 0) return note;
  const val = NOTE_TO_SEMITONE[note];
  if (val === undefined) return note;

  const targetScale = preference === 'flats' ? FLAT_NOTES : SHARP_NOTES;
  const newIndex = (val + semitones + 120) % 12;
  return targetScale[newIndex];
}

export function transposeChord(chordStr: string, semitones: number, preference: AccidentalPreference = 'sharps'): string {
  if (semitones === 0) return chordStr;
  const parts = parseChordParts(chordStr);
  if (!parts) return chordStr;

  const newRoot = transposeNote(parts.root, semitones, preference);
  const newBass = parts.bass ? `/${transposeNote(parts.bass, semitones, preference)}` : '';
  return `${newRoot}${parts.quality}${newBass}`;
}

export function getChordDiagramData(chordStr: string): ChordNoteMap {
  const parts = parseChordParts(chordStr);
  if (!parts) {
    return {
      name: chordStr,
      notes: [],
      pianoKeys: []
    };
  }

  const rootVal = NOTE_TO_SEMITONE[parts.root] ?? 0;
  const intervals = CHORD_INTERVALS[parts.quality] || CHORD_INTERVALS[''];
  
  // Calculate piano active keys (within 0 to 23 semitones for 2-octave piano)
  const pianoKeys: number[] = [];
  const noteNames: string[] = [];

  intervals.forEach((interval) => {
    const semitone = (rootVal + interval) % 12;
    // Map to octave 1 (0-11) or octave 2 (12-23)
    const keyIndex = interval < 12 ? (rootVal + interval) % 12 : 12 + ((rootVal + interval) % 12);
    if (!pianoKeys.includes(keyIndex)) {
      pianoKeys.push(keyIndex);
    }
    const noteName = SHARP_NOTES[semitone];
    if (!noteNames.includes(noteName)) {
      noteNames.push(noteName);
    }
  });

  // Handle slash bass note
  let bassNote = parts.bass;
  if (bassNote) {
    const bassVal = NOTE_TO_SEMITONE[bassNote];
    if (bassVal !== undefined) {
      // Put bass note in lower octave
      if (!pianoKeys.includes(bassVal)) {
        pianoKeys.unshift(bassVal);
      }
    }
  }

  // Look up guitar chord with fallback chain
  let guitarFingering = GUITAR_CHORD_DB[chordStr] || GUITAR_CHORD_DB[`${parts.root}${parts.quality}`];
  let fallbackChordName: string | undefined = undefined;

  if (!guitarFingering) {
    // 1. Try aliases (e.g. A2 -> Asus2, D2 -> Dsus2)
    if (parts.quality === '2') {
      guitarFingering = GUITAR_CHORD_DB[`${parts.root}sus2`];
      if (guitarFingering) fallbackChordName = `${parts.root}sus2`;
    }
    // 2. Try base minor or major
    if (!guitarFingering && (parts.quality.includes('m') || parts.quality.includes('min'))) {
      guitarFingering = GUITAR_CHORD_DB[`${parts.root}m`];
      if (guitarFingering) fallbackChordName = `${parts.root}m`;
    }
    // 3. Try base major
    if (!guitarFingering) {
      guitarFingering = GUITAR_CHORD_DB[parts.root];
      if (guitarFingering) fallbackChordName = parts.root;
    }
  }

  return {
    name: chordStr,
    notes: noteNames,
    bassNote,
    pianoKeys,
    guitarFingering,
    fallbackChordName
  };
}

