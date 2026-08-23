export type ChordFormat = 'chordpro' | 'chords-over-lyrics' | 'auto';
export type DiagramPreference = 'piano' | 'guitar' | 'both' | 'none';
export type AccidentalPreference = 'sharps' | 'flats';
export type ThemeMode = 'oled-dark' | 'material-dark' | 'deep-navy' | 'studio-light' | 'emerald' | 'purple' | 'custom';

export interface ChordLyricPair {
  chord?: string;
  lyric: string;
}

export interface ParsedLine {
  type: 'section-header' | 'comment' | 'empty' | 'chord-lyrics';
  sectionName?: string;
  comment?: string;
  rawText?: string;
  pairs?: ChordLyricPair[];
}

export interface ChordNoteMap {
  name: string;
  notes: string[];
  bassNote?: string;
  pianoKeys: number[];
  guitarFingering?: { frets: number[]; baseFret?: number; fingers?: number[] };
  fallbackChordName?: string;
}

export interface CustomThemeDefinition {
  id: string;
  name: string;
  bgColor: string;
  surfaceColor: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  icon: string;
  visibleInSetlist: boolean;
  visibleInSongCard: boolean;
  visibleInStageHUD: boolean;
}

export type BuiltInFieldKey =
  | 'bank'
  | 'rhythm'
  | 'tempo'
  | 'key'
  | 'transpose'
  | 'tone'
  | 'timeSignature'
  | 'helperNotes'
  | 'artist'
  | 'tags'
  | 'notes';

export interface FieldLocationVisibility {
  visibleInSetlist: boolean;
  visibleInSongCard: boolean;
  visibleInStageHUD: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  originalKey: string;
  currentKey: string;
  transpose: number;
  tempo: number;
  timeSignature: string;
  
  // Keyboard Hardware Fields
  bank?: string;
  rhythm?: string;
  tone?: string;
  helperNotes?: string;

  // Custom User-Defined Fields
  customFields?: Record<string, string>;

  // Chords and Lyrics Content
  content: string;
  format: ChordFormat;
  tags: string[];
  notes: string;
  audioTrackUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SetlistItem {
  id: string;
  type: 'song' | 'break';
  songId?: string;
  breakTitle?: string;
  breakDurationMinutes?: number;
  notes?: string;
}

export interface Setlist {
  id: string;
  name: string;
  eventDate: string;
  targetDurationMinutes: number;
  notes: string;
  items: SetlistItem[];
  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  name: string;
  role: string;
  band: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
}

export interface SetlistDisplaySettings {
  showBank: boolean;
  showRhythm: boolean;
  showTempo: boolean;
  showKey: boolean;
  showHelperNotes: boolean;
  showArtist: boolean;
  showEstimatedDuration: boolean;
}

export interface SongDisplaySettings {
  chordFontSize: number;
  lyricsFontSize: number;
  chordColor: string;
  diagramPreference: DiagramPreference;
  accidentalPreference: AccidentalPreference;
  twoColumnLayout: boolean;
}

export interface StageSettings {
  presentationMode: 'single-song' | 'continuous-setlist';
  showHUD: boolean;
  showMetronome: boolean;
  showTransposeButtons: boolean;
  showAutoScroll: boolean;
  defaultScrollSpeed: number;
  stageTheme: string;
}

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  userProfile: UserProfile;
  setlistDisplay: SetlistDisplaySettings;
  songDisplay: SongDisplaySettings;
  stageSettings: StageSettings;
  fieldVisibility: Record<BuiltInFieldKey, FieldLocationVisibility>;
  customFields: CustomFieldDefinition[];
  customThemes?: CustomThemeDefinition[];
  activeCustomTheme?: CustomThemeDefinition;
}
