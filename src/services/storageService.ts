import type { AppSettings, BuiltInFieldKey, CustomFieldDefinition, FieldLocationVisibility, Setlist, Song, UserProfile } from '../types';

const STORAGE_KEYS = {
  SONGS: 'openstage_songs',
  SETLISTS: 'openstage_setlists',
  SETTINGS: 'openstage_settings'
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Fellowship Musician',
  role: 'Keyboardist & Arranger',
  band: 'Youth Fellowship Band',
  bio: 'Live keys, synth splits & accompaniment setups',
  avatarUrl: '',
  bannerUrl: 'linear-gradient(135deg, #0284c7 0%, #a855f7 100%)'
};

export const DEFAULT_FIELD_VISIBILITY: Record<BuiltInFieldKey, FieldLocationVisibility> = {
  bank: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  rhythm: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  tempo: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  key: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  transpose: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  tone: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  timeSignature: { visibleInSetlist: false, visibleInSongCard: true, visibleInStageHUD: false },
  helperNotes: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  artist: { visibleInSetlist: true, visibleInSongCard: true, visibleInStageHUD: true },
  tags: { visibleInSetlist: false, visibleInSongCard: true, visibleInStageHUD: false },
  notes: { visibleInSetlist: false, visibleInSongCard: false, visibleInStageHUD: true }
};

export const DEFAULT_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  {
    id: 'field_capo',
    name: 'Capo Position',
    icon: '🎸',
    visibleInSetlist: true,
    visibleInSongCard: true,
    visibleInStageHUD: true
  },
  {
    id: 'field_synth_split',
    name: 'Synth Split Cue',
    icon: '🎛️',
    visibleInSetlist: false,
    visibleInSongCard: true,
    visibleInStageHUD: true
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'oled-dark',
  accentColor: '#38bdf8',
  userProfile: DEFAULT_PROFILE,
  setlistDisplay: {
    showBank: true,
    showRhythm: true,
    showTempo: true,
    showKey: true,
    showHelperNotes: true,
    showArtist: true,
    showEstimatedDuration: true
  },
  songDisplay: {
    chordFontSize: 16,
    lyricsFontSize: 19,
    chordColor: '#38bdf8',
    diagramPreference: 'both',
    accidentalPreference: 'sharps',
    twoColumnLayout: false
  },
  stageSettings: {
    presentationMode: 'single-song',
    showHUD: true,
    showMetronome: true,
    showTransposeButtons: true,
    showAutoScroll: true,
    defaultScrollSpeed: 4,
    stageTheme: 'oled-dark'
  },
  fieldVisibility: DEFAULT_FIELD_VISIBILITY,
  customFields: DEFAULT_CUSTOM_FIELDS
};

export const SAMPLE_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Blessed Be Your Name',
    artist: 'Matt Redman',
    originalKey: 'B',
    currentKey: 'G',
    transpose: -4,
    tempo: 116,
    timeSignature: '4/4',
    bank: 'Bank 2 - Reg 1',
    rhythm: 'Pop Rock #34',
    tone: 'Grand Piano + DX Warm Pad',
    helperNotes: 'G G G F# A A B - A A F# (Intro Hook)',
    customFields: {
      field_capo: 'Capo 4',
      field_synth_split: 'LH: Pad | RH: Piano'
    },
    format: 'chords-over-lyrics',
    tags: ['Youth Fellowship', 'Praise', 'Fast'],
    notes: 'Intro starts with Piano + Pad, add drums on verse 2',
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
    content: `[Intro]
G    D/F#    Em7    Cadd9

[Verse 1]
G                  D/F#
  Blessed be Your name in the land that is plentiful
Em7                       Cadd9
  Where Your streams of abundance flow, blessed be Your name
G                  D/F#
  Blessed be Your name when I'm found in the desert place
Em7                          Cadd9
  Though I walk through the wilderness, blessed be Your name

[Chorus]
G                     D/F#
  Every blessing You pour out I'll turn back to praise
Em7                   Cadd9
  When the darkness closes in, Lord, still I will say
G                     D/F#
  Blessed be the name of the Lord, blessed be Your name
Em7                   Cadd9
  Blessed be the name of the Lord, blessed be Your glorious name`
  },
  {
    id: 'song-2',
    title: 'Way Maker',
    artist: 'Sinach / Leeland',
    originalKey: 'E',
    currentKey: 'E',
    transpose: 0,
    tempo: 68,
    timeSignature: '4/4',
    bank: 'Bank 4 - Full Reg',
    rhythm: 'Slow Worship Ballad #12',
    tone: 'Nord Piano Layer + Dark Strings',
    helperNotes: 'B E G# - F# E D# - E (LH Bass Split C#)',
    customFields: {
      field_synth_split: 'LH: Synth Bass | RH: Soft Pad'
    },
    format: 'chords-over-lyrics',
    tags: ['Worship', 'Slow', 'Youth Fellowship'],
    notes: 'Switch to Reg 3 on Bridge for heavy strings swell',
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 400000,
    content: `[Intro]
E    B    C#m7    A2

[Verse 1]
E                     B
  You are here, moving in our midst
         C#m7            A2
I worship You, I worship You
E                     B
  You are here, working in this place
         C#m7            A2
I worship You, I worship You

[Chorus]
                  E                         B
You are Way Maker, Miracle Worker, Promise Keeper
                      C#m7                   A2
Light in the darkness, my God, that is who You are`
  },
  {
    id: 'song-3',
    title: 'Goodness of God',
    artist: 'Bethel Music',
    originalKey: 'Ab',
    currentKey: 'G',
    transpose: -1,
    tempo: 70,
    timeSignature: '4/4',
    bank: 'Bank 1 - Reg 3',
    rhythm: 'Acoustic 6/8 Style #55',
    tone: 'Warm EP + Soft Flute Lead',
    helperNotes: 'D E G A - B B A G E D',
    customFields: {
      field_capo: 'Capo 1'
    },
    format: 'chords-over-lyrics',
    tags: ['Worship', 'Ballad'],
    notes: 'Capo 1 for guitarists, played in G shape on keyboard',
    createdAt: Date.now() - 800000,
    updatedAt: Date.now() - 300000,
    content: `[Verse 1]
G                       Cadd9                 G
  I love You, Lord, for Your mercy never fails me
D/F#   Em7               Cadd9              D
  All  my days I've been held in Your hands
                 Em7         Cadd9
From the moment that I wake up
           G     D/F#   Em7
Until I lay my head
      Cadd9             D             G
Oh, I will sing of the goodness of God

[Chorus]
Cadd9                           G
  All my life You have been faithful
Cadd9                           G        D
  All my life You have been so, so good
Cadd9                                G     D/F#  Em7
  With every breath that I am able
      Cadd9             D             G
Oh, I will sing of the goodness of God`
  },
  {
    id: 'song-4',
    title: '10,000 Reasons (Bless the Lord)',
    artist: 'Matt Redman',
    originalKey: 'G',
    currentKey: 'G',
    transpose: 0,
    tempo: 73,
    timeSignature: '4/4',
    bank: 'Bank 3 - Reg 2',
    rhythm: 'Pop Fusion #48',
    tone: 'Strings + DX Modern EP',
    helperNotes: 'C C C B D D E - D D B',
    customFields: {
      field_synth_split: 'LH: Strings | RH: DX Modern'
    },
    format: 'chords-over-lyrics',
    tags: ['Youth Fellowship', 'Fellowship', 'Standard'],
    notes: 'Classic youth opening song',
    createdAt: Date.now() - 700000,
    updatedAt: Date.now() - 200000,
    content: `[Chorus]
C             G       D/F#       Em
Bless the Lord, O my soul, O my soul
C             G      D/F#
Worship His holy name
      C        Em      C   D   Em
Sing like never before, O my soul
     C            D          G
I'll worship Your holy name

[Verse 1]
    C         G           D         Em
The sun comes up, it's a new day dawning
C            G           D        Em
It's time to sing Your song again
     C        G             D            Em
Whatever may pass and whatever lies before me
C2           G             Dsus4  D    G
Let me be singing when the evening     comes`
  }
];

export const SAMPLE_SETLISTS: Setlist[] = [
  {
    id: 'setlist-1',
    name: 'Youth Fellowship - Sunday Service',
    eventDate: new Date().toISOString().split('T')[0],
    targetDurationMinutes: 30,
    notes: 'Kick off with 10,000 Reasons, then transition to Goodness of God',
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 100000,
    items: [
      { id: 'item-1', type: 'song', songId: 'song-4' },
      { id: 'item-2', type: 'song', songId: 'song-1' },
      { id: 'item-3', type: 'break', breakTitle: 'Opening Prayer & Welcome', breakDurationMinutes: 5 },
      { id: 'item-4', type: 'song', songId: 'song-3' },
      { id: 'item-5', type: 'song', songId: 'song-2' }
    ]
  }
];

export const StorageService = {
  getSongs(): Song[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SONGS);
      if (data) {
        return JSON.parse(data);
      }
      this.saveSongs(SAMPLE_SONGS);
      return SAMPLE_SONGS;
    } catch {
      return SAMPLE_SONGS;
    }
  },

  saveSongs(songs: Song[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    } catch (e) {
      console.error('Failed to save songs to localStorage', e);
    }
  },

  getSetlists(): Setlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETLISTS);
      if (data) {
        return JSON.parse(data);
      }
      this.saveSetlists(SAMPLE_SETLISTS);
      return SAMPLE_SETLISTS;
    } catch {
      return SAMPLE_SETLISTS;
    }
  },

  saveSetlists(setlists: Setlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETLISTS, JSON.stringify(setlists));
    } catch (e) {
      console.error('Failed to save setlists to localStorage', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          userProfile: { ...DEFAULT_PROFILE, ...(parsed.userProfile || {}) },
          fieldVisibility: { ...DEFAULT_FIELD_VISIBILITY, ...(parsed.fieldVisibility || {}) },
          customFields: parsed.customFields && Array.isArray(parsed.customFields)
            ? parsed.customFields
            : DEFAULT_CUSTOM_FIELDS,
          setlistDisplay: { ...DEFAULT_SETTINGS.setlistDisplay, ...(parsed.setlistDisplay || {}) },
          songDisplay: { ...DEFAULT_SETTINGS.songDisplay, ...(parsed.songDisplay || {}) },
          stageSettings: { ...DEFAULT_SETTINGS.stageSettings, ...(parsed.stageSettings || {}) }
        };
      }
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  exportBackup(): void {
    const data = {
      version: '1.4.0',
      appName: 'Open Stage Setlist',
      exportedAt: new Date().toISOString(),
      songs: this.getSongs(),
      setlists: this.getSetlists(),
      settings: this.getSettings()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-stage-setlist-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportMarkdownArchive(): void {
    const songs = this.getSongs();
    let mdContent = `# Open Stage Setlist — Songbook Archive\n*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;

    songs.forEach((song, idx) => {
      mdContent += `## ${idx + 1}. ${song.title}\n`;
      if (song.artist) mdContent += `**Artist / Sung By:** ${song.artist}\n`;
      mdContent += `**Key:** ${song.currentKey || song.originalKey} | **Original Key:** ${song.originalKey} | **Tempo:** ${song.tempo || 'N/A'} BPM | **Time Signature:** ${song.timeSignature || '4/4'}\n`;
      
      if (song.bank || song.rhythm || song.tone) {
        mdContent += `**Hardware:** [Bank: ${song.bank || 'None'}] [Rhythm: ${song.rhythm || 'None'}] [Tone: ${song.tone || 'None'}]\n`;
      }
      if (song.helperNotes) {
        mdContent += `**Melody / Intro Cue:** \`${song.helperNotes}\`\n`;
      }
      if (song.customFields && Object.keys(song.customFields).length > 0) {
        const customParts = Object.entries(song.customFields).map(([k, v]) => `${k}: ${v}`).join(' | ');
        mdContent += `**Custom Parameters:** ${customParts}\n`;
      }
      if (song.tags && song.tags.length > 0) {
        mdContent += `**Tags:** #${song.tags.join(' #')}\n`;
      }
      if (song.notes) {
        mdContent += `**Notes:** ${song.notes}\n`;
      }

      mdContent += `\n\`\`\`chordpro\n${song.content}\n\`\`\`\n\n---\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-stage-songs-archive-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.songs || !Array.isArray(parsed.songs)) {
        return { success: false, message: 'Invalid backup file format: Missing songs array.' };
      }
      
      this.saveSongs(parsed.songs);
      if (parsed.setlists && Array.isArray(parsed.setlists)) {
        this.saveSetlists(parsed.setlists);
      }
      if (parsed.settings) {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      return {
        success: true,
        message: `Successfully imported ${parsed.songs.length} songs and ${parsed.setlists?.length || 0} setlists!`
      };
    } catch (err: any) {
      return { success: false, message: `Import failed: ${err?.message || 'Invalid JSON'}` };
    }
  },

  resetToSamples(): void {
    this.saveSongs(SAMPLE_SONGS);
    this.saveSetlists(SAMPLE_SETLISTS);
    this.saveSettings(DEFAULT_SETTINGS);
  }
};
