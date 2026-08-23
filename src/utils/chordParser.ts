import type { AccidentalPreference, ParsedLine } from '../types';
import { isChord, transposeChord } from './chordTheory';

/**
 * Determines whether raw content is in ChordPro format ([C]lyrics) or chords-over-lyrics.
 */
export function detectFormat(content: string): 'chordpro' | 'chords-over-lyrics' {
  const lines = content.split('\n');
  let bracketCount = 0;
  let chordsOverLyricsScore = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for ChordPro bracket chords like [C] or [Am/G]
    const bracketMatches = line.match(/\[([A-G][#b]?[^\]]*)\]/g);
    if (bracketMatches && bracketMatches.length > 0) {
      bracketCount += bracketMatches.length;
    }

    // Check for chord-only line followed by text line
    if (isChordLine(line)) {
      chordsOverLyricsScore += 2;
    }
  }

  if (bracketCount >= 2) {
    return 'chordpro';
  }
  if (chordsOverLyricsScore >= 2) {
    return 'chords-over-lyrics';
  }
  return bracketCount > 0 ? 'chordpro' : 'chords-over-lyrics';
}

/**
 * Checks if a line consists predominantly of chord symbols and whitespace.
 */
export function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('{') || trimmed.startsWith('#')) return false;

  const tokens = trimmed.split(/\s+/);
  if (tokens.length === 0) return false;

  let chordCount = 0;
  for (const tok of tokens) {
    if (isChord(tok)) {
      chordCount++;
    }
  }

  return chordCount > 0 && chordCount / tokens.length >= 0.5;
}

/**
 * Converts a chords-over-lyrics text block into standard ChordPro notation.
 */
export function convertChordsOverLyricsToChordPro(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';

    if (isChordLine(currentLine) && nextLine && !isChordLine(nextLine) && !nextLine.trim().startsWith('{')) {
      let merged = '';
      const chordLinePositions: { chord: string; index: number }[] = [];
      
      const regex = /\S+/g;
      let match;
      while ((match = regex.exec(currentLine)) !== null) {
        if (isChord(match[0])) {
          chordLinePositions.push({ chord: match[0], index: match.index });
        }
      }

      let lyricIdx = 0;
      for (const item of chordLinePositions) {
        if (item.index > lyricIdx) {
          merged += nextLine.slice(lyricIdx, item.index);
          lyricIdx = item.index;
        }
        merged += `[${item.chord}]`;
      }
      if (lyricIdx < nextLine.length) {
        merged += nextLine.slice(lyricIdx);
      }

      result.push(merged);
      i++; // Skip the next line as it was merged
    } else if (isChordLine(currentLine)) {
      // Standalone chords (e.g. Intro / Solo)
      const formatted = currentLine
        .trim()
        .split(/\s+/)
        .map((ch) => (isChord(ch) ? `[${ch}]` : ch))
        .join(' ');
      result.push(formatted);
    } else {
      result.push(currentLine);
    }
  }

  return result.join('\n');
}

/**
 * Converts ChordPro bracket format into visually aligned Chords-over-Lyrics format.
 */
export function convertChordProToChordsOverLyrics(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      continue;
    }

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      result.push(trimmed);
      continue;
    }

    let chordLine = '';
    let lyricLine = '';
    let cursor = 0;
    const regex = /\[([A-G][#b]?[^\]]*)\]/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      const chord = match[1];
      const textBefore = line.slice(lastIndex, match.index);
      
      lyricLine += textBefore;
      cursor += textBefore.length;

      while (chordLine.length < cursor) {
        chordLine += ' ';
      }
      chordLine += chord;

      lastIndex = regex.lastIndex;
    }

    const remainingText = line.slice(lastIndex);
    lyricLine += remainingText;

    if (chordLine.trim().length > 0) {
      result.push(chordLine);
    }
    if (lyricLine.trim().length > 0) {
      result.push(lyricLine);
    }
  }

  return result.join('\n');
}

/**
 * Parses song content into structured rendering blocks with transposition support.
 */
export function parseSongContent(
  rawContent: string,
  semitones: number = 0,
  preference: AccidentalPreference = 'sharps'
): ParsedLine[] {
  if (!rawContent) return [];

  const format = detectFormat(rawContent);
  const normalizedContent = format === 'chords-over-lyrics'
    ? convertChordsOverLyricsToChordPro(rawContent)
    : rawContent;

  const lines = normalizedContent.split('\n');
  const parsedLines: ParsedLine[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      parsedLines.push({ type: 'empty' });
      continue;
    }

    // Directives
    const directiveMatch = trimmed.match(/^{(?:c|comment|section|soc|eoc|sov|eov):?\s*(.*)}$/i);
    const bracketSectionMatch = trimmed.match(/^\[(Verse \d+|Chorus|Bridge|Intro|Outro|Pre-Chorus|Tag|Solo|Interlude|Ending)\]$/i);

    if (directiveMatch || bracketSectionMatch) {
      const sectionName = directiveMatch ? directiveMatch[1].replace(/}$/, '') : bracketSectionMatch![1];
      parsedLines.push({
        type: 'section-header',
        sectionName: sectionName || 'Section'
      });
      continue;
    }

    if (trimmed.startsWith('#')) {
      parsedLines.push({
        type: 'comment',
        rawText: trimmed.slice(1).trim()
      });
      continue;
    }

    const pairs: { chord?: string; lyric: string }[] = [];
    const regex = /\[([A-G][#b]?[^\]]*)\]([^[]*)/g;
    let match;
    let lastIndex = 0;

    const firstBracketIdx = line.indexOf('[');
    if (firstBracketIdx > 0) {
      pairs.push({
        lyric: line.slice(0, firstBracketIdx)
      });
      lastIndex = firstBracketIdx;
    } else if (firstBracketIdx === -1) {
      parsedLines.push({
        type: 'chord-lyrics',
        pairs: [{ lyric: line }]
      });
      continue;
    }

    while ((match = regex.exec(line)) !== null) {
      const rawChord = match[1];
      const lyric = match[2] || '';
      const transposedChord = isChord(rawChord)
        ? transposeChord(rawChord, semitones, preference)
        : rawChord;

      pairs.push({
        chord: transposedChord,
        lyric: lyric
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length && pairs.length === 0) {
      pairs.push({ lyric: line.slice(lastIndex) });
    }

    parsedLines.push({
      type: 'chord-lyrics',
      pairs
    });
  }

  return parsedLines;
}
