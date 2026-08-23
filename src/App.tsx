import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import type { AppSettings, Setlist, Song, UserProfile, CustomThemeDefinition } from './types';
import { StorageService } from './services/storageService';
import { Sidebar } from './components/Sidebar';
import { MySetlistsPage } from './components/MySetlistsPage';
import { SetlistViewPage } from './components/SetlistViewPage';
import { SetlistEditorPage } from './components/SetlistEditorPage';
import { SongLibrary } from './components/SongLibrary';
import { SongViewPage } from './components/SongViewPage';
import { SongEditor } from './components/SongEditor';
import { LiveStage } from './components/LiveStage';
import { ChordModal } from './components/ChordModal';
import { ToastContainer, type ToastMessage, type ToastType } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';

// Settings Subpages
import { SettingsHome } from './components/settings/SettingsHome';
import { ProfileSettingsPage } from './components/settings/ProfileSettingsPage';
import { FieldsManagerSettingsPage } from './components/settings/FieldsManagerSettingsPage';
import { ThemeSettingsPage } from './components/settings/ThemeSettingsPage';
import { SetlistDisplaySettingsPage } from './components/settings/SetlistDisplaySettingsPage';
import { SongDisplaySettingsPage } from './components/settings/SongDisplaySettingsPage';
import { StageSettingsPage } from './components/settings/StageSettingsPage';
import { BackupSettingsPage } from './components/settings/BackupSettingsPage';
import { AboutSettingsPage } from './components/settings/AboutSettingsPage';

interface AppNavigationState {
  route: string;
  songId?: string;
  setlistId?: string;
  isLiveStage?: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
}

export function App() {
  const [activeRoute, setActiveRoute] = useState<string>('setlists');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());

  // Active Selected Objects for Dedicated View/Edit Pages
  const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Live Stage State
  const [isLiveStageOpen, setIsLiveStageOpen] = useState(false);
  const [stageSong, setStageSong] = useState<Song | null>(null);
  const [stageSetlist, setStageSetlist] = useState<Setlist | null>(null);
  const [stageIndex, setStageIndex] = useState(0);

  // Global Chord Inspection Modal
  const [inspectedChord, setInspectedChord] = useState<string | null>(null);

  // Custom Toast State (Single Active Toast Limit)
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Custom Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const isPopStateNavRef = useRef(false);

  const showToast = (title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}`;
    // Replace with single latest toast to prevent multiple popping up
    setToasts([{ id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Determine parent route for robust Back navigation
  const getParentRoute = (current: string): string => {
    if (current.startsWith('settings-')) return 'settings';
    if (current === 'song-edit') {
      if (selectedSong) return 'song-view';
      return 'songs';
    }
    if (current === 'song-new') {
      return 'songs';
    }
    if (current === 'song-view') {
      if (selectedSetlist) return 'setlist-view';
      return 'songs';
    }
    if (current === 'setlist-edit') {
      if (selectedSetlist) return 'setlist-view';
      return 'setlists';
    }
    if (current === 'setlist-new') {
      return 'setlists';
    }
    if (current === 'setlist-view') {
      return 'setlists';
    }
    if (current === 'stage') {
      if (selectedSetlist) return 'setlist-view';
      if (selectedSong) return 'song-view';
      return 'setlists';
    }
    return 'setlists';
  };

  useEffect(() => {
    loadAllData();

    // Initialize root history entry
    const initialNav: AppNavigationState = { route: 'setlists' };
    window.history.replaceState(initialNav, '');

    const handlePopState = (event: PopStateEvent) => {
      // 1. Close modal if active
      if (inspectedChord) {
        setInspectedChord(null);
        return;
      }

      if (confirmDialog.isOpen) {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        return;
      }

      // 2. Close sidebar if open
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return;
      }

      isPopStateNavRef.current = true;

      const state = event.state as AppNavigationState | null;

      if (state && state.route) {
        setActiveRoute(state.route);
        setIsLiveStageOpen(Boolean(state.isLiveStage));

        if (state.songId) {
          const s = StorageService.getSongs().find((x) => x.id === state.songId);
          if (s) setSelectedSong(s);
          if (state.isLiveStage && s) setStageSong(s);
        }

        if (state.setlistId) {
          const sl = StorageService.getSetlists().find((x) => x.id === state.setlistId);
          if (sl) setSelectedSetlist(sl);
          if (state.isLiveStage && sl) setStageSetlist(sl);
        }
      } else {
        // Smart fallback to parent
        const fallback = getParentRoute(activeRoute);
        setActiveRoute(fallback);
        setIsLiveStageOpen(false);
      }

      setTimeout(() => {
        isPopStateNavRef.current = false;
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [inspectedChord, confirmDialog.isOpen, isSidebarOpen, activeRoute, selectedSetlist, selectedSong]);

  // Update root HTML theme and custom CSS variables
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);

    if (settings.theme === 'custom' && settings.activeCustomTheme) {
      const ct = settings.activeCustomTheme;
      document.documentElement.style.setProperty('--bg-color', ct.bgColor);
      document.documentElement.style.setProperty('--surface-color', ct.surfaceColor);
      document.documentElement.style.setProperty('--card-bg', ct.cardBg);
      document.documentElement.style.setProperty('--text-main', ct.textColor);
      document.documentElement.style.setProperty('--accent-color', ct.accentColor);
      document.documentElement.style.setProperty('--border-color', ct.borderColor);
    } else {
      document.documentElement.style.removeProperty('--bg-color');
      document.documentElement.style.removeProperty('--surface-color');
      document.documentElement.style.removeProperty('--card-bg');
      document.documentElement.style.removeProperty('--text-main');
      document.documentElement.style.removeProperty('--border-color');
      if (settings.accentColor) {
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      }
    }
  }, [settings.theme, settings.accentColor, settings.activeCustomTheme]);

  const navigateTo = (route: string, song?: Song | null, setlist?: Setlist | null, isLiveStage = false) => {
    setActiveRoute(route);
    setIsSidebarOpen(false);
    setIsLiveStageOpen(isLiveStage);

    if (song !== undefined) setSelectedSong(song);
    if (setlist !== undefined) setSelectedSetlist(setlist);

    if (!isPopStateNavRef.current) {
      const navState: AppNavigationState = {
        route,
        songId: song?.id ?? selectedSong?.id,
        setlistId: setlist?.id ?? selectedSetlist?.id,
        isLiveStage
      };
      window.history.pushState(navState, '');
    }
  };

  const handleBack = () => {
    if (isLiveStageOpen) {
      setIsLiveStageOpen(false);
      if (selectedSetlist) {
        navigateTo('setlist-view', undefined, selectedSetlist);
      } else if (selectedSong) {
        navigateTo('song-view', selectedSong);
      } else {
        navigateTo('setlists');
      }
      return;
    }

    if (activeRoute === 'setlist-edit' && selectedSetlist) {
      navigateTo('setlist-view', undefined, selectedSetlist);
      return;
    }

    if (activeRoute === 'song-edit' && selectedSong) {
      navigateTo('song-view', selectedSong);
      return;
    }

    const parent = getParentRoute(activeRoute);
    navigateTo(parent);
  };

  const loadAllData = () => {
    const loadedSongs = StorageService.getSongs();
    const loadedSetlists = StorageService.getSetlists();
    const loadedSettings = StorageService.getSettings();
    setSongs(loadedSongs);
    setSetlists(loadedSetlists);
    setSettings(loadedSettings);
  };

  // Song Actions
  const handleSaveSong = (songToSave: Song) => {
    let updated: Song[];
    const exists = songs.some((s) => s.id === songToSave.id);
    if (exists) {
      updated = songs.map((s) => (s.id === songToSave.id ? songToSave : s));
      showToast('Song Updated', `"${songToSave.title}" saved.`);
    } else {
      updated = [songToSave, ...songs];
      showToast('Song Created', `"${songToSave.title}" added.`);
    }
    setSongs(updated);
    StorageService.saveSongs(updated);
    navigateTo('song-view', songToSave);
  };

  const requestDeleteSong = (song: Song) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Song?',
      message: `Are you sure you want to delete "${song.title}" from your repertoire?`,
      confirmLabel: 'Delete Song',
      isDanger: true,
      onConfirm: () => {
        const updated = songs.filter((s) => s.id !== song.id);
        setSongs(updated);
        StorageService.saveSongs(updated);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Song Deleted', `"${song.title}" removed.`);
        if (selectedSong?.id === song.id) {
          setSelectedSong(null);
          navigateTo('songs');
        }
      }
    });
  };

  const handleDuplicateSong = (song: Song) => {
    const dup: Song = {
      ...song,
      id: `song-${Date.now()}`,
      title: `${song.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [dup, ...songs];
    setSongs(updated);
    StorageService.saveSongs(updated);
    showToast('Song Duplicated', `Created "${dup.title}".`);
  };

  // Setlist Actions
  const handleSaveSetlist = (setlistToSave: Setlist) => {
    let updated: Setlist[];
    const exists = setlists.some((s) => s.id === setlistToSave.id);
    if (exists) {
      updated = setlists.map((s) => (s.id === setlistToSave.id ? setlistToSave : s));
      showToast('Setlist Updated', `"${setlistToSave.name}" saved.`);
    } else {
      updated = [setlistToSave, ...setlists];
      showToast('Setlist Created', `"${setlistToSave.name}" ready.`);
    }
    setSetlists(updated);
    StorageService.saveSetlists(updated);
    navigateTo('setlist-view', undefined, setlistToSave);
  };

  const requestDeleteSetlist = (setlist: Setlist) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Setlist?',
      message: `Are you sure you want to delete "${setlist.name}"? Your song library will not be affected.`,
      confirmLabel: 'Delete Setlist',
      isDanger: true,
      onConfirm: () => {
        const updated = setlists.filter((s) => s.id !== setlist.id);
        setSetlists(updated);
        StorageService.saveSetlists(updated);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Setlist Deleted', `"${setlist.name}" removed.`);
        if (selectedSetlist?.id === setlist.id) {
          setSelectedSetlist(null);
          navigateTo('setlists');
        }
      }
    });
  };

  const requestResetSampleData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset to Default Sample Data?',
      message: 'This will reset your library, setlists, and settings to original factory sample songs.',
      confirmLabel: 'Reset Everything',
      isDanger: true,
      onConfirm: () => {
        StorageService.resetToSamples();
        loadAllData();
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Database Reset', 'Sample data restored.');
      }
    });
  };

  // Live Stage Launchers
  const handleLaunchSingleSongStage = (song: Song) => {
    setStageSong(song);
    setStageSetlist(null);
    setStageIndex(0);
    navigateTo('stage', song, null, true);
  };

  const handleLaunchSetlistStage = (setlist: Setlist, startIndex = 0) => {
    setStageSetlist(setlist);
    setStageIndex(startIndex);

    const firstItem = setlist.items[startIndex];
    if (firstItem && firstItem.type === 'song') {
      const song = songs.find((s) => s.id === firstItem.songId);
      setStageSong(song || null);
    } else {
      setStageSong(null);
    }
    navigateTo('stage', null, setlist, true);
  };

  const handleSelectSetlistIndex = (index: number) => {
    if (!stageSetlist || index < 0 || index >= stageSetlist.items.length) return;
    setStageIndex(index);
    const item = stageSetlist.items[index];
    if (item.type === 'song') {
      const song = songs.find((s) => s.id === item.songId);
      setStageSong(song || null);
    } else {
      setStageSong(null);
    }
  };

  // Settings updates
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  // Custom Theme Handlers
  const handleSaveCustomTheme = (customTheme: CustomThemeDefinition) => {
    const existing = settings.customThemes || [];
    const updated = [customTheme, ...existing.filter((t) => t.id !== customTheme.id)];
    const newSettings: AppSettings = {
      ...settings,
      theme: 'custom',
      customThemes: updated,
      activeCustomTheme: customTheme
    };
    updateSettings(newSettings);
    showToast('Theme Saved', `"${customTheme.name}" applied.`);
  };

  const handleDeleteCustomTheme = (id: string) => {
    const existing = settings.customThemes || [];
    const updated = existing.filter((t) => t.id !== id);
    const newSettings: AppSettings = {
      ...settings,
      theme: settings.theme === 'custom' && settings.activeCustomTheme?.id === id ? 'oled-dark' : settings.theme,
      customThemes: updated,
      activeCustomTheme: settings.activeCustomTheme?.id === id ? undefined : settings.activeCustomTheme
    };
    updateSettings(newSettings);
    showToast('Theme Removed', undefined, 'info');
  };

  // Live Stage Screen Overlay
  if (isLiveStageOpen) {
    return (
      <>
        <LiveStage
          song={stageSong}
          setlist={stageSetlist}
          currentSetlistIndex={stageIndex}
          onExitStage={handleBack}
          onSelectSongIndex={handleSelectSetlistIndex}
          onChordClick={(chord) => setInspectedChord(chord)}
          settings={settings}
        />
        {inspectedChord && (
          <ChordModal
            chord={inspectedChord}
            onClose={() => setInspectedChord(null)}
            diagramPreference={settings.songDisplay.diagramPreference}
          />
        )}
      </>
    );
  }

  return (
    <div className="app-shell">
      {/* Top Main App Bar */}
      <header className="app-topbar-header">
        <div className="topbar-left">
          <button
            className="hamburger-menu-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation sidebar"
          >
            <Menu size={22} />
          </button>
          <img 
            src="/app-icon.jpg" 
            alt="Open Stage Setlist Logo" 
            className="app-logo-badge-img"
          />
          <span className="app-title-text">Open Stage Setlist</span>
        </div>

        <div className="topbar-right">
          {settings.userProfile.avatarUrl ? (
            <img 
              src={settings.userProfile.avatarUrl} 
              alt="User" 
              className="topbar-avatar-img"
              onClick={() => navigateTo('settings-profile')}
            />
          ) : (
            <button
              className="topbar-profile-btn"
              onClick={() => navigateTo('settings-profile')}
            >
              {settings.userProfile.name?.slice(0, 1) || 'M'}
            </button>
          )}
        </div>
      </header>

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeRoute={activeRoute}
        onNavigate={(route) => {
          if (route === 'setlist-new') {
            navigateTo(route, undefined, null);
          } else if (route === 'song-new') {
            navigateTo(route, null, undefined);
          } else {
            navigateTo(route);
          }
        }}
        userProfile={settings.userProfile}
      />

      {/* Main Dedicated Content Router */}
      <main className="app-main-content">
        {/* 1. My Setlists Route */}
        {activeRoute === 'setlists' && (
          <MySetlistsPage
            setlists={setlists}
            onOpenSetlist={(setlist) => navigateTo('setlist-view', undefined, setlist)}
            onLaunchLiveStage={handleLaunchSetlistStage}
            onRequestDeleteSetlist={requestDeleteSetlist}
          />
        )}

        {/* 2. Setlist Dedicated View Page */}
        {activeRoute === 'setlist-view' && selectedSetlist && (
          <SetlistViewPage
            setlist={selectedSetlist}
            songs={songs}
            settings={settings}
            onBack={handleBack}
            onEditSetlist={(setlist) => navigateTo('setlist-edit', undefined, setlist)}
            onOpenSong={(song) => navigateTo('song-view', song)}
            onLaunchLiveStage={handleLaunchSetlistStage}
          />
        )}

        {/* 3. Setlist Create / Edit Page */}
        {(activeRoute === 'setlist-new' || activeRoute === 'setlist-edit') && (
          <SetlistEditorPage
            initialSetlist={activeRoute === 'setlist-edit' ? selectedSetlist : null}
            songs={songs}
            onSave={handleSaveSetlist}
            onCancel={handleBack}
          />
        )}

        {/* 4. All Songs Repertoire Page */}
        {activeRoute === 'songs' && (
          <SongLibrary
            songs={songs}
            settings={settings}
            onOpenSong={(song) => navigateTo('song-view', song)}
            onPlaySongLive={handleLaunchSingleSongStage}
            onEditSong={(song) => navigateTo('song-edit', song)}
            onRequestDeleteSong={requestDeleteSong}
            onDuplicateSong={handleDuplicateSong}
          />
        )}

        {/* 5. Song Dedicated View Page */}
        {activeRoute === 'song-view' && selectedSong && (
          <SongViewPage
            song={selectedSong}
            settings={settings}
            onBack={handleBack}
            onEditSong={(song) => navigateTo('song-edit', song)}
            onLaunchLiveStage={handleLaunchSingleSongStage}
            onChordClick={(chord) => setInspectedChord(chord)}
          />
        )}

        {/* 6. Song Create / Edit Page */}
        {(activeRoute === 'song-new' || activeRoute === 'song-edit') && (
          <SongEditor
            initialSong={activeRoute === 'song-edit' ? selectedSong : null}
            customFieldDefinitions={settings.customFields}
            onSave={handleSaveSong}
            onCancel={handleBack}
            onChordClick={(chord) => setInspectedChord(chord)}
          />
        )}

        {/* 7. Settings Home & Subpages */}
        {activeRoute === 'settings' && (
          <SettingsHome
            settings={settings}
            onSelectSubpage={(subpage) => navigateTo(subpage)}
          />
        )}

        {activeRoute === 'settings-profile' && (
          <ProfileSettingsPage
            initialProfile={settings.userProfile}
            onSave={(profile: UserProfile) => {
              updateSettings({ ...settings, userProfile: profile });
              showToast('Profile Saved', 'Musician profile updated.');
            }}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-fields' && (
          <FieldsManagerSettingsPage
            settings={settings}
            onUpdateSettings={updateSettings}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-themes' && (
          <ThemeSettingsPage
            currentTheme={settings.theme}
            currentAccent={settings.accentColor}
            customThemes={settings.customThemes}
            activeCustomTheme={settings.activeCustomTheme}
            onUpdateTheme={(theme, customTheme) => {
              updateSettings({
                ...settings,
                theme,
                activeCustomTheme: customTheme
              });
            }}
            onUpdateAccent={(accent) => updateSettings({ ...settings, accentColor: accent })}
            onSaveCustomTheme={handleSaveCustomTheme}
            onDeleteCustomTheme={handleDeleteCustomTheme}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-setlist-display' && (
          <SetlistDisplaySettingsPage
            settings={settings.setlistDisplay}
            onUpdate={(sd) => updateSettings({ ...settings, setlistDisplay: sd })}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-song-display' && (
          <SongDisplaySettingsPage
            settings={settings.songDisplay}
            onUpdate={(songDisp) => updateSettings({ ...settings, songDisplay: songDisp })}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-stage' && (
          <StageSettingsPage
            settings={settings.stageSettings}
            onUpdate={(st) => updateSettings({ ...settings, stageSettings: st })}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-backup' && (
          <BackupSettingsPage
            onDataImported={(msg, isSuccess) => {
              loadAllData();
              showToast(isSuccess ? 'Import Successful' : 'Import Failed', msg, isSuccess ? 'success' : 'error');
            }}
            onRequestResetData={requestResetSampleData}
            onBack={handleBack}
          />
        )}

        {activeRoute === 'settings-about' && (
          <AboutSettingsPage onBack={handleBack} />
        )}
      </main>

      {/* Global Chord Inspection Modal */}
      {inspectedChord && (
        <ChordModal
          chord={inspectedChord}
          onClose={() => setInspectedChord(null)}
          diagramPreference={settings.songDisplay.diagramPreference}
        />
      )}

      {/* Global Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Custom Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
