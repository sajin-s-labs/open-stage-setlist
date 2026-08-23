import React, { useRef } from 'react';
import { ArrowLeft, Download, Upload, RefreshCw, FileText } from 'lucide-react';
import { StorageService } from '../../services/storageService';

interface BackupSettingsPageProps {
  onDataImported: (msg: string, isSuccess: boolean) => void;
  onRequestResetData: () => void;
  onBack: () => void;
}

export const BackupSettingsPage: React.FC<BackupSettingsPageProps> = ({
  onDataImported,
  onRequestResetData,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    StorageService.exportBackup();
    onDataImported('Full JSON database exported successfully!', true);
  };

  const handleExportMarkdown = () => {
    StorageService.exportMarkdownArchive();
    onDataImported('Repertoire exported as Markdown (.md) file!', true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importBackup(content);
      onDataImported(res.message, res.success);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="page-container">
      <div className="page-top-action-bar">
        <button type="button" className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Settings
        </button>
        <h2 className="editor-page-heading">Data Backups & Portability</h2>
      </div>

      {/* JSON Backup Card */}
      <div className="editor-card">
        <div className="card-title">💾 Full Database Backup (JSON)</div>
        <p className="settings-card-desc">
          Save your complete library, keyboard banks, setlists, and preferences into a single portable `.json` file. Load it onto your phone, tablet, or laptop anytime.
        </p>

        <div className="backup-actions-grid" style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="primary-btn" onClick={handleExportJSON}>
            <Download size={18} /> Export JSON Backup
          </button>

          <button className="secondary-btn" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Import JSON Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Markdown Repertoire Export Card */}
      <div className="editor-card">
        <div className="card-title">📝 Export All Songs as Markdown (.md)</div>
        <p className="settings-card-desc">
          Export your entire songbook and chord charts into a single human-readable `.md` markdown file compatible with Obsidian, Logseq, Notion, and ChordPro readers.
        </p>

        <button className="secondary-btn" onClick={handleExportMarkdown} style={{ marginTop: '8px' }}>
          <FileText size={18} color="var(--accent-color)" /> Export Repertoire as Markdown (.md)
        </button>
      </div>

      {/* Factory Reset Card */}
      <div className="editor-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
        <div className="card-title" style={{ color: 'var(--danger-color)' }}>
          ⚠️ Reset & Restore Defaults
        </div>
        <p className="settings-card-desc">
          Reset all songs, setlists, and settings to original factory default songs.
        </p>

        <button className="danger-btn outline" onClick={onRequestResetData}>
          <RefreshCw size={16} /> Restore Default Sample Data
        </button>
      </div>
    </div>
  );
};
